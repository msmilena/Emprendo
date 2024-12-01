# Database
from src.database.db import get_connection
# Errors
from src.utils.errors.CustomException import CustomException
from firebase_admin import storage
from google.cloud import firestore
import os
class UserService:
    
    @classmethod
    def get_infoUsuario(cls, idUser):
        try:
            db = get_connection()
            user_ref = db.collection('usuarios').document(idUser)
            user_data = user_ref.get()
            if user_data.exists:
                doc_data = user_data.to_dict()
                # Serialize GeoPoint if present
                for key, value in doc_data.items():
                    if isinstance(value, firestore.GeoPoint):
                        doc_data[key] = {'latitude': value.latitude, 'longitude': value.longitude}
                print(doc_data)
                return doc_data
            return None
        except Exception as e:
            print(f"Error al obtener la información del usuario: {e}")
            return None

    @classmethod
    def update_infoUsuario(cls, idUser, user_data, file=None):
        print(file)
        try:
            db = get_connection()
            user_ref = db.collection('usuarios').document(idUser)
            if file:
                bucket = storage.bucket()
                filename, file_extension = os.path.splitext(file.filename)
                print(file_extension)  # Changed from file.name to file.filename
                full_filename = f'perfil/usuarios/perfil{idUser}{file_extension}'
                blob = bucket.blob(full_filename)
                blob.upload_from_file(file, content_type=file.content_type)  # Set content type
                blob.make_public()
                user_data['urlPerfil'] = blob.public_url
            user_ref.update(user_data)
            return {'success': True}
        except Exception as e:
            print(f"Error al actualizar la información del usuario: {e}")
            return {'success': False, 'message': str(e)}