from pydantic import BaseModel
from datetime import datetime

class EmprendimientoInput(BaseModel):
    nombreComercial: str
    descripcion: str
    categoria: str
    #fechaCreacion: str
    #fechaActualizacion: str
    idEmprendedor: str
    #idEmprendimiento: str
    ruc: str

class EmprendimientoOutput(BaseModel):
    nombreComercial: str
    descripcion: str
    categoria: str
    fechaCreacion: datetime
    fechaActualizacion: datetime
    ruc: str
