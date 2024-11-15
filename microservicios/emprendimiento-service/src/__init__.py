from flask import Flask, make_response, request
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
# Routes
from .routes import EmprendimientosRoutes

from flask_cors import CORS, cross_origin


app = Flask(__name__)

CORS(app, origins="*", supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE"], allow_headers=["Content-Type", "Authorization"])


cred = credentials.Certificate(r"credenciales.json")
firebase_admin.initialize_app(cred, {  'storageBucket': "emprendo-1c101.firebasestorage.app" })

# Definir la función handle_options
def handle_options():
    response = make_response()
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response

# Registrar la función handle_options para manejar solicitudes OPTIONS en todas las rutas
@app.before_request
def options():
    if request.method == 'OPTIONS':
        return handle_options()


def init_app(config):
    # Configuration
    app.config.from_object(config)
    app.config['WTF_CSRF_ENABLED'] = False
    # Blueprints
    app.register_blueprint(EmprendimientosRoutes.main, url_prefix='/emprendimiento')

    return app