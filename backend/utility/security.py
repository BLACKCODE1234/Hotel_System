import bcrypt


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed_password: str) -> bool:
    stored = (
        hashed_password.encode("utf-8")
        if isinstance(hashed_password, str)
        else hashed_password
    )
    return bcrypt.checkpw(password.encode("utf-8"), stored)


def hash_otp(otp: str) -> str:
    return bcrypt.hashpw(otp.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_otp(otp: str, hashed_otp: str) -> bool:
    try:
        return bcrypt.checkpw(otp.encode("utf-8"), hashed_otp.encode("utf-8"))
    except Exception:
        return False
