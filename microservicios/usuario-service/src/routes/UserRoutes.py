from flask import Blueprint, request, jsonify
from src.utils.errors.CustomException import CustomException
from src.services.UserService import UserService
from src.services.models.userRegister import UserRegister
import re
from google.cloud import firestore  # Import firestore for GeoPoint handling

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


@main.route('/update', methods=['POST'])
def update_infoUsuario():
    idUser = request.form.get('idUser')
    if not idUser:
        return jsonify({'message': 'Missing idUser parameter'}), 400

    user_data = request.form.to_dict()
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No file selected for uploading'}), 400
    
    if not user_data and not file:
        return jsonify({'message': 'No data provided for update'}), 400

    try:
        update_result = UserService.update_infoUsuario(idUser, user_data, file)
        if update_result['success']:
            return jsonify({'success': True, 'message': 'User information updated successfully'})
        else:
            return jsonify({'success': False, 'message': update_result['message']}), 400
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500