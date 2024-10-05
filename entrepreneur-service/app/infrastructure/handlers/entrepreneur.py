from typing import List
from dependency_injector.wiring import inject, Provide
from fastapi import APIRouter, Depends
from app.domain.entities.entrepreneur import EntrepreneurEntity, EntrepreneurEntityFactory
from app.infrastructure.container import Container
from app.application.services.entrepreneur import EntrepreneurService
from app.infrastructure.schemas.entrepreneur import EntrepreneurOutput, EntrepreneurInput

router = APIRouter(
    prefix='/entrepreneurs',
    tags=['entrepreneurs']
)

@router.get('/', response_model=List[EntrepreneurOutput])
@inject
def get_catalog(entrepreneur_services: EntrepreneurService = Depends(Provide[Container.entrepreneur_services])) -> List[dict]:
    response: List[EntrepreneurEntity] = entrepreneur_services.entrepreneurs_catalog()
    return [entrepreneur_entity.__dict__ for entrepreneur_entity in response]

@router.get('/{id}', response_model=EntrepreneurOutput)
@inject
def get_description(id: str, entrepreneur_services: EntrepreneurService = Depends(Provide[Container.entrepreneur_services])) -> dict:
    response: EntrepreneurEntity = entrepreneur_services.entrepreneur_detail(id)
    return response.__dict__

@router.post('/', response_model=EntrepreneurOutput)
@inject
def register_entrepreneur(
        entrepreneur: EntrepreneurInput,
        entrepreneur_factory: EntrepreneurEntityFactory = Depends(Provide[Container.entrepreneur_factory]),
        entrepreneur_services: EntrepreneurService = Depends(Provide[Container.entrepreneur_services])
) -> dict:
    name, description, price, stock, image = entrepreneur.__dict__.values()
    entrepreneur_entity: EntrepreneurEntity = entrepreneur_factory.create(None, name, description, price, stock, image)
    response: EntrepreneurEntity = entrepreneur_services.register_entrepreneur(entrepreneur_entity)
    return response.__dict__

@router.put('/{id}', response_model=EntrepreneurOutput)
@inject
def update_entrepreneur(
        id: str,
        entrepreneur: EntrepreneurInput,
        entrepreneur_factory: EntrepreneurEntityFactory = Depends(Provide[Container.entrepreneur_factory]),
        entrepreneur_services: EntrepreneurService = Depends(Provide[Container.entrepreneur_services])
) -> dict:
    name, description, price, stock, image = entrepreneur.__dict__.values()
    entrepreneur_entity: EntrepreneurEntity = entrepreneur_factory.create(id, name, description, price, stock, image)
    response: EntrepreneurEntity = entrepreneur_services.update_entrepreneur(entrepreneur_entity)
    return response.__dict__
