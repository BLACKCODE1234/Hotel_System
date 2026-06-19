from configuration.settings import database_connection, get_cursor


def get_all_rooms(type_filter: str = "", min_price: float = 0, max_price: float = 99999, amenity: str = ""):
    db = database_connection()
    cursor = get_cursor(db)
    conditions = []
    params = []
    if type_filter:
        conditions.append("type = %s")
        params.append(type_filter)
    if min_price > 0:
        conditions.append("price_base >= %s")
        params.append(min_price)
    if max_price < 99999:
        conditions.append("price_base <= %s")
        params.append(max_price)
    if amenity:
        conditions.append("%s = ANY(amenities)")
        params.append(amenity)
    where = ""
    if conditions:
        where = "WHERE " + " AND ".join(conditions)
    try:
        cursor.execute(f"SELECT * FROM rooms {where} ORDER BY price_base ASC", tuple(params))
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()


def get_room_by_id(room_id: int):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute("SELECT * FROM rooms WHERE id = %s", (room_id,))
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()


def create_room(data: dict):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """INSERT INTO rooms (room_number, name, type, description, price_base, price_weekend,
               capacity, size_sqm, bed_type, amenities, floor)
               VALUES (%(room_number)s, %(name)s, %(type)s, %(description)s, %(price_base)s,
               %(price_weekend)s, %(capacity)s, %(size_sqm)s, %(bed_type)s, %(amenities)s, %(floor)s)
               RETURNING *""",
            data,
        )
        db.commit()
        return cursor.fetchone()
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def update_room_status(room_id: int, status: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            "UPDATE rooms SET status = %s WHERE id = %s RETURNING *",
            (status, room_id),
        )
        db.commit()
        return cursor.fetchone()
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def get_room_stats():
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute("""
            SELECT
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE status = 'available') AS available,
                COUNT(*) FILTER (WHERE status = 'occupied') AS occupied,
                COUNT(*) FILTER (WHERE status = 'maintenance') AS maintenance,
                COALESCE(AVG(price_base), 0) AS avg_price
            FROM rooms
        """)
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()
