from fastapi import APIRouter, Query, Request, status

from dependencies import require_role
from models.schemas import BookingStatusUpdate, CreateAdmin, DeleteAdmin, RoomCreate, RoomStatusUpdate
from service import admin_dashboard_service, admin_service, room_service

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


@router.get("/admin/dashboard/stats")
def dashboard_stats(request: Request):
    require_role(request, ["admin", "superadmin"])
    return admin_dashboard_service.get_dashboard_stats()


@router.get("/admin/bookings")
def admin_list_bookings(request: Request):
    require_role(request, ["admin", "superadmin"])
    return admin_dashboard_service.get_all_bookings()


@router.patch("/admin/bookings/{booking_id}/status")
def admin_update_booking_status(booking_id: str, data: BookingStatusUpdate, request: Request):
    require_role(request, ["admin", "superadmin"])
    return admin_dashboard_service.update_booking_status(booking_id, data.status)


@router.get("/admin/rooms")
def admin_list_rooms(request: Request):
    require_role(request, ["admin", "superadmin"])
    return room_service.list_rooms()


@router.post("/admin/rooms")
def admin_create_room(data: RoomCreate, request: Request):
    require_role(request, ["admin", "superadmin"])
    return room_service.create_new_room(data)


@router.patch("/admin/rooms/{room_id}/status")
def admin_update_room_status(room_id: int, data: RoomStatusUpdate, request: Request):
    require_role(request, ["admin", "superadmin"])
    return room_service.change_room_status(room_id, data)


@router.get("/admin/rooms/stats")
def admin_room_stats(request: Request):
    require_role(request, ["admin", "superadmin"])
    return room_service.room_stats()
