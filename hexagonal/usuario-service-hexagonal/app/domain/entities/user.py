import uuid
from app.domain.exceptions import InvalidEmail
import re

class UserEntity:

    def __init__(self, uid: str, name: str, lastName: str, email: str, password: str, tipo: str):
        self.__validate_email(email)

        self.id = uid
        self.name = name
        self.lastName = ""
        self.email = email
        self.password = password
        self.tipo = tipo

    @staticmethod
    def __validate_email(email: str):
        pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        if re.match(pattern, email):
            raise InvalidEmail

class UserEntityFactory:

    @staticmethod
    def create(id: str|None, name: str, lastName: str, email: str, password: str, tipo: str) -> UserEntity:
        if id is None:
            id = uuid.uuid4().__str__()
        return UserEntity(id, name, lastName, email, password, tipo)
