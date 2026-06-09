from fastapi import APIRouter, Request, Response, status

from dependencies import require_role
from models.schemas import PaymentRequest
from service import payment_service

router = APIRouter(tags=["payments"])


@router.post("/payments", status_code=status.HTTP_201_CREATED)
def payments(data: PaymentRequest, request: Request):
    decoded = require_role(request, ["superadmin"])
    return payment_service.process_payment(decoded.get("email"), data)


@router.post("/staffpayment")
def staff_payment(request: Request, response: Response):
    decoded = require_role(request, ["superadmin"])
    return payment_service.staff_payment_refresh(request, response, decoded)
