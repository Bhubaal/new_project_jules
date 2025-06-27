from pydantic import BaseModel
import typing as t


class UserBase(BaseModel):
    email: str
    is_active: bool = True
    is_superuser: bool = False
    first_name: t.Optional[str] = None
    last_name: t.Optional[str] = None
    granted_additional_days: int = 0


class UserOut(UserBase):
    id: int # Ensure UserOut also has id if it's meant to be a representation of a user from DB
    # granted_additional_days is inherited from UserBase
    pass


from pydantic import ConfigDict

class UserCreate(UserBase):
    password: str
    model_config = ConfigDict(from_attributes=True)


class UserEdit(UserBase): # UserBase now includes granted_additional_days, but we want it optional here
    password: t.Optional[str] = None
    email: t.Optional[str] = None # Make all fields in UserEdit optional
    is_active: t.Optional[bool] = None
    is_superuser: t.Optional[bool] = None
    first_name: t.Optional[str] = None
    last_name: t.Optional[str] = None
    granted_additional_days: t.Optional[int] = None # Explicitly make it optional for editing
    model_config = ConfigDict(from_attributes=True)


class User(UserBase): # UserBase now includes granted_additional_days
    id: int
    # No need to redeclare granted_additional_days if UserBase has it with a default
    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str = None
    permissions: str = "user"


# Leave Schemas
from datetime import date
from .models import LeaveStatus, LeaveType, WFHStatus

class LeaveBase(BaseModel):
    from_date: date
    to_date: date
    leave_type: LeaveType
    comments: t.Optional[str] = None
    num_days: int
    user_id: int # Changed from owner_id to user_id to match model

class LeaveCreate(LeaveBase):
    pass

class LeaveEdit(BaseModel):
    from_date: t.Optional[date] = None
    to_date: t.Optional[date] = None
    leave_type: t.Optional[LeaveType] = None
    comments: t.Optional[str] = None
    num_days: t.Optional[int] = None
    status: t.Optional[LeaveStatus] = None

class Leave(LeaveBase):
    id: int
    status: LeaveStatus
    model_config = ConfigDict(from_attributes=True)

# WFH Schemas
class WFHBase(BaseModel):
    from_date: date
    to_date: date
    comments: t.Optional[str] = None
    num_days: int
    user_id: int # Changed from owner_id to user_id to match model

class WFHCreate(WFHBase):
    pass

class WFHEdit(BaseModel):
    from_date: t.Optional[date] = None
    to_date: t.Optional[date] = None
    comments: t.Optional[str] = None
    num_days: t.Optional[int] = None
    status: t.Optional[WFHStatus] = None


class WFH(WFHBase):
    id: int
    status: WFHStatus
    model_config = ConfigDict(from_attributes=True)
