from src.database.db import get_connection
from src.utils.errors.CustomException import CustomException
from .models.User import User
from google.cloud.firestore_v1.base_query import FieldFilter


class AuthService():

    @classmethod
    def login_user(cls, user ):
        try:
            db=get_connection()
            user_ref = db.collection('usuarios').where(filter=FieldFilter("email", "==", user.email))
            print(user)
            user_data = user_ref.get()
            for doc in user_data:
            # Iterar sobre la lista de documentos
                print(doc.id)
                doc_data = doc.to_dict()
                print(f"Datos del usuario: {doc_data}")
                if doc_data and doc_data['password'] == user.password:
                    return User( doc.id, doc_data['nombres'],doc_data['email'], doc_data['password'], doc_data['tipo'])
            return None
        except Exception as ex:
            raise CustomException(ex)
        
    @classmethod
    def register_user(cls, user ):
        try:
            db=get_connection()

        # Buscar usuarios existentes con el mismo correo electrónico
            existing_email_ref = db.collection('usuarios').where(filter=FieldFilter("email", "==", user.email))
            existing_email = existing_email_ref.get()

        # Verificar si existen usuarios con el mismo correo electrónico
            if existing_email:
            # Devolver un mensaje indicando que el correo electrónico ya está en uso
                return {'success': False, 'message': 'El correo electrónico ya está en uso'}

            # Crear un nuevo documento de usuario en la base de datos
            usuario_nuevo = {
                "nombre": user.nombre,
                "email": user.email,
                "password": user.password,
                "tipo": user.tipo
            }
            db.collection('usuarios').add(usuario_nuevo)

            return {'success': True, 'message': 'Usuario registrado exitosamente'}
        except Exception as ex:
            raise CustomException(ex)
        
        