from fastapi import APIRouter

from service import hotel_service

router = APIRouter(tags=["hotels"])


@router.get("/hotels/{hotel_id}")
def get_hotel(hotel_id: int):
    return hotel_service.get_hotel_detail(hotel_id)
