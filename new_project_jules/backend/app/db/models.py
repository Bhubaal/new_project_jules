from sqlalchemy import Boolean, Column, Integer, String, Date, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship

from .session import Base
import enum

class LeaveStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"

class LeaveType(enum.Enum):
    ANNUAL = "annual"
    SICK = "sick"
    UNPAID = "unpaid"
    OTHER = "other"

class WFHStatus(enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    granted_additional_days = Column(Integer, default=0, nullable=False)

    leaves = relationship("Leave", back_populates="owner")
    wfhs = relationship("WFH", back_populates="owner")


class Leave(Base):
    __tablename__ = "leave"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    from_date = Column(Date, nullable=False)
    to_date = Column(Date, nullable=False)
    status = Column(SAEnum(LeaveStatus), default=LeaveStatus.PENDING, nullable=False)
    leave_type = Column(SAEnum(LeaveType), nullable=False)
    comments = Column(String, nullable=True)
    num_days = Column(Integer, nullable=False)

    owner = relationship("User", back_populates="leaves")


class WFH(Base):
    __tablename__ = "wfh"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    from_date = Column(Date, nullable=False)
    to_date = Column(Date, nullable=False)
    status = Column(SAEnum(WFHStatus), default=WFHStatus.PENDING, nullable=False)
    comments = Column(String, nullable=True)
    num_days = Column(Integer, nullable=False)

    owner = relationship("User", back_populates="wfhs")
