from pydantic import BaseModel
import typing as t


class UserBase(BaseModel):
    email: str
    is_active: bool = True
    is_superuser: bool = False
    first_name: str = ""
    last_name: str = ""


class UserOut(UserBase):
    pass


from pydantic import ConfigDict

class UserCreate(UserBase):
    password: str
    model_config = ConfigDict(from_attributes=True)


class UserEdit(UserBase):
    password: t.Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class User(UserBase):
    id: int
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
