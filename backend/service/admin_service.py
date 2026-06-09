from fastapi import HTTPException

from models.schemas import CreateAdmin, DeleteAdmin
from repository.user_repository import create_user, delete_admin_by_email, email_exists, list_admins
from utility.security import hash_password


def create_admin_account(data: CreateAdmin):
    if not all([data.firstname, data.lastname, data.email, data.password]):
        raise HTTPException(status_code=400, detail={"message": "All fields are required"})

    if email_exists(data.email):
        raise HTTPException(status_code=401, detail={"message": "Account already exist"})

    try:
        hashed_password = hash_password(data.password)
        create_user(data.firstname, data.lastname, data.email, hashed_password, role="admin")
    except Exception:
        raise HTTPException(status_code=500, detail={"message": "Server error"})

    return {"message": "ADmin Created Successfully"}


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
