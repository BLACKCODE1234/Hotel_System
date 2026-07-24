from fastapi import HTTPException, Request, Response

from helper.generate_token import generate_access_token
from models.schemas import PaymentRequest
from repository.booking_repository import create_booking
from repository.payment_repository import create_payment
from utility.cookies import set_access_cookie


def process_payment(email: str, data: PaymentRequest):
    missing_fields = []
    if not data.booking_data:
        missing_fields.append("booking data")
    if not data.payment_method:
        missing_fields.append("payment method")
    if data.total_amount is None:
        missing_fields.append("total amount")

    if missing_fields:
        raise HTTPException(
            status_code=400,
            detail={"message": f"Required fields missing: {', '.join(missing_fields)}"},
        )

    user_email = email
    in_date = data.booking_data.get("in_date") or data.booking_data.get("check_in") or data.booking_data.get("checkIn")
    out_date = data.booking_data.get("out_date") or data.booking_data.get("check_out") or data.booking_data.get("checkOut")
    room_type = data.booking_data.get("room_type") or data.booking_data.get("roomType")
    first_name = data.booking_data.get("first_name") or data.booking_data.get("firstName") or ""
    last_name = data.booking_data.get("last_name") or data.booking_data.get("lastName") or ""
    phone = data.booking_data.get("phone") or ""
    adult = int(data.booking_data.get("adult") or data.booking_data.get("adults") or 1)
    children = int(data.booking_data.get("children") or 0)
    booking_status = "pending" if data.payment_method == "cash-front-desk" else "confirmed"

    if not all([in_date, out_date, room_type]):
        raise HTTPException(
            status_code=400,
            detail={"message": "Booking dates and room type are required"},
        )

    safe_payment_data = _sanitize_payment_data(data.payment_data or {})

    try:
        booking = create_booking(
            user_email,
            room_type,
            in_date,
            out_date,
            booking_status,
            guest_name=f"{first_name} {last_name}".strip(),
            phone=phone,
            guests=adult + children,
        )
        method_description = _payment_method_description(data.payment_method, safe_payment_data)
        payment_status = "pending" if data.payment_method == "cash-front-desk" else "completed"
        payment = create_payment(
            booking["booking_id"],
            user_email,
            data.total_amount,
            method_description,
            payment_status,
        )
    except Exception:
        raise HTTPException(
            status_code=500,
            detail={"message": "Server error"},
        )

    return {
        "message": "Payment processed successfully",
        "booking": booking,
        "payment": payment,
    }


def staff_payment_refresh(request: Request, response: Response, decoded: dict):
    try:
        new_access_token = generate_access_token(decoded["email"], decoded["role"])
        set_access_cookie(response, request, new_access_token)
        return {"message": "Token refreshed successfully"}
    except Exception:
        raise HTTPException(
            status_code=500,
            detail={"message": "Failed to generate new token", "error": "a token issue"},
        )


def _sanitize_payment_data(payment_data: dict) -> dict:
    safe = dict(payment_data)
    card_number = str(safe.pop("cardNumber", "") or "").replace(" ", "")
    safe.pop("cvv", None)
    if card_number:
        safe["cardLast4"] = card_number[-4:] if len(card_number) >= 4 else ""
    return safe


def _payment_method_description(payment_method: str, payment_data: dict) -> str:
    if payment_method == "credit-card":
        last4 = payment_data.get("cardLast4") or ""
        return f"Card **** {last4}" if last4 else "Card"
    if payment_method == "paypal":
        paypal_email = payment_data.get("paypalEmail")
        return f"PayPal ({paypal_email})" if paypal_email else "PayPal"
    if payment_method == "mobile-money":
        carrier = payment_data.get("mobileCarrier") or "Mobile Money"
        phone_number = payment_data.get("phoneNumber") or ""
        return f"{carrier} {phone_number}".strip()
    if payment_method == "cash-front-desk":
        return "Cash at front desk"
    return payment_method
