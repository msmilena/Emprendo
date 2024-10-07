from typing import Optional
from dependency_injector.wiring import inject, Provide
from fastapi import APIRouter, Depends
from app.infrastructure.container import Container
from app.application.services.user import UserService
from app.infrastructure.schemas.user import UserInput, UserOutput, UserLoginInput

router = APIRouter(
    prefix='/users',
    tags=['users']
)


# Registro de usuario (cliente o emprendedor)
@router.post('/registro_usuario', response_model=UserOutput)
@inject
def registro_usuario(user: UserInput, user_services: UserService = Depends(Provide[Container.user_services]) ) -> dict:
    nombres, apellidos, email, password, tipo = user.__dict__.values()
    response = user_services.register_user(nombres, apellidos, email, password, tipo)
    return response.__dict__

# Login de usuario
@router.get('/login_usuario', response_model=Optional[UserOutput])
@inject
def login_usuario(login_data: UserLoginInput, user_services: UserService = Depends(Provide[Container.user_services]) ) -> dict:
    email, password = login_data.__dict__.values()
    response = user_services.login_user(email, password)
    return response.__dict__

# Entrega de datos de usuario
@router.get('/datos_usuario', response_model=UserOutput)
@inject
def datos_usuario(id_usuario: str, user_services: UserService = Depends(Provide[Container.user_services])) -> dict:
    response = user_services.get_user_data(id_usuario)
    return response.__dict__
