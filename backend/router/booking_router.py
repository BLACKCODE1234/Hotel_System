from fastapi import APIRouter, HTTPException, Request

from dependencies import get_current_user_payload
from models.schemas import BookingCreate, CancelBooking
from service import booking_service

router = APIRouter(tags=["bookings"])


@router.post("/bookings")
def create_booking(data: BookingCreate, request: Request):
    decoded = get_current_user_payload(request)
    email = decoded.get("email")
    if not email:
        raise HTTPException(status_code=401, detail={"message": "Account not found"})
    return booking_service.create_booking(email, data)


@router.post("/cancelbooking")
def cancel_booking(data: CancelBooking, request: Request):
    decoded = get_current_user_payload(request)
    return booking_service.cancel_user_booking(
        decoded.get("email"),
        decoded.get("role", "user"),
        data,
    )
