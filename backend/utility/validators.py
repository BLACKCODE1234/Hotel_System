def check_password_min_length(v: str) -> str:
    if len(v) < 4:
        raise ValueError("Password must be at least 4 characters")
    return v


def check_name_non_empty(v: str) -> str:
    if not v.strip():
        raise ValueError("Name cannot be empty")
    return v


def check_phone_non_empty(v: str) -> str:
    if not v.strip():
        raise ValueError("Phone number cannot be empty")
    return v
