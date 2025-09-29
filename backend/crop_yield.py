import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns 
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBRegressor
df=pd.read_csv('/Users/lohitalakshmi/Documents/GitHub/AgroNome/notebooks/Crop_yield/crop_yield.csv')
le=LabelEncoder()
df['Crop']=le.fit_transform(df['Crop'])
df['Season']=le.fit_transform(df['Season'])
df['State']=le.fit_transform(df['State']) 
columns = df.columns
features = df[columns.drop(["Yield", "Crop_Year"])]
target = df["Yield"]

X_train, X_test, y_train, y_test = train_test_split(features, target, test_size=0.25, random_state=0)
xgb = XGBRegressor()
xgb.fit(X_train, y_train)
y_pred = xgb.predict(X_test)
print("R² Score:", r2_score(y_test, y_pred))