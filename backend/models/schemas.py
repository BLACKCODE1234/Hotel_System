from datetime import date
from decimal import Decimal
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field

from utility.validators import (
    UserValidators,
    CreateAdminValidators,
    ProfileValidators,
    BookingValidators,
)


class UserSignup(BaseModel, UserValidators):
    email: EmailStr
    password: str
    confirm_password: str
    mobile_number: str
    first_name: str
    last_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class OTPRequest(BaseModel):
    email: EmailStr


class OTPVerify(BaseModel):
    email: EmailStr
    otp: str


class StaffLogin(BaseModel):
    email: EmailStr
    password: str


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class BookingCreate(BaseModel, BookingValidators):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str

    street: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None

    in_date: date
    out_date: date

    adult: int = Field(ge=1)
    children: int = Field(default=0, ge=0)
    rooms: int = Field(default=1, ge=1)

    room_type: str
    special_request: Optional[str] = None


class CancelBooking(BaseModel):
    booking_id: str


class CreateAdmin(BaseModel, CreateAdminValidators):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


class DeleteAdmin(BaseModel):
    email: EmailStr


class ProfileUpdate(BaseModel, ProfileValidators):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

    current_password: Optional[str] = None
    new_password: Optional[str] = None
    confirm_password: Optional[str] = None


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

    amenities: list[str] = Field(default_factory=list)

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