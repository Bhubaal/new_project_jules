from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import typing as t

from app.db.session import get_db
from app.db import crud, schemas
from app.core.auth import get_current_active_user
from app.db.models import User

leaves_router = r = APIRouter()

@r.post("/leaves", response_model=schemas.Leave, status_code=201)
async def create_leave_request(
    leave_in: schemas.LeaveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Create a new leave request for the current user.
    """
    if leave_in.user_id != current_user.id:
        # This is a check to ensure that the user_id in the payload matches the authenticated user.
        # Alternatively, we can ignore leave_in.user_id and always use current_user.id
        raise HTTPException(status_code=403, detail="Cannot create leave request for another user.")
    return crud.create_user_leave(db=db, leave=leave_in, user_id=current_user.id)

@r.get("/leaves", response_model=t.List[schemas.Leave])
async def get_my_leave_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = Query(default=100, lte=100),
):
    """
    Get all leave requests for the current user.
    """
    return crud.get_user_leaves(db=db, user_id=current_user.id, skip=skip, limit=limit)

@r.get("/leaves/{leave_id}", response_model=schemas.Leave)
async def get_leave_request(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get a specific leave request by ID for the current user.
    """
    leave = crud.get_leave(db=db, leave_id=leave_id, user_id=current_user.id)
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    return leave

@r.put("/leaves/{leave_id}", response_model=schemas.Leave)
async def update_leave_request(
    leave_id: int,
    leave_in: schemas.LeaveEdit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Update a specific leave request by ID for the current user.
    Only certain fields can be updated, and status updates might be restricted based on business logic (not implemented here).
    """
    # Ensure the leave exists and belongs to the user before attempting update
    existing_leave = crud.get_leave(db=db, leave_id=leave_id, user_id=current_user.id)
    if not existing_leave:
        raise HTTPException(status_code=404, detail="Leave request not found or not owned by user")

    # Prevent user from updating user_id if it's part of LeaveEdit schema
    if hasattr(leave_in, 'user_id') and leave_in.user_id is not None and leave_in.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot change ownership of the leave request.")

    return crud.update_leave(db=db, leave_id=leave_id, leave_update=leave_in, user_id=current_user.id)

@r.delete("/leaves/{leave_id}", response_model=schemas.Leave)
async def delete_leave_request(
    leave_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Delete a specific leave request by ID for the current user.
    Deletion might be restricted based on status (e.g., cannot delete an approved leave - not implemented here).
    """
    # Ensure the leave exists and belongs to the user before attempting deletion
    existing_leave = crud.get_leave(db=db, leave_id=leave_id, user_id=current_user.id)
    if not existing_leave:
        raise HTTPException(status_code=404, detail="Leave request not found or not owned by user")

    return crud.delete_leave(db=db, leave_id=leave_id, user_id=current_user.id)
