from pydantic import BaseModel, field_validator


class CommonValidators(BaseModel):
    @field_validator("password", check_fields=False)
    @classmethod
    def password_digits_only(cls, v: str) -> str:
        if not v.isdigit():
            raise ValueError("Password must contain only digits")

        if len(v) < 4:
            raise ValueError("Password must be at least 4 digits long")

        return v

    @field_validator("first_name", "last_name", check_fields=False)
    @classmethod
    def name_non_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name cannot be empty")
        return v

    @field_validator("mobile_number", check_fields=False)
    @classmethod
    def phone_non_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Phone number cannot be empty")
        return v
