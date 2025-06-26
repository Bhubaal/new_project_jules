from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import typing as t

from . import models, schemas
from app.core.security import get_password_hash


def get_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_user_by_email(db: Session, email: str) -> schemas.UserBase:
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(
    db: Session, skip: int = 0, limit: int = 100
) -> t.List[schemas.UserOut]:
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        is_active=user.is_active,
        is_superuser=user.is_superuser,
        hashed_password=hashed_password,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Leave CRUD functions
def get_leave(db: Session, leave_id: int, user_id: int):
    leave = db.query(models.Leave).filter(models.Leave.id == leave_id, models.Leave.user_id == user_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    return leave

def get_user_leaves(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> t.List[schemas.Leave]:
    return db.query(models.Leave).filter(models.Leave.user_id == user_id).offset(skip).limit(limit).all()

# Admin CRUD function to get any leave by ID without user_id check
def get_leave_by_id_admin(db: Session, leave_id: int):
    leave = db.query(models.Leave).filter(models.Leave.id == leave_id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    return leave

def create_user_leave(db: Session, leave: schemas.LeaveCreate, user_id: int):
    # user_id parameter is authoritative.
    # For regular users, API layer sets this to current_user.id and validates leave.user_id against it.
    # For admin, API layer sets this to leave.user_id from payload.
    leave_data = leave.model_dump(exclude={'user_id'}) # Exclude user_id from model dump, as it's passed directly
    db_leave = models.Leave(**leave_data, user_id=user_id)
    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)
    return db_leave

def update_leave(db: Session, leave_id: int, leave_update: schemas.LeaveEdit, user_id: int):
    db_leave = get_leave(db, leave_id, user_id) # Ensures user owns the leave
    update_data = leave_update.model_dump(exclude_unset=True) # Use model_dump

    for key, value in update_data.items():
        setattr(db_leave, key, value)

    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)
    return db_leave

def update_leave_admin(db: Session, leave_id: int, leave_update: schemas.LeaveEdit):
    db_leave = get_leave_by_id_admin(db, leave_id) # Use the admin getter, no user_id check
    update_data = leave_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_leave, key, value)

    db.add(db_leave)
    db.commit()
    db.refresh(db_leave)
    return db_leave

def delete_leave(db: Session, leave_id: int, user_id: int):
    db_leave = get_leave(db, leave_id, user_id) # Ensures user owns the leave
    db.delete(db_leave)
    db.commit()
    return db_leave

def delete_leave_admin(db: Session, leave_id: int):
    db_leave = get_leave_by_id_admin(db, leave_id) # Use the admin getter, no user_id check
    db.delete(db_leave)
    db.commit()
    return db_leave

# WFH CRUD functions
def get_wfh(db: Session, wfh_id: int, user_id: int):
    wfh = db.query(models.WFH).filter(models.WFH.id == wfh_id, models.WFH.user_id == user_id).first()
    if not wfh:
        raise HTTPException(status_code=404, detail="WFH request not found")
    return wfh

def get_user_wfhs(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> t.List[schemas.WFH]:
    return db.query(models.WFH).filter(models.WFH.user_id == user_id).offset(skip).limit(limit).all()

def create_user_wfh(db: Session, wfh: schemas.WFHCreate, user_id: int):
    # Prioritize user_id from parameter (authenticated user)
    wfh_data = wfh.model_dump(exclude_unset=True, exclude={'user_id'}) # Exclude user_id from the dump
    db_wfh = models.WFH(**wfh_data, user_id=user_id) # Pass user_id explicitly
    db.add(db_wfh)
    db.commit()
    db.refresh(db_wfh)
    return db_wfh

def update_wfh(db: Session, wfh_id: int, wfh_update: schemas.WFHEdit, user_id: int):
    db_wfh = get_wfh(db, wfh_id, user_id) # Ensures user owns the wfh
    update_data = wfh_update.model_dump(exclude_unset=True) # Use model_dump

    for key, value in update_data.items():
        setattr(db_wfh, key, value)

    db.add(db_wfh)
    db.commit()
    db.refresh(db_wfh)
    return db_wfh

def delete_wfh(db: Session, wfh_id: int, user_id: int):
    db_wfh = get_wfh(db, wfh_id, user_id) # Ensures user owns the wfh
    db.delete(db_wfh)
    db.commit()
    return db_wfh

# Admin WFH CRUD functions
def get_wfh_by_id_admin(db: Session, wfh_id: int):
    wfh = db.query(models.WFH).filter(models.WFH.id == wfh_id).first()
    if not wfh:
        raise HTTPException(status_code=404, detail="WFH request not found")
    return wfh

def update_wfh_admin(db: Session, wfh_id: int, wfh_update: schemas.WFHEdit):
    db_wfh = get_wfh_by_id_admin(db, wfh_id) # Use admin getter
    update_data = wfh_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_wfh, key, value)
    db.add(db_wfh)
    db.commit()
    db.refresh(db_wfh)
    return db_wfh

def delete_wfh_admin(db: Session, wfh_id: int):
    db_wfh = get_wfh_by_id_admin(db, wfh_id) # Use admin getter
    db.delete(db_wfh)
    db.commit()
    return db_wfh


def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    db.delete(user)
    db.commit()
    return user


def edit_user(
    db: Session, user_id: int, user: schemas.UserEdit
) -> schemas.User:
    db_user = get_user(db, user_id)
    if not db_user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, detail="User not found")
    update_data = user.dict(exclude_unset=True)

    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(user.password)
        del update_data["password"]

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
