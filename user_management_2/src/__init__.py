from flask import Flask, make_response, request
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
# Routes
from .routes import AuthRoutes
from .routes import UserRoutes

from flask_cors import CORS, cross_origin


app = Flask(__name__)

CORS(app, origins="*", supports_credentials=True, methods=["GET", "POST", "PUT", "DELETE"], allow_headers=["Content-Type", "Authorization"])


cred = credentials.Certificate(r"/etc/secrets/loyalfilsm-firebase-adminsdk-c3vxb-294f23391f.json")
firebase_admin.initialize_app(cred)

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
    app.register_blueprint(AuthRoutes.main, url_prefix='/auth')
    app.register_blueprint(UserRoutes.main, url_prefix='/user')

    return app