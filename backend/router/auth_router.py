from fastapi import APIRouter, Request, Response, status

from models.schemas import AdminLogin, StaffLogin, UserLogin, UserSignup
from service import auth_service

router = APIRouter(tags=["auth"])


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(data: UserSignup, request: Request, response: Response):
    return auth_service.signup(data, request, response)


@router.post("/login")
def login(data: UserLogin, request: Request, response: Response):
    return auth_service.login(data, request, response)


@router.post("/stafflogin")
def staff_login(data: StaffLogin, request: Request, response: Response):
    return auth_service.staff_login(data, request, response)


@router.post("/adminlogin")
def admin_login(data: AdminLogin, request: Request, response: Response):
    return auth_service.admin_login(data, request, response)


@router.post("/logout")
def logout(request: Request, response: Response):
    return auth_service.logout(request, response)


@router.post("/me")
def me(request: Request):
    return auth_service.get_me(request)


@router.post("/refresh")
def refresh(request: Request, response: Response):
    return auth_service.refresh_token(request, response)
