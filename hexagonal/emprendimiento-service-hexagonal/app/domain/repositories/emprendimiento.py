from abc import ABC, abstractmethod
from typing import List

from app.domain.entities.emprendimiento import EmprendimientoEntity


class EmprendimientoRepository(ABC):

    @abstractmethod
    def get_all(self) -> List[EmprendimientoEntity]:
        raise NotImplemented

    @abstractmethod
    def get_by_id(self, idEmprendimiento: str) -> EmprendimientoEntity:
        raise NotImplemented

    @abstractmethod
    def add(self, emprendimiento: EmprendimientoEntity) -> EmprendimientoEntity:
        raise NotImplemented

    @abstractmethod
    def update(self, emprendimiento: EmprendimientoEntity) -> EmprendimientoEntity:
        raise NotImplemented
