# Database
from src.database.db import get_connection
# Errors
from src.utils.errors.CustomException import CustomException
# Models
from src.services.models.User import User
from datetime import datetime
from google.cloud.firestore_v1.base_query import FieldFilter
import requests


class AuthService:

    @classmethod
    def get_user_by_uid(cls, uid):
        try:
            db = get_connection()
            print(uid)
            user_ref = db.collection('usuarios').document(uid)
            user_data = user_ref.get()
            if user_data.exists:
                doc_data = user_data.to_dict()
                return User(uid, doc_data['nombre'], doc_data['email'], doc_data['tipo'])
            return None
        except Exception as e:
            print(f"Error al obtener el usuario: {e}")
            return None

    @classmethod
    def check_email_availability(cls, email):
        try:
            db = get_connection()
            existing_email_ref = db.collection('usuarios').where('email', '==', email).get()
            if existing_email_ref:
                return {'success': False, 'message': 'Email ya está en uso'}
            else:
                return {'success': True, 'message': 'Email está disponible'}
        except Exception as e:
            print(f"Error al verificar el correo electrónico: {e}")
            return {'success': False, 'message': str(e)}

    @classmethod
    def register_user(cls, user):
        try:
            db = get_connection()

            # Buscar usuarios existentes con el mismo correo electrónico
            existing_email_ref = db.collection('usuarios').where(filter=FieldFilter("email", "==", user.email))
            existing_email = existing_email_ref.get()

            # Verificar si existen usuarios con el mismo correo electrónico
            if existing_email:
                # Devolver un mensaje indicando que el correo electrónico ya está en uso
                return {'success': False, 'message': 'El correo electrónico ya está en uso'}

            # Crear un nuevo documento de usuario en la base de datos
            user_ref = db.collection('usuarios').document()
            user.id = user_ref.id  # Asignar el ID generado por Firestore al usuario
            usuario_nuevo = {
                "nombre": user.nombre,
                "email": user.email,
                "password": user.password,
                "tipo": user.tipo,
                "tipoAuth": user.tipoAuth,
                "fechaCreacion": datetime.now().isoformat()
            }
            user_ref.set(usuario_nuevo)
            print(f"Usuario registrado con ID: {user.id}")
            # Crear las colecciones "favoritos" y "valoraciones" dentro del documento del usuario
            user_ref.collection('favoritos').add({})
            user_ref.collection('valoraciones').add({})

            return {'success': True, 'message': 'Usuario registrado exitosamente', 'user_id': user.id}
        except Exception as ex:
            raise CustomException(ex)

    @classmethod
    def register_user_with_emprendimiento(cls, user, emprendimiento_data, image_file):
        try:
            # Register user
            user_registration_result = cls.register_user(user)
            if not user_registration_result['success']:
                return user_registration_result

            # Use the Firestore-assigned user ID for the emprendimiento
            user_id = user_registration_result['user_id']
            emprendimiento_data['idEmprendedor'] = user_id

            # Register emprendimiento with image
            emprendimiento_service_url = "https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/guardarEmprendimiento"
            files = {'file': image_file}
            response = requests.post(emprendimiento_service_url, data=emprendimiento_data, files=files)
            if response.status_code == 200:
                return {'success': True, 'message': 'Usuario y emprendimiento registrados exitosamente'}
            else:
                return {'success': False, 'message': 'Error al registrar el emprendimiento'}
        except Exception as ex:
            raise CustomException(ex)