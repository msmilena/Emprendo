
# Database
from src.database.db import get_connection
# Errors
from src.utils.errors.CustomException import CustomException
# Models
from .models.Emprendimiento import Emprendimiento
from google.cloud.firestore_v1.base_query import FieldFilter

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
            emprendimientos = emprendimientos_ref.get()
            emprendimientos_list = []
            for emprendimiento in emprendimientos:
                emprendimientos_list.append(emprendimiento.to_dict())
            return emprendimientos_list
        except Exception as ex:
            raise CustomException(ex)
            
    @classmethod
    def save_emprendimiento(cls, emprendimiento):
        try:
            db = get_connection()

            # Validar que los campos no estén vacíos
            required_fields = ['idEmprendedor', 'nombreComercial', 'localizacion', 'ruc']
            for field in required_fields:
                if not getattr(emprendimiento, field):
                    return {'success': False, 'message': f'El campo {field} no puede estar vacío'}

            # Validar el formato del RUC (11 dígitos)
            if not (emprendimiento.ruc.isdigit() and len(emprendimiento.ruc) == 11):
                return {'success': False, 'message': 'El RUC debe tener 11 dígitos'}

            # Buscar emprendimientos existentes con el mismo nombre comercial
            existing_name_ref = db.collection('emprendimientos').where(filter=FieldFilter("nombreComercial", "==", emprendimiento.nombreComercial))
            existing_name = existing_name_ref.get()

            # Verificar si existen emprendimientos con el mismo nombre comercial
            if existing_name:
                return {'success': False, 'message': 'El nombre comercial del emprendimiento ya existe'}

            # Agregar un nuevo documento en la colección 'emprendimientos'
            db.collection('emprendimientos').add({
                "idEmprendedor": emprendimiento.idEmprendedor,
                "nombreComercial": emprendimiento.nombreComercial,
                "localizacion": emprendimiento.localizacion,
                "ruc": emprendimiento.ruc,
            })

            return {'success': True, 'message': 'Emprendimiento guardado exitosamente'}
        except Exception as ex:
            raise CustomException(ex)
          
 