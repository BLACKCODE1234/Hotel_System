import os

from configuration.settings import database_connection, get_cursor
from utility.security import hash_password

REQUIRED_TABLES = {
    "users": """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(200) NOT NULL UNIQUE,
            password TEXT NOT NULL,
            phone VARCHAR(50) DEFAULT '',
            role VARCHAR(50) NOT NULL DEFAULT 'user',
            verified BOOLEAN DEFAULT FALSE,
            status VARCHAR(20) DEFAULT 'active',
            last_login TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """,
    "email_otps": """
        CREATE TABLE IF NOT EXISTS email_otps (
            id SERIAL PRIMARY KEY,
            email VARCHAR(200) NOT NULL,
            otp_hash TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """,
    "bookings": """
        CREATE TABLE IF NOT EXISTS bookings (
            booking_id SERIAL PRIMARY KEY,
            user_email VARCHAR(200) NOT NULL,
            guest_name VARCHAR(200) DEFAULT '',
            phone VARCHAR(50) DEFAULT '',
            guests INT DEFAULT 1,
            room_type VARCHAR(100) NOT NULL,
            in_date DATE NOT NULL,
            out_date DATE NOT NULL,
            status VARCHAR(30) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """,
    "payments": """
        CREATE TABLE IF NOT EXISTS payments (
            payment_id SERIAL PRIMARY KEY,
            booking_id INT REFERENCES bookings(booking_id) ON DELETE CASCADE,
            user_email VARCHAR(200) NOT NULL,
            amount NUMERIC(10,2) NOT NULL DEFAULT 0,
            payment_method VARCHAR(100) DEFAULT '',
            status VARCHAR(30) DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """,
    "rooms": """
        CREATE TABLE IF NOT EXISTS rooms (
            id SERIAL PRIMARY KEY,
            room_number VARCHAR(10) NOT NULL UNIQUE,
            name VARCHAR(200) NOT NULL,
            type VARCHAR(50) NOT NULL,
            description TEXT DEFAULT '',
            price_base NUMERIC(10,2) NOT NULL DEFAULT 0,
            price_weekend NUMERIC(10,2) DEFAULT 0,
            capacity INT DEFAULT 2,
            size_sqm INT DEFAULT 0,
            bed_type VARCHAR(100) DEFAULT '',
            images TEXT[] DEFAULT '{}',
            amenities TEXT[] DEFAULT '{}',
            status VARCHAR(20) DEFAULT 'available',
            floor INT DEFAULT 1,
            rating NUMERIC(2,1) DEFAULT 0,
            reviews_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """,
    "hotels": """
        CREATE TABLE IF NOT EXISTS hotels (
            id SERIAL PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            slug VARCHAR(200) UNIQUE,
            location VARCHAR(200) DEFAULT '',
            address TEXT DEFAULT '',
            description TEXT DEFAULT '',
            rating NUMERIC(2,1) DEFAULT 0,
            reviews_count INT DEFAULT 0,
            images TEXT[] DEFAULT '{}',
            amenities TEXT[] DEFAULT '{}',
            contact_phone VARCHAR(50) DEFAULT '',
            contact_email VARCHAR(200) DEFAULT '',
            contact_website VARCHAR(200) DEFAULT '',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """,
    "tasks": """
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            description TEXT DEFAULT '',
            priority VARCHAR(20) DEFAULT 'medium',
            status VARCHAR(20) DEFAULT 'pending',
            assigned_to VARCHAR(200) DEFAULT '',
            room_number VARCHAR(10) DEFAULT '',
            department VARCHAR(100) DEFAULT '',
            due_time VARCHAR(50) DEFAULT '',
            created_by VARCHAR(200) DEFAULT '',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """,
    "staff_checklist": """
        CREATE TABLE IF NOT EXISTS staff_checklist (
            id SERIAL PRIMARY KEY,
            staff_email VARCHAR(200) NOT NULL,
            label VARCHAR(200) NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """,
    "staff_schedule": """
        CREATE TABLE IF NOT EXISTS staff_schedule (
            id SERIAL PRIMARY KEY,
            staff_email VARCHAR(200) NOT NULL,
            day_of_week VARCHAR(20) NOT NULL,
            date DATE,
            shift_start TIME,
            shift_end TIME,
            status VARCHAR(20) DEFAULT 'upcoming',
            created_at TIMESTAMP DEFAULT NOW()
        )
    """,
    "staff_attendance": """
        CREATE TABLE IF NOT EXISTS staff_attendance (
            id SERIAL PRIMARY KEY,
            staff_email VARCHAR(200) NOT NULL,
            clock_in TIMESTAMP,
            clock_out TIMESTAMP,
            date DATE DEFAULT CURRENT_DATE,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """,
}


def ensure_tables():
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
        existing = {row["table_name"] for row in cursor.fetchall()}
        for name, ddl in REQUIRED_TABLES.items():
            if name not in existing:
                cursor.execute(ddl)
                print(f"Created table: {name}")
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Table setup error: {e}")
        raise
    finally:
        cursor.close()
        db.close()


SEED_DATA = {
    "users": [
        ("Admin", "Manager", "admin@luxurygrandhotel.com", "SEED_ADMIN_PASSWORD", "+233301234560", "admin", True),
        ("Super", "Admin", "superadmin@luxurygrandhotel.com", "SEED_SUPERADMIN_PASSWORD", "+233301234561", "superadmin", True),
        ("Staff", "Member", "staff@luxurygrandhotel.com", "SEED_STAFF_PASSWORD", "+233301234562", "staff", True),
        ("Demo", "User", "user@example.com", "SEED_USER_PASSWORD", "+233301234563", "user", True),
    ],
    "rooms": [
        ("101", "Standard Room", "standard", 149, 189, 2, 25, "Queen Bed",
         ["Free Wi-Fi", "Air Conditioning", "TV", "Coffee Maker"], 1),
        ("102", "Standard Twin", "standard", 159, 199, 2, 28, "Two Twin Beds",
         ["Free Wi-Fi", "Air Conditioning", "TV", "Coffee Maker", "Work Desk"], 1),
        ("201", "Deluxe King Room", "deluxe", 229, 279, 2, 35, "King Bed",
         ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Ocean View", "Balcony"], 2),
        ("202", "Deluxe Double", "deluxe", 249, 299, 4, 38, "Two Queen Beds",
         ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Ocean View", "Safe"], 2),
        ("301", "Executive Suite", "executive", 389, 459, 3, 50, "King Bed",
         ["Separate Living Area", "Ocean View", "Balcony", "Premium Wi-Fi", "Jacuzzi", "Butler Service"], 3),
        ("302", "Business Suite", "executive", 419, 489, 2, 45, "Queen Bed",
         ["Work Desk", "Meeting Space", "Premium Wi-Fi", "City View", "Coffee Machine"], 3),
        ("401", "Presidential Suite", "presidential", 749, 899, 4, 80, "King Bed",
         ["Master Bedroom", "Private Terrace", "Butler Service", "Jacuzzi", "Private Pool", "Sauna"], 4),
        ("402", "Royal Suite", "presidential", 849, 999, 6, 100, "Emperor King Bed",
         ["Master Bedroom", "Private Terrace", "Butler Service", "Jacuzzi", "Private Pool", "Cinema Room"], 4),
    ],
    "hotels": [
        ("Luxury Grand Hotel", "luxury-grand-hotel", "Accra, Ghana",
         "123 Independence Avenue, Accra Central, Ghana",
         "Experience unparalleled luxury at the Luxury Grand Hotel. Located in the heart of Accra, "
         "our hotel offers world-class amenities, exceptional service, and breathtaking views. "
         "Whether you're traveling for business or pleasure, we ensure an unforgettable stay.",
         4.8, 2847,
         ["Free Wi-Fi", "Swimming Pool", "Fitness Center", "Spa", "Restaurant", "Bar/Lounge",
          "Room Service", "Concierge", "Parking", "Airport Shuttle", "Business Center", "Laundry"],
         "+233 30 123 4567", "reservations@luxurygrand.com", "www.luxurygrandhotel.com"),
    ],
    "staff_checklist_items": [
        "Uniform & appearance check",
        "Cleaning equipment prepared",
        "Attended team briefing",
    ],
    "staff_tasks": [
        ("Clean Room 205", "Guest checkout - full cleaning required", "high", "pending",
         "staff@luxurygrandhotel.com", "205", "Housekeeping", "10:30 AM"),
        ("Fix AC Unit", "Room 301 - AC not cooling properly", "medium", "in-progress",
         "staff@luxurygrandhotel.com", "301", "Maintenance", "2:00 PM"),
        ("Restock Minibar", "Presidential Suite - guest request", "low", "completed",
         "staff@luxurygrandhotel.com", "401", "Housekeeping", "9:00 AM"),
    ],
    "staff_schedule": [
        ("staff@luxurygrandhotel.com", "Monday", None, "08:00", "16:00", "upcoming"),
        ("staff@luxurygrandhotel.com", "Tuesday", None, "08:00", "16:00", "upcoming"),
        ("staff@luxurygrandhotel.com", "Wednesday", None, "08:00", "16:00", "upcoming"),
        ("staff@luxurygrandhotel.com", "Thursday", None, "08:00", "16:00", "upcoming"),
        ("staff@luxurygrandhotel.com", "Friday", None, "08:00", "16:00", "upcoming"),
    ],
}


def seed_data():
    db = database_connection()
    cursor = get_cursor(db)
    try:
        cursor.execute("SELECT COUNT(*) AS cnt FROM users")
        if cursor.fetchone()["cnt"] == 0:
            for first_name, last_name, email, password_env, phone, role, verified in SEED_DATA["users"]:
                password = os.getenv(password_env, f"{role.title()}Demo123!")
                cursor.execute(
                    """INSERT INTO users (first_name, last_name, email, password, phone, role, verified)
                       VALUES (%s, %s, %s, %s, %s, %s, %s)""",
                    (first_name, last_name, email, hash_password(password), phone, role, verified),
                )
            print("Seeded users")

        cursor.execute("SELECT COUNT(*) AS cnt FROM rooms")
        if cursor.fetchone()["cnt"] == 0:
            for r in SEED_DATA["rooms"]:
                cursor.execute(
                    """INSERT INTO rooms (room_number, name, type, price_base, price_weekend,
                       capacity, size_sqm, bed_type, amenities, floor)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                    r,
                )
            print("Seeded rooms")

        cursor.execute("SELECT COUNT(*) AS cnt FROM hotels")
        if cursor.fetchone()["cnt"] == 0:
            for h in SEED_DATA["hotels"]:
                cursor.execute(
                    """INSERT INTO hotels (name, slug, location, address, description,
                       rating, reviews_count, amenities, contact_phone, contact_email, contact_website)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                    h,
                )
            print("Seeded hotels")

        cursor.execute("SELECT COUNT(*) AS cnt FROM staff_checklist")
        if cursor.fetchone()["cnt"] == 0:
            for label in SEED_DATA["staff_checklist_items"]:
                cursor.execute(
                    "INSERT INTO staff_checklist (staff_email, label) VALUES (%s, %s)",
                    ("staff@luxurygrandhotel.com", label),
                )
            print("Seeded staff checklist")

        cursor.execute("SELECT COUNT(*) AS cnt FROM tasks")
        if cursor.fetchone()["cnt"] == 0:
            for task in SEED_DATA["staff_tasks"]:
                cursor.execute(
                    """INSERT INTO tasks (title, description, priority, status, assigned_to, room_number, department, due_time)
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                    task,
                )
            print("Seeded staff tasks")

        cursor.execute("SELECT COUNT(*) AS cnt FROM staff_schedule")
        if cursor.fetchone()["cnt"] == 0:
            for schedule in SEED_DATA["staff_schedule"]:
                cursor.execute(
                    """INSERT INTO staff_schedule (staff_email, day_of_week, date, shift_start, shift_end, status)
                       VALUES (%s, %s, %s, %s, %s, %s)""",
                    schedule,
                )
            print("Seeded staff schedule")
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Seed error: {e}")
    finally:
        cursor.close()
        db.close()


if __name__ == "__main__":
    ensure_tables()
    seed_data()
