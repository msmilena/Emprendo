from flask import Blueprint, request, jsonify
from src.services.RecommendationService import RecommendationService
from src.utils.errors.CustomException import CustomException

main = Blueprint('recommendation_blueprint', __name__)

recommendation_service = None

@main.before_app_request
def initialize_service():
    """Inicializa el servicio de recomendaciones al inicio de la aplicación"""
    global recommendation_service
    recommendation_service = RecommendationService()
    recommendation_service.fetch_data()

@main.route('/recommendations/location', methods=['GET'])
def get_location_recommendations():
    """Obtiene recomendaciones basadas en ubicación y categoría opcional"""
    try:
        lat = float(request.args.get('lat'))
        lon = float(request.args.get('lon'))
        categoria = request.args.get('categoria')
        limit = int(request.args.get('limit', 5))
        
        recommendations = recommendation_service.get_recommendations(
            lat=lat,
            lon=lon,
            categoria=categoria,
            limit=limit
        )
        return jsonify({
            'success': True,
            'recommendations': recommendations
        })
    except Exception as ex:
        return jsonify({'message': str(ex), 'success': False}), 500

@main.route('/recommendations/similar/<string:business_id>', methods=['GET'])
def get_similar_businesses(business_id):
    """Obtiene emprendimientos similares a uno específico"""
    try:
        limit = int(request.args.get('limit', 5))
        similar_businesses = recommendation_service.get_similar_businesses(
            business_id=business_id,
            n=limit
        )
        return jsonify({
            'success': True,
            'similar_businesses': similar_businesses
        })
    except Exception as ex:
        return jsonify({'message': str(ex), 'success': False}), 500

@main.route('/recommendations/user/<string:user_id>', methods=['GET'])
def get_user_recommendations(user_id):
    """Obtiene recomendaciones personalizadas para un usuario específico"""
    try:
        limit = int(request.args.get('limit', 5))
        categoria = request.args.get('categoria')
        lat = float(request.args.get('lat', 0))  # Opcional
        lon = float(request.args.get('lon', 0))  # Opcional
        
        user_recommendations = recommendation_service.get_user_recommendations(
            user_id=user_id,
            lat=lat,
            lon=lon,
            categoria=categoria,
            limit=limit
        )
        return jsonify({
            'success': True,
            'recommendations': user_recommendations
        })
    except Exception as ex:
        return jsonify({'message': str(ex), 'success': False}), 500

@main.route('/recommendations/popular', methods=['GET'])
def get_popular_recommendations():
    """Obtiene recomendaciones basadas en popularidad por categoría"""
    try:
        categoria = request.args.get('categoria')
        limit = int(request.args.get('limit', 5))
        timeframe = request.args.get('timeframe', 'month')  # week, month, year
        
        # Necesitamos agregar este método al servicio
        popular_recommendations = recommendation_service.get_popular_recommendations(
            categoria=categoria,
            timeframe=timeframe,
            limit=limit
        )
        return jsonify({
            'success': True,
            'recommendations': popular_recommendations
        })
    except Exception as ex:
        return jsonify({'message': str(ex), 'success': False}), 500

@main.route('/recommendations/refresh', methods=['POST'])
def refresh_recommendation_data():
    """Actualiza los datos del servicio de recomendaciones"""
    try:
        global recommendation_service
        recommendation_service = RecommendationService()
        recommendation_service.fetch_data()
        return jsonify({
            'success': True,
            'message': 'Recommendation service data refreshed successfully'
        })
    except Exception as ex:
        return jsonify({'message': str(ex), 'success': False}), 500

# Ruta de health check
@main.route('/recommendations/health', methods=['GET'])
def health_check():
    """Verifica el estado del servicio de recomendaciones"""
    try:
        is_ready = recommendation_service is not None
        return jsonify({
            'success': True,
            'status': 'healthy' if is_ready else 'initializing',
            'message': 'Service is ready' if is_ready else 'Service is initializing'
        })
    except Exception as ex:
        return jsonify({
            'success': False,
            'status': 'unhealthy',
            'message': str(ex)
        }), 500