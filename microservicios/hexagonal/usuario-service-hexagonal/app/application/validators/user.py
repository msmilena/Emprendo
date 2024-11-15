from app.domain.exceptions import InvalidEmail
import re

class UserValidator:

    @staticmethod
    def validate_email(email: str):
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            raise InvalidEmail