from abc import ABC, abstractmethod
from typing import List
from app.domain.entities.entrepreneur import EntrepreneurEntity
from app.domain.events.entrepreneur import EntrepreneurCreatedEvent, EntrepreneurUpdatedEvent
from app.domain.repositories.entrepreneur import EntrepreneurRepository


class EntrepreneurUseCases(ABC):

    @abstractmethod
    def __init__(self, entrepreneur_repository: EntrepreneurRepository,
                 entrepreneur_created_event: EntrepreneurCreatedEvent,
                 entrepreneur_updated_event: EntrepreneurUpdatedEvent
                 ):
        self.entrepreneur_repository = entrepreneur_repository
        self.entrepreneur_created_event = entrepreneur_created_event
        self.entrepreneur_updated_event = entrepreneur_updated_event

    @abstractmethod
    def entrepreneurs_catalog(self) -> List[EntrepreneurEntity]:
        raise NotImplemented

    @abstractmethod
    def entrepreneur_detail(self, id: str) -> EntrepreneurEntity:
        raise NotImplemented

    @abstractmethod
    def register_entrepreneur(self, entrepreneur: EntrepreneurEntity) -> EntrepreneurEntity:
        raise NotImplemented

    @abstractmethod
    def update_entrepreneur(self, entrepreneur: EntrepreneurEntity) -> EntrepreneurEntity:
        raise NotImplemented
