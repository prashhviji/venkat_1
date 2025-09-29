from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from .models import CropRecommender, CropRotationPredictor, CropYieldPredictor

app = FastAPI(title="Crop-Wise API")

# Allow cross-origin requests from frontend (adjust origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize models (will be set in startup event)
recommender = None
rotation_predictor = None
yield_predictor = None
XGBClassifier = None
XGBRegressor = None

from sklearn.ensemble import RandomForestClassifier

# Globals populated at startup
reco_model = None
reco_label_encoder = None
reco_soil_encoder = None

app = FastAPI(title="Crop-Wise API")


class RecoRequest(BaseModel):
    temperature: Optional[float]
    humidity: Optional[float]
    rainfall: Optional[float]
    ph: Optional[float]
    nitrogen: Optional[float]
    phosphorous: Optional[float]
    potassium: Optional[float]
    carbon: Optional[float]
    soil: Optional[str]


class SimpleResponse(BaseModel):
    crops: List[str]


def load_reco_model():
    df = pd.read_csv(r"../crop_recommendation_dataset.csv")
    # Save encoders for reuse
    le_soil = LabelEncoder().fit(df['Soil'].astype(str))
    le_crop = LabelEncoder().fit(df['Crop'].astype(str))

    X = df.copy()
    X['Soil'] = le_soil.transform(X['Soil'].astype(str))
    y = le_crop.transform(df['Crop'].astype(str))

    if XGBClassifier is not None:
        model = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss')
    else:
        model = RandomForestClassifier(n_estimators=100)
    model.fit(X.drop(columns=['Crop']), y)
    return model, le_crop, le_soil


@app.on_event("startup")
def startup_event():
    global reco_model, reco_label_encoder, reco_soil_encoder
    try:
        reco_model, reco_label_encoder, reco_soil_encoder = load_reco_model()
        print("✅ Recommendation model loaded")
    except Exception as e:
        print("⚠️ Failed to load recommendation model:", e)

# Allow cross-origin requests from frontend (adjust origins in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/recommend", response_model=SimpleResponse)
def recommend(req: RecoRequest):
    # Build input vector from provided fields, falling back to dataset means where missing
    df = pd.read_csv(r"../crop_recommendation_dataset.csv")
    sample = {}
    numeric_cols = ['Temperature','Humidity','Rainfall','PH','Nitrogen','Phosphorous','Potassium','Carbon']
    for col in numeric_cols:
        val = getattr(req, col.lower(), None)
        if val is None:
            sample[col] = float(df[col].mean())
        else:
            sample[col] = float(val)
    # Soil: map provided soil string into the trained encoder labels
    soils_raw = pd.read_csv(r"../crop_recommendation_dataset.csv")['Soil'].astype(str)
    if req.soil is None:
        soil_val = soils_raw.mode()[0]
    else:
        # try case-insensitive exact match
        candidates = soils_raw.unique().tolist()
        match = None
        for s in candidates:
            if str(s).strip().lower() == str(req.soil).strip().lower():
                match = s
                break
        soil_val = match if match is not None else candidates[0]

    input_df = pd.DataFrame([sample])
    input_df['Soil'] = reco_soil_encoder.transform([soil_val])
    preds = reco_model.predict(input_df)
    crops = []
    try:
        crops = reco_label_encoder.inverse_transform(preds)
    except Exception:
        crops = [str(p) for p in preds]
    return {"crops": list(crops[:3])}


class RotationRequest(BaseModel):
    region: Optional[str]
    soil_type: Optional[str]
    start_season: Optional[str]
    crop1: Optional[str]
    crop2: Optional[str]
    crop3: Optional[str]
    number_of_seasons: Optional[int]


@app.post('/api/rotation')
def rotation_predict(req: RotationRequest):
    # Load rotation dataset and return mean yields for now as a simple baseline
    try:
        df = pd.read_csv(r"../crop_rotation_with_soil_score.csv")
    except Exception:
        return {"yield_t_per_ha": None, "carbon_kg_co2": None}
    # Simple heuristic: return dataset means
    return {
        "yield_t_per_ha": float(df['Yield_t_per_ha'].mean()) if 'Yield_t_per_ha' in df.columns else None,
        "carbon_kg_co2": float(df['Carbon_Sequestration_kg_CO2'].mean()) if 'Carbon_Sequestration_kg_CO2' in df.columns else None
    }


class YieldRequest(BaseModel):
    crop: Optional[str]
    season: Optional[str]
    state: Optional[str]
    area_hectares: Optional[float]


@app.post('/api/yield')
def yield_predict(req: YieldRequest):
    # Load crop yield CSV and return mean yield for requested crop or overall mean
    try:
        df = pd.read_csv(r"../crop_yield.csv")
    except Exception:
        return {"yield_t_per_ha": None}

    if req.crop and 'Crop' in df.columns:
        subset = df[df['Crop'].astype(str).str.lower() == str(req.crop).lower()]
        if len(subset) > 0 and 'Yield' in subset.columns:
            return {"yield_t_per_ha": float(subset['Yield'].mean())}

    if 'Yield' in df.columns:
        return {"yield_t_per_ha": float(df['Yield'].mean())}
    return {"yield_t_per_ha": None}
