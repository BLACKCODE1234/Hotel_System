from fastapi import APIRouter

from models.schemas import OTPRequest, OTPVerify
from service import otp_service

router = APIRouter(tags=["otp"])


@router.post("/send-otp")
def send_otp(data: OTPRequest):
    return otp_service.send_otp(data)


@router.post("/verify-otp")
def verify_otp(data: OTPVerify):
    return otp_service.verify_otp_code(data)
