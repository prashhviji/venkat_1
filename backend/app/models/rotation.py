from typing import Tuple, Optional, Dict
import pandas as pd
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

class CropRotationPredictor:
    def __init__(self):
        self.yield_model = None
        self.carbon_model = None
        self.encoder = OneHotEncoder(handle_unknown='ignore', sparse_output=False)
        self.categorical_cols = ['Region', 'Soil_Type', 'Start_Season', 'Crop1', 'Crop2', 'Crop3']
        self.numeric_cols = ['Number_of_Seasons']
        self.target_cols = ['Yield_t_per_ha', 'Carbon_Sequestration_kg_CO2']
        self._load_data()
        
    def _load_data(self):
        """Load and preprocess the dataset"""
        try:
            self.df = pd.read_csv("../crop_rotation_with_soil_score.csv")
            # Fill missing values in Crop3 with 'None'
            self.df['Crop3'] = self.df['Crop3'].fillna('None')
            # Fit encoder on categorical columns
            self.encoder.fit(self.df[self.categorical_cols])
        except Exception as e:
            print(f"Error loading rotation data: {e}")
            self.df = None

    def train(self) -> bool:
        """Train both yield and carbon models"""
        if self.df is None:
            return False
            
        try:
            # Prepare features
            encoded_cat = self.encoder.transform(self.df[self.categorical_cols])
            encoded_cat_df = pd.DataFrame(
                encoded_cat, 
                columns=self.encoder.get_feature_names_out(self.categorical_cols)
            )
            X = pd.concat([
                encoded_cat_df.reset_index(drop=True),
                self.df[self.numeric_cols].reset_index(drop=True)
            ], axis=1)
            
            # Train yield model
            self.yield_model = RandomForestRegressor(n_estimators=100, random_state=42)
            self.yield_model.fit(X, self.df['Yield_t_per_ha'])
            
            # Train carbon model
            self.carbon_model = RandomForestRegressor(n_estimators=100, random_state=42)
            self.carbon_model.fit(X, self.df['Carbon_Sequestration_kg_CO2'])
            
            return True
        except Exception as e:
            print(f"Error training rotation models: {e}")
            return False

    def predict(self, features: Dict) -> Dict[str, float]:
        """Predict yield and carbon sequestration for given rotation pattern"""
        if self.yield_model is None or self.carbon_model is None:
            return {"yield_t_per_ha": None, "carbon_kg_co2": None}
            
        try:
            # Prepare input features
            input_data = {}
            for col in self.categorical_cols:
                input_data[col] = features.get(col.lower(), self.df[col].mode()[0])
            for col in self.numeric_cols:
                input_data[col] = features.get(col.lower(), self.df[col].mean())
                
            input_df = pd.DataFrame([input_data])
            
            # Transform categorical features
            encoded_input = self.encoder.transform(input_df[self.categorical_cols])
            encoded_input_df = pd.DataFrame(
                encoded_input,
                columns=self.encoder.get_feature_names_out(self.categorical_cols)
            )
            X = pd.concat([
                encoded_input_df,
                input_df[self.numeric_cols]
            ], axis=1)
            
            # Make predictions
            yield_pred = float(self.yield_model.predict(X)[0])
            carbon_pred = float(self.carbon_model.predict(X)[0])
            
            return {
                "yield_t_per_ha": yield_pred,
                "carbon_kg_co2": carbon_pred
            }
        except Exception as e:
            print(f"Error making rotation prediction: {e}")
            return {"yield_t_per_ha": None, "carbon_kg_co2": None}

    def save_models(self, path: str = "models") -> bool:
        """Save models and encoder to disk"""
        try:
            os.makedirs(path, exist_ok=True)
            joblib.dump(self.yield_model, os.path.join(path, "rotation_yield.joblib"))
            joblib.dump(self.carbon_model, os.path.join(path, "rotation_carbon.joblib"))
            joblib.dump(self.encoder, os.path.join(path, "rotation_encoder.joblib"))
            return True
        except Exception as e:
            print(f"Error saving rotation models: {e}")
            return False

    def load_models(self, path: str = "models") -> bool:
        """Load models and encoder from disk"""
        try:
            self.yield_model = joblib.load(os.path.join(path, "rotation_yield.joblib"))
            self.carbon_model = joblib.load(os.path.join(path, "rotation_carbon.joblib"))
            self.encoder = joblib.load(os.path.join(path, "rotation_encoder.joblib"))
            return True
        except Exception as e:
            print(f"Error loading rotation models: {e}")
            return False