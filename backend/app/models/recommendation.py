from typing import Tuple, Optional
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

try:
    from xgboost import XGBClassifier
except ImportError:
    XGBClassifier = None

class CropRecommender:
    def __init__(self):
        self.model = None
        self.le_soil = LabelEncoder()
        self.le_crop = LabelEncoder()
        self.feature_cols = ['Temperature', 'Humidity', 'Rainfall', 'PH', 'Nitrogen', 'Phosphorous', 'Potassium', 'Carbon', 'Soil']
        self.target_col = 'Crop'
        self._load_data()
        
    def _load_data(self):
        """Load and preprocess the dataset"""
        try:
            self.df = pd.read_csv("../crop_recommendation_dataset.csv")
            self.df['Soil'] = self.le_soil.fit_transform(self.df['Soil'].astype(str))
            self.df['Crop'] = self.le_crop.fit_transform(self.df['Crop'].astype(str))
        except Exception as e:
            print(f"Error loading recommendation data: {e}")
            self.df = None

    def train(self) -> bool:
        """Train the model and return success status"""
        if self.df is None:
            return False
            
        try:
            X = self.df[self.feature_cols]
            y = self.df[self.target_col]
            
            if XGBClassifier is not None:
                self.model = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss')
            else:
                self.model = RandomForestClassifier(n_estimators=100)
                
            self.model.fit(X, y)
            return True
        except Exception as e:
            print(f"Error training recommendation model: {e}")
            return False

    def predict(self, features: dict) -> Tuple[list, dict]:
        """Predict crops and return (predictions, feature_means)"""
        if self.model is None:
            return [], {}
            
        # Get feature means for missing values
        means = {col: float(self.df[col].mean()) for col in self.feature_cols if col != 'Soil'}
        
        # Fill missing features with means
        input_data = {}
        for col in self.feature_cols:
            if col == 'Soil':
                soil_val = features.get('soil')
                if soil_val is None:
                    soil_val = self.df['Soil'].mode()[0]
                else:
                    # Try case-insensitive match with original soil names
                    soil_mapping = dict(zip(
                        [s.lower() for s in self.le_soil.classes_],
                        self.le_soil.transform(self.le_soil.classes_)
                    ))
                    soil_val = soil_mapping.get(soil_val.lower(), self.df['Soil'].mode()[0])
                input_data[col] = soil_val
            else:
                input_data[col] = features.get(col.lower(), means[col])
        
        # Make prediction
        try:
            input_df = pd.DataFrame([input_data])
            preds = self.model.predict(input_df)
            crops = self.le_crop.inverse_transform(preds)
            return list(crops), means
        except Exception as e:
            print(f"Error making prediction: {e}")
            return [], means

    def save_model(self, path: str = "models") -> bool:
        """Save model and encoders to disk"""
        try:
            os.makedirs(path, exist_ok=True)
            joblib.dump(self.model, os.path.join(path, "crop_recommender.joblib"))
            joblib.dump(self.le_soil, os.path.join(path, "soil_encoder.joblib"))
            joblib.dump(self.le_crop, os.path.join(path, "crop_encoder.joblib"))
            return True
        except Exception as e:
            print(f"Error saving model: {e}")
            return False

    def load_model(self, path: str = "models") -> bool:
        """Load model and encoders from disk"""
        try:
            self.model = joblib.load(os.path.join(path, "crop_recommender.joblib"))
            self.le_soil = joblib.load(os.path.join(path, "soil_encoder.joblib"))
            self.le_crop = joblib.load(os.path.join(path, "crop_encoder.joblib"))
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

    def recommend(self, soil: str, temperature: Optional[float] = None, humidity: Optional[float] = None, **kwargs) -> Tuple[list, dict]:
        """API-compatible recommend method"""
        features = {'soil': soil, 'temperature': temperature, 'humidity': humidity}
        features.update(kwargs)
        return self.predict(features)

    def crop_rotation_recommendation(self, region: str, soil_type: str, start_season: str, crop1: str, crop2: str, crop3: str, number_of_seasons: int):
        """
        Recommend a crop rotation plan based on the given parameters.
        
        Parameters:
        - region (str): The region for the crop rotation.
        - soil_type (str): The type of soil in the region.
        - start_season (str): The season to start the crop rotation.
        - crop1 (str): The first crop in the rotation.
        - crop2 (str): The second crop in the rotation.
        - crop3 (str): The third crop in the rotation.
        - number_of_seasons (int): The number of seasons for the crop rotation.
        
        Returns:
        - dict: A dictionary containing the recommended crop rotation plan.
        """
        # This is a stub implementation. The actual implementation would involve
        # more complex logic and possibly machine learning models to predict the
        # best crop rotation plan.
        return {
            "region": region,
            "soil_type": soil_type,
            "start_season": start_season,
            "crop1": crop1,
            "crop2": crop2,
            "crop3": crop3,
            "number_of_seasons": number_of_seasons
        }

    def yield_prediction(self, crop: str, season: str, state: str, area_hectares: float):
        """
        Predict the yield of a crop based on the given parameters.
        
        Parameters:
        - crop (str): The crop for which to predict the yield.
        - season (str): The season in which the crop is grown.
        - state (str): The state in which the crop is grown.
        - area_hectares (float): The area in hectares for which to predict the yield.
        
        Returns:
        - float: The predicted yield in tonnes.
        """
        # This is a stub implementation. The actual implementation would involve
        # more complex logic and possibly machine learning models to predict the
        # crop yield.
        return area_hectares * 2.5  # Assume an average yield of 2.5 tonnes per hectare for stub