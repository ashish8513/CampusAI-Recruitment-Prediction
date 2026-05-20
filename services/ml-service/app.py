"""ML Microservice — Campus Salary Prediction (Ridge + StandardScaler)."""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import numpy as np
import pandas as pd
import pickle
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LEGACY = ROOT.parent.parent

app = FastAPI(title="Campus ML Service", version="2.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = scaler = None
FEATURE_COLUMNS: list[str] = []


def load_artifacts():
    global model, scaler, FEATURE_COLUMNS
    for base in (ROOT, LEGACY):
        mp, sp, fp = base / "model.pkl", base / "scaler.pkl", base / "feature_columns.pkl"
        if mp.exists() and sp.exists():
            with open(mp, "rb") as f:
                model = pickle.load(f)
            with open(sp, "rb") as f:
                scaler = pickle.load(f)
            if fp.exists():
                with open(fp, "rb") as f:
                    FEATURE_COLUMNS = pickle.load(f)
            else:
                FEATURE_COLUMNS = _default_feature_columns()
            return
    raise FileNotFoundError(
        "model.pkl not found. Run: python services/ml-service/train_model.py"
    )


def _default_feature_columns():
    """Column order from notebook get_dummies(drop_first=True)."""
    return [
        "hsc_s_Commerce",
        "hsc_s_Science",
        "degree_t_Others",
        "degree_t_Sci&Tech",
        "gender",
        "ssc_p",
        "hsc_p",
        "degree_p",
        "workex",
        "etest_p",
        "mba_p",
        "status",
        "ssc_b_Central",
        "hsc_b_Central",
        "specialisation_fin",
    ]


class PredictRequest(BaseModel):
    gender: int = Field(ge=0, le=1)
    ssc_p: float
    ssc_b: int
    hsc_p: float
    hsc_b: int
    hsc_s: str
    degree_p: float
    degree_t: str
    workex: int
    etest_p: float
    specialisation: int
    mba_p: float
    status: int


def encode_features(data: PredictRequest) -> np.ndarray:
    """Build feature row matching notebook / training column order."""
    hsc_s = data.hsc_s
    degree_t = data.degree_t

    row = {
        "hsc_s_Commerce": 1 if hsc_s == "Commerce" else 0,
        "hsc_s_Science": 1 if hsc_s == "Science" else 0,
        "degree_t_Others": 1 if degree_t == "Others" else 0,
        "degree_t_Sci&Tech": 1 if degree_t == "Sci&Tech" else 0,
        "gender": data.gender,
        "ssc_p": data.ssc_p,
        "hsc_p": data.hsc_p,
        "degree_p": data.degree_p,
        "workex": data.workex,
        "etest_p": data.etest_p,
        "mba_p": data.mba_p,
        "status": data.status,
        "ssc_b_Central": data.ssc_b,
        "hsc_b_Central": data.hsc_b,
        "specialisation_fin": data.specialisation,
    }

    df = pd.DataFrame([row])
    cols = FEATURE_COLUMNS if FEATURE_COLUMNS else _default_feature_columns()
    for c in cols:
        if c not in df.columns:
            df[c] = 0
    df = df[cols]
    return df.values


@app.on_event("startup")
def startup():
    load_artifacts()


@app.get("/health")
def health():
    return {
        "service": "ml-service",
        "status": "ok",
        "model_loaded": model is not None,
        "n_features": len(FEATURE_COLUMNS) or (getattr(scaler, "n_features_in_", None) if scaler else None),
    }


@app.post("/predict")
def predict(body: PredictRequest):
    if model is None or scaler is None:
        raise HTTPException(503, "Model not loaded")
    try:
        features = encode_features(body)
        n_expected = getattr(scaler, "n_features_in_", len(FEATURE_COLUMNS))
        if features.shape[1] != n_expected:
            raise ValueError(
                f"Feature mismatch: got {features.shape[1]}, scaler expects {n_expected}. "
                "Re-run train_model.py"
            )
        scaled = scaler.transform(features)
        salary = round(float(model.predict(scaled)[0]), 2)
        if salary < 0:
            salary = 0.0
        placement = "Placed" if body.status == 1 else "Not Placed"
        return {
            "predicted_salary": salary,
            "placement_status": placement,
            "currency": "INR",
            "confidence_band": "±12% (validation RMSE baseline)",
        }
    except ValueError as e:
        raise HTTPException(400, str(e)) from e
    except Exception as e:
        raise HTTPException(500, f"Prediction error: {e}") from e
