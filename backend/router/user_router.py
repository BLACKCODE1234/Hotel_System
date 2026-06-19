from fastapi import APIRouter, HTTPException, Request

from dependencies import get_current_user_payload
from models.schemas import ProfileUpdate
from service import user_service

router = APIRouter(tags=["users"])


def _get_email(request: Request) -> str:
    decoded = get_current_user_payload(request)
    email = decoded.get("email")
    if not email:
        raise HTTPException(status_code=401, detail={"message": "Invalid token payload"})
    return email


@router.get("/userdetails")
def user_details(request: Request):
    return user_service.get_details(_get_email(request))


@router.post("/change-password")
def change_password(data: ProfileUpdate, request: Request):
    return user_service.update_profile(_get_email(request), data)


@router.post("/change-profile")
def change_profile(data: ProfileUpdate, request: Request):
    return user_service.update_profile(_get_email(request), data)


@router.get("/user/history")
def user_history(request: Request):
    return user_service.get_history(_get_email(request))
