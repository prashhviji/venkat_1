import pandas as pd
import numpy as np
import itertools
import joblib
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
import os

os.environ['GROQ_API_KEY'] = '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'

yield_model = joblib.load('/Users/lohitalakshmi/Documents/GitHub/Annam AI/Agronome2/notebooks/crop_rotation_ml/models/yield_model.pkl')
carbon_model = joblib.load('/Users/lohitalakshmi/Documents/GitHub/Annam AI/Agronome2/notebooks/crop_rotation_ml/models/carbon_model.pkl')
encoder = joblib.load('/Users/lohitalakshmi/Documents/GitHub/Annam AI/Agronome2/notebooks/crop_rotation_ml/models/encoder.pkl')

print("✅ Models and encoder loaded!")

season_crops = {
    'Kharif': ['Maize', 'Rice', 'Soybean', 'Groundnut', 'Bottle Gourd', 'Cotton'],
    'Rabi': ['Wheat', 'Mustard', 'Barley', 'Peas', 'Chickpea'],
    'Zaid': ['Watermelon', 'Cucumber', 'Bottle Gourd', 'Okra']
}

soil_crops = {
    'Alluvial': ['Rice', 'Wheat', 'Maize', 'Mustard', 'Peas', 'Bottle Gourd'],
    'Black': ['Cotton', 'Soybean', 'Groundnut', 'Maize'],
    'Red': ['Groundnut', 'Soybean', 'Maize', 'Peas', 'Wheat'],
    'Laterite': ['Rice', 'Groundnut', 'Chickpea', 'Cotton'],
    'Arid Sandy': ['Barley', 'Mustard', 'Wheat', 'Cucumber', 'Watermelon']
}

def get_season_sequence(start_season, num_seasons):
    season_order = ['Kharif', 'Rabi', 'Zaid']
    start_index = season_order.index(start_season)
    return [season_order[(start_index + i) % 3] for i in range(num_seasons)]

def get_top_crop_sequences(region, soil_type, start_season, num_seasons, preferred_crops, weights, top_n=3):
    total_weight = sum(weights.values())
    weights = {k: v / total_weight for k, v in weights.items()}

    season_seq = get_season_sequence(start_season, num_seasons)

    all_valid_crops = set()
    for season in season_seq:
        crops_in_season = set(season_crops.get(season, []))
        crops_in_soil = set(soil_crops.get(soil_type, []))
        valid_crops = crops_in_season & crops_in_soil
        all_valid_crops.update(valid_crops)

    invalid_crops = set(preferred_crops) - all_valid_crops
    if invalid_crops:
        print(f"⚠️ Invalid crops: {', '.join(invalid_crops)} (ignored)\n")
    preferred_crops = list(set(preferred_crops) & all_valid_crops)

    season_wise_crops = []
    for season in season_seq:
        crops = set(season_crops[season]) & set(soil_crops[soil_type]) & set(preferred_crops)
        if not crops:
            raise ValueError(f"No valid crops for {season} in {soil_type} soil.")
        season_wise_crops.append(list(crops))

    crop_sequences = [seq for seq in itertools.product(*season_wise_crops) if len(set(seq)) == len(seq)]
    print(f"🔢 Valid Crop Sequences: {len(crop_sequences)}")

    input_rows = []
    for seq in crop_sequences:
        row = {
            'Region': region,
            'Soil_Type': soil_type,
            'Start_Season': start_season,
            'Number_of_Seasons': num_seasons,
            'Crop1': seq[0] if num_seasons >= 1 else 'None',
            'Crop2': seq[1] if num_seasons >= 2 else 'None',
            'Crop3': seq[2] if num_seasons == 3 else 'None'
        }
        input_rows.append(row)

    input_df = pd.DataFrame(input_rows)
    input_df['Crop3'] = input_df['Crop3'].fillna('None')

    categorical_cols = ['Region', 'Soil_Type', 'Start_Season', 'Crop1', 'Crop2', 'Crop3']
    encoded_input = encoder.transform(input_df[categorical_cols])
    encoded_df = pd.DataFrame(encoded_input, columns=encoder.get_feature_names_out(categorical_cols))
    final_input = pd.concat([encoded_df.reset_index(drop=True),
                             input_df[['Number_of_Seasons']].reset_index(drop=True)], axis=1)

    predicted_yield = yield_model.predict(final_input)
    predicted_carbon = carbon_model.predict(final_input)

    def normalize(arr):
        return (arr - arr.min()) / (arr.max() - arr.min() + 1e-8) if arr.max() != arr.min() else np.zeros_like(arr)

    yield_norm = normalize(predicted_yield)
    carbon_norm = normalize(predicted_carbon)
    scores = yield_norm * weights['yield'] + carbon_norm * weights['carbon']

    result_df = pd.DataFrame({
        'Crop Sequence': crop_sequences,
        'Yield (t/ha)': predicted_yield.round(2),
        'Carbon Sequestration (kg CO₂/ha)': predicted_carbon.round(2),
        'Score': scores.round(2)
    })

    return result_df.sort_values(by='Score', ascending=False).reset_index(drop=True).head(top_n)

llm = ChatGroq(
    temperature=0.3,
    model_name="llama-3.1-8b-instant"
)

prompt = PromptTemplate(
    input_variables=["region", "soil_type", "start_season", "num_seasons", "preferred_crops", "yield_weight", "carbon_weight", "ml_results"],
    template="""
    You are a distinguished agricultural scientist and expert agronomist specializing in sustainable crop rotation systems and climate-smart agriculture. Generate a comprehensive scientific report for crop rotation recommendations.

    ANALYSIS PARAMETERS:
    Region: {region}
    Soil Type: {soil_type}
    Starting Season: {start_season}
    Number of Seasons: {num_seasons}
    Preferred Crops: {preferred_crops}
    Yield Weight: {yield_weight}
    Carbon Sequestration Weight: {carbon_weight}

    ML PREDICTION RESULTS:
    {ml_results}

    Generate a detailed scientific report with the following sections:

    1. EXECUTIVE SUMMARY
    Brief overview of the analysis and top recommendation with key benefits and expected outcomes.

    2. REGIONAL & SOIL ANALYSIS
    Detailed analysis of {region} agricultural conditions, {soil_type} soil characteristics and crop suitability, seasonal patterns starting from {start_season} season.

    3. TOP CROP ROTATION RECOMMENDATIONS
    Provide 3 optimal crop sequences with:
    - Detailed crop sequence breakdown with scientific rationale
    - Expected yield analysis with regional benchmarks
    - Carbon sequestration potential and climate benefits
    - Soil health impact assessment
    - Nutrient cycling and fertilizer requirements
    - Pest and disease management advantages
    - Water requirement analysis
    - Market viability and economic considerations

    4. SCIENTIFIC JUSTIFICATION
    Agronomic principles supporting the recommendations, crop complementarity and synergistic effects, evidence-based benefits of the rotation patterns, comparison with traditional farming practices.

    5. IMPLEMENTATION GUIDELINES
    Season-wise cultivation calendar, specific agronomic practices for each crop, monitoring and evaluation metrics, risk mitigation strategies.

    6. SUSTAINABILITY IMPACT
    Long-term soil health benefits, carbon footprint reduction potential, biodiversity and ecosystem services, climate resilience factors.

    7. CONCLUSION & RECOMMENDATIONS
    Summary of key findings, action items for implementation, future considerations.

    Generate a comprehensive, scientifically rigorous report that serves as a decision-making tool for farmers, agricultural advisors, and policy makers.
    """
)

# region = 'Punjab'
# soil_type = 'Alluvial'
# start_season = 'Kharif'
# num_seasons = 3
# preferred_crops = ['Maize', 'Mustard', 'Wheat', 'Peas', 'Bottle Gourd', 'Cucumber', 'Watermelon']
# yield_weight = 0.5
# carbon_weight = 0.9

region = input("Enter region (default: Punjab): ") or 'Punjab'
soil_type = input("Enter soil type (default: Alluvial): ") or 'Alluvial'
start_season = input("Enter start season (default: Kharif): ") or 'Kharif'
num_seasons = int(input("Enter number of seasons (default: 3): ") or 3)
preferred_crops_input = input("Enter preferred crops separated by commas (default: Maize,Mustard,Wheat,Peas,Bottle Gourd,Cucumber,Watermelon): ")
preferred_crops = [crop.strip() for crop in preferred_crops_input.split(',')] if preferred_crops_input else ['Maize', 'Mustard', 'Wheat', 'Peas', 'Bottle Gourd', 'Cucumber', 'Watermelon']
yield_weight = float(input("Enter yield weight (default: 0.5): ") or 0.5)
carbon_weight = float(input("Enter carbon weight (default: 0.9): ") or 0.9)

weights = {
    'yield': yield_weight,
    'carbon': carbon_weight
}

top_recommendations = get_top_crop_sequences(region, soil_type, start_season, num_seasons, preferred_crops, weights)

pd.set_option('display.max_columns', None)
pd.set_option('display.width', 1000)

print("\n🌟 Top Recommended Crop Sequences:")
ml_results_str = ""
for index, row in top_recommendations.iterrows():
    result_line = f"Rank {index + 1}: {row['Crop Sequence']} - Yield: {row['Yield (t/ha)']} t/ha, Carbon: {row['Carbon Sequestration (kg CO₂/ha)']} kg CO₂/ha, Score: {row['Score']}"
    print(result_line)
    ml_results_str += result_line + "\n"
    print("-" * 100)

chain = prompt | llm

output = chain.invoke({
    "region": region,
    "soil_type": soil_type,
    "start_season": start_season,
    "num_seasons": num_seasons,
    "preferred_crops": ', '.join(preferred_crops),
    "yield_weight": yield_weight,
    "carbon_weight": carbon_weight,
    "ml_results": ml_results_str
})

print("\n" + "="*100)
print("COMPREHENSIVE AGRICULTURAL REPORT")
print("="*100)
print(output.content)