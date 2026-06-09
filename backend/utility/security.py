from passlib.context import CryptContext

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(password, hashed_password)
    except Exception:
        return False


def hash_otp(otp: str) -> str:
    return pwd_context.hash(otp)


def verify_otp(otp: str, hashed_otp: str) -> bool:
    try:
        return pwd_context.verify(otp, hashed_otp)
    except Exception:
        return False
