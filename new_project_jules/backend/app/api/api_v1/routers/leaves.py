from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import typing as t

from app.db.session import get_db
from app.db import crud, schemas
from app.core.auth import get_current_active_user, get_current_active_superuser
from app.db.models import User

leaves_router = r = APIRouter()

# Regular user endpoints (prefixed with /user for clarity, or keep as is if preferred)

@r.post("/leaves", response_model=schemas.Leave, status_code=201)
async def create_leave_request_for_self(
    leave_in: schemas.LeaveCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Create a new leave request for the current user.
    """
    if leave_in.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="user_id in payload must match authenticated user.")
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


# Admin Endpoints for managing leaves

@r.post("/admin/leaves", response_model=schemas.Leave, status_code=201, tags=["admin"])
async def admin_create_leave_for_user(
    leave_in: schemas.LeaveCreate, # Contains user_id for target user
    db: Session = Depends(get_db),
    current_superuser: User = Depends(get_current_active_superuser),
):
    """
    Admin: Create a new leave request for a specified user.
    The user_id of the target user must be provided in the leave_in payload.
    """
    # Optional: Validate if user_id in leave_in exists
    user = crud.get_user(db, leave_in.user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User with id {leave_in.user_id} not found.")
    # The user_id from the payload (leave_in.user_id) is passed to crud.create_user_leave
    return crud.create_user_leave(db=db, leave=leave_in, user_id=leave_in.user_id)

@r.get("/admin/users/{user_id}/leaves", response_model=t.List[schemas.Leave], tags=["admin"])
async def admin_get_user_leave_requests(
    user_id: int,
    db: Session = Depends(get_db),
    current_superuser: User = Depends(get_current_active_superuser),
    skip: int = 0,
    limit: int = Query(default=100, lte=100),
):
    """
    Admin: Get all leave requests for a specific user.
    """
    user = crud.get_user(db, user_id) # Validate user exists
    if not user:
        raise HTTPException(status_code=404, detail=f"User with id {user_id} not found.")
    return crud.get_user_leaves(db=db, user_id=user_id, skip=skip, limit=limit)

@r.get("/admin/leaves/{leave_id}", response_model=schemas.Leave, tags=["admin"])
async def admin_get_leave_request_by_id(
    leave_id: int,
    db: Session = Depends(get_db),
    current_superuser: User = Depends(get_current_active_superuser),
):
    """
    Admin: Get a specific leave request by its ID.
    """
    leave = crud.get_leave_by_id_admin(db=db, leave_id=leave_id)
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    return leave

@r.put("/admin/leaves/{leave_id}", response_model=schemas.Leave, tags=["admin"])
async def admin_update_leave_request(
    leave_id: int,
    leave_in: schemas.LeaveEdit,
    db: Session = Depends(get_db),
    current_superuser: User = Depends(get_current_active_superuser),
):
    """
    Admin: Update a specific leave request by its ID.
    """
    # crud.update_leave_admin will fetch the leave by ID and update it.
    # It also handles the case where the leave doesn't exist.
    # Note: LeaveEdit schema does not (and should not) contain user_id to change ownership.
    # If changing user_id was a requirement, the schema and logic would need adjustment.
    updated_leave = crud.update_leave_admin(db=db, leave_id=leave_id, leave_update=leave_in)
    if not updated_leave: # Should be handled by HTTPException in crud if not found
        raise HTTPException(status_code=404, detail="Leave request not found or failed to update")
    return updated_leave

@r.delete("/admin/leaves/{leave_id}", response_model=schemas.Leave, tags=["admin"])
async def admin_delete_leave_request(
    leave_id: int,
    db: Session = Depends(get_db),
    current_superuser: User = Depends(get_current_active_superuser),
):
    """
    Admin: Delete a specific leave request by its ID.
    """
    # crud.delete_leave_admin will fetch the leave by ID and delete it.
    # It also handles the case where the leave doesn't exist.
    deleted_leave = crud.delete_leave_admin(db=db, leave_id=leave_id)
    if not deleted_leave: # Should be handled by HTTPException in crud if not found
        raise HTTPException(status_code=404, detail="Leave request not found or failed to delete")
    return deleted_leave
