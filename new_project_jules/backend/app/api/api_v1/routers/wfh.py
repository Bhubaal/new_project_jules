from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import typing as t

from app.db.session import get_db
from app.db import crud, schemas
from app.core.auth import get_current_active_user, get_current_active_superuser
from app.db.models import User

wfh_router = r = APIRouter()

# Regular user endpoints

@r.post("/wfh", response_model=schemas.WFH, status_code=201)
async def create_wfh_request_for_self(
    wfh_in: schemas.WFHCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Create a new WFH request for the current user.
    """
    if wfh_in.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="user_id in payload must match authenticated user.")
    return crud.create_user_wfh(db=db, wfh=wfh_in, user_id=current_user.id)

@r.get("/wfh", response_model=t.List[schemas.WFH])
async def get_my_wfh_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    skip: int = 0,
    limit: int = Query(default=100, lte=100),
):
    """
    Get all WFH requests for the current user.
    """
    return crud.get_user_wfhs(db=db, user_id=current_user.id, skip=skip, limit=limit)

@r.get("/wfh/{wfh_id}", response_model=schemas.WFH)
async def get_wfh_request(
    wfh_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Get a specific WFH request by ID for the current user.
    """
    wfh = crud.get_wfh(db=db, wfh_id=wfh_id, user_id=current_user.id)
    if not wfh:
        raise HTTPException(status_code=404, detail="WFH request not found")
    return wfh

@r.put("/wfh/{wfh_id}", response_model=schemas.WFH)
async def update_wfh_request(
    wfh_id: int,
    wfh_in: schemas.WFHEdit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Update a specific WFH request by ID for the current user.
    """
    existing_wfh = crud.get_wfh(db=db, wfh_id=wfh_id, user_id=current_user.id)
    if not existing_wfh:
        raise HTTPException(status_code=404, detail="WFH request not found or not owned by user")

    if hasattr(wfh_in, 'user_id') and wfh_in.user_id is not None and wfh_in.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot change ownership of the WFH request.")

    return crud.update_wfh(db=db, wfh_id=wfh_id, wfh_update=wfh_in, user_id=current_user.id)

@r.delete("/wfh/{wfh_id}", response_model=schemas.WFH)
async def delete_wfh_request(
    wfh_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Delete a specific WFH request by ID for the current user.
    """
    existing_wfh = crud.get_wfh(db=db, wfh_id=wfh_id, user_id=current_user.id)
    if not existing_wfh:
        raise HTTPException(status_code=404, detail="WFH request not found or not owned by user")

    return crud.delete_wfh(db=db, wfh_id=wfh_id, user_id=current_user.id)


# Admin Endpoints for managing WFH requests

@r.post("/admin/wfh", response_model=schemas.WFH, status_code=201, tags=["admin"])
async def admin_create_wfh_for_user(
    wfh_in: schemas.WFHCreate, # Contains user_id for target user
    db: Session = Depends(get_db),
    current_superuser: User = Depends(get_current_active_superuser),
):
    """
    Admin: Create a new WFH request for a specified user.
    The user_id of the target user must be provided in the wfh_in payload.
    """
    user = crud.get_user(db, wfh_in.user_id) # Validate user exists
    if not user:
        raise HTTPException(status_code=404, detail=f"User with id {wfh_in.user_id} not found.")
    # The user_id from the payload (wfh_in.user_id) is passed to crud.create_user_wfh
    return crud.create_user_wfh(db=db, wfh=wfh_in, user_id=wfh_in.user_id)

@r.get("/admin/users/{user_id}/wfh", response_model=t.List[schemas.WFH], tags=["admin"])
async def admin_get_user_wfh_requests(
    user_id: int,
    db: Session = Depends(get_db),
    current_superuser: User = Depends(get_current_active_superuser),
    skip: int = 0,
    limit: int = Query(default=100, lte=100),
):
    """
    Admin: Get all WFH requests for a specific user.
    """
    user = crud.get_user(db, user_id) # Validate user exists
    if not user:
        raise HTTPException(status_code=404, detail=f"User with id {user_id} not found.")
    return crud.get_user_wfhs(db=db, user_id=user_id, skip=skip, limit=limit)

@r.get("/admin/wfh/{wfh_id}", response_model=schemas.WFH, tags=["admin"])
async def admin_get_wfh_request_by_id(
    wfh_id: int,
    db: Session = Depends(get_db),
    current_superuser: User = Depends(get_current_active_superuser),
):
    """
    Admin: Get a specific WFH request by its ID.
    """
    wfh = crud.get_wfh_by_id_admin(db=db, wfh_id=wfh_id)
    if not wfh:
        raise HTTPException(status_code=404, detail="WFH request not found")
    return wfh

@r.put("/admin/wfh/{wfh_id}", response_model=schemas.WFH, tags=["admin"])
async def admin_update_wfh_request(
    wfh_id: int,
    wfh_in: schemas.WFHEdit,
    db: Session = Depends(get_db),
    current_superuser: User = Depends(get_current_active_superuser),
):
    """
    Admin: Update a specific WFH request by its ID.
    """
    updated_wfh = crud.update_wfh_admin(db=db, wfh_id=wfh_id, wfh_update=wfh_in)
    if not updated_wfh: # Should be handled by HTTPException in crud if not found
        raise HTTPException(status_code=404, detail="WFH request not found or failed to update")
    return updated_wfh

@r.delete("/admin/wfh/{wfh_id}", response_model=schemas.WFH, tags=["admin"])
async def admin_delete_wfh_request(
    wfh_id: int,
    db: Session = Depends(get_db),
    current_superuser: User = Depends(get_current_active_superuser),
):
    """
    Admin: Delete a specific WFH request by its ID.
    """
    deleted_wfh = crud.delete_wfh_admin(db=db, wfh_id=wfh_id)
    if not deleted_wfh: # Should be handled by HTTPException in crud if not found
        raise HTTPException(status_code=404, detail="WFH request not found or failed to delete")
    return deleted_wfh
