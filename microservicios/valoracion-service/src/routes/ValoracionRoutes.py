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


@main.route('/uptValoraciones', methods=['PUT'])
def upt_valoraciones():

    idUsuario = request.args.get('idUsuario') 

    data = request.json
    idEmprendimiento = data.get("idEmprendimiento")
    valor = data.get("valor")
    
    save_result = ValoracionService.upd_valoracion(idUsuario,idEmprendimiento,valor)

    if save_result['success']:
        return jsonify({'success': True, 'message': 'Actualización de datos existoso'})
    else:
        return jsonify({'success': False, 'message': save_result['message']}), 400



@main.route('/guardarFavorito', methods=['POST'])
def post_guardarFavorito():
    idUsuario = request.args.get('idUsuario')

    data = request.json
    idEmprendimiento = data.get('iEmprendimiento') 
    idProducto = data.get('idProducto') 

    save_result = ValoracionService.save_favorito(idUsuario, idEmprendimiento, idProducto)

    if save_result['success']:
        return jsonify({'success': True, 'message': 'Guardado de datos existoso'})
    else:
        return jsonify({'success': False, 'message': save_result['message']}), 400


@main.route('/eliminarFavorito', methods=['DELETE'])
def dlt_favoritos():

    idUsuario = request.args.get('idUsuario') 

    data = request.json
    idEmprendimiento = data.get("idEmprendimiento")
    idProducto = data.get("idProducto")
    
    save_result = ValoracionService.dlt_favorito(idUsuario,idEmprendimiento,idProducto)

    if save_result['success']:
        return jsonify({'success': True, 'message': 'Actualización de datos existoso'})
    else:
        return jsonify({'success': False, 'message': save_result['message']}), 400

@main.route('/getFavoritos/usuario', methods=['GET'])
def get_favorito():
    idUsuario = request.args.get('idUsuario')
    try:
        list_favoritos = ValoracionService.get_favoritos(idUsuario)
        return jsonify({'success': True, 'valoraciones': list_favoritos})
    except CustomException as e:
        return jsonify({'message': str(e), 'success': False}), 500
    

#emprendimientos    productos