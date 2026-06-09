from fastapi import APIRouter, Request

from dependencies import get_current_user_payload
from models.schemas import ProfileUpdate
from service import user_service

router = APIRouter(tags=["users"])


@router.get("/userdetails")
def user_details(request: Request):
    decoded = get_current_user_payload(request)
    email = decoded.get("email")
    if not email:
        from fastapi import HTTPException

        raise HTTPException(status_code=401, detail={"message": "Invalid token payload"})
    return user_service.get_details(email)


@router.post("/change-password")
def change_password(data: ProfileUpdate, request: Request):
    decoded = get_current_user_payload(request)
    email = decoded.get("email")
    if not email:
        from fastapi import HTTPException

        raise HTTPException(status_code=401, detail={"message": "Invalid token payload"})
    return user_service.update_profile(email, data)


@router.post("/change-profile")
def change_profile(data: ProfileUpdate, request: Request):
    return change_password(data, request)


@router.get("/user/history")
def user_history(request: Request):
    decoded = get_current_user_payload(request)
    email = decoded.get("email")
    if not email:
        from fastapi import HTTPException

        raise HTTPException(status_code=401, detail={"message": "Invalid token payload"})
    return user_service.get_history(email)
