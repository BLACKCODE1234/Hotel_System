from fastapi import APIRouter, Request

from main import limiter
from models.schemas import OTPRequest, OTPVerify
from service import otp_service

router = APIRouter(tags=["otp"])


@router.post("/send-otp")
@limiter.limit("3/minute")
def send_otp(data: OTPRequest, request: Request):
    return otp_service.send_otp(data)


@router.post("/verify-otp")
@limiter.limit("5/minute")
def verify_otp(data: OTPVerify, request: Request):
    return otp_service.verify_otp_code(data)
