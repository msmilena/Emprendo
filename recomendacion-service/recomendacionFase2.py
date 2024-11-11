from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from surprise import Dataset, Reader, SVD
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class VentureRecommender:
    def __init__(self, df):
        self.df = df
        self.preprocess_data()
        self.train_model()

    def preprocess_data(self):
        self.df['ruc'] = self.df['ruc'].astype(str)
        self.df['puntaje'] = pd.to_numeric(self.df['puntaje'], errors='coerce')
        self.df['puntaje'] = self.df['puntaje'].fillna(self.df['puntaje'].mean())
        self.df['busqueda'] = self.df['razon_social'] + ' ' + self.df['descripcion_ciiu3'] + ' ' + self.df['sector'] + ' ' + self.df['categoria'] + ' ' + self.df['subcategoria']
        self.df['busqueda'] = self.df['busqueda'].str.lower()
        self.df['usuario'] = self.df['departamento'] + '_' + self.df['provincia'] + '_' + self.df['distrito']

    def train_model(self):
        reader = Reader(rating_scale=(1, 5))
        data = Dataset.load_from_df(self.df[['usuario', 'ruc', 'puntaje']], reader)
        trainset = data.build_full_trainset()
        self.algo = SVD()
        self.algo.fit(trainset)

    def get_recommendations(self, palabra_busqueda, departamento, provincia, distrito, puntaje_minimo, n=5):
        usuario = f"{departamento}_{provincia}_{distrito}"
        palabra_busqueda = palabra_busqueda.lower()
        candidates = self.df[
            (self.df['busqueda'].str.contains(palabra_busqueda)) &
            (self.df['puntaje'] >= puntaje_minimo)
        ]
        
        if candidates.empty:
            return []
        
        predictions = []
        for _, empresa in candidates.iterrows():
            pred = self.algo.predict(usuario, empresa['ruc'])
            if pred.est >= puntaje_minimo:
                predictions.append((empresa['ruc'], pred.est))
        
        predictions.sort(key=lambda x: x[1], reverse=True)
        top_predictions = predictions[:n]
        
        recomendaciones_detalladas = []
        for ruc, puntaje_predicho in top_predictions:
            empresa = self.df[self.df['ruc'] == ruc].iloc[0]
            recomendaciones_detalladas.append({
                'ruc': empresa['ruc'],
                'razon_social': empresa['razon_social'],
                'descripcion_ciiu3': empresa['descripcion_ciiu3'],
                'sector': empresa['sector'],
                'categoria': empresa['categoria'],
                'subcategoria': empresa['subcategoria'],
                'puntaje_original': float(empresa['puntaje']),
                'puntaje_predicho': float(puntaje_predicho),
                'departamento': empresa['departamento'],
                'provincia': empresa['provincia'],
                'distrito': empresa['distrito']
            })
        
        return recomendaciones_detalladas

df = pd.read_csv('Directorio_MiPyme2021_categorizado.csv')
recommender = VentureRecommender(df)

class RecommendationRequest(BaseModel):
    palabra_busqueda: str
    departamento: str
    provincia: str
    distrito: str
    puntaje_minimo: float

@app.post("/recommend")
async def get_recommendations(request: RecommendationRequest):
    recommendations = recommender.get_recommendations(
        request.palabra_busqueda,
        request.departamento,
        request.provincia,
        request.distrito,
        request.puntaje_minimo
    )
    if not recommendations:
        raise HTTPException(status_code=404, detail="No se encontraron recomendaciones")
    return recommendations

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)