import logging

from passlib.context import CryptContext
from passlib.exc import UnknownHashError

logger = logging.getLogger(__name__)

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(password, hashed_password)
    except UnknownHashError:
        logger.error("Unknown hash format for password verification")
        return False
    except Exception as e:
        logger.exception("Unexpected error verifying password: %s", e)
        return False


def hash_otp(otp: str) -> str:
    return pwd_context.hash(otp)


def verify_otp(otp: str, hashed_otp: str) -> bool:
    try:
        return pwd_context.verify(otp, hashed_otp)
    except UnknownHashError:
        logger.error("Unknown hash format for OTP verification")
        return False
    except Exception as e:
        logger.exception("Unexpected error verifying OTP: %s", e)
        return False
