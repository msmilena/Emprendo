from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid
from app.domain.exceptions import InvalidCategoria, InvalidRUC

class Localizacion:
    def __init__(self, latitud: float, longitud: float):
        self.latitud = latitud
        self.longitud = longitud
    
    def to_dict(self):
        return {
            'latitud': self.latitud,
            'longitud': self.longitud
        }


class Puntuacion:
    def __init__(self, promedio: Optional[float] = None, totales: Optional[int] = None):
        self.promedio = promedio
        self.totales = totales
    
    def to_dict(self):
        return {
            'promedio': self.promedio,
            'totales': self.totales
        }

class Enlaces:
    def __init__(self, facebook: Optional[str] = None, instagram: Optional[str] = None, x: Optional[str] = None):
        self.facebook = facebook
        self.instagram = instagram
        self.x = x

    def to_dict(self):
        return {
            'facebook': self.facebook,
            'instagram': self.instagram,
            'x': self.x
        }

class EmprendimientoEntity:
    def __init__(self, 
                 idEmprendimiento: str, 
                 idEmprendedor: str, 
                 ruc: str, 
                 nombreComercial: str, 
                 descripcion: str, 
                 categoria: str, 
                 localizacion: Localizacion, 
                 puntuacion: Optional[Puntuacion] = None, 
                 tags: Optional[List[str]] = None, 
                 enlaces: Optional[Enlaces] = None, 
                 fechaCreacion: Optional[datetime] = None, 
                 fechaActualizacion: Optional[datetime] = None ):
                 #productos: Optional[List['ProductEntity']] = None):
        self.__validar_ruc(ruc)

        self.idEmprendimiento = idEmprendimiento
        self.idEmprendedor = idEmprendedor
        print(f"enlaces antes de la validación: {enlaces}")  # Depuración
        print(f"puntuacion antes de la validación: {puntuacion}")  # Depuración
        self.ruc = ruc
        self.nombreComercial = nombreComercial
        self.descripcion = descripcion
        self.categoria = categoria
        self.localizacion = localizacion
        self.puntuacion = puntuacion if puntuacion is not None else Puntuacion()
        self.tags = tags if tags is not None else []
        self.enlaces = enlaces if enlaces is not None else Enlaces()
        self.fechaCreacion = fechaCreacion 
        self.fechaActualizacion = fechaActualizacion if fechaActualizacion is not None else datetime.now()
        #self.productos = productos if productos is not None else []
    
    @staticmethod
    def __validar_ruc(ruc: str):
        print(f"Validando RUC: {ruc}")  # Depuración
        if not ruc.isdigit() or len(ruc) != 11:
            print("digit",ruc.isdigit())
            print("len",len(ruc))
            raise InvalidRUC

class EmprendimientoFactory:

    @staticmethod
    def create(
        idEmprendimiento: str,
        idEmprendedor: str,
        ruc: str,
        nombreComercial: str,
        descripcion: str,
        categoria: str,
        localizacion: Optional[Dict[float, float]] = None,
        puntuacion: Optional[Dict[float, Optional[int]]] = None,
        tags: Optional[list] = None,
        enlaces: Optional[Dict[str, Optional[str]]] = None,
        fechaCreacion: Optional[str] = None,
        fechaActualizacion: Optional[str] = None
    ) -> EmprendimientoEntity:
        
        if idEmprendimiento is None:
            idEmprendimiento = uuid.uuid4().__str__()

        localizacion_obj = Localizacion(
                latitud=localizacion['latitud'],
                longitud=localizacion['longitud']
        ) if isinstance(localizacion, dict) else None

        puntuacion_obj = Puntuacion(
                promedio=puntuacion.get('promedio') if isinstance(puntuacion, dict) else None,
                totales=puntuacion.get('totales') if isinstance(puntuacion, dict) else None
        ) #if isinstance(puntuacion, dict) else None

        #print(f"puntuacion_obj antes de la validación: {puntuacion_obj.to_dict}")  # Depuración

        enlaces_obj = Enlaces(
            facebook=enlaces.get('facebook') if isinstance(enlaces, dict) else None,
            instagram=enlaces.get('instagram') if isinstance(enlaces, dict) else None,
            x=enlaces.get('x') if isinstance(enlaces, dict) else None
        )

        return EmprendimientoEntity(
            idEmprendimiento=idEmprendimiento,
            idEmprendedor=idEmprendedor,
            ruc=ruc,
            nombreComercial=nombreComercial,
            descripcion=descripcion,
            categoria=categoria,
            localizacion=localizacion_obj.to_dict() if localizacion_obj else None,
            puntuacion=puntuacion_obj.to_dict() if puntuacion_obj else {},
            tags=tags or [],
            enlaces=enlaces_obj.to_dict() if enlaces_obj else {},
            fechaCreacion=fechaCreacion if isinstance(fechaCreacion, datetime) else datetime.fromisoformat(fechaCreacion) if fechaCreacion else None,
            fechaActualizacion=fechaActualizacion if isinstance(fechaActualizacion, datetime) else datetime.fromisoformat(fechaActualizacion) if fechaActualizacion else None
        )