from fastapi import HTTPException

from repository import hotel_repository


def get_hotel_detail(hotel_id: int):
    try:
        hotel = hotel_repository.get_hotel_by_id(hotel_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error fetching hotel: {str(e)}"})
    if not hotel:
        raise HTTPException(status_code=404, detail={"message": "Hotel not found"})

    try:
        rooms = hotel_repository.get_all_rooms_for_hotel()
    except Exception:
        rooms = []

    return {
        "id": hotel["id"],
        "name": hotel["name"],
        "slug": hotel.get("slug", ""),
        "location": hotel.get("location", ""),
        "address": hotel.get("address", ""),
        "description": hotel.get("description", ""),
        "rating": float(hotel.get("rating", 0) or 0),
        "reviews": hotel.get("reviews_count", 0),
        "images": hotel.get("images") or [],
        "amenities": hotel.get("amenities") or [],
        "contact": {
            "phone": hotel.get("contact_phone", ""),
            "email": hotel.get("contact_email", ""),
            "website": hotel.get("contact_website", ""),
        },
        "rooms": [
            {
                "id": r["id"],
                "name": r["name"],
                "type": r["type"],
                "price": {
                    "base": float(r["price_base"]),
                    "weekend": float(r.get("price_weekend", 0) or 0),
                },
                "size": f"{r.get('size_sqm', 0)} m²" if r.get("size_sqm") else "",
                "beds": r.get("bed_type", ""),
                "maxGuests": r.get("capacity", 2),
                "images": r.get("images") or [],
                "amenities": r.get("amenities") or [],
                "description": r.get("description", ""),
                "available": r.get("status") == "available",
            }
            for r in rooms
        ],
    }
