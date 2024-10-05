from dependency_injector import containers, providers
from app.domain.entities.entrepreneur import EntrepreneurEntityFactory
from app.infrastructure.events.entrepreneur import EntrepreneurCreatedQueueEvent, EntrepreneurUpdatedQueueEvent
from app.infrastructure.handlers import Handlers
from app.infrastructure.repositories.entrepreneur import EntrepreneurInMemoryRepository
from app.application.services.entrepreneur import EntrepreneurService


class Container(containers.DeclarativeContainer):

    #loads all handlers where @injects are set
    wiring_config = containers.WiringConfiguration(modules=Handlers.modules())

    #Factories
    entrepreneur_factory = providers.Factory(EntrepreneurEntityFactory)

    #Repositories
    entrepreneur_repository = providers.Singleton(EntrepreneurInMemoryRepository)

    #Events
    entrepreneur_created_event = providers.Factory(EntrepreneurCreatedQueueEvent)
    entrepreneur_updated_event = providers.Factory(EntrepreneurUpdatedQueueEvent)

    #Services
    entrepreneur_services = providers.Factory(EntrepreneurService, entrepreneur_repository, entrepreneur_created_event, entrepreneur_updated_event)
