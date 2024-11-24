# Notebook de Debugging: Sistema de Recomendaciones (Corregido)
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD

def create_test_data():
    """Crear dataset sintético para pruebas"""
    # Datos de emprendimientos
    businesses = pd.DataFrame({
        'idEmprendimeinto': ['E1', 'E2', 'E3', 'E4', 'E5'],
        'nombreComercial': ['Negocio 1', 'Negocio 2', 'Negocio 3', 'Negocio 4', 'Negocio 5'],
        'categoria': ['Food', 'Food', 'Tech', 'Fashion', 'Tech'],
        'subcategoria': ['Restaurant', 'Cafe', 'Software', 'Clothes', 'Hardware'],
        'tags_string': ['comida,local', 'cafe,postres', 'apps,web', 'ropa,moda', 'computadoras,tech'],
        'latitud': [-0.1, -0.2, -0.15, -0.18, -0.22],
        'longitud': [-78.1, -78.2, -78.15, -78.18, -78.22],
        'promedioValoracion': [4.5, 4.0, 3.8, 4.2, 4.7],
        'totalesValoracion': [100, 80, 50, 70, 90]
    })
    
    # Más ratings para tener más datos
    ratings = pd.DataFrame({
        'idUsuario': ['U1', 'U1', 'U2', 'U2', 'U3', 'U3', 'U4', 'U4', 'U5'],
        'idEmprendimiento': ['E1', 'E2', 'E3', 'E4', 'E5', 'E1', 'E2', 'E3', 'E4'],
        'valoracion': [5, 4, 3, 5, 4, 3, 5, 4, 5]
    })
    
    return businesses, ratings

def test_utility_matrix(businesses, ratings):
    """Probar la creación de la matriz de utilidad"""
    try:
        utility_matrix = ratings.pivot_table(
            values='valoracion',
            index='idUsuario',
            columns='idEmprendimiento',
            fill_value=0
        )
        print("✓ Matriz de utilidad creada exitosamente")
        print("\nForma de la matriz:", utility_matrix.shape)
        print("\nPrimeras filas:")
        print(utility_matrix.head())
        return utility_matrix
    except Exception as e:
        print("✗ Error creando matriz de utilidad:", str(e))
        return None

def test_feature_vectors(businesses):
    """Probar la creación de vectores de características"""
    try:
        # Obtener valores únicos
        categorias = businesses['categoria'].unique()
        subcategorias = businesses['subcategoria'].unique()
        
        # Crear conjunto de tags únicos
        all_tags = set()
        for tags_str in businesses['tags_string'].dropna():
            all_tags.update([tag.strip() for tag in tags_str.split(',')])
        
        # Crear mapeos
        categoria_map = {cat: i for i, cat in enumerate(categorias)}
        subcategoria_map = {sub: i + len(categorias) for i, sub in enumerate(subcategorias)}
        tags_map = {tag: i + len(categorias) + len(subcategorias) 
                   for i, tag in enumerate(all_tags)}
        
        # Inicializar matriz
        n_features = len(categorias) + len(subcategorias) + len(all_tags)
        n_items = len(businesses)
        feature_matrix = np.zeros((n_items, n_features))
        
        # Llenar matriz
        for i, row in businesses.iterrows():
            # Categoría (peso 2.0)
            feature_matrix[i, categoria_map[row['categoria']]] = 2.0
            
            # Subcategoría (peso 1.5)
            feature_matrix[i, subcategoria_map[row['subcategoria']]] = 1.5
            
            # Tags (peso 1.0)
            if pd.notna(row['tags_string']):
                for tag in row['tags_string'].split(','):
                    tag = tag.strip()
                    feature_matrix[i, tags_map[tag]] = 1.0
        
        print("✓ Vectores de características creados")
        print("\nDimensiones:", feature_matrix.shape)
        print("Número de características:", n_features)
        print("- Categorías:", len(categorias))
        print("- Subcategorías:", len(subcategorias))
        print("- Tags:", len(all_tags))
        
        # Verificar que la matriz no está vacía
        print("\nSuma de características:", feature_matrix.sum())
        print("Ejemplo de vector:", feature_matrix[0])
        
        return feature_matrix
    except Exception as e:
        print("✗ Error creando vectores de características:", str(e))
        return None

def test_similarity_calculation(feature_matrix):
    """Probar cálculo de similitud"""
    try:
        if feature_matrix is None:
            raise ValueError("No hay matriz de características")
        
        # Calcular similitud del coseno
        similarities = cosine_similarity(feature_matrix)
        
        # Calcular score promedio para cada item
        similarity_scores = similarities.mean(axis=1)
        
        # Normalizar scores
        normalized_scores = MinMaxScaler().fit_transform(
            similarity_scores.reshape(-1, 1)
        ).flatten()
        
        print("✓ Cálculo de similitud exitoso")
        print("\nForma matriz de similitud:", similarities.shape)
        print("Rango de scores:", normalized_scores.min(), "-", normalized_scores.max())
        print("\nMatriz de similitud:")
        print(pd.DataFrame(similarities).round(3))
        return normalized_scores
    except Exception as e:
        print("✗ Error calculando similitud:", str(e))
        return None

def test_svd(utility_matrix):
    """Probar aplicación de SVD"""
    try:
        if utility_matrix is None:
            raise ValueError("No hay matriz de utilidad")
        
        X = utility_matrix.T
        
        # Ajustar n_components al mínimo entre 3 y el número de características
        n_components = min(3, min(X.shape))
        print(f"Usando {n_components} componentes para SVD")
        
        svd_model = TruncatedSVD(n_components=n_components, random_state=42)
        resultant_matrix = svd_model.fit_transform(X)
        correlation_matrix = np.corrcoef(resultant_matrix)
        
        print("✓ SVD aplicado exitosamente")
        print("\nVarianza explicada:", svd_model.explained_variance_ratio_.sum())
        print("Forma matriz resultante:", resultant_matrix.shape)
        return correlation_matrix
    except Exception as e:
        print("✗ Error aplicando SVD:", str(e))
        return None

def test_recommendations(businesses, feature_matrix, correlation_matrix):
    """Probar generación de recomendaciones"""
    try:
        if feature_matrix is None or correlation_matrix is None:
            raise ValueError("Faltan matrices necesarias")
        
        # Probar para un negocio específico
        business_idx = 0
        
        # Similitud basada en SVD
        svd_correlations = correlation_matrix[business_idx] if correlation_matrix is not None else np.zeros(len(businesses))
        
        # Similitud basada en características
        feature_similarities = cosine_similarity(feature_matrix)[business_idx]
        
        # Combinar scores
        combined_scores = (svd_correlations + feature_similarities) / 2
        
        print("✓ Cálculo de recomendaciones exitoso")
        print("\nTop 3 negocios similares para", businesses.iloc[business_idx]['nombreComercial'])
        top_indices = np.argsort(combined_scores)[-4:-1][::-1]
        for idx in top_indices:
            print(f"- {businesses.iloc[idx]['nombreComercial']}: {combined_scores[idx]:.3f}")
            
    except Exception as e:
        print("✗ Error calculando recomendaciones:", str(e))

def run_all_tests():
    print("=== Iniciando tests del sistema de recomendaciones ===\n")
    
    # 1. Crear datos de prueba
    print("1. Creando datos de prueba...")
    businesses, ratings = create_test_data()
    print("✓ Datos de prueba creados\n")
    
    # 2. Probar matriz de utilidad
    print("2. Probando creación de matriz de utilidad...")
    utility_matrix = test_utility_matrix(businesses, ratings)
    print()
    
    # 3. Probar vectores de características
    print("3. Probando creación de vectores de características...")
    feature_matrix = test_feature_vectors(businesses)
    print()
    
    # 4. Probar cálculo de similitud
    print("4. Probando cálculo de similitud...")
    similarity_scores = test_similarity_calculation(feature_matrix)
    print()
    
    # 5. Probar SVD
    print("5. Probando aplicación de SVD...")
    correlation_matrix = test_svd(utility_matrix)
    print()
    
    # 6. Probar recomendaciones
    print("6. Probando generación de recomendaciones...")
    test_recommendations(businesses, feature_matrix, correlation_matrix)
    print()
    
    print("=== Tests completados ===")

if __name__ == "__main__":
    run_all_tests()