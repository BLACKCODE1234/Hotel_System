from fastapi import APIRouter, Request, Response, status

from dependencies import require_role
from models.schemas import PaymentRequest
from service import payment_service

router = APIRouter(tags=["payments"])


@router.post("/payments", status_code=status.HTTP_201_CREATED)
def payments(data: PaymentRequest, request: Request):
    decoded = require_role(request, ["user", "admin", "superadmin"])
    return payment_service.process_payment(decoded.get("email"), data)
