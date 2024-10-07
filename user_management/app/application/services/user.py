from typing import List
from app.domain.use_cases.user import UserUseCases
from app.domain.entities.user import UserEntity
from app.domain.events.user import UserCreatedEvent
from app.application.validators.user import UserValidator
from app.domain.repositories.user import UserRepository


class UserService(UserUseCases):

    def __init__(self, user_repository: UserRepository):
        super().__init__(user_repository)

    def get_user_data(self, id: str) -> UserEntity:
        user = self.user_repository.get_by_id(id)
        return user

    def register_user(self, user: UserEntity) -> UserEntity:
        UserValidator.validate_price_is_float(user.price)
        user = self.user_repository.add(user)
        return user

    def login_user(self, email: str, password: str) -> UserEntity:
        user = self.user_repository.get_by_email(email)
        if user and user.password == password:
            return user
        return None
