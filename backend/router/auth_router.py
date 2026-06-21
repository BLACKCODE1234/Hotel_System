from fastapi import APIRouter, Request, Response, status

from main import limiter
from models.schemas import AdminLogin, StaffLogin, UserLogin, UserSignup
from service import auth_service

router = APIRouter(tags=["auth"])


@router.post("/signup", status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def signup(data: UserSignup, request: Request, response: Response):
    return auth_service.signup(data, request, response)


@router.post("/login")
@limiter.limit("10/minute")
def login(data: UserLogin, request: Request, response: Response):
    return auth_service.login(data, request, response)


@router.post("/stafflogin")
@limiter.limit("10/minute")
def staff_login(data: StaffLogin, request: Request, response: Response):
    return auth_service.staff_login(data, request, response)


@router.post("/adminlogin")
@limiter.limit("10/minute")
def admin_login(data: AdminLogin, request: Request, response: Response):
    return auth_service.admin_login(data, request, response)


@router.post("/logout")
def logout(request: Request, response: Response):
    return auth_service.logout(request, response)


@router.post("/me")
def me(request: Request):
    return auth_service.get_me(request)


@router.post("/refresh")
@limiter.limit("10/minute")
def refresh(request: Request, response: Response):
    return auth_service.refresh_token(request, response)
