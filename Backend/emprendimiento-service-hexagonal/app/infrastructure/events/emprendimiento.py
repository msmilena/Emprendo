from app.domain.entities.emprendimiento import EmprendimientoEntity
from app.domain.events.emprendimiento import EmprendimientoCreadoEvent, EmprendimientoActualizadoEvent


class EmprendimientoCreatedQueueEvent(EmprendimientoCreadoEvent):

    def send(self, emprendimiento: EmprendimientoEntity):
        # TODO: Your code here
        return True

class EmprendimientoUpdatedQueueEvent(EmprendimientoActualizadoEvent):

    def send(self, emprendimiento: EmprendimientoEntity):
        # TODO: Your code here
        return True
