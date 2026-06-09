from typing import Any, Optional

from pydantic import BaseModel, EmailStr, Field, model_validator


class UserSignup(BaseModel):
    email: EmailStr
    password: str
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    repassword: Optional[str] = None
    confirmpassword: Optional[str] = None

    model_config = {"populate_by_name": True}

    @model_validator(mode="after")
    def normalize_names(self):
        if not self.firstname:
            self.firstname = self.first_name
        if not self.lastname:
            self.lastname = self.last_name
        return self

    def confirm_password(self) -> str:
        return self.repassword or self.confirmpassword or ""


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
    in_date: str
    out_date: str
    adult: int
    children: int
    rooms: int
    room_type: str
    special_request: Optional[str] = Field(default=None, alias="special_request")


class CancelBooking(BaseModel):
    booking_id: str


class CreateAdmin(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    password: str


class DeleteAdmin(BaseModel):
    email: EmailStr


class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    currentPassword: Optional[str] = None
    current_password: Optional[str] = None
    newPassword: Optional[str] = None
    new_password: Optional[str] = None
    confirmPassword: Optional[str] = None
    confirm_password: Optional[str] = None

    def current_pwd(self) -> Optional[str]:
        return self.currentPassword or self.current_password

    def new_pwd(self) -> Optional[str]:
        return self.newPassword or self.new_password

    def confirm_pwd(self) -> Optional[str]:
        return self.confirmPassword or self.confirm_password


class PaymentRequest(BaseModel):
    bookingData: dict[str, Any]
    paymentData: Optional[dict[str, Any]] = None
    paymentMethod: str
    totalAmount: float
