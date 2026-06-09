from fastapi import HTTPException, Request

from models.schemas import ProfileUpdate
from repository.user_repository import email_exists, get_user_credentials, get_user_details, update_user_profile
from utility.security import hash_password, verify_password


def get_details(email: str):
    try:
        details = get_user_details(email)
    except Exception:
        raise HTTPException(status_code=500, detail={"message": "Server error"})

    if not details:
        raise HTTPException(status_code=404, detail={"message": "User not found"})
    return details


def update_profile(email: str, data: ProfileUpdate):
    new_password = data.new_pwd()
    confirm_password = data.confirm_pwd()
    current_password = data.current_pwd()
    change_password_flag = bool(new_password or confirm_password)

    if change_password_flag:
        if not current_password or not new_password:
            raise HTTPException(
                status_code=400,
                detail={"message": "Current and new password are required"},
            )
        if confirm_password and new_password != confirm_password:
            raise HTTPException(
                status_code=400,
                detail={"message": "New passwords do not match"},
            )
        if len(new_password) < 6:
            raise HTTPException(
                status_code=400,
                detail={"message": "Password should be more than 6 characters"},
            )

    try:
        user = get_user_credentials(email)
    except Exception:
        raise HTTPException(status_code=500, detail={"message": "Server error"})

    if not user:
        raise HTTPException(status_code=404, detail={"message": "User not found"})

    if data.email and data.email != user["email"] and email_exists(data.email):
        raise HTTPException(status_code=400, detail={"message": "Email already in use"})

    fields = {}
    if data.first_name is not None:
        fields["first_name"] = data.first_name
    if data.last_name is not None:
        fields["last_name"] = data.last_name
    if data.email is not None:
        fields["email"] = data.email
    if data.phone is not None:
        fields["phone"] = data.phone

    if change_password_flag:
        if not verify_password(current_password, user["password"]):
            raise HTTPException(
                status_code=400,
                detail={"message": "Current password is incorrect"},
            )
        fields["password"] = hash_password(new_password)

    if not fields:
        raise HTTPException(status_code=400, detail={"message": "No profile fields to update"})

    try:
        update_user_profile(email, fields)
    except Exception:
        raise HTTPException(status_code=500, detail={"message": "Server error"})

    return {"message": "Profile updated successfully"}


def get_history(email: str):
    from repository.booking_repository import get_user_booking_history

    try:
        return get_user_booking_history(email)
    except Exception:
        raise HTTPException(status_code=500, detail={"message": "Server error"})
