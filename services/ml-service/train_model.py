"""Train Ridge model — matches notebook.ipynb encoding exactly."""
import pickle
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge

ROOT = Path(__file__).resolve().parent.parent.parent
csv = ROOT / "data" / "train.csv"
if not csv.exists():
    csv = ROOT / "train.csv"

df = pd.read_csv(csv)
df = df.drop(columns=["sl_no"], errors="ignore")
df["salary"] = df["salary"].fillna(0)

df["ssc_b_Central"] = df["ssc_b"].map({"Central": 1, "Others": 0})
df["hsc_b_Central"] = df["hsc_b"].map({"Central": 1, "Others": 0})
df["workex"] = df["workex"].map({"No": 0, "Yes": 1})
df["status"] = df["status"].astype(str).map({"Placed": 1, "Not Placed": 0}).fillna(0).astype(int)
df["specialisation_fin"] = df["specialisation"].map({"Mkt&HR": 0, "Mkt&Fin": 1})

ohe = pd.get_dummies(df[["hsc_s", "degree_t"]], drop_first=True).astype(int)
df1 = pd.concat(
    [ohe, df.drop(["hsc_s", "degree_t", "ssc_b", "hsc_b", "specialisation"], axis=1)],
    axis=1,
)

y = df1["salary"]
X = df1.drop(["salary"], axis=1)
FEATURE_COLUMNS = list(X.columns)

print("Features:", FEATURE_COLUMNS)
print("Count:", len(FEATURE_COLUMNS))

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler()
X_train_s = scaler.fit_transform(X_train)
model = GridSearchCV(Ridge(), {"alpha": [0.1, 1, 10]}, cv=5).fit(X_train_s, y_train).best_estimator_

artifact = {
    "model": model,
    "scaler": scaler,
    "feature_columns": FEATURE_COLUMNS,
}

for dest in (Path(__file__).parent, ROOT):
    with open(dest / "model.pkl", "wb") as f:
        pickle.dump(model, f)
    with open(dest / "scaler.pkl", "wb") as f:
        pickle.dump(scaler, f)
    with open(dest / "feature_columns.pkl", "wb") as f:
        pickle.dump(FEATURE_COLUMNS, f)

print("Saved model.pkl, scaler.pkl, feature_columns.pkl")
print("Test predict:", model.predict(scaler.transform(X.iloc[:1]))[0])
