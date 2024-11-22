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
                response = jsonify({'message': 'No se encontro informacion del usuario', 'success': False, 'idUser': idUser})
                return response, 401
        else:
            return jsonify({'message': 'Missing idUser parameter'}), 400
    except CustomException:
        return jsonify({'message': "ERROR", 'success': False})