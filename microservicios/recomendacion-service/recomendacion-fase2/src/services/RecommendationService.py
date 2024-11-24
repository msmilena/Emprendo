from google.cloud import bigquery
from google.oauth2 import service_account
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from functools import lru_cache
import pandas as pd
import os
from src.utils.errors.CustomException import CustomException
from typing import List, Optional, Dict
import numpy as np
from sklearn.metrics.pairwise import haversine_distances
from sklearn.decomposition import TruncatedSVD


class RecommendationService:
    def __init__(self):
        credentials_path = r"credenciales.json"
        credentials = service_account.Credentials.from_service_account_file(credentials_path)
        self.client = bigquery.Client(credentials=credentials, project=credentials.project_id)
        self.data = None
        self.utility_matrix = None
        self.svd_model = None
        self.correlation_matrix = None
        self.num_components = 7
        self.feature_vectors = None
        
    def fetch_data(self):
        """Obtiene datos de BigQuery y preprocesa la información"""
        query = """
         SELECT e.*, 
            ARRAY_TO_STRING(e.tags, ',') as tags_string,
               r.idUsuario,
               r.valoracion as rating
        FROM `emprendo-1c101.emprendo_produccion.prod_emprendimiento` e
        LEFT JOIN `emprendo-1c101.emprendo_produccion.prod_valoraciones` r
        ON e.idEmprendimeinto = r.idEmprendimiento
        """
        self.data = self.client.query(query).to_dataframe(bqstorage_client=None)
        print(self.data.head())  # Imprimir las primeras filas de los datos obtenidos
        self._preprocess_data()
        
    def _preprocess_data(self):
        """Preprocesa los datos y crea la matriz de utilidad"""
        if self.data is None:
            raise ValueError("No data available. Call fetch_data() first.")
            
        # Crear matriz de utilidad (usuarios x emprendimientos)
        self.utility_matrix = self.data.pivot_table(
            values='rating',
            index='idUsuario',
            columns='idEmprendimeinto',
            fill_value=0
        )
        
        # Crear vectores de características
        self._create_feature_vectors()
        
        # Aplicar SVD
        self._apply_svd()
        
    def _create_feature_vectors(self):
        """Crea vectores de características basados en categoria, subcategoria y tags"""
        # Obtener valores únicos para cada característica
        categorias = self.data['categoria'].unique()
        subcategorias = self.data['subcategoria'].unique()
        
        # Crear conjunto de tags únicos
        all_tags = set()
        for tags_str in self.data['tags_string'].dropna():
            all_tags.update([tag.strip() for tag in tags_str.split(',')])
        
        # Inicializar matriz de características
        n_features = len(categorias) + len(subcategorias) + len(all_tags)
        n_items = len(self.data)
        feature_matrix = np.zeros((n_items, n_features))
        
        # Mapear características a índices
        categoria_map = {cat: i for i, cat in enumerate(categorias)}
        subcategoria_map = {sub: i + len(categorias) for i, sub in enumerate(subcategorias)}
        tags_map = {tag: i + len(categorias) + len(subcategorias) 
                   for i, tag in enumerate(all_tags)}
        
        # Llenar matriz de características
        for i, row in self.data.iterrows():
            # Categoría (peso 2.0)
            feature_matrix[i, categoria_map[row['categoria']]] = 2.0
            
            # Subcategoría (peso 1.5)
            feature_matrix[i, subcategoria_map[row['subcategoria']]] = 1.5
            
            # Tags (peso 1.0)
            if pd.notna(row['tags_string']):
                for tag in row['tags_string'].split(','):
                    tag = tag.strip()
                    feature_matrix[i, tags_map[tag]] = 1.0
        
        self.feature_vectors = feature_matrix
        
    def _calculate_similarity_score(self, data: pd.DataFrame) -> np.ndarray:
        """Calcula score basado en similitud de contenido usando características categóricas"""
        if self.feature_vectors is None:
            raise ValueError("Feature vectors not created. Call _create_feature_vectors() first.")
            
        # Calcular similitud del coseno entre todos los emprendimientos
        similarities = cosine_similarity(self.feature_vectors)
        
        # Para cada emprendimiento, tomar la similitud promedio con los demás
        similarity_scores = similarities.mean(axis=1)
        
        # Normalizar scores
        return MinMaxScaler().fit_transform(similarity_scores.reshape(-1, 1)).flatten()
        
    def _apply_svd(self):
        """Aplica SVD a la matriz de utilidad"""
        try:
            if self.utility_matrix is None:
                raise ValueError("No hay matriz de utilidad")
            X = self.utility_matrix.T  # Transponer para tener emprendimientos en filas

            # Ajustar n_components al mínimo entre 3 y el número de características
            n_components = min(3, min(X.shape))
            print(f"Usando {n_components} componentes para SVD")
            
            svd_model = TruncatedSVD(n_components=n_components, random_state=42)
            resultant_matrix = svd_model.fit_transform(X)
            self.correlation_matrix = np.corrcoef(resultant_matrix)
            
            # Calcular matriz de correlación
            #self.correlation_matrix = np.corrcoef(resultant_matrix)
        except Exception as e:
            print("✗ Error aplicando SVD:", str(e))
            return None
        
    def get_similar_businesses(self, business_id: str, n: int = 5) -> List[Dict]:
        """Encuentra emprendimientos similares basados en SVD y características"""
        if business_id not in self.utility_matrix.columns:
            return []
            
        # Obtener índice del negocio
        business_idx = list(self.utility_matrix.columns).index(business_id)
        
        # Similitud basada en SVD
        svd_correlations = self.correlation_matrix[business_idx] if self.correlation_matrix is not None else np.zeros(len(self.data))
        
        feature_similarities = cosine_similarity(self.feature_vectors)[business_idx]
        
        # Combinar scores (50% SVD, 50% características)
        combined_scores = (svd_correlations + feature_similarities) / 2
        
        # Obtener los índices de los más similares (excluyendo el mismo negocio)
        similar_indices = np.argsort(combined_scores)[-n-1:-1][::-1]
        
        similar_businesses = []
        for idx in similar_indices:
            business_id = self.utility_matrix.columns[idx]
            business_data = self.data[self.data['idEmprendimeinto'] == business_id].iloc[0]
            
            similar_businesses.append({
                'idEmprendimeinto': business_id,
                'nombreComercial': business_data['nombreComercial'],
                'categoria': business_data['categoria'],
                'subcategoria': business_data['subcategoria'],
                'tags': business_data['tags_string'],
                'similarity_score': float(combined_scores[idx])
            })
            
        return similar_businesses
        
    def get_recommendations(self, 
                       lat: float, 
                       lon: float, 
                       categoria: Optional[str] = None,
                       limit: int = 5) -> List[dict]:
        """Obtiene recomendaciones combinando similitud, distancia y valoraciones"""
        if self.data is None:
            self.fetch_data()
            
        # Filtrar por categoría si se especifica
        filtered_data = self.data if categoria is None else self.data[self.data['categoria'] == categoria]
        
        # Verificar si hay datos después del filtrado
        if len(filtered_data) == 0:
            return []
            
        # Asegurar que el límite no exceda el número de registros disponibles
        limit = min(limit, len(filtered_data))
        
        try:
            # Calcular scores solo para los datos filtrados
            location_scores = self._calculate_location_score(lat, lon, filtered_data)
            rating_scores = self._calculate_rating_score(filtered_data)
            similarity_scores = self._calculate_similarity_score(filtered_data)
            
            # Verificar que todos los arrays tengan la misma longitud
            assert len(location_scores) == len(filtered_data)
            assert len(rating_scores) == len(filtered_data)
            assert len(similarity_scores) == len(filtered_data)
            
            # Combinar scores con pesos
            final_scores = (
                location_scores * 0.3 +    # 30% peso para ubicación
                rating_scores * 0.4 +      # 40% peso para valoraciones
                similarity_scores * 0.3     # 30% peso para similitud
            )
            
            # Obtener los mejores resultados
            top_indices = np.argsort(final_scores)[-limit:][::-1]
            
            # Crear lista de recomendaciones
            recommendations = []
            for idx in top_indices:
                if idx < len(filtered_data):  # Verificación adicional de índices
                    recommendations.append(
                        self._create_recommendation_dict(
                            filtered_data.iloc[idx],
                            location_scores[idx],
                            rating_scores[idx],
                            similarity_scores[idx],
                            final_scores[idx]
                        )
                    )
            
            return recommendations
        
        except Exception as e:
            # Log the error here if you have logging configured
            print(f"Error in get_recommendations: {str(e)}")
            raise ValueError(f"Error calculating recommendations: {str(e)}")
                
    def _calculate_location_score(self, lat: float, lon: float, data: pd.DataFrame) -> np.ndarray:
        """Calcula score basado en distancia usando Haversine"""
        coords1 = np.array([[np.radians(lat), np.radians(lon)]])
        coords2 = np.radians(data[['latitud', 'longitud']].values)
        distances = self._haversine_distance(coords1, coords2)[0]
        
        return 1 - MinMaxScaler().fit_transform(distances.reshape(-1, 1)).flatten()
        
    def _calculate_rating_score(self, data: pd.DataFrame) -> np.ndarray:
        """Calcula score basado en valoraciones y cantidad de reviews"""
        ratings = data['promedioValoracion'].values
        weights = data['totalesValoracion'].values
        
        scaler = MinMaxScaler()
        normalized_ratings = scaler.fit_transform(ratings.reshape(-1, 1)).flatten()
        normalized_weights = scaler.fit_transform(weights.reshape(-1, 1)).flatten()
        
        return (normalized_ratings * 0.7) + (normalized_weights * 0.3)
        
    def _create_recommendation_dict(self, 
                                  row: pd.Series, 
                                  location_score: float,
                                  rating_score: float,
                                  similarity_score: float,
                                  final_score: float) -> dict:
        """Crea diccionario con la información de la recomendación"""
        return {
            'idEmprendimeinto': row['idEmprendimeinto'],
            'nombreComercial': row['nombreComercial'],
            'categoria': row['categoria'],
            'subcategoria': row['subcategoria'],
            'tags': row['tags_string'],
            'valoracion': float(row['promedioValoracion']),
            'totalValoraciones': int(row['totalesValoracion']),
            'location_score': float(location_score),
            'rating_score': float(rating_score),
            'similarity_score': float(similarity_score),
            'total_score': float(final_score)
        }
        
    @staticmethod
    def _haversine_distance(coord1: np.ndarray, coord2: np.ndarray) -> np.ndarray:
        """Calcula distancia Haversine entre coordenadas"""
        R = 6371  # Radio de la Tierra en km
        
        dlat = coord2[:, 0] - coord1[:, 0]
        dlon = coord2[:, 1]
        
        a = np.sin(dlat/2)**2 + np.cos(coord1[:, 0]) * np.cos(coord2[:, 0]) * np.sin(dlon/2)**2
        c = 2 * np.arcsin(np.sqrt(a))
        
        return R * c
        
    def get_user_recommendations(self, 
                            user_id: str,
                            lat: float = 0,
                            lon: float = 0,
                            categoria: Optional[str] = None,
                            limit: int = 5) -> List[dict]:
        """
        Obtiene recomendaciones personalizadas para un usuario específico
        basadas en sus valoraciones previas y preferencias
        """
        if self.data is None:
            self.fetch_data()
            
        # Obtener valoraciones del usuario
        user_ratings = self.utility_matrix.loc[user_id] if user_id in self.utility_matrix.index else None
        
        if user_ratings is None or user_ratings.sum() == 0:
            # Si el usuario no tiene valoraciones, usar recomendaciones basadas en popularidad
            return self.get_popular_recommendations(categoria=categoria, limit=limit)
            
        # Filtrar por categoría si se especifica
        filtered_data = self.data if categoria is None else self.data[self.data['categoria'] == categoria]
        
        # Calcular scores
        content_scores = self._calculate_content_score(user_ratings)
        rating_scores = self._calculate_rating_score(filtered_data)
        
        # Si se proporcionan coordenadas, incluir score de ubicación
        if lat != 0 and lon != 0:
            location_scores = self._calculate_location_score(lat, lon, filtered_data)
            final_scores = (
                content_scores * 0.4 +     # 40% peso para similitud de contenido
                rating_scores * 0.3 +      # 30% peso para valoraciones
                location_scores * 0.3      # 30% peso para ubicación
            )
        else:
            final_scores = (
                content_scores * 0.6 +     # 60% peso para similitud de contenido
                rating_scores * 0.4        # 40% peso para valoraciones
            )
        
        # Obtener los mejores resultados
        top_indices = np.argsort(final_scores)[-limit:][::-1]
        
        return [self._create_recommendation_dict(filtered_data.iloc[idx],
                                            location_scores[idx] if lat != 0 and lon != 0 else 0,
                                            rating_scores[idx],
                                            content_scores[idx],
                                            final_scores[idx])
                for idx in top_indices]

    def get_popular_recommendations(self,
                                categoria: Optional[str] = None,
                                timeframe: str = 'month',
                                limit: int = 5) -> List[dict]:
        """
        Obtiene recomendaciones basadas en popularidad
        """
        if self.data is None:
            self.fetch_data()
            
        # Filtrar por categoría si se especifica
        filtered_data = self.data if categoria is None else self.data[self.data['categoria'] == categoria]
        
        # Calcular score de popularidad basado en valoraciones y vistas
        popularity_scores = self._calculate_popularity_score(filtered_data, timeframe)
        
        # Obtener los mejores resultados
        top_indices = np.argsort(popularity_scores)[-limit:][::-1]
        
        return [self._create_popular_recommendation_dict(filtered_data.iloc[idx],
                                                    popularity_scores[idx])
                for idx in top_indices]

    def _calculate_content_score(self, user_ratings: pd.Series) -> np.ndarray:
        """Calcula score basado en similitud de contenido con las preferencias del usuario"""
        # Obtener características promedio de los emprendimientos que el usuario ha valorado positivamente
        positive_ratings = user_ratings[user_ratings > 3.5]
        if len(positive_ratings) == 0:
            return np.zeros(len(self.data))
            
        user_profile = np.zeros(self.feature_vectors.shape[1])
        for business_id, rating in positive_ratings.items():
            business_idx = self.data[self.data['idEmprendimeinto'] == business_id].index[0]
            user_profile += self.feature_vectors[business_idx] * (rating / 5.0)
        
        user_profile /= len(positive_ratings)
        
        # Calcular similitud entre el perfil del usuario y todos los emprendimientos
        similarities = cosine_similarity(self.feature_vectors, user_profile.reshape(1, -1))
        
        return MinMaxScaler().fit_transform(similarities).flatten()

    def _calculate_popularity_score(self, data: pd.DataFrame, timeframe: str) -> np.ndarray:
        """Calcula score de popularidad basado en valoraciones y periodo de tiempo"""
        # Aquí podrías agregar lógica para filtrar por timeframe si tienes timestamps
        ratings = data['promedioValoracion'].values
        num_ratings = data['totalesValoracion'].values
        
        # Normalizar scores
        scaler = MinMaxScaler()
        normalized_ratings = scaler.fit_transform(ratings.reshape(-1, 1)).flatten()
        normalized_num_ratings = scaler.fit_transform(num_ratings.reshape(-1, 1)).flatten()
        
        # Combinar scores (70% promedio de valoraciones, 30% cantidad de valoraciones)
        return (normalized_ratings * 0.7) + (normalized_num_ratings * 0.3)

    def _create_popular_recommendation_dict(self,
                                        row: pd.Series,
                                        popularity_score: float) -> dict:
        """Crea diccionario con la información de recomendación popular"""
        return {
            'idEmprendimeinto': row['idEmprendimeinto'],
            'nombreComercial': row['nombreComercial'],
            'categoria': row['categoria'],
            'subcategoria': row['subcategoria'],
            'tags': row['tags_string'],
            'valoracion': float(row['promedioValoracion']),
            'totalValoraciones': int(row['totalesValoracion']),
            'popularity_score': float(popularity_score)
        }