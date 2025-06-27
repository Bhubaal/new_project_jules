from fastapi import APIRouter, Request, Depends, Response, encoders
import typing as t

from app.db.session import get_db
from app.db.crud import (
    get_users,
    get_user,
    create_user,
    delete_user,
    edit_user,
)
from app.db.schemas import UserCreate, UserEdit, User, UserOut
from app.core.auth import get_current_active_user, get_current_active_superuser

users_router = r = APIRouter()


@r.get(
    "/users",
    response_model=t.List[User],
    response_model_exclude_none=True,
)
async def users_list(
    response: Response,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    """
    Get all users
    """
    users = get_users(db)
    # This is necessary for react-admin to work
    response.headers["Content-Range"] = f"0-9/{len(users)}"
    return users


@r.get("/users/me", response_model=User, response_model_exclude_none=True)
async def user_me(current_user=Depends(get_current_active_user)):
    """
    Get own user
    """
    return current_user


@r.get(
    "/users/{user_id}",
    response_model=User,
    response_model_exclude_none=True,
)
async def user_details(
    request: Request,
    user_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    """
    Get any user details
    """
    user = get_user(db, user_id)
    return user
    # return encoders.jsonable_encoder(
    #     user, skip_defaults=True, exclude_none=True,
    # )


@r.post("/users", response_model=User, response_model_exclude_none=True)
async def user_create(
    request: Request,
    user: UserCreate,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    """
    Create a new user
    """
    return create_user(db, user)


@r.put(
    "/users/{user_id}", response_model=User, response_model_exclude_none=True
)
async def user_edit(
    request: Request,
    user_id: int,
    user: UserEdit,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    """
    Update existing user
    """
    return edit_user(db, user_id, user)


@r.delete(
    "/users/{user_id}", response_model=User, response_model_exclude_none=True
)
async def user_delete(
    request: Request,
    user_id: int,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser),
):
    """
    Delete existing user
    """
    return delete_user(db, user_id)

from pydantic import BaseModel # Add this import

# New Pydantic model for the request body of the new endpoint
class UserLeaveAdjustment(BaseModel):
    granted_additional_days: int

@r.put("/admin/users/{user_id}/adjust_leave_days", response_model=User, response_model_exclude_none=True, tags=["admin"])
async def adjust_user_leave_days(
    user_id: int,
    adjustment: UserLeaveAdjustment,
    db=Depends(get_db),
    current_user=Depends(get_current_active_superuser), # Ensure this is the correct dependency for admin rights
):
    """
    Admin: Adjust the granted_additional_days for a specific user.
    This sets the total granted_additional_days to the provided value.
    """
    # edit_user will raise an exception if user not found.
    # We need to pass a UserEdit schema to edit_user.
    user_edit_data = UserEdit(granted_additional_days=adjustment.granted_additional_days)

    # The existing edit_user CRUD function can be used.
    # It's already protected by get_current_active_superuser at the router level for /users/{user_id} PUT.
    # However, this is a new specific admin route, so explicit dependency is good.
    return edit_user(db=db, user_id=user_id, user=user_edit_data)
