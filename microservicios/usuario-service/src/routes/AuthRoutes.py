from flask import Blueprint, request, jsonify
from src.services.models.User import User
from src.services.models.userRegister import UserRegister
from src.services.AuthService import AuthService
from firebase_admin import auth as firebase_auth
import re
from datetime import datetime

main = Blueprint('auth_blueprint', __name__)

# Expresiones regulares para validar el formato del correo electrónico y la contraseña
EMAIL_REGEX = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
PASSWORD_REGEX = r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'

@main.route('/login', methods=['POST'])
def login():
    data = request.json
    print(data)
    token = data.get('token')
    print(token)
    try:
        # Verificar el token de Firebase
        decoded_token = firebase_auth.verify_id_token(token)
        uid = decoded_token['uid']
        email = decoded_token['email']

        # Obtener información adicional del usuario desde Firestore si es necesario
        user = AuthService.get_user_by_uid(uid)
        if user:
            return jsonify({'success': True, 'uid': uid, 'email': email, 'nombre': user.nombre, 'tipo': user.tipo})
        else:
            return jsonify({'success': False, 'message': 'Usuario no encontrado en la base de datos'}), 403
    except Exception as ex:
        return jsonify({'success': False, 'message': str(ex)}), 401

@main.route('/register', methods=['POST'])
def register():
    data = request.json
    print(data)
    id = data.get("id")
    nombre = data.get("nombre")
    email = data.get("email")
    password = data.get("password")
    tipo = data.get("tipo")
    tipoAuth = data.get("tipoAuth")

    # Validación del formato del correo electrónico
    if not re.match(EMAIL_REGEX, email):
        return jsonify({'success': False, 'message': 'Ingrese un Correo Electrónico válido'}), 400

    # Validación del formato de la contraseña solo si tipoAuth es 0
    if tipoAuth == 0 and not re.match(PASSWORD_REGEX, password):
        return jsonify({'success': False, 'message': 'La contraseña debe contener al menos 8 caracteres, incluyendo al menos una letra, un número y un carácter especial'}), 400

    # Validación del tipoAuth
    if tipoAuth not in [0, 1]:
        return jsonify({'success': False, 'message': 'Error en la validación del tipo de autenticación'}), 400

    _userR = UserRegister(id, nombre, email, password if tipoAuth == 0 else "", tipo, tipoAuth)

    register_result = AuthService.register_user(_userR)

    if register_result['success']:
        return jsonify({'success': True, 'message': 'Usuario registrado exitosamente'})
    else:
        return jsonify({'success': False, 'message': register_result['message']}), 400

@main.route('/check_email', methods=['GET'])
def check_email():
    email = request.args.get('email')
    if not email:
        return jsonify({'success': False, 'message': 'Email parameter is missing'}), 400

    check_result = AuthService.check_email_availability(email)
    if check_result['success']:
        return jsonify({'success': True, 'message': check_result['message']}), 200
    else:
        return jsonify({'success': False, 'message': check_result['message']}), 200