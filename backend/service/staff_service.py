from fastapi import HTTPException

from models.schemas import TaskCreate, TaskStatusUpdate, ChecklistToggle, ClockInOut
from repository import staff_repository


def list_tasks(assigned_to: str = ""):
    try:
        tasks = staff_repository.get_tasks(assigned_to)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error fetching tasks: {str(e)}"})
    return [
        {
            "id": t["id"],
            "title": t["title"],
            "description": t.get("description", ""),
            "priority": t.get("priority", "medium"),
            "status": t.get("status", "pending"),
            "assignedTo": t.get("assigned_to", ""),
            "room": t.get("room_number", ""),
            "department": t.get("department", ""),
            "dueTime": t.get("due_time", ""),
        }
        for t in tasks
    ]


def create_new_task(data: TaskCreate):
    try:
        task = staff_repository.create_task(data.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error creating task: {str(e)}"})
    return {"message": "Task created", "task": {"id": task["id"], "title": task["title"]}}


def change_task_status(task_id: int, data: TaskStatusUpdate):
    try:
        task = staff_repository.update_task_status(task_id, data.status)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error updating task: {str(e)}"})
    if not task:
        raise HTTPException(status_code=404, detail={"message": "Task not found"})
    return {"message": "Task status updated", "status": task["status"]}


def get_checklist(staff_email: str):
    try:
        items = staff_repository.get_checklist(staff_email)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error fetching checklist: {str(e)}"})
    return [
        {"id": item["id"], "label": item["label"], "completed": item["completed"]}
        for item in items
    ]


def toggle_checklist_item(item_id: int, data: ChecklistToggle):
    try:
        item = staff_repository.toggle_checklist(item_id, data.completed)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error updating checklist: {str(e)}"})
    if not item:
        raise HTTPException(status_code=404, detail={"message": "Checklist item not found"})
    return {"id": item["id"], "label": item["label"], "completed": item["completed"]}


def get_schedule(staff_email: str):
    try:
        entries = staff_repository.get_schedule(staff_email)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error fetching schedule: {str(e)}"})
    return [
        {
            "id": e["id"],
            "day": e["day_of_week"],
            "date": str(e["date"]) if e.get("date") else "",
            "shift": f"{e['shift_start']} - {e['shift_end']}" if e.get("shift_start") else "",
            "status": e.get("status", "upcoming"),
        }
        for e in entries
    ]


def perform_clock_in(staff_email: str):
    try:
        record = staff_repository.clock_in(staff_email)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error clocking in: {str(e)}"})
    return {"message": "Clocked in", "clock_in": str(record["clock_in"])}


def perform_clock_out(staff_email: str):
    try:
        record = staff_repository.clock_out(staff_email)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error clocking out: {str(e)}"})
    if not record:
        raise HTTPException(status_code=400, detail={"message": "No active clock-in found for today"})
    return {"message": "Clocked out", "clock_out": str(record["clock_out"])}


def get_clock_status(staff_email: str):
    try:
        record = staff_repository.get_today_attendance(staff_email)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error fetching status: {str(e)}"})
    if not record:
        return {"isClockedIn": False}
    return {
        "isClockedIn": record["clock_in"] is not None and record["clock_out"] is None,
        "clockIn": str(record["clock_in"]) if record.get("clock_in") else None,
        "clockOut": str(record["clock_out"]) if record.get("clock_out") else None,
    }
