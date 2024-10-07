from abc import ABC, abstractmethod
from typing import List

from app.domain.entities.user import UserEntity


class UserRepository(ABC):

    @abstractmethod
    def add(self, user: UserEntity):
        raise NotImplemented

    @abstractmethod
    def get_by_id(self, id: str) -> UserEntity:
        raise NotImplemented

    @abstractmethod
    def get_by_email(self, email: str) -> UserEntity:
        raise NotImplemented


