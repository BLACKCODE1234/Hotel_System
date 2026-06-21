from configuration.settings import database_connection, get_cursor


def email_exists(email: str) -> bool:
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute("SELECT email FROM users WHERE email = %s", (email,))
        return cursor.fetchone() is not None
    finally:
        cursor.close()
        db.close()


def get_user_by_email(email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """
            SELECT first_name, last_name, email, password, role, phone, verified
            FROM users
            WHERE email = %s
            """,
            (email,),
        )
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()


def get_user_credentials(email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            "SELECT password, role, email, first_name, last_name, verified FROM users WHERE email = %s",
            (email,),
        )
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()


def get_user_by_email_and_role(email: str, role: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """
            SELECT password, role, email, first_name, last_name, verified
            FROM users
            WHERE email = %s AND role = %s
            """,
            (email, role),
        )
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()


def create_user(first_name: str, last_name: str, email: str, hashed_password: str, role: str = "user"):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """
            INSERT INTO users (first_name, last_name, email, password, role)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (first_name, last_name, email, hashed_password, role),
        )
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def update_last_login(email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            "UPDATE users SET last_login = NOW() WHERE email = %s",
            (email,),
        )
        db.commit()
    except Exception:
        db.rollback()
    finally:
        cursor.close()
        db.close()


def mark_verified(email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            "UPDATE users SET verified = TRUE WHERE email = %s",
            (email,),
        )
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def get_user_details(email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """
            SELECT first_name, last_name, email, role, phone
            FROM users
            WHERE email = %s
            """,
            (email,),
        )
        return cursor.fetchone()
    finally:
        cursor.close()
        db.close()


def update_user_profile(email: str, fields: dict):
    if not fields:
        return

    allowed_columns = {"first_name", "last_name", "email", "phone", "password"}
    update_parts = []
    params = []
    for column, value in fields.items():
        if column not in allowed_columns:
            continue
        update_parts.append(f"{column} = %s")
        params.append(value)

    params.append(email)
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            "UPDATE users SET {', '.join(update_parts)} WHERE email = %s",
            tuple(params),
        )
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def delete_admin_by_email(email: str):
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute("SELECT role FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if not user:
            return None
        if user["role"] != "admin":
            return "not_admin"
        cursor.execute("DELETE FROM users WHERE email = %s", (email,))
        db.commit()
        return "deleted"
    except Exception:
        db.rollback()
        raise
    finally:
        cursor.close()
        db.close()


def list_admins():
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute(
            """
            SELECT id, first_name, last_name, email, role, last_login, status
            FROM users
            WHERE role = 'admin'
            ORDER BY created_at DESC
            """
        )
        return cursor.fetchall()
    finally:
        cursor.close()
        db.close()
