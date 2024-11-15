from src.database.db import get_connection
from src.utils.errors.CustomException import CustomException
from .models.Valoracion import Valoracion
from google.cloud.firestore_v1.base_query import FieldFilter
from firebase_admin import firestore

class ValoracionService():

    @classmethod
    def save_valoracion(cls, valoracion):
        try:
            db = get_connection()

            # Validar que los campos no estén vacíos
            required_fields = ['idUsuario', 'idEmprendimiento', 'valor']
            for field in required_fields:
                if not getattr(valoracion, field):
                    return {'success': False, 'message': f'El campo {field} no puede estar vacío'}

            
            emprendimiento_ref = db.collection('emprendimientos').document(valoracion.idEmprendimiento)
            # Agregar a usuario un nuevo documento en la colección 'valoracion'
            db.collection('usuarios').document(valoracion.idUsuario).collection('valoraciones').add({
                "fechaValoracion": firebase_admin.firestore.SERVER_TIMESTAMP,
                "idEmprendimiento": emprendimiento_ref,
                "valoracion": valoracion.valor
            })

            return {'success': True, 'message': 'Valoracion guardada exitosamente'}
        except Exception as ex:
            raise CustomException(ex)


    @classmethod
    def upt_valoracion(cls, idEmprendimiento, valor):
        try:
            db = get_connection()
            
            emprendimiento_ref = db.document(idEmprendimiento)
            doc = emprendimiento_ref.get()

            if not doc.exists:
                return None

            # Obtener los valores actuales
            datos = doc.to_dict().get('valoracion', {})
            promedio_actual = datos.get('promedioValoracion', 0)
            total_valoraciones = datos.get('totalesValoracion', 0)

            # Calcular el nuevo promedio
            nuevo_total = total_valoraciones + 1
            nuevo_promedio = ((promedio_actual * total_valoraciones) + valor) / nuevo_total

            # Actualizar los datos en Firestore
            nueva_valoracion = {
                'valoracion.promedioValoracion': nuevo_promedio,
                'valoracion.totalesValoracion': nuevo_total
            }
            emprendimiento_ref.update(nueva_valoracion)

            return nueva_valoracion
        
        except Exception as ex:
            raise CustomException(ex)


    @classmethod
    def get_valoraciones(cls, idUsuario):
        try:
            db = get_connection()
            valoracion_list = []
            valoraciones_ref = db.collection('usuarios').document(idUsuario)
            valoraciones_docs = valoraciones_ref.stream()

            for doc in valoraciones_docs:
                valoracion_data = doc.to_dict()
                fechaValoracion = valoracion_data.get('fechaValoracion')
                idEmprendimiento_ref = valoracion_data.get('idEmprendimiento')
                valoracion = valoracion_data.get('valoracion')

                if not idEmprendimiento_ref:
                    continue

                # Obtener el documento del emprendimiento
                emprendimiento_doc = idEmprendimiento_ref.get()
                if not emprendimiento_doc.exists:
                    continue

                idEmprendimiento = emprendimiento_doc.id
                emprendimiento_data = emprendimiento_doc.to_dict()
                nombreComercial = emprendimiento_data.get('nombreComercial')

                # Crear el diccionario con los datos requeridos
                valoracion_info = {
                    'idEmprendimiento': idEmprendimiento,
                    'nombreComercial': nombreComercial,
                    'fechaValoracion': fechaValoracion,
                    'valoracion': valoracion
                }

                valoracion_list.append(valoracion_info)

            return valoracion_list
        except Exception as ex:
            raise CustomException(ex)
