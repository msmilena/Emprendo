from flask import Blueprint, request, jsonify
from google.cloud.firestore_v1.document import DocumentReference
from google.cloud.firestore_v1._helpers import GeoPoint
import datetime
# Errors
from src.utils.errors.CustomException import CustomException
# Services
from src.services.ActualizacionService import ActualizacionService

#from src.services.models.Emprendimiento import Emprendimiento


main = Blueprint('actualizacion_blueprint', __name__)

def serialize_emprendimiento(data):
    if isinstance(data, dict):
        return {k: serialize_emprendimiento(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [serialize_emprendimiento(item) for item in data]
    elif isinstance(data, DocumentReference):
        return data.id  # O cualquier otra representación que prefieras
    elif isinstance(data, GeoPoint):
        return {'latitude': data.latitude, 'longitude': data.longitude}
    elif isinstance(data, datetime.datetime):
        return data.isoformat()
    else:
        return data


@main.route('/updateUsuarios', methods=['POST'])
def update_bigquery():
    try:
        result = ActualizacionService.update_bigquery_from_firestore()
        return jsonify(result), 200
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500


@main.route('/updateEmprendimientos', methods=['POST'])
def update_emprendimientos():
    try:
        result = ActualizacionService.update_bigquery_from_emprendimientos()
        return jsonify(result), 200
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500


@main.route('/updateProductos', methods=['POST'])
def update_productos():
    try:
        result = ActualizacionService.update_bigquery_from_productos()
        return jsonify(result), 200
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500


@main.route('/updateFavoritos', methods=['POST'])
def update_favoritos():
    try:
        result = ActualizacionService.update_bigquery_from_favoritos()
        return jsonify(result), 200
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500


@main.route('/updateValoraciones', methods=['POST'])
def update_valoraciones():
    try:
        result = ActualizacionService.update_bigquery_from_valoraciones()
        return jsonify(result), 200
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500


@main.route('/updateAll', methods=['POST'])
def update_all():
    try:
        result_usuarios = ActualizacionService.update_bigquery_from_firestore()
        result_emprendimientos = ActualizacionService.update_bigquery_from_emprendimientos()
        result_productos = ActualizacionService.update_bigquery_from_productos()
        result_favoritos = ActualizacionService.update_bigquery_from_favoritos()
        result_valoraciones = ActualizacionService.update_bigquery_from_valoraciones()

        return jsonify({
            "usuarios": result_usuarios,
            "emprendimientos": result_emprendimientos,
            "productos": result_productos,
            "favoritos": result_favoritos,
            "valoraciones": result_valoraciones
        }), 200
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500


@main.route('/hola', methods=['GET'])
def hola_mundo():
    return jsonify({'message': 'Hola Mundo'}), 200