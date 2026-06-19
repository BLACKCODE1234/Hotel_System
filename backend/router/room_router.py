from fastapi import APIRouter, Query

from service import room_service

router = APIRouter(tags=["rooms"])


@router.get("/rooms")
def list_rooms(
    type: str = Query("", description="Filter by room type"),
    min_price: float = Query(0, description="Minimum price"),
    max_price: float = Query(99999, description="Maximum price"),
    amenity: str = Query("", description="Filter by amenity"),
):
    return room_service.list_rooms(type_filter=type, min_price=min_price, max_price=max_price, amenity=amenity)


@router.get("/rooms/{room_id}")
def get_room(room_id: int):
    return room_service.get_room(room_id)
