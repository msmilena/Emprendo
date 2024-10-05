from abc import ABC, abstractmethod
from typing import List

from app.domain.entities.entrepreneur import EntrepreneurEntity


class EntrepreneurRepository(ABC):

    @abstractmethod
    def get_all(self) -> List[EntrepreneurEntity]:
        raise NotImplemented

    @abstractmethod
    def get_by_id(self, id: str) -> EntrepreneurEntity:
        raise NotImplemented

    @abstractmethod
    def add(self, entrepreneur: EntrepreneurEntity) -> EntrepreneurEntity:
        raise NotImplemented

    @abstractmethod
    def update(self, entrepreneur: EntrepreneurEntity) -> EntrepreneurEntity:
        raise NotImplemented
