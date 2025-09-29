import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics import r2_score, mean_squared_error

# Load dataset
df = pd.read_csv("/Users/lohitalakshmi/Documents/GitHub/Annam AI/Agronome2/notebooks/crop_rotation_ml/data/crop_rotation_with_soil_score.csv")
print("✅ Dataset loaded!")

# Fill missing values in Crop3 with 'None' for consistency
df['Crop3'] = df['Crop3'].fillna('None')

# Target variables
targets = ['Yield_t_per_ha', 'Carbon_Sequestration_kg_CO2']

# Define features and labels
X = df.drop(columns=targets)
y = df[targets].copy()

# Categorical columns for encoding
categorical_cols = ['Region', 'Soil_Type', 'Start_Season', 'Crop1', 'Crop2', 'Crop3']

# Fit encoder on categorical columns and transform
encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)

encoded_cat = encoder.fit_transform(X[categorical_cols])
encoded_cat_df = pd.DataFrame(encoded_cat, columns=encoder.get_feature_names_out(categorical_cols))

# Combine with numeric features
X_final = pd.concat([encoded_cat_df.reset_index(drop=True), X[['Number_of_Seasons']].reset_index(drop=True)], axis=1)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(X_final, y, test_size=0.2, random_state=42)

# Prepare model save directory
os.makedirs("models", exist_ok=True)

# Train and save Yield Model
yield_model = RandomForestRegressor(n_estimators=100, random_state=42)
yield_model.fit(X_train, y_train['Yield_t_per_ha'])
joblib.dump(yield_model, "/Users/lohitalakshmi/Documents/GitHub/Annam AI/Agronome2/notebooks/crop_rotation_ml/models/yield_model.pkl")


# Train and save Carbon Sequestration Model
carbon_model = RandomForestRegressor(n_estimators=100, random_state=42)
carbon_model.fit(X_train, y_train['Carbon_Sequestration_kg_CO2'])
joblib.dump(carbon_model, "/Users/lohitalakshmi/Documents/GitHub/Annam AI/Agronome2/notebooks/crop_rotation_ml/models/carbon_model.pkl")

# Save encoder
joblib.dump(encoder, "/Users/lohitalakshmi/Documents/GitHub/Annam AI/Agronome2/notebooks/crop_rotation_ml/models/encoder.pkl")

# Evaluate (Optional)
def evaluate_model(name, model, X_test, y_test):
    pred = model.predict(X_test)
    r2 = r2_score(y_test, pred)
    mse = mean_squared_error(y_test, pred)
    print(f"📈 {name} R² Score: {r2:.4f}")
    print(f"📉 {name} MSE     : {mse:.4f}\n")

evaluate_model("Yield", yield_model, X_test, y_test['Yield_t_per_ha'])

evaluate_model("Carbon", carbon_model, X_test, y_test['Carbon_Sequestration_kg_CO2'])

print("✅ All models and encoder saved in 'models/' folder.")