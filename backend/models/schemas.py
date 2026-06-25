from datetime import date
from typing import Any, Optional
from decimal import Decimal

from pydantic import BaseModel, EmailStr, Field, field_validator, model_validator

from utility.validators import (
    check_name_non_empty,
    check_password_min_length,
    check_phone_non_empty,
)


class UserSignup(BaseModel):
    email: EmailStr
    password: str
    mobile_number: str
    first_name: str
    last_name: str
    confirm_password: str

    _password_val = field_validator("password", mode="before")(check_password_min_length)
    _name_val = field_validator("first_name", "last_name", mode="before")(check_name_non_empty)
    _phone_val = field_validator("mobile_number", mode="before")(check_phone_non_empty)

    @model_validator(mode="after")
    def passwords_match(self) -> "UserSignup":
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class OTPRequest(BaseModel):
    email: EmailStr


class OTPVerify(BaseModel):
    email: EmailStr
    otp: str


class StaffLogin(BaseModel):
    email: str
    password: str


class AdminLogin(BaseModel):
    email: str
    password: str


class BookingCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    street: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    in_date: date  # Parsed + validated automatically
    out_date: date
    adult: int = Field(ge=1)
    children: int = Field(ge=0)
    rooms: int = Field(ge=1)
    room_type: str
    special_request: Optional[str] = None



class CancelBooking(BaseModel):
    booking_id: str


class CreateAdmin(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str

    _password_val = field_validator("password", mode="before")(check_password_min_length)
    _name_val = field_validator("first_name", "last_name", mode="before")(check_name_non_empty)


class DeleteAdmin(BaseModel):
    email: EmailStr


class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None
    confirm_password: Optional[str] = None

    @model_validator(mode="after")
    def passwords_match(self) -> "ProfileUpdate":
        if self.new_password and self.new_password != self.confirm_password:
            raise ValueError("Passwords do not match")
        return self




class PaymentRequest(BaseModel):
    booking_data: dict[str, Any]
    payment_data: Optional[dict[str, Any]] = None
    payment_method: str
    total_amount: Decimal


class RoomCreate(BaseModel):
    room_number: str
    name: str
    type: str
    description: str = ""
    price_base: Decimal = Decimal("0")
    price_weekend: Decimal = Decimal("0")
    capacity: int = 2
    size_sqm: int = 0
    bed_type: str = ""
    amenities: list[str] = []
    floor: int = 1


class RoomStatusUpdate(BaseModel):
    status: str


class BookingStatusUpdate(BaseModel):
    status: str


class TaskCreate(BaseModel):
    title: str
    description: str = ""
    priority: str = "medium"
    assigned_to: str = ""
    room_number: str = ""
    department: str = ""
    due_time: str = ""


class TaskStatusUpdate(BaseModel):
    status: str


class ChecklistToggle(BaseModel):
    completed: bool


class ClockInOut(BaseModel):
    pass