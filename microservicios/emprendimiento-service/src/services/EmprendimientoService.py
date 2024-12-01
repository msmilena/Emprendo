# Database
from src.database.db import get_connection
# Errors
from src.utils.errors.CustomException import CustomException
# Models
from .models.Emprendimiento import Emprendimiento
from google.cloud.firestore_v1.base_query import FieldFilter
from datetime import datetime

class EmprendimientoService():

    @classmethod
    def get_infoEmprendimiento(cls, idEmprendimiento):
        try:
            db = get_connection()
            emprendimiento_ref = db.collection('emprendimientos').document(idEmprendimiento)
            emprendimiento_data = emprendimiento_ref.get()
            if emprendimiento_data.exists:
                doc_data = emprendimiento_data.to_dict()
                print(doc_data)
                return doc_data
            return None
        except Exception as ex:
            raise CustomException(ex)
     
    @classmethod
    def get_top_emprendimientos(cls, limit=10):
        try:
            db = get_connection()
            emprendimientos_ref = db.collection('emprendimientos').limit(limit)
            docs = emprendimientos_ref.stream()
            emprendimientos = []
            for doc in docs:
                emprendimiento = doc.to_dict()
                emprendimiento['idEmprendimiento'] = doc.id
                emprendimientos.append(emprendimiento)
            return emprendimientos
        except Exception as ex:
            raise CustomException(ex)
            
    @classmethod
    def save_emprendimiento(cls, emprendimiento):
        try:
            db = get_connection()
            emprendimiento_ref = db.collection('emprendimientos').document()
            emprendimiento_data = emprendimiento.to_dict()
            emprendimiento_data['fechaCreacion'] = datetime.now()
            emprendimiento_ref.set(emprendimiento_data)
            return {'success': True}
        except Exception as ex:
            raise CustomException(ex)

    @classmethod
    def get_infoEmprendimiento_by_emprendedor(cls, idEmprendedor):
        try:
            db = get_connection()
            emprendimientos_ref = db.collection('emprendimientos').where('idEmprendedor', '==', idEmprendedor)
            docs = emprendimientos_ref.stream()
            emprendimientos = []
            for doc in docs:
                emprendimiento = doc.to_dict()
                emprendimiento['idEmprendimiento'] = doc.id
                emprendimientos.append(emprendimiento)
            return emprendimientos if emprendimientos else None
        except Exception as ex:
            raise CustomException(ex)

