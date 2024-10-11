import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

def get_firestore_client():
    # Verifica si la aplicación ya está inicializada
    if not firebase_admin._apps:
        # Obtiene la ruta del archivo de credenciales desde una variable de entorno
        #cred_path = r"C:\Users\Milena\Desktop\Proyectos\RepoEmprendo\Emprendo\emprendimiento-service\app\infrastructure\emprendo-1c101-firebase-adminsdk-xtepa-375cfe69f3.json"
        cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        print("holaa aqui",cred_path)
        if not cred_path:
            raise ValueError("La variable de entorno GOOGLE_APPLICATION_CREDENTIALS no está configurada")
        
        try:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        except Exception as e:
            raise Exception(f"Error al inicializar Firebase: {str(e)}")
    
    try:
        return firestore.client()
    except Exception as e:
        raise Exception(f"Error al obtener el cliente de Firestore: {str(e)}")

# Ejemplo de uso
# if __name__ == "__main__":
#     try:
#         db = get_firestore_client()
#         print("Conexión a Firestore establecida con éxito")
        
#         # Acción de prueba: Leer documentos de la colección 'users'
#         users_ref = db.collection('usuarios')
#         docs = users_ref.stream()
        
#         print("Documentos en la colección 'usuarios':")
#         for doc in docs:
#             print(f'{doc.id} => {doc.to_dict()}')
#     except Exception as e:
#         print(f"Error: {str(e)}")