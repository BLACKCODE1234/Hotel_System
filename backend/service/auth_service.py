from fastapi import HTTPException, Request, Response

from helper.generate_token import (
    decoded_token,
    generate_access_token,
    generate_refresh_token,
)
from models.schemas import AdminLogin, StaffLogin, UserLogin, UserSignup
from repository.user_repository import (
    create_user,
    email_exists,
    get_user_by_email_and_role,
    get_user_credentials,
    update_last_login,
)
from utility.cookies import clear_auth_cookies, set_access_cookie, set_auth_cookies
from utility.security import hash_password, verify_password


def _login_response(user: dict, request: Request, response: Response, default_role: str):
    role = user.get("role", default_role)
    access_token = generate_access_token(user["email"], role)
    refresh_token = generate_refresh_token(user["email"], role)
    set_auth_cookies(response, request, access_token, refresh_token)

    return {
        "message": "Login successful",
        "user": {
            "email": user["email"],
            "role": role,
            "first_name": user.get("first_name"),
            "last_name": user.get("last_name"),
        },
    }


def signup(data: UserSignup, request: Request, response: Response):
    if len(data.password) < 8:
        raise HTTPException(
            status_code=400,
            detail={"message": "Password should be at least 8 characters", "status": "error"},
        )

    confirm = data.confirm_password
    if confirm != data.password:
        raise HTTPException(
            status_code=400,
            detail={"message": "Passwords do not match", "status": "error"},
        )

    if not all([data.first_name, data.last_name, data.email, data.password, confirm]):
        raise HTTPException(
            status_code=400,
            detail={"message": "All fields are required", "status": "error", "user": None},
        )

    if email_exists(data.email):
        raise HTTPException(
            status_code=400,
            detail={"message": "Account already exist", "status": "error"},
        )

    try:
        hashed = hash_password(data.password)
        create_user(data.first_name, data.last_name, data.email, hashed, role="user")
    except Exception:
        raise HTTPException(
            status_code=500,
            detail={"message": "Server is down", "status": "error"},
        )

    access_token = generate_access_token(data.email, role="user")
    refresh_token = generate_refresh_token(data.email, role="user")
    set_auth_cookies(response, request, access_token, refresh_token)

    return {
        "message": "Signup successful",
        "status": "success",
        "user": {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "email": data.email,
        },
    }


def login(data: UserLogin, request: Request, response: Response):
    if not all([data.email, data.password]):
        raise HTTPException(
            status_code=400,
            detail={"message": "All fields are required", "status": "error"},
        )

    try:
        user = get_user_credentials(data.email)
    except Exception:
        raise HTTPException(
            status_code=500,
            detail={"message": "Server is down", "status": "error"},
        )

    if not user:
        raise HTTPException(
            status_code=404,
            detail={"message": "Account not found", "status": "error"},
        )

    if not user.get("verified"):
        raise HTTPException(
            status_code=403,
            detail={"message": "Please verify your email before logging in", "status": "error"},
        )

    if not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=401,
            detail={"message": "Password incorrect", "status": "error"},
        )

    update_last_login(data.email)
    return _login_response(user, request, response, default_role="user")


def staff_login(data: StaffLogin, request: Request, response: Response):
    if not all([data.email, data.password]):
        raise HTTPException(
            status_code=400,
            detail={"message": "All fields are required", "status": "error"},
        )

    try:
        user = get_user_by_email_and_role(data.email, "staff")
    except Exception:
        raise HTTPException(
            status_code=500,
            detail={"message": "Something occurred", "status": "error"},
        )

    if not user:
        raise HTTPException(
            status_code=404,
            detail={"message": "Account not found", "status": "error"},
        )

    if not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=401,
            detail={"message": "Password incorrect", "status": "error"},
        )

    return _login_response(user, request, response, default_role="staff")


def admin_login(data: AdminLogin, request: Request, response: Response):
    if not all([data.email, data.password]):
        raise HTTPException(
            status_code=400,
            detail={"message": "All fields are required", "status": "error"},
        )

    try:
        user = get_user_by_email_and_role(data.email, "admin")
    except Exception:
        raise HTTPException(
            status_code=500,
            detail={"message": "something happened", "status": "error"},
        )

    if not user:
        raise HTTPException(
            status_code=404,
            detail={"message": "Account not found", "status": "error"},
        )

    if not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=401,
            detail={"message": "Password incorrect", "status": "error"},
        )

    update_last_login(data.email)
    return _login_response(user, request, response, default_role="admin")


def logout(request: Request, response: Response):
    clear_auth_cookies(response, request)
    return {"message": "Logout successful", "status": "success"}


def get_me(request: Request):
    from dependencies import get_authenticated_user

    user = get_authenticated_user(request)
    return {
        "user": {
            "email": user["email"],
            "role": user["role"],
            "firstname": user.get("first_name"),
            "lastname": user.get("last_name"),
        }
    }


def refresh_token(request: Request, response: Response):
    refresh = request.cookies.get("refresh_token")
    if not refresh:
        raise HTTPException(
            status_code=401,
            detail={"message": "Refresh token missing", "code": "NO_REFRESH_TOKEN"},
        )

    decoded = decoded_token(refresh, is_refresh=True)
    if not decoded:
        raise HTTPException(
            status_code=401,
            detail={"message": "Invalid or expired refresh token", "code": "INVALID_REFRESH_TOKEN"},
        )
    if decoded.get("error"):
        raise HTTPException(
            status_code=401,
            detail={"message": "Refresh token expired", "code": "EXPIRED_REFRESH_TOKEN"},
        )

    try:
        email = decoded["email"]
        role = decoded["role"]
        new_access_token = generate_access_token(email, role)
        new_refresh_token = generate_refresh_token(email, role)
        set_auth_cookies(response, request, new_access_token, new_refresh_token)
        return {"message": "Token refreshed successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"message": "Failed to generate new token", "error": str(e)},
        )
