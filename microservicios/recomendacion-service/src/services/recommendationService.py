from google.cloud import bigquery
from google.oauth2 import service_account
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
import pandas as pd
import os
from typing import List, Optional, Dict
import numpy as np
from sklearn.metrics.pairwise import haversine_distances
from sklearn.decomposition import TruncatedSVD


# Set Up Google Cloud Credentials
credentials_path = 'credenciales.json'
credentials = service_account.Credentials.from_service_account_file(credentials_path)

# Define RecommendationService Class
class RecommendationService:
    def __init__(self):
        self.client = bigquery.Client(credentials=credentials, project=credentials.project_id)
    
    def fetch_data(self):
        """Obtiene datos de BigQuery y preprocesa la información"""
        query = """
        SELECT e.*, e.localizacion.lat as latitud, e.localizacion.long as longitud,
               r.idUsuario, r.valoracion as rating, r.idValoracion
        FROM `emprendo-1c101.emprendofirestore.emprendimientos` e
        LEFT JOIN `emprendo-1c101.emprendofirestore.valoraciones` r
        ON e.idEmprendimiento = r.idEmprendimiento
        """
        self.data = self.client.query(query).to_dataframe()
        self.data['rating'] = pd.to_numeric(self.data['rating'], errors='coerce')
        self.data.dropna(subset=['idUsuario', 'rating'], inplace=True)
        print(self.data.head())  # Imprimir las primeras filas de los datos obtenidos
        return self._preprocess_data(self.data)

    def _preprocess_data(self, data):
        """Preprocesa los datos y crea la matriz de utilidad"""
        if data is None:
            raise ValueError("No data available. Call fetch_data() first.")
        
        # Filtrar las columnas necesarias y eliminar filas con valores nulos en 'idUsuario' y 'rating'
        df_recsys = data[['idUsuario', 'idEmprendimiento', 'rating', 'nombreComercial']]
        df_recsys['idUsuario'] = df_recsys['idUsuario'].astype(str)
        df_recsys['idEmprendimiento'] = df_recsys['idEmprendimiento'].astype(str)
        print(df_recsys.shape)
        print(df_recsys.head())
        
        # Crear matriz de utilidad (usuarios x emprendimientos)
        utility_matrix = df_recsys.pivot_table(
            values='rating',
            index='idUsuario',
            columns='idEmprendimiento',
            fill_value=0
        )
        
        # Transponer la matriz de utilidad
        transposed_matrix = utility_matrix.T
        print(transposed_matrix.shape)
        print(transposed_matrix.head())

        # Aplicar SVD
        resultant_matrix, correlation_matrix = self._apply_svd(transposed_matrix)
        
        # Calcular la matriz de correlación de usuarios
        user_correlation_matrix = self._calculate_user_correlation(utility_matrix)
        
        return transposed_matrix, correlation_matrix, user_correlation_matrix

    def _apply_svd(self, transposed_matrix):
        """Aplicar SVD a la matriz de utilidad"""
        transposed_matrix = transposed_matrix.astype(float)  # Ensure the matrix is of type float
        n_features = transposed_matrix.shape[1]
        n_components = min(20, n_features)
        svd_model = TruncatedSVD(n_components=n_components, random_state=42)
        
        resultant_matrix = svd_model.fit_transform(transposed_matrix)
        correlation_matrix = np.corrcoef(resultant_matrix)
        
        return resultant_matrix, correlation_matrix

    def _calculate_user_correlation(self, utility_matrix):
        """Calcular la matriz de correlación de usuarios"""
        print("Utility matrix shape:", utility_matrix.shape)
        print("Utility matrix type:", type(utility_matrix))
        print("Utility matrix contents:\n", utility_matrix)
        utility_matrix_np = utility_matrix.to_numpy().astype(float)  # Convert to numpy array of type float
        print("Numpy utility matrix shape:", utility_matrix_np.shape)
        print("Numpy utility matrix type:", type(utility_matrix_np))
        print("Numpy utility matrix contents:\n", utility_matrix_np)
        if utility_matrix_np.ndim == 2 and utility_matrix_np.shape[0] > 1 and utility_matrix_np.shape[1] > 1:
            return np.corrcoef(utility_matrix_np)
        else:
            raise ValueError("Utility matrix is not in the expected format or has insufficient data.")
    
    def get_recommendations(self, id_emprendimiento, top_n=5):
        """Obtener recomendaciones basadas en un emprendimiento"""
        transposed_matrix, correlation_matrix, _ = self.fetch_data()
        
        ids_list = list(transposed_matrix.index)
        if str(id_emprendimiento) not in ids_list:
            raise ValueError(f"ID Emprendimiento {id_emprendimiento} not found in data.")
        
        id_liked = ids_list.index(str(id_emprendimiento))
        corr_recom = correlation_matrix[id_liked]
        
        ids = (corr_recom > 0.10) & (corr_recom < 0.99)
        recommendations = [(corr_recom[i].round(2), ids_list[i]) for i in np.where(ids)[0]]
        
        return sorted(recommendations, key=lambda x: x[0], reverse=True)[:top_n]

    def get_user_recommendations(self, user_id, top_n=5):
        """Obtener recomendaciones de usuarios basadas en un usuario"""
        _, _, user_correlation_matrix = self.fetch_data()
        
        utility_matrix = self.data.pivot_table(
            values='rating',
            index='idUsuario',
            columns='idEmprendimiento',
            fill_value=0
        )
        
        if str(user_id) not in utility_matrix.index:
            raise ValueError(f"User ID {user_id} not found in data.")
        
        idx = utility_matrix.index.get_loc(str(user_id))
        corr_urecom = user_correlation_matrix[idx]
        uids = (corr_urecom > 0.10) & (corr_urecom < 0.99)
        user_recommendations = [(utility_matrix.index[i], corr_urecom[i].round(2)) for i in np.where(uids)[0]]
        
        return sorted(user_recommendations, key=lambda x: x[1], reverse=True)[:top_n]
    
    def get_location_based_recommendations(self, user_latitude, user_longitude, top_n=5, max_distance_km=50):
        """
        Obtener recomendaciones basadas en ubicación y preferencias del usuario
        
        Args:
        - user_latitude: Latitud del usuario
        - user_longitude: Longitud del usuario
        - top_n: Número de recomendaciones a devolver
        - max_distance_km: Distancia máxima para considerar emprendimientos
        
        Returns:
        Lista de emprendimientos recomendados con su distancia
        """
        data = self.fetch_data()
        
        # Calcular distancias usando la fórmula de Haversine
        def haversine_distance(lat1, lon1, lat2, lon2):
            R = 6371  # Radio de la Tierra en kilómetros
            
            # Convertir grados a radianes
            lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
            
            # Diferencias
            dlat = lat2 - lat1
            dlon = lon2 - lon1
            
            # Fórmula de Haversine
            a = np.sin(dlat/2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2)**2
            c = 2 * np.arcsin(np.sqrt(a))
            distance = R * c
            
            return distance

        # Filtrar emprendimientos cercanos
        data['distance'] = data.apply(
            lambda row: haversine_distance(
                user_latitude, user_longitude, 
                row['latitud'], row['longitud']
            ), 
            axis=1
        )
        
        # Filtrar por distancia máxima
        nearby_ventures = data[data['distance'] <= max_distance_km]
        
        # Combinar recomendaciones por correlación y distancia
        recommendations = []
        
        for _, venture in nearby_ventures.iterrows():
            # Obtener correlación y detalles del emprendimiento
            venture_recommendations = self.get_recommendations(venture['idEmprendimiento'])
            
            for corr, rec_venture_id in venture_recommendations:
                rec_venture = data[data['idEmprendimiento'] == rec_venture_id].iloc[0]
                
                recommendations.append({
                    'venture_id': rec_venture_id,
                    'venture_name': rec_venture['nombreComercial'],
                    'correlation': corr,
                    'distance': rec_venture['distance']
                })
        
        # Ordenar por correlación y distancia
        recommendations.sort(key=lambda x: (x['correlation'], -x['distance']), reverse=True)
        
        return recommendations[:top_n]
    
    def get_category_recommendations(self, category, top_n=5):
        """
        Obtener recomendaciones basadas en la categoría
        
        Args:
        - category: Categoría del emprendimiento
        - top_n: Número de recomendaciones a devolver
        
        Returns:
        Lista de emprendimientos recomendados en la misma categoría
        """
        data = self.fetch_data()
        
        # Filtrar emprendimientos por categoría
        category_data = data[data['categoria'] == category]
        
        if category_data.empty:
            raise ValueError(f"No se encontraron emprendimientos en la categoría {category}")
        
        # Crear matriz de utilidad (usuarios x emprendimientos)
        utility_matrix = category_data.pivot_table(
            values='rating',
            index='idUsuario',
            columns='idEmprendimiento',
            fill_value=0
        )
        
        # Transponer la matriz de utilidad
        transposed_matrix = utility_matrix.T
        
        # Aplicar SVD
        resultant_matrix, correlation_matrix = self._apply_svd(transposed_matrix)
        
        # Obtener recomendaciones basadas en la correlación
        recommendations = []
        for idx, row in category_data.iterrows():
            id_emprendimiento = row['idEmprendimiento']
            if id_emprendimiento in transposed_matrix.index:
                id_liked = list(transposed_matrix.index).index(id_emprendimiento)
                corr_recom = correlation_matrix[id_liked]
                ids = (corr_recom > 0.10) & (corr_recom < 0.99)
                recs = [(corr_recom[i].round(2), list(transposed_matrix.index)[i]) for i in np.where(ids)[0]]
                recommendations.extend(recs)
        
        # Ordenar y devolver las recomendaciones
        recommendations = sorted(recommendations, key=lambda x: x[0], reverse=True)
        return recommendations[:top_n]

recommendation_service = RecommendationService()
