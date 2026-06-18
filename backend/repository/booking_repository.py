
from configuration.settings import database_connection, get_cursor

def get_booking_by_id(booking_id: str, user_email: str | None = None):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        if user_email:
            cursor.execute(
                "SELECT * FROM bookings WHERE booking_id = %s AND user_email = %s",
                (booking_id, user_email),
            )
        else:
            cursor.execute(
                "SELECT * FROM bookings WHERE booking_id = %s",
                (booking_id,),
            )
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()


def cancel_booking(booking_id: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """UPDATE bookings
            SET status = %s
            WHERE booking_id = %s
            AND status != %s
            RETURNING *
            """,
            ("cancelled", booking_id, "cancelled"),
        )
        updated = cursor.fetchone()
        db.commit()
        return updated
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def get_user_booking_history(user_email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """
            SELECT booking_id, user_email, room_type, in_date, out_date, status, created_at
            FROM bookings
            WHERE user_email = %s
            ORDER BY created_at DESC
            """,
            (user_email,),
        )
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()


def create_booking(user_email: str, room_type: str, in_date: str, out_date: str, status: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:

        if in_date >= out_date:
            raise ValueError("Check-out date must be after check-in date")
        cursor.execute(
            """
            INSERT INTO bookings (user_email, room_type, in_date, out_date, status, created_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
            RETURNING booking_id, user_email, room_type, in_date, out_date, status, created_at
            """,
            (user_email, room_type, in_date, out_date, status),
        )
        booking = cursor.fetchone()
        db.commit()
        return booking
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()
