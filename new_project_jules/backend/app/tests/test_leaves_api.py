import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.main import app
from app.db import crud, schemas, models
from app.db.session import SessionLocal, get_db, Base, engine
# API_V1_STR is used for constructing endpoint paths consistently
from app.core.config import API_V1_STR


# Ensure all tables are created in the test database.
# This is important if using a separate test DB or an in-memory DB.
# If your main DB is used for tests (not recommended), Alembic migrations should handle this.
Base.metadata.create_all(bind=engine)

TEST_USER_EMAIL = "testleaveuser@example.com"
TEST_USER_PASSWORD = "testleavepassword"

@pytest.fixture(scope="module")
def db() -> Session:
    """
    Provides a database session for the test module.
    Creates tables if they don't exist (idempotent).
    """
    # Base.metadata.create_all(bind=engine) # Moved to top level for clarity
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        # Clean up database state after module tests if necessary, e.g., delete test user
        user = db_session.query(models.User).filter(models.User.email == TEST_USER_EMAIL).first()
        if user:
            # Delete leaves associated with the user first if there are foreign key constraints
            db_session.query(models.Leave).filter(models.Leave.user_id == user.id).delete(synchronize_session=False)
            db_session.query(models.WFH).filter(models.WFH.user_id == user.id).delete(synchronize_session=False) # Also for WFH if applicable
            db_session.delete(user)
            db_session.commit()
        db_session.close()

@pytest.fixture(scope="module")
def client(db: Session) -> TestClient:
    """
    Provides a TestClient for the FastAPI application.
    Overrides the get_db dependency to use the module-scoped test session.
    """
    def override_get_db():
        try:
            yield db
        finally:
            pass # Session closure handled by the db fixture

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    # Clean up dependency override after module tests
    del app.dependency_overrides[get_db]


@pytest.fixture(scope="module")
def test_user(db: Session) -> models.User:
    """
    Creates a test user in the database once per module.
    If user exists, it returns the existing one (idempotent for the module).
    """
    user = crud.get_user_by_email(db, email=TEST_USER_EMAIL)
    if not user:
        user_in = schemas.UserCreate(
            email=TEST_USER_EMAIL,
            password=TEST_USER_PASSWORD, # Raw password, CRUD create_user will hash it
            first_name="Test",
            last_name="UserLeave",
            is_active=True,
            is_superuser=False,
        )
        user = crud.create_user(db=db, user=user_in)
    return user

@pytest.fixture(scope="module")
def auth_token_headers(client: TestClient, test_user: models.User) -> dict[str, str]:
    """
    Logs in the test user and returns authentication token headers.
    Uses the /api/token path as per auth router configuration.
    """
    login_data = {
        "username": test_user.email,
        "password": TEST_USER_PASSWORD, # Use the raw password used for creation
    }
    # The auth router is mounted at /api, and its token endpoint is /token
    r = client.post("/api/token", data=login_data)
    assert r.status_code == 200, f"Failed to get token: {r.text}. User: {test_user.email}"
    tokens = r.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers

# Test Cases for Leaves API

def test_get_empty_leaves(client: TestClient, auth_token_headers: dict[str, str], test_user: models.User, db: Session):
    # Ensure no leaves exist for the user at the start of this specific test
    db.query(models.Leave).filter(models.Leave.user_id == test_user.id).delete()
    db.commit()
    response = client.get(f"{API_V1_STR}/leaves", headers=auth_token_headers)
    assert response.status_code == 200, response.text
    assert response.json() == []

def test_create_leave(client: TestClient, auth_token_headers: dict[str, str], test_user: models.User, db: Session):
    leave_data = {
        "from_date": str(date.today() + timedelta(days=10)),
        "to_date": str(date.today() + timedelta(days=12)),
        "leave_type": models.LeaveType.ANNUAL.value,
        "comments": "Test annual leave",
        "num_days": 3,
        "user_id": test_user.id # Must match authenticated user
    }
    response = client.post(f"{API_V1_STR}/leaves", headers=auth_token_headers, json=leave_data)
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["from_date"] == leave_data["from_date"]
    assert data["leave_type"] == leave_data["leave_type"]
    assert data["user_id"] == test_user.id
    assert data["status"] == models.LeaveStatus.PENDING.value

    leave_in_db = db.query(models.Leave).filter(models.Leave.id == data["id"]).first()
    assert leave_in_db is not None
    assert leave_in_db.comments == "Test annual leave"
    # Clean up created leave
    db.delete(leave_in_db)
    db.commit()


def test_create_leave_for_another_user_fails(client: TestClient, auth_token_headers: dict[str, str], test_user: models.User):
    another_user_id = test_user.id + 999 # Dummy ID for a different user
    leave_data = {
        "from_date": str(date.today() + timedelta(days=15)),
        "to_date": str(date.today() + timedelta(days=16)),
        "leave_type": models.LeaveType.SICK.value,
        "comments": "Test sick leave for another user",
        "num_days": 2,
        "user_id": another_user_id
    }
    response = client.post(f"{API_V1_STR}/leaves", headers=auth_token_headers, json=leave_data)
    assert response.status_code == 403, response.text
    data = response.json()
    assert "Cannot create leave request for another user" in data["detail"]

def test_get_one_leave(client: TestClient, auth_token_headers: dict[str, str], test_user: models.User, db: Session):
    leave_create_schema = schemas.LeaveCreate(
        from_date=date.today() + timedelta(days=20),
        to_date=date.today() + timedelta(days=21),
        leave_type=models.LeaveType.OTHER,
        comments="Leave for get test",
        num_days=2,
        user_id=test_user.id
    )
    created_leave = crud.create_user_leave(db, leave=leave_create_schema, user_id=test_user.id)

    response = client.get(f"{API_V1_STR}/leaves/{created_leave.id}", headers=auth_token_headers)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == created_leave.id
    assert data["comments"] == "Leave for get test"

    db.delete(created_leave) # Cleanup
    db.commit()


def test_get_nonexistent_leave(client: TestClient, auth_token_headers: dict[str, str]):
    response = client.get(f"{API_V1_STR}/leaves/999999", headers=auth_token_headers)
    assert response.status_code == 404, response.text

def test_update_leave(client: TestClient, auth_token_headers: dict[str, str], test_user: models.User, db: Session):
    leave_create_schema = schemas.LeaveCreate(
        from_date=date.today() + timedelta(days=30),
        to_date=date.today() + timedelta(days=31),
        leave_type=models.LeaveType.UNPAID,
        comments="Leave to update",
        num_days=2,
        user_id=test_user.id
    )
    created_leave = crud.create_user_leave(db, leave=leave_create_schema, user_id=test_user.id)

    update_data = {"comments": "Updated comment", "status": models.LeaveStatus.APPROVED.value}
    response = client.put(f"{API_V1_STR}/leaves/{created_leave.id}", headers=auth_token_headers, json=update_data)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == created_leave.id
    assert data["comments"] == "Updated comment"
    assert data["status"] == models.LeaveStatus.APPROVED.value

    leave_in_db = db.query(models.Leave).filter(models.Leave.id == created_leave.id).first()
    assert leave_in_db is not None
    assert leave_in_db.comments == "Updated comment"
    assert leave_in_db.status == models.LeaveStatus.APPROVED

    db.delete(leave_in_db) # Cleanup
    db.commit()

def test_delete_leave(client: TestClient, auth_token_headers: dict[str, str], test_user: models.User, db: Session):
    leave_create_schema = schemas.LeaveCreate(
        from_date=date.today() + timedelta(days=40),
        to_date=date.today() + timedelta(days=41),
        leave_type=models.LeaveType.ANNUAL,
        comments="Leave to delete",
        num_days=2,
        user_id=test_user.id
    )
    created_leave = crud.create_user_leave(db, leave=leave_create_schema, user_id=test_user.id)

    response = client.delete(f"{API_V1_STR}/leaves/{created_leave.id}", headers=auth_token_headers)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == created_leave.id

    leave_in_db = db.query(models.Leave).filter(models.Leave.id == created_leave.id).first()
    assert leave_in_db is None # Should be deleted

def test_get_all_my_leaves(client: TestClient, auth_token_headers: dict[str, str], test_user: models.User, db: Session):
    # Clean existing leaves for this user to ensure count is predictable
    db.query(models.Leave).filter(models.Leave.user_id == test_user.id).delete()
    db.commit()

    leave1_schema = schemas.LeaveCreate(
        from_date=date.today() + timedelta(days=50), to_date=date.today() + timedelta(days=51),
        leave_type=models.LeaveType.SICK, comments="Sick 1", num_days=2, user_id=test_user.id)
    leave2_schema = schemas.LeaveCreate(
        from_date=date.today() + timedelta(days=52), to_date=date.today() + timedelta(days=53),
        leave_type=models.LeaveType.ANNUAL, comments="Annual 1", num_days=2, user_id=test_user.id)

    l1 = crud.create_user_leave(db, leave=leave1_schema, user_id=test_user.id)
    l2 = crud.create_user_leave(db, leave=leave2_schema, user_id=test_user.id)

    response = client.get(f"{API_V1_STR}/leaves", headers=auth_token_headers)
    assert response.status_code == 200, response.text
    data = response.json()
    assert len(data) == 2
    comments_in_response = {item["comments"] for item in data}
    assert "Sick 1" in comments_in_response
    assert "Annual 1" in comments_in_response

    # Cleanup
    db.delete(l1)
    db.delete(l2)
    db.commit()
