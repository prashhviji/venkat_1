'use client';

import { useState } from 'react';
import { apiClient } from '../utils/api';

interface CropData {
  name: string;
  bestSeason: string;
  waterNeeds: string;
  averageYield: string;
  additionalTip: string;
}

interface FormData {
  soilType: string;
  location: string;
  season: string;
}

const cropDatabase: Record<string, CropData[]> = {
  'alluvial-kharif': [
    {
      name: 'Rice',
      bestSeason: 'Kharif',
      waterNeeds: 'High',
      averageYield: '4-5 tons/hectare',
      additionalTip: 'Rice thrives in alluvial soils with abundant water supply during monsoon season.'
    },
    {
      name: 'Cotton',
      bestSeason: 'Kharif',
      waterNeeds: 'Medium',
      averageYield: '1.5-2 tons/hectare',
      additionalTip: 'Cotton requires well-drained alluvial soil and moderate rainfall.'
    },
    {
      name: 'Sugarcane',
      bestSeason: 'Kharif',
      waterNeeds: 'High',
      averageYield: '70-80 tons/hectare',
      additionalTip: 'Sugarcane grows excellently in fertile alluvial soils with consistent irrigation.'
    }
  ],
  'alluvial-rabi': [
    {
      name: 'Wheat',
      bestSeason: 'Rabi',
      waterNeeds: 'Medium',
      averageYield: '3-4 tons/hectare',
      additionalTip: 'Wheat grows well in alluvial soils with moderate irrigation and cool winters.'
    },
    {
      name: 'Barley',
      bestSeason: 'Rabi',
      waterNeeds: 'Low',
      averageYield: '2.5-3 tons/hectare',
      additionalTip: 'Barley is drought-resistant and suitable for alluvial soils with limited water.'
    },
    {
      name: 'Mustard',
      bestSeason: 'Rabi',
      waterNeeds: 'Low',
      averageYield: '1-1.5 tons/hectare',
      additionalTip: 'Mustard is ideal for alluvial soils and requires minimal water during growing season.'
    }
  ],
  'black-kharif': [
    {
      name: 'Cotton',
      bestSeason: 'Kharif',
      waterNeeds: 'Medium',
      averageYield: '2-2.5 tons/hectare',
      additionalTip: 'Black cotton soil is perfect for cotton cultivation with its water retention properties.'
    },
    {
      name: 'Soybean',
      bestSeason: 'Kharif',
      waterNeeds: 'Medium',
      averageYield: '1.5-2 tons/hectare',
      additionalTip: 'Soybean grows well in black soil with good drainage and moderate water.'
    }
  ],
  'black-rabi': [
    {
      name: 'Wheat',
      bestSeason: 'Rabi',
      waterNeeds: 'Medium',
      averageYield: '3.5-4.5 tons/hectare',
      additionalTip: 'Black soil provides excellent nutrition for wheat with its high water retention.'
    },
    {
      name: 'Chickpea',
      bestSeason: 'Rabi',
      waterNeeds: 'Low',
      averageYield: '1.5-2 tons/hectare',
      additionalTip: 'Chickpea is well-suited for black soil and requires minimal irrigation.'
    }
  ],
  'red-kharif': [
    {
      name: 'Millet',
      bestSeason: 'Kharif',
      waterNeeds: 'Low',
      averageYield: '1-1.5 tons/hectare',
      additionalTip: 'Millet is drought-resistant and grows well in red soil with minimal water needs.'
    },
    {
      name: 'Groundnut',
      bestSeason: 'Kharif',
      waterNeeds: 'Medium',
      averageYield: '2-2.5 tons/hectare',
      additionalTip: 'Groundnut thrives in well-drained red soil with moderate rainfall.'
    }
  ],
  'red-rabi': [
    {
      name: 'Ragi',
      bestSeason: 'Rabi',
      waterNeeds: 'Low',
      averageYield: '1.5-2 tons/hectare',
      additionalTip: 'Ragi is highly nutritious and grows well in red soil with minimal water requirements.'
    }
  ]
};

export default function RecommendationPage() {
  const [formData, setFormData] = useState<FormData>({
    soilType: '',
    location: '',
    season: ''
  });
  const [recommendations, setRecommendations] = useState<CropData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.soilType || !formData.season) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getCropRecommendations({
        soil: formData.soilType,
        location: formData.location
      });

      if (response.crops && response.crops.length > 0) {
        // Try to enrich the API response with local data
        const enrichedCrops = response.crops.map(cropName => {
          // Try to find matching crop in our database
          let matchingCrop: CropData | undefined;
          Object.entries(cropDatabase).forEach(([key, crops]) => {
            const found = crops.find(c => c.name.toLowerCase() === cropName.toLowerCase());
            if (found) matchingCrop = found;
          });

          if (matchingCrop) {
            return matchingCrop;
          }

          // If no match found, create a basic entry
          return {
            name: cropName,
            bestSeason: formData.season.charAt(0).toUpperCase() + formData.season.slice(1),
            waterNeeds: 'Variable',
            averageYield: 'Varies by conditions',
            additionalTip: 'Contact your local agricultural extension for specific guidance.'
          };
        });

        setRecommendations(enrichedCrops);
      } else {
        // Fallback to local database if API returns no crops
        const key = `${formData.soilType}-${formData.season}`;
        const crops = cropDatabase[key] || [];
        setRecommendations(crops);
      }
    } catch (err) {
      console.error('Failed to get recommendations:', err);
      // Fallback to local database on error
      const key = `${formData.soilType}-${formData.season}`;
      const crops = cropDatabase[key] || [];
      setRecommendations(crops);
      setError('Failed to reach the recommendation service. Showing offline recommendations.');
    } finally {
      setIsLoading(false);
      setShowResults(true);
    }
  };

  const getWaterNeedsColor = (waterNeeds: string) => {
    switch (waterNeeds.toLowerCase()) {
      case 'high': return 'text-blue-600 bg-blue-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🌱 Crop Recommendation System
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Get personalized crop recommendations based on your soil type, location, and preferred growing season
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 h-fit border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="bg-green-600 p-2 rounded-lg mr-3">📋</span>
              Farm Details
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Soil Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Soil Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.soilType}
                  onChange={(e) => handleInputChange('soilType', e.target.value)}
                  className="w-full p-3 border-2 border-gray-700 rounded-lg focus:border-green-500 focus:outline-none transition-colors bg-gray-800 hover:bg-gray-750 text-white"
                  required
                >
                  <option value="" className="text-gray-400">Select soil type</option>
                  <option value="alluvial" className="text-white">Alluvial Soil</option>
                  <option value="black" className="text-white">Black Soil (Regur)</option>
                  <option value="red" className="text-white">Red Soil</option>
                  <option value="laterite" className="text-white">Laterite Soil</option>
                  <option value="desert" className="text-white">Desert Soil</option>
                  <option value="mountain" className="text-white">Mountain Soil</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter your city or state"
                  className="w-full p-3 border-2 border-gray-700 rounded-lg focus:border-green-500 focus:outline-none transition-colors bg-gray-800 hover:bg-gray-750 text-white placeholder-gray-400"
                />
              </div>

              {/* Season */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Growing Season <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => handleInputChange('season', e.target.value)}
                  className="w-full p-3 border-2 border-gray-700 rounded-lg focus:border-green-500 focus:outline-none transition-colors bg-gray-800 hover:bg-gray-750 text-white"
                  required
                >
                  <option value="" className="text-gray-400">Select season</option>
                  <option value="kharif" className="text-white">Kharif (June - October)</option>
                  <option value="rabi" className="text-white">Rabi (November - April)</option>
                  <option value="zaid" className="text-white">Zaid (April - June)</option>
                </select>
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
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                } text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex justify-center items-center`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Getting Recommendations...
                  </>
                ) : (
                  'Get Crop Recommendations'
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {showResults && (
              <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
                <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                  <span className="bg-blue-600 p-2 rounded-lg mr-3">🌾</span>
                  Recommended Crops for You
                </h2>

                {recommendations.length > 0 ? (
                  <div className="space-y-4">
                    {recommendations.map((crop, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:border-green-300 bg-gradient-to-r from-white to-green-50"
                      >
                        <div className="flex flex-wrap items-start justify-between mb-4">
                          <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            🌱 {crop.name}
                          </h3>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {crop.bestSeason}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center">
                            <span className="text-gray-600 font-medium mr-2">💧 Water Needs:</span>
                            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getWaterNeedsColor(crop.waterNeeds)}`}>
                              {crop.waterNeeds}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-gray-600 font-medium mr-2">📊 Average Yield:</span>
                            <span className="text-gray-800 font-semibold">{crop.averageYield}</span>
                          </div>
                        </div>

                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                          <p className="text-blue-800 text-sm">
                            <span className="font-semibold">💡 Tip: </span>
                            {crop.additionalTip}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">🔍</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      No Recommendations Available
                    </h3>
                    <p className="text-gray-500">
                      Sorry, we don't have crop recommendations for this combination of soil type and season yet.
                    </p>
                  </div>
                )}
              </div>
            )}

            {!showResults && (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🌾</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-500">
                  Fill out the form to get personalized crop recommendations based on your farming conditions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            🌍 Understanding Indian Agricultural Seasons
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌧️</span>
              </div>
              <h4 className="font-semibold text-green-800 mb-2">Kharif Season</h4>
              <p className="text-sm text-green-700">June - October</p>
              <p className="text-xs text-green-600 mt-2">Monsoon crops that require abundant water</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="bg-amber-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❄️</span>
              </div>
              <h4 className="font-semibold text-amber-800 mb-2">Rabi Season</h4>
              <p className="text-sm text-amber-700">November - April</p>
              <p className="text-xs text-amber-600 mt-2">Winter crops grown in cooler months</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">☀️</span>
              </div>
              <h4 className="font-semibold text-purple-800 mb-2">Zaid Season</h4>
              <p className="text-sm text-purple-700">April - June</p>
              <p className="text-xs text-purple-600 mt-2">Summer crops with irrigation support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}