from abc import ABC, abstractmethod
from app.domain.entities.emprendimiento import EmprendimientoEntity

class EmprendimientoCreadoEvent(ABC):

    @abstractmethod
    def send(self, emprendimiento: EmprendimientoEntity) -> bool:
        raise NotImplemented

class EmprendimientoActualizadoEvent(ABC):

    @abstractmethod
    def send(self, emprendimiento: EmprendimientoEntity) -> bool:
        raise NotImplemented
