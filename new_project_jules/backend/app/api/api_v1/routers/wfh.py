from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import typing as t

from app.db.session import get_db
from app.db import crud, schemas
from app.core.auth import get_current_active_user
from app.db.models import User

wfh_router = r = APIRouter()

@r.post("/wfh", response_model=schemas.WFH, status_code=201)
async def create_wfh_request(
    wfh_in: schemas.WFHCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Create a new WFH request for the current user.
    """
    if wfh_in.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Cannot create WFH request for another user.")
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
