from flask import Blueprint, request, jsonify
from src.services.recommendationService import recommendation_service
import requests
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from google.cloud import bigquery
from google.oauth2 import service_account

main = Blueprint('recommendation_blueprint', __name__)

# Set Up Google Cloud Credentials
credentials_path = 'credenciales.json'
credentials = service_account.Credentials.from_service_account_file(credentials_path)

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
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@main.route('/user_recommendations', methods=['GET'])
def get_user_recommendations():
    user_id = request.args.get('user_id')
    top_n = int(request.args.get('top_n', 5))
    
    try:
        user_recommendations = recommendation_service.get_user_recommendations(user_id, top_n)
        return jsonify(user_recommendations)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400

@main.route('/location_recommendations', methods=['GET'])
def get_location_recommendations():
    user_latitude = float(request.args.get('latitude'))
    user_longitude = float(request.args.get('longitude'))
    top_n = int(request.args.get('top_n', 5))
    max_distance_km = float(request.args.get('max_distance_km', 50))
    
    try:
        location_recommendations = recommendation_service.get_location_based_recommendations(
            user_latitude, user_longitude, top_n, max_distance_km
        )
        return jsonify(location_recommendations)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

@main.route('/category_recommendations', methods=['GET'])
def get_category_recommendations():
    category = request.args.get('category')
    top_n = int(request.args.get('top_n', 5))
    
    try:
        category_recommendations = recommendation_service.get_category_recommendations(category, top_n)
        return jsonify(category_recommendations)
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500


@main.route('/recomendaciones/<string:item_id>', methods=['GET'])
def hacer_recomendacion(item_id):
    n = int(request.args.get('n', 10))
    
    try:
        # IMPORTACIÓN DE DATOS DESDE BIGQUERY
        query = """
        SELECT e.*, e.localizacion.lat as latitud, e.localizacion.long as longitud,
               r.idUsuario, r.valoracion as rating, r.idValoracion
        FROM `emprendo-1c101.emprendofirestore.emprendimientos` e
        LEFT JOIN `emprendo-1c101.emprendofirestore.valoraciones` r
        ON e.idEmprendimiento = r.idEmprendimiento
        """
        client = bigquery.Client(credentials=credentials, project=credentials.project_id)
        data = client.query(query).to_dataframe()
        data['rating'] = pd.to_numeric(data['rating'], errors='coerce')
        data.dropna(subset=['idUsuario', 'rating'], inplace=True)
        
        # Filtrar las columnas necesarias
        df = data[['idEmprendimiento', 'idUsuario', 'rating']]
        df.rename(columns={'rating': 'review', 'idEmprendimiento': 'Id', 'idUsuario': 'User_id'}, inplace=True)
        df['review'] = df['review'].astype(int)  # Cambiar el tipo de la columna review

        # Creamos una matriz item-usuario solo con los datos necesarios
        iu = df.pivot_table(index='Id', columns='User_id', values='review', fill_value=0)

        # CÁLCULO DE LA SIMILITUD DE ITEMS
        similitud_items = cosine_similarity(iu.to_numpy())

        # CREACIÓN DE UNA MATRIZ DE RECOMENDACIONES
        matriz_recomendaciones = pd.DataFrame(similitud_items, index=iu.index, columns=iu.index)

        # Convertir el DataFrame de una matriz a un formato largo
        matriz_recomendaciones_long = matriz_recomendaciones.stack().rename_axis(['id1', 'id2']).reset_index(name='similitud')
        matriz_recomendaciones_long = matriz_recomendaciones_long[matriz_recomendaciones_long['id1'] != matriz_recomendaciones_long['id2']]
        matriz_recomendaciones_long = matriz_recomendaciones_long[matriz_recomendaciones_long['id1'] < matriz_recomendaciones_long['id2']]

        # Verifica que el item exista en la matriz
        if item_id in matriz_recomendaciones_long['id1'].unique():
            # Filtra donde 'id1' sea igual al item proporcionado
            recomendaciones = matriz_recomendaciones_long[matriz_recomendaciones_long['id1'] == item_id]
            
            # Ordena por similitud de manera descendente y selecciona los primeros n resultados
            recomendaciones = recomendaciones.sort_values(by='similitud', ascending=False).head(n)
            
            # Obtener detalles de los emprendimientos recomendados
            detailed_recommendations = []
            for _, row in recomendaciones.iterrows():
                id_emprendimiento = row['id2']
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
        else:
            return jsonify({'error': f"Error: El ID {item_id} no se encuentra en las columnas del DataFrame."}), 404
    except Exception as e:
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

