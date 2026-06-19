from fastapi import APIRouter, Request

from dependencies import require_role, get_current_user_payload
from models.schemas import ChecklistToggle, ClockInOut, TaskCreate, TaskStatusUpdate
from service import staff_service

router = APIRouter(tags=["staff"])


def _get_email(request: Request) -> str:
    payload = get_current_user_payload(request)
    return payload.get("email", "")


@router.get("/staff/tasks")
def staff_tasks(request: Request):
    require_role(request, ["staff", "admin"])
    return staff_service.list_tasks(assigned_to=_get_email(request))


@router.post("/staff/tasks")
def staff_create_task(data: TaskCreate, request: Request):
    require_role(request, ["staff", "admin"])
    return staff_service.create_new_task(data)


@router.patch("/staff/tasks/{task_id}/status")
def staff_update_task_status(task_id: int, data: TaskStatusUpdate, request: Request):
    require_role(request, ["staff", "admin"])
    return staff_service.change_task_status(task_id, data)


@router.get("/staff/checklist")
def staff_checklist(request: Request):
    require_role(request, ["staff", "admin"])
    return staff_service.get_checklist(_get_email(request))


@router.patch("/staff/checklist/{item_id}")
def staff_toggle_checklist(item_id: int, data: ChecklistToggle, request: Request):
    require_role(request, ["staff", "admin"])
    return staff_service.toggle_checklist_item(item_id, data)


@router.get("/staff/schedule")
def staff_schedule(request: Request):
    require_role(request, ["staff", "admin"])
    return staff_service.get_schedule(_get_email(request))


@router.post("/staff/clock-in")
def staff_clock_in(request: Request):
    require_role(request, ["staff", "admin"])
    return staff_service.perform_clock_in(_get_email(request))


@router.post("/staff/clock-out")
def staff_clock_out(request: Request):
    require_role(request, ["staff", "admin"])
    return staff_service.perform_clock_out(_get_email(request))


@router.get("/staff/clock-status")
def staff_clock_status(request: Request):
    require_role(request, ["staff", "admin"])
    return staff_service.get_clock_status(_get_email(request))
