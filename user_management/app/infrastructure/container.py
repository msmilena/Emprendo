from dependency_injector import containers, providers
from app.domain.entities.user import UserEntityFactory
from app.infrastructure.events.user import UserCreatedQueueEvent
from app.infrastructure.handlers import Handlers
from app.infrastructure.repositories.user import UserInMemoryRepository
from app.application.services.user import UserService


class Container(containers.DeclarativeContainer):

    #loads all handlers where @injects are set
    wiring_config = containers.WiringConfiguration(modules=Handlers.modules())

    #Factories
    user_factory = providers.Factory(UserEntityFactory)

    #Repositories
    user_repository = providers.Singleton(UserInMemoryRepository)

    #Events
    user_created_event = providers.Factory(UserCreatedQueueEvent)

    #Services
    user_services = providers.Factory(UserService, user_repository, user_created_event)
