# Database
from src.database.db import get_connection
# Errors
from src.utils.errors.CustomException import CustomException

class UserService:
    
    @classmethod
    def get_infoUsuario(cls, idUser):
        try:
            db = get_connection()
            user_ref = db.collection('usuarios').document(idUser)
            user_data = user_ref.get()
            if user_data.exists:
                doc_data = user_data.to_dict()
                print(doc_data)
                return doc_data
            return None
        except Exception as e:
            print(f"Error al obtener la información del usuario: {e}")
            return None