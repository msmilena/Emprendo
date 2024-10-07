from abc import ABC, abstractmethod
from typing import List
from app.domain.entities.emprendimiento import EmprendimientoEntity
from app.domain.events.emprendimiento import EmprendimientoCreadoEvent, EmprendimientoActualizadoEvent
from app.domain.repositories.emprendimiento import EmprendimientoRepository


class EmprendimientoUseCases(ABC):

    @abstractmethod
    def __init__(self, emprendimiento_repository: EmprendimientoRepository,
                 emprendimiento_created_event: EmprendimientoCreadoEvent,
                 emprendimiento_updated_event: EmprendimientoActualizadoEvent
                 ):
        self.emprendimiento_repository = emprendimiento_repository
        self.emprendimiento_created_event = emprendimiento_created_event
        self.emprendimiento_updated_event = emprendimiento_updated_event

    @abstractmethod
    def catalogo_emprendimientos(self) -> List[EmprendimientoEntity]:
        raise NotImplemented

    @abstractmethod
    def detalle_emprendimiento(self, idEmprendimiento: str) -> EmprendimientoEntity:
        raise NotImplemented

    @abstractmethod
    def register_emprendimiento(self, emprendimiento: EmprendimientoEntity) -> EmprendimientoEntity:
        raise NotImplemented

    @abstractmethod
    def update_emprendimiento(self, emprendimiento: EmprendimientoEntity) -> EmprendimientoEntity:
        raise NotImplemented
