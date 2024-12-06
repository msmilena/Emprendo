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
        self.data = None
        self.utility_matrix = None
        self.transposed_matrix = None
        self.svd_model = None
        self.correlation_matrix = None
        self.user_correlation_matrix = None
        self.num_components = 20
        self.resultant_matrix = None
        self.n_features =None
    
    @classmethod
    def fetch_data(self):
        """Obtiene datos de BigQuery y preprocesa la información"""
        query = """
        
        SELECT e.*,
         e.localizacion.lat as latitud,
         e.localizacion.long as longitud,
               r.idUsuario,
               r.valoracion as rating,
               r.idValoracion
        FROM `emprendo-1c101.emprendofirestore.emprendimientos` e
        LEFT JOIN `emprendo-1c101.emprendofirestore.valoraciones` r
        ON e.idEmprendimiento = r.idEmprendimiento
        """
        # Set Up Google Cloud Credentials
        credentials_path = 'credenciales.json'
        credentials = service_account.Credentials.from_service_account_file(credentials_path)
        self.client = bigquery.Client(credentials=credentials, project=credentials.project_id)
        self.data = self.client.query(query).to_dataframe()
        print(self.data.head())  # Imprimir las primeras filas de los datos obtenidos
        self._preprocess_data(self)


    def _preprocess_data(self):
        """Preprocesa los datos y crea la matriz de utilidad"""
        if self.data is None:
            raise ValueError("No data available. Call fetch_data() first.")
        
        # Filtrar las columnas necesarias
        df_recsys = self.data[['idUsuario', 'idEmprendimiento', 'rating', 'nombreComercial']]
        print(df_recsys.shape)
        print(df_recsys.head())
        
        # Crear matriz de utilidad (usuarios x emprendimientos)
        self.utility_matrix = df_recsys.pivot_table(
            values='rating',
            index='idUsuario',
            columns='idEmprendimiento',
            fill_value=0
        )
        
        # Transponer la matriz de utilidad
        self.transposed_matrix = self.utility_matrix.T # transposed es X
        print(self.transposed_matrix.shape)
        print(self.transposed_matrix.head())

        # Aplicar SVD
        self._apply_svd(self)
        
        # Calcular la matriz de correlación de usuarios
        self._calculate_user_correlation(self)
        
    def _apply_svd(self):
        """Aplicar SVD a la matriz de utilidad"""
        self.n_features = self.transposed_matrix.shape[1]
        n_components = min(20, self.n_features)
        self.svd_model = TruncatedSVD(n_components=n_components, random_state=42)
        
        self.resultant_matrix = self.svd_model.fit_transform(self.transposed_matrix)
        self.correlation_matrix = np.corrcoef(self.resultant_matrix)
        
    def _calculate_user_correlation(self):
        """Calcular la matriz de correlación de usuarios"""
        self.user_correlation_matrix = np.corrcoef(self.utility_matrix)
    
    @classmethod
    def get_recommendations(self, id_emprendimiento, top_n=5):
        """Obtener recomendaciones basadas en un emprendimiento"""
        # Ensure data is fetched and processed
        #if self.data is None:
        self.fetch_data()
        
        if self.correlation_matrix is None:
            raise ValueError("Correlation matrix not computed.")
        
        ids_list = list(self.transposed_matrix.index)
        if id_emprendimiento not in ids_list:
            raise ValueError(f"ID Emprendimiento {id_emprendimiento} not found in data.")
        
        id_liked = ids_list.index(id_emprendimiento)
        corr_recom = self.correlation_matrix[id_liked]
        
        ids = (corr_recom > 0.10) & (corr_recom < 0.99)
        recommendations = [(corr_recom[i].round(2), ids_list[i]) for i in np.where(ids)[0]]
        
        return sorted(recommendations, key=lambda x: x[0], reverse=True)[:top_n]
    
    @classmethod
    def get_user_recommendations(self, user_id, top_n=5):
        """Obtener recomendaciones de usuarios basadas en un usuario"""
        # Ensure data is fetched and processed
        self.fetch_data()
        
        if self.user_correlation_matrix is None:
            raise ValueError("User correlation matrix not computed.")
        
        if user_id not in self.utility_matrix.index:
            raise ValueError(f"User ID {user_id} not found in data.")
        
        idx = self.utility_matrix.index.get_loc(user_id)
        corr_urecom = self.user_correlation_matrix[idx]
        uids = (corr_urecom > 0.10) & (corr_urecom < 0.99)
        user_recommendations = [(self.utility_matrix.index[i], corr_urecom[i].round(2)) for i in np.where(uids)[0]]
        
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
        if self.data is None:
            self.fetch_data()
        
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
        self.data['distance'] = self.data.apply(
            lambda row: haversine_distance(
                user_latitude, user_longitude, 
                row['latitud'], row['longitud']
            ), 
            axis=1
        )
        
        # Filtrar por distancia máxima
        nearby_ventures = self.data[self.data['distance'] <= max_distance_km]
        
        # Combinar recomendaciones por correlación y distancia
        recommendations = []
        
        for _, venture in nearby_ventures.iterrows():
            # Obtener correlación y detalles del emprendimiento
            venture_recommendations = self.get_recommendations(venture['idEmprendimiento'])
            
            for corr, rec_venture_id in venture_recommendations:
                rec_venture = self.data[self.data['idEmprendimiento'] == rec_venture_id].iloc[0]
                
                recommendations.append({
                    'venture_id': rec_venture_id,
                    'venture_name': rec_venture['nombreComercial'],
                    'correlation': corr,
                    'distance': rec_venture['distance']
                })
        
        # Ordenar por correlación y distancia
        recommendations.sort(key=lambda x: (x['correlation'], -x['distance']), reverse=True)
        
        return recommendations[:top_n]
    
recommendation_service = RecommendationService()
