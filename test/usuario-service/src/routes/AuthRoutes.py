from flask import Blueprint, request, jsonify
from src.services.models.User import User
from src.services.models.userRegister import UserRegister
from src.utils.Security import Security
from src.services.AuthService import AuthService
import re


main = Blueprint('auth_blueprint', __name__)

# Expresiones regulares para validar el formato del correo electrónico y la contraseña
EMAIL_REGEX = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
PASSWORD_REGEX = r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$'


@main.route('/', methods=['POST'])
def login():
    data = request.json  # Accede a los datos JSON en lugar de los datos del formulario
    email = data.get('email')  # Ajusta el campo a 'username'
    password = data.get('password')

    _user = User( None, None, email, password, None)
    authenticated_user = AuthService.login_user(_user)

    if (authenticated_user != None):
        encoded_token = Security.generate_token(authenticated_user)
        return jsonify({'success': True, 'token': encoded_token, 'nombre': authenticated_user.nombre, "email":authenticated_user.email, "tipo":authenticated_user.tipo})                                                                                                                                                                                                                    
    else:
        response = jsonify({'message': 'Unauthorized'})
        return response, 401

@main.route('/register', methods=['POST'])
def register():
    data=request.json
    nombre = data.get("nombre")
    email = data.get("email")
    password = data.get("password")
    tipo = data.get("tipo")

    # Validación del formato del correo electrónico
    if not re.match(EMAIL_REGEX, email):
        return jsonify({'success': False, 'message': 'Ingrese un Correo Electrónico válido'}), 400

    # Validación del formato de la contraseña
    if not re.match(PASSWORD_REGEX, password):
        return jsonify({'success': False, 'message': 'La contraseña debe contener al menos 8 caracteres, incluyendo al menos una letra y un número'}), 400


    _userR = UserRegister(nombre,email,password,tipo)

    register_result = AuthService.register_user(_userR)

    if register_result['success']:
            return jsonify({'success': True, 'message': 'Usuario registrado exitosamente'})
    else:
            return jsonify({'success': False, 'message': register_result['message']}), 400