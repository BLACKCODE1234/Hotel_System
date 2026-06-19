from fastapi import HTTPException

from models.schemas import RoomCreate, RoomStatusUpdate
from repository import room_repository


def list_rooms(type_filter: str = "", min_price: float = 0, max_price: float = 99999, amenity: str = ""):
    try:
        rooms = room_repository.get_all_rooms(type_filter, min_price, max_price, amenity)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error fetching rooms: {str(e)}"})
    return [
        {
            "id": r["id"],
            "room_number": r["room_number"],
            "name": r["name"],
            "type": r["type"],
            "description": r.get("description", ""),
            "price": float(r["price_base"]),
            "price_weekend": float(r.get("price_weekend", 0) or 0),
            "capacity": r.get("capacity", 2),
            "size_sqm": r.get("size_sqm", 0),
            "bed_type": r.get("bed_type", ""),
            "image": (r.get("images") or [None])[0] if r.get("images") else "",
            "amenities": r.get("amenities") or [],
            "status": r.get("status", "available"),
            "floor": r.get("floor", 1),
            "rating": float(r.get("rating", 0) or 0),
            "reviews": r.get("reviews_count", 0),
        }
        for r in rooms
    ]


def get_room(room_id: int):
    try:
        room = room_repository.get_room_by_id(room_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error fetching room: {str(e)}"})
    if not room:
        raise HTTPException(status_code=404, detail={"message": "Room not found"})
    return {
        "id": room["id"],
        "room_number": room["room_number"],
        "name": room["name"],
        "type": room["type"],
        "description": room.get("description", ""),
        "price": float(room["price_base"]),
        "price_weekend": float(room.get("price_weekend", 0) or 0),
        "capacity": room.get("capacity", 2),
        "size_sqm": room.get("size_sqm", 0),
        "bed_type": room.get("bed_type", ""),
        "images": room.get("images") or [],
        "amenities": room.get("amenities") or [],
        "status": room.get("status", "available"),
        "floor": room.get("floor", 1),
        "rating": float(room.get("rating", 0) or 0),
        "reviews": room.get("reviews_count", 0),
    }


def create_new_room(data: RoomCreate):
    try:
        room = room_repository.create_room(data.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error creating room: {str(e)}"})
    return {"message": "Room created successfully", "room": {"id": room["id"], "name": room["name"]}}


def change_room_status(room_id: int, data: RoomStatusUpdate):
    try:
        room = room_repository.update_room_status(room_id, data.status)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error updating room: {str(e)}"})
    if not room:
        raise HTTPException(status_code=404, detail={"message": "Room not found"})
    return {"message": "Room status updated", "status": room["status"]}


def room_stats():
    try:
        return room_repository.get_room_stats()
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error fetching stats: {str(e)}"})
