from configuration.settings import database_connection, get_cursor


def get_all_hotels():
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute("SELECT * FROM hotels ORDER BY name")
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()


def get_hotel_by_id(hotel_id: int):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute("SELECT * FROM hotels WHERE id = %s", (hotel_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()


def get_hotel_by_slug(slug: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute("SELECT * FROM hotels WHERE slug = %s", (slug,))
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()


def get_all_rooms_for_hotel():
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute("SELECT * FROM rooms ORDER BY price_base ASC")
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()
