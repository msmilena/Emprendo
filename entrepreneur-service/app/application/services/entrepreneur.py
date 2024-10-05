from typing import List
from app.domain.use_cases.entrepreneur import EntrepreneurUseCases
from app.domain.entities.entrepreneur import EntrepreneurEntity
from app.domain.events.entrepreneur import EntrepreneurCreatedEvent, EntrepreneurUpdatedEvent
from app.application.validators.entrepreneur import EntrepreneurValidator
from app.domain.repositories.entrepreneur import EntrepreneurRepository


class EntrepreneurService(EntrepreneurUseCases):

    __media_url = 'https://github.com/msmilena/Emprendo'

    def __init__(self, entrepreneur_repository: EntrepreneurRepository,
                 entrepreneur_created_event: EntrepreneurCreatedEvent,
                 entrepreneur_updated_event: EntrepreneurUpdatedEvent
                 ):
        super().__init__(entrepreneur_repository, entrepreneur_created_event, entrepreneur_updated_event)

    def entrepreneurs_catalog(self) -> List[EntrepreneurEntity]:
        entrepreneurs = self.entrepreneur_repository.get_all()
        for entrepreneur in entrepreneurs:
            entrepreneur.image = self.__media_url.format(entrepreneur.image)
        return entrepreneurs

    def entrepreneur_detail(self, id: str) -> EntrepreneurEntity:
        entrepreneur = self.entrepreneur_repository.get_by_id(id)
        entrepreneur.image = self.__media_url.format(entrepreneur.image)
        return entrepreneur

    def register_entrepreneur(self, entrepreneur: EntrepreneurEntity) -> EntrepreneurEntity:
        EntrepreneurValidator.validate_price_is_float(entrepreneur.price)
        EntrepreneurValidator.validate_description_len(entrepreneur.description)

        entrepreneur = self.entrepreneur_repository.add(entrepreneur)
        entrepreneur.image = self.__media_url.format(entrepreneur.image)

        self.entrepreneur_created_event.send(entrepreneur)

        return entrepreneur

    def update_entrepreneur(self, entrepreneur: EntrepreneurEntity) -> EntrepreneurEntity:
        EntrepreneurValidator.validate_price_is_float(entrepreneur.price)
        EntrepreneurValidator.validate_description_len(entrepreneur.description)

        entrepreneur = self.entrepreneur_repository.update(entrepreneur)
        entrepreneur.image = self.__media_url.format(entrepreneur.image)

        self.entrepreneur_updated_event.send(entrepreneur)

        return entrepreneur
