from database.db import database_connection, get_cursor


def create_payment(booking_id, user_email: str, amount: float, payment_method: str, status: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """
            INSERT INTO payments (booking_id, user_email, amount, payment_method, status, created_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
            RETURNING payment_id, booking_id, user_email, amount, payment_method, status, created_at
            """,
            (booking_id, user_email, amount, payment_method, status),
        )
        payment = cursor.fetchone()
        db.commit()
        return payment
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()
