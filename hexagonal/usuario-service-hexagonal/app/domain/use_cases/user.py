from abc import ABC, abstractmethod
from typing import List
from app.domain.entities.user import UserEntity
from app.domain.events.user import UserCreatedEvent
from app.domain.repositories.user import UserRepository


class UserUseCases(ABC):

    @abstractmethod
    def __init__(self, user_repository: UserRepository,
                 user_created_event: UserCreatedEvent
                 ):
        self.user_repository = user_repository
        self.user_created_event = user_created_event

    @abstractmethod
    def register_user(self, user: UserEntity):
        raise NotImplemented

    @abstractmethod
    def login_user(self, user: UserEntity) -> UserEntity:
        raise NotImplemented