import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.main import app
from app.db import crud, schemas, models
from app.db.session import SessionLocal, get_db, Base, engine # Re-importing Base, engine for clarity if used
from app.core.config import API_V1_STR

# Base.metadata.create_all(bind=engine) # Already called in test_leaves_api or globally

TEST_USER_EMAIL_WFH = "testwfhuser@example.com"
TEST_USER_PASSWORD_WFH = "testwfhpassword"


@pytest.fixture(scope="module")
def db_wfh() -> Session: # Renamed to avoid conflict if tests run in same session by some runners
    """
    Provides a database session for the WFH test module.
    """
    # Ensure tables exist (idempotent)
    Base.metadata.create_all(bind=engine)
    db_session = SessionLocal()
    try:
        yield db_session
    finally:
        # Clean up database state after module tests
        user = db_session.query(models.User).filter(models.User.email == TEST_USER_EMAIL_WFH).first()
        if user:
            db_session.query(models.WFH).filter(models.WFH.user_id == user.id).delete(synchronize_session=False)
            db_session.delete(user)
            db_session.commit()
        db_session.close()

@pytest.fixture(scope="module")
def client_wfh(db_wfh: Session) -> TestClient: # Use db_wfh fixture
    """
    Provides a TestClient for the FastAPI application for WFH tests.
    Overrides get_db dependency.
    """
    def override_get_db():
        try:
            yield db_wfh
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    del app.dependency_overrides[get_db]


@pytest.fixture(scope="module")
def test_user_wfh(db_wfh: Session) -> models.User: # Use db_wfh fixture
    """
    Creates a test user for WFH tests.
    """
    user = crud.get_user_by_email(db_wfh, email=TEST_USER_EMAIL_WFH)
    if not user:
        user_in = schemas.UserCreate(
            email=TEST_USER_EMAIL_WFH,
            password=TEST_USER_PASSWORD_WFH,
            first_name="TestWFH",
            last_name="UserWFH",
            is_active=True,
            is_superuser=False,
        )
        user = crud.create_user(db=db_wfh, user=user_in)
    return user

@pytest.fixture(scope="module")
def auth_token_headers_wfh(client_wfh: TestClient, test_user_wfh: models.User) -> dict[str, str]: # Use client_wfh and test_user_wfh
    """
    Logs in the WFH test user and returns auth token headers.
    """
    login_data = {
        "username": test_user_wfh.email,
        "password": TEST_USER_PASSWORD_WFH,
    }
    r = client_wfh.post("/api/token", data=login_data) # Assuming /api/token is the general login URL
    assert r.status_code == 200, f"Failed to get token for WFH user: {r.text}"
    tokens = r.json()
    a_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {a_token}"}
    return headers

# Test Cases for WFH API

def test_get_empty_wfh(client_wfh: TestClient, auth_token_headers_wfh: dict[str, str], test_user_wfh: models.User, db_wfh: Session):
    db_wfh.query(models.WFH).filter(models.WFH.user_id == test_user_wfh.id).delete()
    db_wfh.commit()
    response = client_wfh.get(f"{API_V1_STR}/wfh", headers=auth_token_headers_wfh)
    assert response.status_code == 200, response.text
    assert response.json() == []

def test_create_wfh(client_wfh: TestClient, auth_token_headers_wfh: dict[str, str], test_user_wfh: models.User, db_wfh: Session):
    wfh_data = {
        "from_date": str(date.today() + timedelta(days=5)),
        "to_date": str(date.today() + timedelta(days=6)),
        "comments": "Test WFH request",
        "num_days": 2,
        "user_id": test_user_wfh.id # Must match authenticated user
    }
    response = client_wfh.post(f"{API_V1_STR}/wfh", headers=auth_token_headers_wfh, json=wfh_data)
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["from_date"] == wfh_data["from_date"]
    assert data["comments"] == wfh_data["comments"]
    assert data["user_id"] == test_user_wfh.id
    assert data["status"] == models.WFHStatus.PENDING.value

    wfh_in_db = db_wfh.query(models.WFH).filter(models.WFH.id == data["id"]).first()
    assert wfh_in_db is not None
    assert wfh_in_db.comments == "Test WFH request"
    db_wfh.delete(wfh_in_db) # Cleanup
    db_wfh.commit()


def test_create_wfh_for_another_user_fails(client_wfh: TestClient, auth_token_headers_wfh: dict[str, str], test_user_wfh: models.User):
    another_user_id = test_user_wfh.id + 777
    wfh_data = {
        "from_date": str(date.today() + timedelta(days=8)),
        "to_date": str(date.today() + timedelta(days=9)),
        "comments": "Test WFH for another",
        "num_days": 2,
        "user_id": another_user_id
    }
    response = client_wfh.post(f"{API_V1_STR}/wfh", headers=auth_token_headers_wfh, json=wfh_data)
    assert response.status_code == 403, response.text
    data = response.json()
    assert "Cannot create WFH request for another user" in data["detail"]


def test_get_one_wfh(client_wfh: TestClient, auth_token_headers_wfh: dict[str, str], test_user_wfh: models.User, db_wfh: Session):
    wfh_create_schema = schemas.WFHCreate(
        from_date=date.today() + timedelta(days=25),
        to_date=date.today() + timedelta(days=26),
        comments="WFH for get test",
        num_days=2,
        user_id=test_user_wfh.id
    )
    created_wfh = crud.create_user_wfh(db_wfh, wfh=wfh_create_schema, user_id=test_user_wfh.id)

    response = client_wfh.get(f"{API_V1_STR}/wfh/{created_wfh.id}", headers=auth_token_headers_wfh)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == created_wfh.id
    assert data["comments"] == "WFH for get test"

    db_wfh.delete(created_wfh) # Cleanup
    db_wfh.commit()

def test_get_nonexistent_wfh(client_wfh: TestClient, auth_token_headers_wfh: dict[str, str]):
    response = client_wfh.get(f"{API_V1_STR}/wfh/888888", headers=auth_token_headers_wfh)
    assert response.status_code == 404, response.text


def test_update_wfh(client_wfh: TestClient, auth_token_headers_wfh: dict[str, str], test_user_wfh: models.User, db_wfh: Session):
    wfh_create_schema = schemas.WFHCreate(
        from_date=date.today() + timedelta(days=35),
        to_date=date.today() + timedelta(days=36),
        comments="WFH to update",
        num_days=2,
        user_id=test_user_wfh.id
    )
    created_wfh = crud.create_user_wfh(db_wfh, wfh=wfh_create_schema, user_id=test_user_wfh.id)

    update_data = {"comments": "Updated WFH comment", "status": models.WFHStatus.APPROVED.value}
    response = client_wfh.put(f"{API_V1_STR}/wfh/{created_wfh.id}", headers=auth_token_headers_wfh, json=update_data)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == created_wfh.id
    assert data["comments"] == "Updated WFH comment"
    assert data["status"] == models.WFHStatus.APPROVED.value

    wfh_in_db = db_wfh.query(models.WFH).filter(models.WFH.id == created_wfh.id).first()
    assert wfh_in_db is not None
    assert wfh_in_db.comments == "Updated WFH comment"
    assert wfh_in_db.status == models.WFHStatus.APPROVED

    db_wfh.delete(wfh_in_db) # Cleanup
    db_wfh.commit()


def test_delete_wfh(client_wfh: TestClient, auth_token_headers_wfh: dict[str, str], test_user_wfh: models.User, db_wfh: Session):
    wfh_create_schema = schemas.WFHCreate(
        from_date=date.today() + timedelta(days=45),
        to_date=date.today() + timedelta(days=46),
        comments="WFH to delete",
        num_days=2,
        user_id=test_user_wfh.id
    )
    created_wfh = crud.create_user_wfh(db_wfh, wfh=wfh_create_schema, user_id=test_user_wfh.id)

    response = client_wfh.delete(f"{API_V1_STR}/wfh/{created_wfh.id}", headers=auth_token_headers_wfh)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == created_wfh.id

    wfh_in_db = db_wfh.query(models.WFH).filter(models.WFH.id == created_wfh.id).first()
    assert wfh_in_db is None # Should be deleted


def test_get_all_my_wfhs(client_wfh: TestClient, auth_token_headers_wfh: dict[str, str], test_user_wfh: models.User, db_wfh: Session):
    db_wfh.query(models.WFH).filter(models.WFH.user_id == test_user_wfh.id).delete()
    db_wfh.commit()

    wfh1_schema = schemas.WFHCreate(
        from_date=date.today() + timedelta(days=55), to_date=date.today() + timedelta(days=56),
        comments="WFH 1", num_days=2, user_id=test_user_wfh.id)
    wfh2_schema = schemas.WFHCreate(
        from_date=date.today() + timedelta(days=57), to_date=date.today() + timedelta(days=58),
        comments="WFH 2", num_days=2, user_id=test_user_wfh.id)

    w1 = crud.create_user_wfh(db_wfh, wfh=wfh1_schema, user_id=test_user_wfh.id)
    w2 = crud.create_user_wfh(db_wfh, wfh=wfh2_schema, user_id=test_user_wfh.id)

    response = client_wfh.get(f"{API_V1_STR}/wfh", headers=auth_token_headers_wfh)
    assert response.status_code == 200, response.text
    data = response.json()
    assert len(data) == 2
    comments_in_response = {item["comments"] for item in data}
    assert "WFH 1" in comments_in_response
    assert "WFH 2" in comments_in_response

    db_wfh.delete(w1) # Cleanup
    db_wfh.delete(w2)
    db_wfh.commit()
