from datetime import date

from pydantic import field_validator, model_validator


class UserValidators:
    PASSWORD_MIN_LENGTH = 8

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        value = value.strip()

        if len(value) < cls.PASSWORD_MIN_LENGTH:
            raise ValueError("Password must be at least 8 characters")

        return value

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_name(cls, value: str):
        value = value.strip()

        if not value:
            raise ValueError("Name cannot be empty")

        return value

    @field_validator("mobile_number")
    @classmethod
    def validate_phone(cls, value: str):
        value = value.strip()

        if not value:
            raise ValueError("Phone number cannot be empty")

        return value

    @model_validator(mode="after")
    def passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match")

        return self


class CreateAdminValidators:
    PASSWORD_MIN_LENGTH = 8

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str):
        value = value.strip()

        if len(value) < cls.PASSWORD_MIN_LENGTH:
            raise ValueError("Password must be at least 8 characters")

        return value

    @field_validator("first_name", "last_name")
    @classmethod
    def validate_name(cls, value: str):
        value = value.strip()

        if not value:
            raise ValueError("Name cannot be empty")

        return value


class ProfileValidators:

    @model_validator(mode="after")
    def passwords_match(self):
        if self.new_password:
            if not self.confirm_password:
                raise ValueError("Confirm password is required")

            if self.new_password != self.confirm_password:
                raise ValueError("Passwords do not match")

        return self


class BookingValidators:

    @model_validator(mode="after")
    def validate_dates(self):
        if self.out_date <= self.in_date:
            raise ValueError(
                "Check-out date must be after check-in date"
            )

        return self