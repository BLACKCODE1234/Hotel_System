from datetime import date
from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field, model_validator


class UserSignup(BaseModel):
    email: EmailStr
    password: str
    firstname: str 
    lastname: str
    confirm_password: str  # Required — no ambiguity

    @model_validator(mode="after")
    def passwords_must_match(self) -> "UserSignup":
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
    staff_id: str
    password: str


class AdminLogin(BaseModel):
    admin_id: str
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

    @model_validator(mode="after")
    def checkout_after_checkin(self) -> "BookingCreate":
        if self.out_date <= self.in_date:
            raise ValueError("out_date must be after in_date")
        return self


class CancelBooking(BaseModel):
    booking_id: str


class CreateAdmin(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str


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
    def password_change_is_complete(self) -> "ProfileUpdate":
        pwd_fields = [self.current_password, self.new_password, self.confirm_password]
        if any(pwd_fields) and not all(pwd_fields):
            raise ValueError(
                "current_password, new_password, and confirm_password "
                "must all be provided together"
            )
        if self.new_password and self.new_password != self.confirm_password:
            raise ValueError("new_password and confirm_password do not match")
        return self


class PaymentRequest(BaseModel):
    booking_data: dict[str, Any]
    payment_data: Optional[dict[str, Any]] = None
    payment_method: str
    total_amount: float