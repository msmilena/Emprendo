from abc import ABC, abstractmethod
from app.domain.entities.entrepreneur import EntrepreneurEntity

class EntrepreneurCreatedEvent(ABC):

    @abstractmethod
    def send(self, entrepreneur: EntrepreneurEntity) -> bool:
        raise NotImplemented

class EntrepreneurUpdatedEvent(ABC):

    @abstractmethod
    def send(self, entrepreneur: EntrepreneurEntity) -> bool:
        raise NotImplemented
