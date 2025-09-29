from typing import Optional, Dict
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

try:
    from xgboost import XGBRegressor
except ImportError:
    XGBRegressor = None

class CropYieldPredictor:
    def __init__(self):
        self.model = None
        self.le_crop = LabelEncoder()
        self.le_season = LabelEncoder()
        self.le_state = LabelEncoder()
        self.feature_cols = ['Crop', 'Season', 'State']
        self._load_data()
        
    def _load_data(self):
        """Load and preprocess the dataset"""
        try:
            self.df = pd.read_csv("../crop_yield.csv")
            self.df['Crop'] = self.le_crop.fit_transform(self.df['Crop'].astype(str))
            self.df['Season'] = self.le_season.fit_transform(self.df['Season'].astype(str))
            self.df['State'] = self.le_state.fit_transform(self.df['State'].astype(str))
        except Exception as e:
            print(f"Error loading yield data: {e}")
            self.df = None

    def train(self) -> bool:
        """Train the yield prediction model"""
        if self.df is None:
            return False
            
        try:
            X = self.df[self.feature_cols]
            y = self.df['Yield']
            
            if XGBRegressor is not None:
                self.model = XGBRegressor()
            else:
                self.model = RandomForestRegressor(n_estimators=100)
                
            self.model.fit(X, y)
            return True
        except Exception as e:
            print(f"Error training yield model: {e}")
            return False

    def predict(self, features: Dict) -> float:
        """Predict yield for given crop and conditions"""
        if self.model is None:
            return None
            
        try:
            # Prepare input features with encoding
            input_data = {}
            
            # Crop
            crop = features.get('crop')
            if crop is not None:
                crop_mapping = dict(zip(
                    [c.lower() for c in self.le_crop.classes_],
                    self.le_crop.transform(self.le_crop.classes_)
                ))
                input_data['Crop'] = crop_mapping.get(crop.lower(), self.df['Crop'].mode()[0])
            else:
                input_data['Crop'] = self.df['Crop'].mode()[0]
                
            # Season
            season = features.get('season')
            if season is not None:
                season_mapping = dict(zip(
                    [s.lower() for s in self.le_season.classes_],
                    self.le_season.transform(self.le_season.classes_)
                ))
                input_data['Season'] = season_mapping.get(season.lower(), self.df['Season'].mode()[0])
            else:
                input_data['Season'] = self.df['Season'].mode()[0]
                
            # State
            state = features.get('state')
            if state is not None:
                state_mapping = dict(zip(
                    [s.lower() for s in self.le_state.classes_],
                    self.le_state.transform(self.le_state.classes_)
                ))
                input_data['State'] = state_mapping.get(state.lower(), self.df['State'].mode()[0])
            else:
                input_data['State'] = self.df['State'].mode()[0]
            
            # Make prediction
            input_df = pd.DataFrame([input_data])
            pred = self.model.predict(input_df)
            return float(pred[0])
        except Exception as e:
            print(f"Error making yield prediction: {e}")
            return None

    def save_model(self, path: str = "models") -> bool:
        """Save model and encoders to disk"""
        try:
            os.makedirs(path, exist_ok=True)
            joblib.dump(self.model, os.path.join(path, "yield_predictor.joblib"))
            joblib.dump(self.le_crop, os.path.join(path, "yield_crop_encoder.joblib"))
            joblib.dump(self.le_season, os.path.join(path, "yield_season_encoder.joblib"))
            joblib.dump(self.le_state, os.path.join(path, "yield_state_encoder.joblib"))
            return True
        except Exception as e:
            print(f"Error saving yield model: {e}")
            return False

    def load_model(self, path: str = "models") -> bool:
        """Load model and encoders from disk"""
        try:
            self.model = joblib.load(os.path.join(path, "yield_predictor.joblib"))
            self.le_crop = joblib.load(os.path.join(path, "yield_crop_encoder.joblib"))
            self.le_season = joblib.load(os.path.join(path, "yield_season_encoder.joblib"))
            self.le_state = joblib.load(os.path.join(path, "yield_state_encoder.joblib"))
            return True
        except Exception as e:
            print(f"Error loading yield model: {e}")
            return False