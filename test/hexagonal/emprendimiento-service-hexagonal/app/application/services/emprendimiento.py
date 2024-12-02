from typing import List
from app.domain.use_cases.emprendimiento import EmprendimientoUseCases
from app.domain.entities.emprendimiento import EmprendimientoEntity
from app.domain.events.emprendimiento import EmprendimientoCreadoEvent, EmprendimientoActualizadoEvent
from app.application.validators.emprendimiento import EmprendimientoValidator
from app.domain.repositories.emprendimiento import EmprendimientoRepository


class EmprendimientoService(EmprendimientoUseCases):

    __media_url = 'https://github.com/msmilena/Emprendo'

    def __init__(self, emprendimiento_repository: EmprendimientoRepository,
                 emprendimiento_created_event: EmprendimientoCreadoEvent,
                 emprendimiento_updated_event: EmprendimientoActualizadoEvent
                 ):
        super().__init__(emprendimiento_repository, emprendimiento_created_event, emprendimiento_updated_event)

    def catalogo_emprendimientos(self) -> List[EmprendimientoEntity]:
        emprendimientos = self.emprendimiento_repository.get_all()
        return emprendimientos

    def detalle_emprendimiento(self, idEmprendimiento: str) -> EmprendimientoEntity:
        emprendimiento = self.emprendimiento_repository.get_by_id(idEmprendimiento)
        return emprendimiento

    def register_emprendimiento(self, emprendimiento: EmprendimientoEntity) -> EmprendimientoEntity:
        EmprendimientoValidator.validate_ruc(emprendimiento.ruc)
        emprendimiento = self.emprendimiento_repository.add(emprendimiento)

        self.emprendimiento_created_event.send(emprendimiento)
        
        return emprendimiento

    def update_emprendimiento(self, emprendimiento: EmprendimientoEntity) -> EmprendimientoEntity:
        
        EmprendimientoValidator.validate_ruc(emprendimiento.ruc)
        emprendimiento = self.emprendimiento_repository.update(emprendimiento)
      
        self.emprendimiento_updated_event.send(emprendimiento)

        return emprendimiento
