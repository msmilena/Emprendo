from copy import copy
from typing import List
from app.domain.entities.emprendimiento import EmprendimientoFactory, EmprendimientoEntity
from app.domain.repositories.emprendimiento import EmprendimientoRepository
from app.infrastructure.firestore import get_firestore_client

class EmprendimientoInMemoryRepository(EmprendimientoRepository):

    # emprendimientos: List[dict] = [
    #      {
    #     'nombreComercial': 'Tech Startup',
    #     'descripcion': 'A startup focused on innovative tech solutions',
    #     'categoria': 'Technology',
    #     'fechaCreacion': '2023-10-01T12:00:00',
    #     'fechaActualizacion': '2023-10-01T12:00:00',
    #     'idEmprendedor': '1a2b3c4d5e6f7g8h9i0j',
    #     'ruc': '12345678901',
    #     'idEmprendimiento': '123a',
    #     'localizacion': {
    #         'latitud': -12.04318,
    #         'longitud': -77.02824
    #     }
    # },
    # {
    #     'nombreComercial': 'Organic Farm',
    #     'descripcion': 'A farm producing organic vegetables and fruits',
    #     'categoria': 'Agriculture',
    #     'fechaCreacion': '2023-10-02T12:00:00',
    #     'fechaActualizacion': '2023-10-02T12:00:00',
    #     'idEmprendedor': '0j9i8h7g6f5e4d3c2b1a',
    #     'ruc': '10987654321',
    #     'idEmprendimiento': '123b',
    #     'localizacion': {
    #         'latitud': -12.04318,
    #         'longitud': -77.02824
    #     }
    # }
    # ]

    def __init__(self):
        self.client = get_firestore_client()
        self.collection = self.client.collection('emprendimientos')

    def get_all(self) -> list:
        docs = self.collection.stream()
        return [EmprendimientoEntity(**{**doc.to_dict(), 'idEmprendimiento': doc.id}) for doc in docs]

    def get_by_id(self, idEmprendimiento: str) -> EmprendimientoEntity:
        doc_ref = self.collection.document(idEmprendimiento)
        doc = doc_ref.get()
        if doc.exists:
            data = doc.to_dict()
            data['idEmprendimiento'] = idEmprendimiento  # Asignar el ID del documento
            return EmprendimientoEntity(**data)
        else:
            raise ValueError("Emprendimiento no encontrado")

    def add(self, emprendimiento: EmprendimientoEntity) -> EmprendimientoEntity:
        doc_ref = self.collection.document()
        doc_ref.set(copy(emprendimiento.__dict__))
        emprendimiento.idEmprendimiento = doc_ref.id
        return emprendimiento

    def update(self, emprendimiento: EmprendimientoEntity) -> EmprendimientoEntity:
        for key, value in enumerate(self.emprendimientos):
            if value['idEmprendimiento'] == emprendimiento.idEmprendimiento:
                self.emprendimientos[key] = copy(emprendimiento.__dict__)
        return emprendimiento
