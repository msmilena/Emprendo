from flask import Blueprint, request, jsonify
from src.services.recommendationService import recommendation_service
import requests

main = Blueprint('recommendation_blueprint', __name__)

@main.route('/recommendations', methods=['GET'])
def get_recommendations():
    id_emprendimiento = request.args.get('id_emprendimiento')
    top_n = int(request.args.get('top_n', 5))
    
    try:
        recommendations = recommendation_service.get_recommendations(id_emprendimiento, top_n)
        # Call the external service with the IDs from the recommendations
        detailed_recommendations = []
        for recommendation in recommendations:
            score, id_emprendimiento = recommendation
            response = requests.get(f"https://emprendo-emprendimiento-service-26932749356.us-west1.run.app/emprendimiento/emprendimientoInfo?idEmprendimiento={id_emprendimiento}")
            if response.status_code == 200:
                detailed_recommendations.append(response.json())
            else:
                detailed_recommendations.append({
                    'error': f"Failed to fetch details for ID {id_emprendimiento}",
                    'status_code': response.status_code,
                    'response': response.text
                })
        return jsonify(detailed_recommendations)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@main.route('/user_recommendations', methods=['GET'])
def get_user_recommendations():
    user_id = request.args.get('user_id')
    top_n = int(request.args.get('top_n', 5))
    
    try:
        user_recommendations = recommendation_service.get_user_recommendations(user_id, top_n)
        return jsonify(user_recommendations)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

