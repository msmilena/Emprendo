from typing import List
from dependency_injector.wiring import inject, Provide
from fastapi import APIRouter, Depends
from app.domain.entities.emprendimiento import EmprendimientoEntity, EmprendimientoFactory
from app.infrastructure.container import Container
from app.application.services.emprendimiento import EmprendimientoService
from app.infrastructure.schemas.emprendimiento import EmprendimientoOutput, EmprendimientoInput
from datetime import datetime

router = APIRouter(
    prefix='/emprendimientos',
    tags=['emprendimientos']
)

@router.get('/', response_model=List[EmprendimientoOutput])
@inject
def get_catalog(emprendimiento_services: EmprendimientoService = Depends(Provide[Container.emprendimiento_services])) -> List[dict]:
    response: List[EmprendimientoEntity] = emprendimiento_services.catalogo_emprendimientos()
    return [emprendimiento_entity.__dict__ for emprendimiento_entity in response]

@router.get('/datos_emprendimiento/{idEmprendimiento}', response_model=EmprendimientoOutput)
@inject
def get_description(idEmprendimiento: str, emprendimiento_services: EmprendimientoService = Depends(Provide[Container.emprendimiento_services])) -> dict:
    response: EmprendimientoEntity = emprendimiento_services.detalle_emprendimiento(idEmprendimiento)
    return response.__dict__

@router.post('/registro_emprendimiento', response_model=EmprendimientoOutput)
@inject
def register_emprendimiento(
        emprendimiento: EmprendimientoInput,
        emprendimiento_factory: EmprendimientoFactory = Depends(Provide[Container.emprendimiento_factory]),
        emprendimiento_services: EmprendimientoService = Depends(Provide[Container.emprendimiento_services])
) -> dict:
    nombreComercial, descripcion, categoria,idEmprendedor,ruc   = emprendimiento.__dict__.values()

    # Crear la entidad sin idEmprendimiento
    emprendimiento_entity: EmprendimientoEntity = emprendimiento_factory.create(
        idEmprendimiento=None,
        idEmprendedor=idEmprendedor,
        ruc=ruc,
        nombreComercial=nombreComercial,
        descripcion=descripcion,
        categoria=categoria,
        fechaCreacion=datetime.now(),
        fechaActualizacion=datetime.now()
    )
    
    # Registrar el emprendimiento y obtener el ID generado por Firestore
    response: EmprendimientoEntity = emprendimiento_services.register_emprendimiento(emprendimiento_entity)
    
    print(f"todo generado: {response}")  # Depuración
    # Actualizar la entidad con el ID generado
    emprendimiento_entity.idEmprendimiento = response.idEmprendimiento
    
    return response.__dict__

@router.put('/{idEmprendimiento}', response_model=EmprendimientoOutput)
@inject
def update_emprendimiento(
        idEmprendimiento: str,
        emprendimiento: EmprendimientoInput,
        emprendimiento_factory: EmprendimientoFactory = Depends(Provide[Container.emprendimiento_factory]),
        emprendimiento_services: EmprendimientoService = Depends(Provide[Container.emprendimiento_services])
) -> dict:
    nombreComercial, descripcion, categoria, fechaCreacion, fechaActualizacion,idEmprendedor,ruc  = emprendimiento.__dict__.values()
    emprendimiento_entity: EmprendimientoEntity = emprendimiento_factory.create(idEmprendimiento, nombreComercial, descripcion, categoria, fechaCreacion, fechaActualizacion,idEmprendedor,ruc )
    response: EmprendimientoEntity = emprendimiento_services.update_emprendimiento(emprendimiento_entity)
    return response.__dict__
