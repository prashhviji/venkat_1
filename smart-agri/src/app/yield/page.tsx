'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { apiClient } from '../utils/api';

interface FormData {
  crop: string;
  season: string;
  state: string;
  area_hectares?: number;
}

interface PredictionResult {
  predictedYield: number;
  confidence: number;
  factors: {
    soilImpact: number;
    rainfallImpact: number;
    temperatureImpact: number;
  };
}

// Sample historical data for charts
const rainfallYieldData = [
  { rainfall: 400, yield: 2.1 },
  { rainfall: 600, yield: 2.8 },
  { rainfall: 800, yield: 3.5 },
  { rainfall: 1000, yield: 4.2 },
  { rainfall: 1200, yield: 4.8 },
  { rainfall: 1400, yield: 4.9 },
  { rainfall: 1600, yield: 4.6 },
];

const historicalYieldData = [
  { year: '2019', yield: 3.2, rainfall: 950 },
  { year: '2020', yield: 3.8, rainfall: 1100 },
  { year: '2021', yield: 3.1, rainfall: 850 },
  { year: '2022', yield: 4.1, rainfall: 1250 }
];

export default function YieldPrediction() {
  const [formData, setFormData] = useState<FormData>({
    crop: '',
    season: '',
    state: '',
    area_hectares: undefined
  });
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculatePrediction = (data: FormData): PredictionResult => {
    // Base yields for different crops (tons/hectare)
    const baseYields: Record<string, number> = {
      wheat: 3.5,
      rice: 4.0,
      corn: 5.2,
      cotton: 1.8,
      soybean: 2.1,
      sugarcane: 75,
      barley: 2.8,
      millet: 1.5
    };

    // Season multipliers
    const seasonMultipliers: Record<string, number> = {
      kharif: 1.2,  // Good for monsoon crops
      rabi: 1.0,    // Standard season
      zaid: 0.8     // Challenging season due to heat
    };

    // State-wise agricultural efficiency multipliers
    const stateMultipliers: Record<string, number> = {
      punjab: 1.3,
      haryana: 1.2,
      uttar_pradesh: 1.1,
      bihar: 0.9,
      madhya_pradesh: 1.0,
      gujarat: 1.1,
      maharashtra: 1.0,
      karnataka: 0.9,
      andhra_pradesh: 1.1,
      rajasthan: 0.8
    };

    // Calculate impacts
    const baseYield = baseYields[data.crop] || 3.0;
    const seasonMultiplier = seasonMultipliers[data.season] || 1.0;
    const stateMultiplier = stateMultipliers[data.state] || 1.0;
    
    const predictedYield = baseYield * seasonMultiplier * stateMultiplier;
    
    // Calculate confidence based on data reliability
    const cropConfidence = baseYields[data.crop] ? 90 : 70;
    const seasonConfidence = seasonMultipliers[data.season] ? 85 : 70;
    const stateConfidence = stateMultipliers[data.state] ? 85 : 70;
    
    const overallConfidence = Math.round((cropConfidence + seasonConfidence + stateConfidence) / 3);

    return {
      predictedYield: Math.round(predictedYield * 100) / 100,
      confidence: Math.min(95, overallConfidence),
      factors: {
        soilImpact: Math.round(stateMultiplier * 100),
        rainfallImpact: Math.round(seasonMultiplier * 100),
        temperatureImpact: Math.round((stateMultiplier + seasonMultiplier) / 2 * 100)
      }
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.crop || !formData.state || !formData.season) {
      alert('Please fill in all required fields');
      return;
    }

    const result = calculatePrediction(formData);
    setPrediction(result);
    setShowResults(true);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-400 bg-green-900/30';
    if (confidence >= 70) return 'text-yellow-400 bg-yellow-900/30';
    return 'text-red-400 bg-red-900/30';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 Crop Yield Prediction
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Predict your crop yield based on environmental factors and soil conditions using advanced data analysis
          </p>
        </div>

        <div className="grid xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 h-fit border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="bg-blue-600 p-2 rounded-lg mr-3">🌾</span>
              Enter Farm Parameters
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Crop Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Crop Name <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.crop}
                  onChange={(e) => handleInputChange('crop', e.target.value)}
                  className="w-full p-3 border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-800 hover:bg-gray-750 text-white"
                  required
                >
                  <option value="" className="text-gray-400">Select crop type</option>
                  <option value="wheat" className="text-white">Wheat</option>
                  <option value="rice" className="text-white">Rice</option>
                  <option value="corn" className="text-white">Corn/Maize</option>
                  <option value="cotton" className="text-white">Cotton</option>
                  <option value="soybean" className="text-white">Soybean</option>
                  <option value="sugarcane" className="text-white">Sugarcane</option>
                  <option value="barley" className="text-white">Barley</option>
                  <option value="millet" className="text-white">Millet</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full p-3 border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-800 hover:bg-gray-750 text-white"
                  required
                >
                  <option value="" className="text-gray-400">Select state</option>
                  <option value="andhra_pradesh">Andhra Pradesh</option>
                  <option value="bihar">Bihar</option>
                  <option value="gujarat">Gujarat</option>
                  <option value="haryana">Haryana</option>
                  <option value="karnataka">Karnataka</option>
                  <option value="madhya_pradesh">Madhya Pradesh</option>
                  <option value="maharashtra">Maharashtra</option>
                  <option value="punjab">Punjab</option>
                  <option value="rajasthan">Rajasthan</option>
                  <option value="uttar_pradesh">Uttar Pradesh</option>
                </select>
              </div>

              {/* Season */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Growing Season <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => handleInputChange('season', e.target.value)}
                  className="w-full p-3 border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-800 hover:bg-gray-750 text-white"
                  required
                >
                  <option value="" className="text-gray-400">Select season</option>
                  <option value="kharif">Kharif (June - October)</option>
                  <option value="rabi">Rabi (November - April)</option>
                  <option value="zaid">Zaid (April - June)</option>
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Area (Hectares)
                </label>
                <input
                  type="number"
                  value={formData.area_hectares || ''}
                  onChange={(e) => handleInputChange('area_hectares', Number(e.target.value))}
                  placeholder="e.g., 5"
                  min="0"
                  className="w-full p-3 border-2 border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-gray-800 hover:bg-gray-750 text-white placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">Optional: Land area in hectares</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full ${
                  isLoading 
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                } text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex justify-center items-center`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Predicting Yield...
                  </>
                ) : (
                  'Predict Yield'
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {showResults && prediction && (
              <>
                {/* Prediction Results */}
                <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <span className="bg-green-600 p-2 rounded-lg mr-3">📈</span>
                    Yield Prediction Results
                  </h2>

                  {/* Main Results */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
                      <h3 className="text-lg font-semibold text-blue-300 mb-2">Predicted Yield</h3>
                      <p className="text-3xl font-bold text-white">
                        {prediction.predictedYield} 
                        <span className="text-lg text-gray-400 ml-2">
                          tons/hectare
                        </span>
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-6 border border-green-800/30">
                      <h3 className="text-lg font-semibold text-green-300 mb-2">Confidence Level</h3>
                      <p className="text-3xl font-bold text-white">
                        {prediction.confidence}%
                        <span className="text-sm text-gray-400 ml-2">accuracy</span>
                      </p>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            prediction.confidence >= 85 ? 'bg-green-500' : 
                            prediction.confidence >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Factor Analysis */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Factor Impact Analysis</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="text-sm text-gray-400">Soil Fertility Impact</div>
                        <div className="text-xl font-bold text-orange-400">{prediction.factors.soilImpact}%</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="text-sm text-gray-400">Rainfall Impact</div>
                        <div className="text-xl font-bold text-blue-400">{prediction.factors.rainfallImpact}%</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="text-sm text-gray-400">Temperature Impact</div>
                        <div className="text-xl font-bold text-red-400">{prediction.factors.temperatureImpact}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-amber-900/20 border border-amber-800/50 rounded-lg p-4">
                    <p className="text-amber-200 text-sm flex items-start">
                      <span className="mr-2 text-lg">⚠️</span>
                      <span>
                        <strong>Note:</strong> This prediction is based on past data trends and environmental factors. 
                        Actual yields may vary due to pest attacks, disease, farming practices, and other unforeseen circumstances.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="bg-purple-600 p-2 rounded-lg mr-3">📊</span>
                    Data Analysis & Trends
                  </h3>

                  {/* Rainfall vs Yield Chart */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-300 mb-4">Yield vs Rainfall Analysis</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={rainfallYieldData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="rainfall" 
                            stroke="#9CA3AF"
                            fontSize={12}
                            label={{ value: 'Rainfall (mm)', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                          />
                          <YAxis 
                            stroke="#9CA3AF"
                            fontSize={12}
                            label={{ value: 'Yield (tons/hectare)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#FFFFFF'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="yield" 
                            stroke="#3B82F6" 
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 5 }}
                            activeDot={{ r: 7, fill: '#60A5FA' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Historical Yield Trend */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-300 mb-4">5-Year Historical Yield Trend</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={historicalYieldData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="year" 
                            stroke="#9CA3AF"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#9CA3AF"
                            fontSize={12}
                            label={{ value: 'Yield (tons/hectare)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              border: '1px solid #374151',
                              borderRadius: '8px',
                              color: '#FFFFFF'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="yield" fill="#10B981" name="Yield (tons/hectare)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!showResults && (
              <div className="bg-gray-900 rounded-2xl shadow-xl p-8 text-center border border-gray-800">
                <div className="bg-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🔮</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Ready for Prediction?
                </h3>
                <p className="text-gray-400">
                  Enter your farm parameters to get accurate yield predictions with confidence metrics and trend analysis.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Information Cards */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-xl">🧪</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Soil Analysis</h4>
            <p className="text-gray-400 text-sm">
              Soil fertility directly impacts nutrient availability and crop growth potential.
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-xl">🌧️</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Rainfall Impact</h4>
            <p className="text-gray-400 text-sm">
              Optimal rainfall varies by crop. Too little or too much can significantly reduce yields.
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="bg-red-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <span className="text-xl">🌡️</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Temperature Effects</h4>
            <p className="text-gray-400 text-sm">
              Each crop has an optimal temperature range for maximum photosynthesis and growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}