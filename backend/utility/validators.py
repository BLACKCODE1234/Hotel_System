
    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v

    @field_validator("first_name", "last_name")
    @classmethod
    def name_non_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name cannot be empty")
        return v

    @field_validator("mobile_number")
    @classmethod
    def phone_non_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Phone number cannot be empty")
        return v

