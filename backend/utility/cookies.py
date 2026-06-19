import os

from fastapi import Request, Response

ACCESS_TOKEN_MAX_AGE = 15 * 60
REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60


def get_cookie_settings(request: Request):
    env = os.getenv("ENVIRONMENT", "development")
    is_local = env == "development"
    secure_cookie = False if is_local else True
    samesite_cookie = "lax" if is_local else "none"
    domain_cookie = None
    return secure_cookie, samesite_cookie, domain_cookie


def set_auth_cookies(
    response: Response,
    request: Request,
    access_token: str,
    refresh_token: str,
):
    secure_cookie, samesite_cookie, domain_cookie = get_cookie_settings(request)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=secure_cookie,
        samesite=samesite_cookie,
        domain=domain_cookie,
        max_age=REFRESH_TOKEN_MAX_AGE,
        path="/",
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=secure_cookie,
        samesite=samesite_cookie,
        domain=domain_cookie,
        max_age=ACCESS_TOKEN_MAX_AGE,
        path="/",
    )


def set_access_cookie(response: Response, request: Request, access_token: str):
    secure_cookie, samesite_cookie, domain_cookie = get_cookie_settings(request)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=secure_cookie,
        samesite=samesite_cookie,
        domain=domain_cookie,
        max_age=ACCESS_TOKEN_MAX_AGE,
        path="/",
    )


def clear_auth_cookies(response: Response, request: Request):
    secure_cookie, samesite_cookie, domain_cookie = get_cookie_settings(request)
    response.delete_cookie(
        key="access_token",
        path="/",
        secure=secure_cookie,
        samesite=samesite_cookie,
        domain=domain_cookie,
    )
    response.delete_cookie(
        key="refresh_token",
        path="/",
        secure=secure_cookie,
        samesite=samesite_cookie,
        domain=domain_cookie,
    )
