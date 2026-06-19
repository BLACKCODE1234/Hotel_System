from typing import Optional

from fastapi import HTTPException, Request

from helper.generate_token import decoded_token
from repository.user_repository import get_user_by_email


def get_token_from_request(request: Request, allow_bearer: bool = False) -> Optional[str]:
    access_token = request.cookies.get("access_token")
    if access_token:
        return access_token

    if allow_bearer:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            return auth_header.split(" ", 1)[1]

    return None


def decode_access_token(request: Request, allow_bearer: bool = False) -> dict:
    token = get_token_from_request(request, allow_bearer=allow_bearer)
    if not token:
        raise HTTPException(status_code=401, detail={"message": "No token", "user": None})

    decoded = decoded_token(token)
    if not decoded or decoded.get("error"):
        raise HTTPException(
            status_code=401,
            detail={"message": "Invalid or expired token", "user": None},
        )
    return decoded


def require_role(request: Request, roles: list[str], allow_bearer: bool = False) -> dict:
    decoded = decode_access_token(request, allow_bearer=allow_bearer)
    if decoded.get("role") not in roles:
        raise HTTPException(status_code=403, detail={"message": "Forbidden"})
    return decoded


def get_current_user_payload(request: Request) -> dict:
    return decode_access_token(request)


def get_authenticated_user(request: Request):
    decoded = decode_access_token(request)
    email = decoded.get("email")
    if not email:
        raise HTTPException(status_code=401, detail={"message": "Invalid token payload"})

    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail={"user": None})
    return user
