from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="API de Recomendación de Emprendimientos")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Cargar datos y convertir la columna 'ruc' a string
df = pd.read_csv('Directorio_MiPyme2021_categorizado.csv')
df['ruc'] = df['ruc'].astype(str)  # Convertir RUC a string

# Modelos Pydantic
class Emprendimiento(BaseModel):
    ruc: str
    razon_social: str
    categoria: str
    subcategoria: Optional[str] = None  # Hacer subcategoria opcional
    departamento: str
    provincia: str
    distrito: str
    puntaje: float

    class Config:
        from_attributes = True  # Para permitir la conversión desde objetos

class RecommendationRequest(BaseModel):
    categorias: List[str]
    departamento: Optional[str] = None
    provincia: Optional[str] = None
    distrito: Optional[str] = None

# Endpoints
@app.get("/categorias", response_model=List[str])
async def get_categorias():
    """Obtener todas las categorías disponibles"""
    return sorted(df['categoria'].unique().tolist())

@app.get("/ubicaciones")
async def get_ubicaciones():
    """Obtener todas las ubicaciones disponibles"""
    return {
        "departamentos": sorted(df['departamento'].unique().tolist()),
        "provincias": sorted(df['provincia'].unique().tolist()),
        "distritos": sorted(df['distrito'].unique().tolist())
    }

@app.post("/recomendar", response_model=List[Emprendimiento])
async def recomendar_emprendimientos(
    request: RecommendationRequest,
    limit: int = Query(10, description="Número máximo de recomendaciones")
):
    """Recomendar emprendimientos basados en categorías y ubicación"""
    print(request)
    # Crear una copia del DataFrame para filtrar
    filtered_df = df.copy()
    
    # Filtrar por categorías
    filtered_df = filtered_df[filtered_df['categoria'].isin(request.categorias)]
    
    # Filtrar por ubicación si se proporciona
    if request.departamento:
        filtered_df = filtered_df[filtered_df['departamento'] == request.departamento.upper()]
    if request.provincia:
        filtered_df = filtered_df[filtered_df['provincia'] == request.provincia.upper()]
    # if request.distrito:
    #     filtered_df = filtered_df[filtered_df['distrito'] == request.distrito]
    
    # Ordenar por puntaje y obtener los top N
    top_emprendimientos = (
        filtered_df.sort_values('puntaje', ascending=False)
        .head(limit)
    )
    
    # Convertir a lista de diccionarios y luego a modelos Pydantic
    return [
        Emprendimiento(
            ruc=row['ruc'],
            razon_social=row['razon_social'],
            categoria=row['categoria'],
            subcategoria=row['subcategoria'],
            departamento=row['departamento'],
            provincia=row['provincia'],
            distrito=row['distrito'],
            puntaje=row['puntaje']
        )
        for _, row in top_emprendimientos.iterrows()
    ]


@app.get("/buscar", response_model=List[Emprendimiento])
async def buscar_emprendimientos(
    q: str = Query(..., min_length=3, description="Texto a buscar"),
    limit: int = Query(10, description="Número máximo de resultados")
):
    """Buscar emprendimientos por texto en razón social o descripción"""
    
    # Búsqueda simple en razón social
    results_df = df[df['razon_social'].str.contains(q, case=False, na=False)]
    
    # Convertir los resultados a una lista de diccionarios y luego a modelos Pydantic
    emprendimientos = []
    for _, row in results_df.head(limit).iterrows():
        try:
            emprendimiento = Emprendimiento(
                ruc=str(row['ruc']),  # Asegurarnos de que RUC sea string
                razon_social=row['razon_social'],
                categoria=row['categoria'],
                subcategoria=row['subcategoria'] if pd.notna(row['subcategoria']) else None,
                departamento=row['departamento'],
                provincia=row['provincia'],
                distrito=row['distrito'],
                puntaje=float(row['puntaje'])  # Asegurarnos de que puntaje sea float
            )
            emprendimientos.append(emprendimiento)
        except Exception as e:
            print(f"Error procesando emprendimiento: {row['ruc']}, Error: {e}")
            continue
    
    return emprendimientos

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)