import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier

crop_reco_df = pd.read_csv(r"C:\Users\Asus\OneDrive\Documents\GitHub\Annam AI\Agronome\notebooks\Crop_recommendation\Crop_Recommendation_Dataset.csv")

crop_reco_df['Soil'] = LabelEncoder().fit_transform(crop_reco_df['Soil'])
crop_reco_df['Crop'] = LabelEncoder().fit_transform(crop_reco_df['Crop'])

features = crop_reco_df.iloc[:, :-1]
target = crop_reco_df.iloc[:, -1]

x_train, x_test, y_train, y_test = train_test_split(features, target, test_size=0.09, random_state=0)

model = XGBClassifier()
model.fit(x_train, y_train)

y_pred = model.predict(x_test)
print(accuracy_score(y_test, y_pred))