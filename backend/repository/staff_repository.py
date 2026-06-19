from datetime import date

from configuration.settings import database_connection, get_cursor


def get_tasks(assigned_to: str = ""):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        if assigned_to:
            cursor.execute(
                "SELECT * FROM tasks WHERE assigned_to = %s ORDER BY created_at DESC",
                (assigned_to,),
            )
        else:
            cursor.execute("SELECT * FROM tasks ORDER BY created_at DESC")
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()


def create_task(data: dict):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """INSERT INTO tasks (title, description, priority, assigned_to, room_number, department, due_time)
               VALUES (%(title)s, %(description)s, %(priority)s, %(assigned_to)s, %(room_number)s, %(department)s, %(due_time)s)
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


def update_task_status(task_id: int, status: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            "UPDATE tasks SET status = %s WHERE id = %s RETURNING *",
            (status, task_id),
        )
        db.commit()
        return cursor.fetchone()
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def get_checklist(staff_email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            "SELECT * FROM staff_checklist WHERE staff_email = %s ORDER BY id",
            (staff_email,),
        )
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()


def toggle_checklist(item_id: int, completed: bool):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            "UPDATE staff_checklist SET completed = %s WHERE id = %s RETURNING *",
            (completed, item_id),
        )
        db.commit()
        return cursor.fetchone()
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def get_schedule(staff_email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """SELECT * FROM staff_schedule
               WHERE staff_email = %s
               ORDER BY date ASC, shift_start ASC""",
            (staff_email,),
        )
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()


def clock_in(staff_email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """INSERT INTO staff_attendance (staff_email, clock_in, date)
               VALUES (%s, NOW(), %s) RETURNING *""",
            (staff_email, date.today()),
        )
        db.commit()
        return cursor.fetchone()
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def clock_out(staff_email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """UPDATE staff_attendance SET clock_out = NOW()
               WHERE staff_email = %s AND date = %s AND clock_out IS NULL
               RETURNING *""",
            (staff_email, date.today()),
        )
        db.commit()
        return cursor.fetchone()
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def get_today_attendance(staff_email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """SELECT * FROM staff_attendance
               WHERE staff_email = %s AND date = %s
               ORDER BY created_at DESC LIMIT 1""",
            (staff_email, date.today()),
        )
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()
