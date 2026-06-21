from datetime import datetime, timedelta

from configuration.settings import database_connection, get_cursor


def delete_otps_for_email(email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute("DELETE FROM email_otps WHERE email = %s", (email,))
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def save_otp(email: str, otp_hash: str, expires_at: datetime):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """
            INSERT INTO email_otps (email, otp_hash, expires_at, used, created_at)
            VALUES (%s, %s, %s, %s, NOW())
            """,
            (email, otp_hash, expires_at, False),
        )
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def get_latest_otp(email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """
            SELECT id, otp_hash, expiry, used, created_at
            FROM otp_table
            WHERE email = %s
            ORDER BY created_at DESC
            LIMIT 1
            """,
            (email,),
        )
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()


def mark_otp_used(otp_id: int):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute("UPDATE email_otps SET used = TRUE WHERE id = %s", (otp_id,))
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()
