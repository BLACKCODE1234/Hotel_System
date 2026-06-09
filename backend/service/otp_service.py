from datetime import datetime, timedelta

from fastapi import HTTPException

from models.schemas import OTPRequest, OTPVerify
from repository import otp_repository, user_repository
from utility.otp import generate_otp
from utility.security import hash_otp, verify_otp
from utility.utility_email import send_otp_email


def send_otp(data: OTPRequest):
    otp = generate_otp()
    hashed_otp = hash_otp(otp)
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    try:
        otp_repository.delete_otps_for_email(data.email)
        otp_repository.save_otp(data.email, hashed_otp, expires_at)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": "Server error", "error": str(e)})

    try:
        send_otp_email(data.email, otp)
    except Exception:
        raise HTTPException(status_code=500, detail={"message": "Failed to send OTP email"})

    return {"message": "OTP sent to email"}


def verify_otp_code(data: OTPVerify):
    record = otp_repository.get_latest_otp(data.email)
    if not record:
        raise HTTPException(status_code=400, detail={"message": "OTP NOT FOUND"})

    if record.get("used"):
        raise HTTPException(status_code=400, detail={"message": "OTP has already been used"})

    expires_at = record["expires_at"]
    if datetime.utcnow() > expires_at:
        otp_repository.mark_otp_used(record["id"])
        raise HTTPException(status_code=400, detail={"message": "OTP has expired"})

    if not verify_otp(data.otp, record["otp_hash"]):
        raise HTTPException(status_code=400, detail={"message": "Invalid OTP"})

    otp_repository.mark_otp_used(record["id"])
    user_repository.mark_verified(data.email)

    return {"message": "OTP verified successfully", "account_verified": True}
