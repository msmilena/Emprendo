from flask import Blueprint, request, jsonify
from src.utils.errors.CustomException import CustomException
from src.services.UserService import UserService
from src.services.models.userRegister import UserRegister
import re

main = Blueprint('user_blueprint', __name__)
# Expresiones regulares para validar el formato del correo electr�nico y la contrase�a
EMAIL_REGEX = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
PASSWORD_REGEX = r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$'



@main.route('/info', methods=['GET'])
def get_infoUsuario():
    idUser = request.args.get('idUser')  # Obt�n el idUser de los par�metros de la URL
    try:
        print(idUser)
        if idUser:
            infoUser = UserService.get_infoUsuario(idUser)
            print(infoUser)
            if infoUser is not None:
                return jsonify({'success': True,"userData": infoUser})
            else:
                response = jsonify({'message': 'Unauthorized'})
                return response, 401
        else:
            return jsonify({'message': 'Missing idUser parameter'}), 400
    except CustomException:
        return jsonify({'message': "ERROR", 'success': False})


@main.route('/guardarDatos', methods=['POST'])
def post_guardarDatos():
    data=request.json
    print(data)
    nombre = data.get("nombre")
    email = data.get("email")
    password = data.get("password")
    tipo = data.get("tipo")

    # Validaci�n del formato del correo electr�nico
    if not re.match(EMAIL_REGEX, email):
        return jsonify({'success': False, 'message': 'Ingrese un Correo Electronico valido'}), 400

    # Validaci�n del formato de la contrase�a
    #if not re.match(PASSWORD_REGEX, password):
     #   return jsonify({'success': False, 'message': 'La contrase�a debe contener al menos 8 caracteres, incluyendo al menos una letra y un n�mero'}), 400

    _userR = UserRegister(nombre,email,password,tipo)
    save_result = UserService.save_user(_userR)

    if save_result['success']:
       return jsonify({'success': True, 'message': 'Guardado de datos existoso'})
    else:
       return jsonify({'success': False, 'message': save_result['message']}), 400
