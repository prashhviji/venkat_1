'use client';

import { useState } from 'react';
import { apiClient } from '../utils/api';

interface FormData {
  crop1: string;
  crop2?: string;
  crop3?: string;
  soil_type: string;
  region?: string;
  start_season?: string;
  number_of_seasons?: number;
}

interface RotationPlan {
  sequence: Array<{
    year: number;
    crop: string;
    benefits: string;
    icon: string;
  }>;
  soilHealthNote: string;
  nitrogenBalance: string;
  pestReduction: string;
}

const rotationPlans: Record<string, RotationPlan> = {
  'wheat-alluvial': {
    sequence: [
      { year: 1, crop: 'Chickpea', benefits: 'Nitrogen fixation', icon: '🟤' },
      { year: 2, crop: 'Wheat', benefits: 'High yield with nitrogen', icon: '🌾' },
      { year: 3, crop: 'Maize', benefits: 'Deep root system', icon: '🌽' },
      { year: 4, crop: 'Mustard', benefits: 'Pest control & oil', icon: '🌻' }
    ],
    soilHealthNote: 'This rotation improves nitrogen balance through legumes and reduces pest risk with diverse crops.',
    nitrogenBalance: 'Excellent - Chickpea adds 40-60 kg N/ha',
    pestReduction: 'High - Diverse crops break pest cycles'
  },
  'rice-alluvial': {
    sequence: [
      { year: 1, crop: 'Wheat', benefits: 'Winter crop utilization', icon: '🌾' },
      { year: 2, crop: 'Chickpea', benefits: 'Nitrogen fixation', icon: '🟤' },
      { year: 3, crop: 'Rice', benefits: 'Water utilization', icon: '🌾' },
      { year: 4, crop: 'Mustard', benefits: 'Soil conditioning', icon: '🌻' }
    ],
    soilHealthNote: 'Rice-wheat system with legume break improves soil structure and nutrient cycling.',
    nitrogenBalance: 'Good - Balanced N cycling',
    pestReduction: 'Medium - Regular crop diversity'
  },
  'cotton-black': {
    sequence: [
      { year: 1, crop: 'Soybean', benefits: 'Nitrogen enrichment', icon: '🫘' },
      { year: 2, crop: 'Cotton', benefits: 'Cash crop income', icon: '🤍' },
      { year: 3, crop: 'Wheat', benefits: 'Cereal nutrition', icon: '🌾' },
      { year: 4, crop: 'Chickpea', benefits: 'Nitrogen addition', icon: '🟤' }
    ],
    soilHealthNote: 'This plan maintains black soil fertility while maximizing cotton productivity and soil health.',
    nitrogenBalance: 'Very Good - Multiple legumes',
    pestReduction: 'High - Cotton pest cycle broken'
  },
  'default': {
    sequence: [
      { year: 1, crop: 'Wheat', benefits: 'Stable cereal base', icon: '🌾' },
      { year: 2, crop: 'Chickpea', benefits: 'Nitrogen fixation', icon: '🟤' },
      { year: 3, crop: 'Maize', benefits: 'High biomass', icon: '🌽' },
      { year: 4, crop: 'Mustard', benefits: 'Pest deterrent', icon: '🌻' }
    ],
    soilHealthNote: 'This balanced rotation improves nitrogen balance and reduces pest risk through crop diversity.',
    nitrogenBalance: 'Good - Legume inclusion',
    pestReduction: 'Medium-High - Crop diversity'
  }
};

export default function RotationPage() {
  const [formData, setFormData] = useState<FormData>({
    crop1: '',
    crop2: '',
    crop3: '',
    soil_type: '',
    region: '',
    start_season: '',
    number_of_seasons: 4
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [rotationPlan, setRotationPlan] = useState<RotationPlan | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.crop1 || !formData.soil_type) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.getRotationPredictions(formData);
      
      // Convert API response to rotation plan format
      const sequence = [
        { 
          year: 1, 
          crop: formData.crop1,
          benefits: 'Current crop',
          icon: '🌾'
        },
        // Add predicted crops here based on response
      ];

      if (formData.crop2) {
        sequence.push({
          year: 2,
          crop: formData.crop2,
          benefits: 'Planned crop',
          icon: '🌱'
        });
      }

      if (formData.crop3) {
        sequence.push({
          year: 3,
          crop: formData.crop3,
          benefits: 'Planned crop',
          icon: '🌿'
        });
      }

      const plan: RotationPlan = {
        sequence,
        soilHealthNote: `Predicted yield: ${response.yield_t_per_ha?.toFixed(2)} tons/ha`,
        nitrogenBalance: 'Based on model prediction',
        pestReduction: `Carbon impact: ${response.carbon_kg_co2?.toFixed(2)} kg CO2/ha`
      };

      setRotationPlan(plan);
      setShowResults(true);
    } catch (err) {
      console.error('Failed to get rotation prediction:', err);
      setError('Failed to get rotation prediction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const CircularRotation = ({ sequence }: { sequence: RotationPlan['sequence'] }) => {
    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    
    return (
      <div className="flex justify-center">
        <svg width="300" height="300" className="transform rotate-0">
          {/* Circle background */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke="#374151"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          
          {/* Crop positions */}
          {sequence.map((item, index) => {
            const angle = (index * 90 - 90) * (Math.PI / 180); // Start from top
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            return (
              <g key={index}>
                {/* Connection lines */}
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={x}
                  y2={y}
                  stroke="#6B7280"
                  strokeWidth="1"
                  opacity="0.5"
                />
                
                {/* Crop circles */}
                <circle
                  cx={x}
                  cy={y}
                  r="30"
                  fill="#1F2937"
                  stroke="#3B82F6"
                  strokeWidth="2"
                />
                
                {/* Year text */}
                <text
                  x={x}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-300 font-semibold"
                >
                  Year {item.year}
                </text>
                
                {/* Crop icon */}
                <text
                  x={x}
                  y={y + 8}
                  textAnchor="middle"
                  className="text-lg"
                >
                  {item.icon}
                </text>
              </g>
            );
          })}
          
          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="25"
            fill="#059669"
            stroke="#10B981"
            strokeWidth="2"
          />
          <text
            x={centerX}
            y={centerY + 5}
            textAnchor="middle"
            className="text-sm fill-white font-bold"
          >
            🔄
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔄 Crop Rotation Planner
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Plan sustainable crop rotations to improve soil health, reduce pests, and maximize long-term productivity
          </p>
        </div>

        <div className="grid xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 h-fit border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="bg-purple-600 p-2 rounded-lg mr-3">📝</span>
              Current Farm Status
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Last Crop Grown */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Crop Grown <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.crop1}
                  onChange={(e) => handleInputChange('crop1', e.target.value)}
                  className="w-full p-3 border-2 border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none transition-colors bg-gray-800 hover:bg-gray-750 text-white"
                  required
                >
                  <option value="" className="text-gray-400">Select previous crop</option>
                  <option value="wheat" className="text-white">Wheat</option>
                  <option value="rice" className="text-white">Rice</option>
                  <option value="cotton" className="text-white">Cotton</option>
                  <option value="maize" className="text-white">Maize/Corn</option>
                  <option value="soybean" className="text-white">Soybean</option>
                  <option value="chickpea" className="text-white">Chickpea</option>
                  <option value="mustard" className="text-white">Mustard</option>
                  <option value="sugarcane" className="text-white">Sugarcane</option>
                </select>
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Soil Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.soil_type}
                  onChange={(e) => handleInputChange('soil_type', e.target.value)}
                  className="w-full p-3 border-2 border-gray-700 rounded-lg focus:border-purple-500 focus:outline-none transition-colors bg-gray-800 hover:bg-gray-750 text-white"
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Generate Rotation Plan
              </button>
            </form>

            {/* Benefits Info */}
            <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">Why Crop Rotation?</h3>
              <div className="space-y-2">
                <div className="flex items-center text-gray-300 text-sm">
                  <span className="mr-2">🌱</span>
                  Improves soil fertility and structure
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <span className="mr-2">🐛</span>
                  Reduces pest and disease pressure
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <span className="mr-2">💧</span>
                  Optimizes water and nutrient usage
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <span className="mr-2">📈</span>
                  Increases long-term productivity
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {showResults && rotationPlan && (
              <>
                {/* Rotation Plan Results */}
                <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                    <span className="bg-green-600 p-2 rounded-lg mr-3">🔄</span>
                    Recommended Crop Rotation Plan
                  </h2>

                  {/* Circular Rotation Visualization */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-4 text-center">Circular Rotation View</h3>
                    <CircularRotation sequence={rotationPlan.sequence} />
                  </div>

                  {/* Timeline View */}
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-300 mb-6">Timeline Sequence</h3>
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-500 to-blue-500"></div>
                      
                      <div className="space-y-6">
                        {rotationPlan.sequence.map((item, index) => (
                          <div key={index} className="flex items-center relative">
                            {/* Timeline dot */}
                            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full border-2 border-gray-900 relative z-10"></div>
                            
                            {/* Content */}
                            <div className="ml-6 bg-gray-800 rounded-xl p-4 flex-1 border border-gray-700 hover:border-purple-500 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="text-2xl mr-3">{item.icon}</span>
                                  <div>
                                    <h4 className="text-lg font-semibold text-white">
                                      Year {item.year} → {item.crop}
                                    </h4>
                                    <p className="text-sm text-gray-400">{item.benefits}</p>
                                  </div>
                                </div>
                                <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                  Year {item.year}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Benefits Analysis */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-xl p-6 border border-green-800/30">
                      <h4 className="text-lg font-semibold text-green-300 mb-2">Nitrogen Balance</h4>
                      <p className="text-white font-medium">{rotationPlan.nitrogenBalance}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
                      <h4 className="text-lg font-semibold text-blue-300 mb-2">Pest Reduction</h4>
                      <p className="text-white font-medium">{rotationPlan.pestReduction}</p>
                    </div>
                  </div>

                  {/* Soil Health Note */}
                  <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-emerald-300 mb-3 flex items-center">
                      <span className="mr-2">🌱</span>
                      Soil Health Benefits
                    </h4>
                    <p className="text-emerald-200">{rotationPlan.soilHealthNote}</p>
                  </div>
                </div>

                {/* Additional Recommendations */}
                <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                    <span className="bg-orange-600 p-2 rounded-lg mr-3">💡</span>
                    Additional Recommendations
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-300">Best Practices</h4>
                      <div className="space-y-2">
                        <div className="flex items-start text-gray-400 text-sm">
                          <span className="mr-2 mt-0.5">✓</span>
                          Apply organic matter between rotations
                        </div>
                        <div className="flex items-start text-gray-400 text-sm">
                          <span className="mr-2 mt-0.5">✓</span>
                          Test soil pH before each rotation cycle
                        </div>
                        <div className="flex items-start text-gray-400 text-sm">
                          <span className="mr-2 mt-0.5">✓</span>
                          Monitor pest populations regularly
                        </div>
                        <div className="flex items-start text-gray-400 text-sm">
                          <span className="mr-2 mt-0.5">✓</span>
                          Maintain detailed crop performance records
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-300">Timing Tips</h4>
                      <div className="space-y-2">
                        <div className="flex items-start text-gray-400 text-sm">
                          <span className="mr-2 mt-0.5">🕒</span>
                          Plan rotations 2-3 years in advance
                        </div>
                        <div className="flex items-start text-gray-400 text-sm">
                          <span className="mr-2 mt-0.5">🌧️</span>
                          Consider seasonal rainfall patterns
                        </div>
                        <div className="flex items-start text-gray-400 text-sm">
                          <span className="mr-2 mt-0.5">💰</span>
                          Balance cash crops with soil builders
                        </div>
                        <div className="flex items-start text-gray-400 text-sm">
                          <span className="mr-2 mt-0.5">🌾</span>
                          Allow soil rest periods when needed
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {!showResults && (
              <div className="bg-gray-900 rounded-2xl shadow-xl p-8 text-center border border-gray-800">
                <div className="bg-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🗓️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Plan Your Rotation
                </h3>
                <p className="text-gray-400">
                  Enter your last crop and soil type to get a customized 4-year rotation plan that improves soil health.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Educational Section */}
        <div className="mt-12 bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            🎯 Rotation Planning Principles
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-xl border border-green-800/30">
              <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🫘</span>
              </div>
              <h4 className="font-semibold text-green-300 mb-2">Nitrogen Fixers</h4>
              <p className="text-xs text-green-400">Legumes add nitrogen to soil naturally</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-800/30">
              <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌾</span>
              </div>
              <h4 className="font-semibold text-blue-300 mb-2">Heavy Feeders</h4>
              <p className="text-xs text-blue-400">Cereals utilize available nutrients efficiently</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl border border-orange-800/30">
              <div className="bg-orange-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥕</span>
              </div>
              <h4 className="font-semibold text-orange-300 mb-2">Root Crops</h4>
              <p className="text-xs text-orange-400">Deep roots break soil compaction</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-800/30">
              <div className="bg-purple-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h4 className="font-semibold text-purple-300 mb-2">Cover Crops</h4>
              <p className="text-xs text-purple-400">Protect and restore soil between seasons</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}