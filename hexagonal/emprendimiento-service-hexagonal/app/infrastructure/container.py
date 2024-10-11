from dependency_injector import containers, providers
from app.domain.entities.emprendimiento import EmprendimientoFactory
from app.infrastructure.events.emprendimiento import EmprendimientoCreatedQueueEvent, EmprendimientoUpdatedQueueEvent
from app.infrastructure.handlers import Handlers
from app.infrastructure.repositories.emprendimiento import EmprendimientoInMemoryRepository
from app.application.services.emprendimiento import EmprendimientoService


class Container(containers.DeclarativeContainer):

    #loads all handlers where @injects are set
    wiring_config = containers.WiringConfiguration(modules=Handlers.modules())

    #Factories
    emprendimiento_factory = providers.Factory(EmprendimientoFactory)

    #Repositories
    emprendimiento_repository = providers.Singleton(EmprendimientoInMemoryRepository)

    #Events
    emprendimiento_created_event = providers.Factory(EmprendimientoCreatedQueueEvent)
    emprendimiento_updated_event = providers.Factory(EmprendimientoUpdatedQueueEvent)

    #Services
    emprendimiento_services = providers.Factory(EmprendimientoService, emprendimiento_repository, emprendimiento_created_event, emprendimiento_updated_event)
