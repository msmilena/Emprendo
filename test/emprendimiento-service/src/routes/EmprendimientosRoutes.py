from flask import Blueprint, request, jsonify

# Errors
from src.utils.errors.CustomException import CustomException
# Services
from src.services.EmprendimientoService import EmprendimientoService

from src.services.models.Emprendimiento import Emprendimiento


main = Blueprint('emprendimiento_blueprint', __name__)


@main.route('/')
def login_static():
        print("Hola mundo")
        return "Hola mundo"

@main.route('/emprendimientoInfo', methods=['GET'])
def get_infoEmprendimiento():
    idEmprendimiento = request.args.get('idEmprendimiento')  # Obtén el idEmprendimiento de los parámetros de la URL
    try:
        print(idEmprendimiento)
        if idEmprendimiento:
            infoEmprendimiento = EmprendimientoService.get_infoEmprendimiento(idEmprendimiento)
            print(infoEmprendimiento)
            if infoEmprendimiento is not None:
                return jsonify({'success': True, "emprendimientoData": infoEmprendimiento})
            else:
                response = jsonify({'message': 'Emprendimiento no encontrado'})
                return response, 404
        else:
            return jsonify({'message': 'Falta el parámetro idEmprendimiento'}), 400
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500


@main.route('/guardarEmprendimiento', methods=['POST'])
def post_guardarDatos():
    data = request.json
    print(data)
    idEmprendedor = data.get("idEmprendedor")
    nombreComercial = data.get("nombreComercial")
    localizacion = data.get("localizacion")
    ruc = data.get("ruc")

    emprendimiento = Emprendimiento(idEmprendedor, nombreComercial, localizacion, ruc)
    save_result = EmprendimientoService.save_emprendimiento(emprendimiento)

    if save_result['success']:
        return jsonify({'success': True, 'message': 'Guardado de datos existoso'})
    else:
        return jsonify({'success': False, 'message': save_result['message']}), 400

@main.route('/emprendimientos', methods=['GET'])
def get_top_emprendimientos():
    try:
        top_emprendimientos = EmprendimientoService.get_top_emprendimientos()
        return jsonify({'success': True, 'emprendimientos': top_emprendimientos})
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500