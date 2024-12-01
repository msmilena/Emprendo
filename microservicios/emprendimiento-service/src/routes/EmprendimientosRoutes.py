from flask import Blueprint, request, jsonify
from google.cloud.firestore_v1.document import DocumentReference
from google.cloud.firestore_v1._helpers import GeoPoint
import datetime
import os
from werkzeug.utils import secure_filename
from firebase_admin import storage
# Errors
from src.utils.errors.CustomException import CustomException
# Services
from src.services.EmprendimientoService import EmprendimientoService

from src.services.models.Emprendimiento import Emprendimiento


main = Blueprint('emprendimiento_blueprint', __name__)

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
        return data.date().isoformat()
    else:
        return data

@main.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No file selected for uploading'}), 400
    if file:
        filename = secure_filename(file.filename)
        bucket = storage.bucket()  # El bucket se obtiene de la configuración inicial
        blob = bucket.blob(filename)
        blob.upload_from_file(file)
        blob.make_public()
        file_url = blob.public_url
        return jsonify({'success': True, 'file_url': file_url}), 200
    else:
        return jsonify({'success': False, 'message': 'File upload failed'}), 500


@main.route('/emprendimientoInfo', methods=['GET'])
def get_infoEmprendimiento():
    idEmprendimiento = request.args.get('idEmprendimiento')
    idEmprendedor = request.args.get('idEmprendedor')
    try:
        if idEmprendimiento:
            infoEmprendimiento = EmprendimientoService.get_infoEmprendimiento(idEmprendimiento)
        elif idEmprendedor:
            infoEmprendimiento = EmprendimientoService.get_infoEmprendimiento_by_emprendedor(idEmprendedor)
        else:
            return jsonify({'message': 'Falta el parámetro idEmprendimiento o idEmprendedor'}), 400

        if infoEmprendimiento is not None:
            serialized_info = serialize_emprendimiento(infoEmprendimiento)
            return jsonify({'success': True, "emprendimientoData": serialized_info})
        else:
            return jsonify({'message': 'Emprendimiento no encontrado'}), 404
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500


@main.route('/guardarEmprendimiento', methods=['POST'])
def post_guardarDatos():
    data = request.form.to_dict()
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No file selected for uploading'}), 400
    if file:
        idEmprendedor = data.get("idEmprendedor")
        filename, file_extension = os.path.splitext(file.filename)
        print(file_extension)  # Changed from file.name to file.filename
        full_filename = f'perfil/emprendimiento/perfil{idEmprendedor}{file_extension}'
        bucket = storage.bucket()  # El bucket se obtiene de la configuración inicial
        blob = bucket.blob(full_filename)
        blob.upload_from_file(file, content_type=file.content_type)  # Set content type
        blob.make_public()
        file_url = blob.public_url
        data['image_url'] = file_url  # Agregar la URL de la imagen a los datos del emprendimiento

    
    nombreComercial = data.get("nombreComercial")
    localizacion_latitud = float(data.get("localizacion_latitud"))
    localizacion_longitud = float(data.get("localizacion_longitud"))
    localizacion = GeoPoint(localizacion_latitud, localizacion_longitud)
    ruc = data.get("ruc")
    image_url = data.get("image_url")

    emprendimiento = Emprendimiento(idEmprendedor, nombreComercial, localizacion, ruc, image_url)
    save_result = EmprendimientoService.save_emprendimiento(emprendimiento)

    if save_result['success']:
        return jsonify({'success': True, 'message': 'Guardado de datos existoso'})
    else:
        return jsonify({'success': False, 'message': save_result['message']}), 400


@main.route('/emprendimientos', methods=['GET'])
def get_top_emprendimientos():
    try:
        limit = request.args.get('limit', default=10, type=int)  # Obtener el parámetro limit de la URL
        top_emprendimientos = EmprendimientoService.get_top_emprendimientos(limit)
        serialized_info = serialize_emprendimiento(top_emprendimientos)
        return jsonify({'success': True, 'emprendimientos': serialized_info})
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500
    
@main.route('/resumenDashboardEmprendimiento', methods=['GET'])
def get_emprendedor_summary():
    idEmprendedor = request.args.get('idEmprendedor')
    if not idEmprendedor:
        return jsonify({'message': 'Falta el parámetro idEmprendedor'}), 400
    try:
        resumen_info = EmprendimientoService.get_summary_info_dashboard_by_emprendedor(idEmprendedor)
        if resumen_info:
            return jsonify({'success': True, 'resumen': resumen_info}), 200
        else:
            return jsonify({'message': 'No se encontraron emprendimientos para el emprendedor dado'}), 404
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500

@main.route('/topProductosDashboard', methods=['GET'])
def get_top_productos():
    idEmprendimiento = request.args.get('idEmprendimiento')
    idEmprendedor = request.args.get('idEmprendedor')

    try:
        # Llamar al servicio que obtiene los productos top 3 favoritos
        productos = EmprendimientoService.get_top_productos_favoritos(idEmprendimiento=idEmprendimiento, idEmprendedor=idEmprendedor)

        if productos is not None:
            return jsonify({'success': True, 'productos': productos})
        else:
            return jsonify({'message': 'No se encontraron productos favoritos'}), 404

    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500
