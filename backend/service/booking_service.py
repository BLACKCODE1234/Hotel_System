from datetime import date

from fastapi import HTTPException

from models.schemas import BookingCreate, CancelBooking
from repository.booking_repository import cancel_booking, create_booking as repo_create_booking, get_booking_by_id


def create_booking(_email: str, data: BookingCreate):
    missing_fields = []
    if not data.first_name:
        missing_fields.append("first_name")
    if not data.last_name:
        missing_fields.append("last_name")
    if not data.email:
        missing_fields.append("email")
    if not data.phone:
        missing_fields.append("phone")
    if data.adult is None:
        missing_fields.append("adults")
    if data.children is None:
        missing_fields.append("children")
    if data.rooms is None:
        missing_fields.append("rooms")
    if not data.room_type:
        missing_fields.append("room_type")
    if not data.in_date:
        missing_fields.append("in_date")
    if not data.out_date:
        missing_fields.append("out_date")

    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail={"message": f"Required fields missing: {', '.join(missing_fields)}"},
        )

    if data.out_date <= data.in_date:
        raise HTTPException(
            status_code=400,
            detail={"message": "Check-out date must be after check-in date"},
        )

    try:
        booking = repo_create_booking(
            user_email=_email,
            room_type=data.room_type,
            in_date=data.in_date.isoformat() if isinstance(data.in_date, date) else str(data.in_date),
            out_date=data.out_date.isoformat() if isinstance(data.out_date, date) else str(data.out_date),
            status="confirmed",
        )
        return {"message": "Booking created", "booking": booking}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": "Server error", "error": str(e)})


def cancel_user_booking(email: str, role: str, data: CancelBooking):
    if not data.booking_id:
        raise HTTPException(status_code=400, detail={"message": "Booking ID is required"})

    try:
        if role in ("admin", "superadmin"):
            booking = get_booking_by_id(data.booking_id)
        else:
            booking = get_booking_by_id(data.booking_id, user_email=email)

        if not booking:
            raise HTTPException(status_code=404, detail={"message": "Booking not found"})

        updated = cancel_booking(data.booking_id)
        return {"message": "Booking cancelled", "booking": updated}
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail={"message": "Server error"})
