from fastapi import APIRouter, Request, status

from dependencies import require_role
from models.schemas import CreateAdmin, DeleteAdmin
from service import admin_service

router = APIRouter(tags=["admin"])


@router.post("/superadmin/create_admin", status_code=status.HTTP_201_CREATED)
def create_admin(data: CreateAdmin, request: Request):
    require_role(request, ["superadmin"])
    return admin_service.create_admin_account(data)


@router.post("/superadmin/deleteadmin")
def delete_admin(data: DeleteAdmin, request: Request):
    require_role(request, ["superadmin"])
    return admin_service.remove_admin(data)


@router.get("/superadmin/list_admin")
def list_admin(request: Request):
    require_role(request, ["superadmin"], allow_bearer=True)
    return admin_service.get_admin_list()
