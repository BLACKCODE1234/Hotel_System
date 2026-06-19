from fastapi import HTTPException
import logging

from models.schemas import CreateAdmin, DeleteAdmin, OTPRequest
from repository.user_repository import create_user, delete_admin_by_email, email_exists, list_admins
from utility.security import hash_password

logger = logging.getLogger(__name__)

def create_admin_account(data: CreateAdmin):
    if not all([data.first_name, data.last_name, data.email, data.password]):
        raise HTTPException(status_code=400, detail={"message": "All fields are required"})

    if email_exists(data.email):
        raise HTTPException(status_code=409, detail={"message": "Account already exists"})

    try:
        hashed_password = hash_password(data.password)
        create_user(data.first_name, data.last_name, data.email, hashed_password, role="admin")
    except Exception:
        raise HTTPException(status_code=500, detail={"message": "Server error"})

    try:
        from service.otp_service import send_otp
        send_otp(OTPRequest(email=data.email))
    except Exception:
        logger.exception("Error sending OTP to admin",data.email)

    return {"message": "Admin created successfully. A verification email has been sent to the admin."}


def remove_admin(data: DeleteAdmin):
    if not data.email:
        raise HTTPException(status_code=400, detail={"message": "Email is required"})

    try:
        result = delete_admin_by_email(data.email)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": str(e)})

    if result is None:
        raise HTTPException(status_code=404, detail={"message": "User not found"})
    if result == "not_admin":
        raise HTTPException(status_code=400, detail={"message": "Only admins can be deleted"})

    return {"message": f"Admin with email {data.email} deleted successfully"}


def get_admin_list():
    try:
        admins = list_admins()
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error listing admins: {str(e)}"})

    return [
        {
            "id": admin["id"],
            "name": f"{admin['first_name']} {admin['last_name']}",
            "email": admin["email"],
            "permissions": admin.get("permissions", []),
            "lastLogin": admin.get("last_login"),
            "status": admin.get("status", "active"),
        }
        for admin in admins
    ]
