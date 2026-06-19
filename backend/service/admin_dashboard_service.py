from fastapi import HTTPException

from repository import booking_repository, room_repository
from repository.user_repository import list_admins


def get_dashboard_stats():
    try:
        booking_stats = booking_repository.get_booking_stats()
        room_stats = room_repository.get_room_stats()
        admins = list_admins()
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error fetching stats: {str(e)}"})

    total_rooms = room_stats.get("total", 0) or 0
    available_rooms = room_stats.get("available", 0) or 0
    occupancy = round((1 - available_rooms / max(total_rooms, 1)) * 100)

    return {
        "totalBookings": booking_stats.get("total", 0) or 0,
        "confirmedBookings": booking_stats.get("confirmed", 0) or 0,
        "pendingBookings": booking_stats.get("pending", 0) or 0,
        "cancelledBookings": booking_stats.get("cancelled", 0) or 0,
        "totalRevenue": float(booking_stats.get("total_revenue", 0) or 0),
        "totalRooms": total_rooms,
        "availableRooms": available_rooms,
        "occupiedRooms": room_stats.get("occupied", 0) or 0,
        "maintenanceRooms": room_stats.get("maintenance", 0) or 0,
        "occupancyRate": occupancy,
        "avgRoomPrice": float(room_stats.get("avg_price", 0) or 0),
        "totalAdmins": len(admins) if admins else 0,
    }


def get_all_bookings():
    try:
        bookings = booking_repository.get_all_bookings()
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error fetching bookings: {str(e)}"})
    return [
        {
            "id": b.get("booking_id", ""),
            "guestName": b.get("guest_name", "Guest"),
            "email": b.get("email", ""),
            "phone": b.get("phone", ""),
            "roomType": b.get("room_type", ""),
            "checkIn": str(b.get("check_in", "")),
            "checkOut": str(b.get("check_out", "")),
            "guests": b.get("guests", 1),
            "total_amount": float(b.get("total_amount", 0)) if b.get("total_amount") else 0,
            "status": b.get("status", "pending"),
            "paymentMethod": b.get("payment_method", ""),
            "bookingDate": str(b.get("booking_date", "")),
        }
        for b in bookings
    ]


def update_booking_status(booking_id: str, status: str):
    try:
        booking = booking_repository.update_booking_status(booking_id, status)
    except Exception as e:
        raise HTTPException(status_code=500, detail={"message": f"Error updating booking: {str(e)}"})
    if not booking:
        raise HTTPException(status_code=404, detail={"message": "Booking not found"})
    return {"message": "Booking status updated", "status": booking["status"]}
