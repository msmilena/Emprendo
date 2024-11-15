from flask import Blueprint, request, jsonify
from src.utils.errors.CustomException import CustomException
from src.services.ValoracionService import ValoracionService
from src.services.models.Valoracion import Valoracion
import re

main = Blueprint('valoracion_blueprint', __name__)

@main.route('/guardarValoracion', methods=['POST'])
def post_guardarValoracion():
    idUsuario = request.args.get('idUsuario') 

    data = request.json
    idEmprendimiento = data.get("idEmprendimiento")
    valor = data.get("valor")

    valoracion = Valoracion(idUsuario, idEmprendimiento, valor)
    save_result = ValoracionService.save_valoracion(valoracion)

    if save_result['success']:
        return jsonify({'success': True, 'message': 'Guardado de datos existoso'})
    else:
        return jsonify({'success': False, 'message': save_result['message']}), 400


@main.route('/getValoraciones/usuario', methods=['GET'])
def get_valoraciones():

    idUsuario = request.args.get('idUsuario') 
    try:
        list_valoraciones = ValoracionService.get_valoraciones(idUsuario)
        return jsonify({'success': True, 'valoraciones': list_valoraciones})
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500


@main.route('/uptValoraciones/emprendimiento', methods=['UPDATE'])
def upt_valoraciones():

    idEmprendimiento = request.args.get('idEmprendimiento')
    data = request.json
    valor = data.get("valoracion")

    try:

        if idEmprendimiento and valor:

            upt_valoracion = ValoracionService.upt_valoracion(idEmprendimiento,valor)
            if upt_valoracion is not None:
                return jsonify({'success': True, "actualizacionValoracion": upt_valoracion})
        else:
            return jsonify({'message': 'Faltan parámetros'}), 400
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500