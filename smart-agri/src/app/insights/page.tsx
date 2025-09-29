'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MarketData {
  month: string;
  rice: number;
  wheat: number;
  cotton: number;
}

interface SustainabilityMetric {
  title: string;
  value: string;
  improvement: string;
  icon: string;
  color: string;
}

interface FarmingTip {
  season: string;
  crop: string;
  tip: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

// Sample market data for last 6 months
const marketPriceData: MarketData[] = [
  { month: 'Mar 2025', rice: 2850, wheat: 2250, cotton: 5800 },
  { month: 'Apr 2025', rice: 2920, wheat: 2180, cotton: 6100 },
  { month: 'May 2025', rice: 3100, wheat: 2050, cotton: 6350 },
  { month: 'Jun 2025', rice: 3250, wheat: 2100, cotton: 6200 },
  { month: 'Jul 2025', rice: 3180, wheat: 2300, cotton: 5950 },
  { month: 'Aug 2025', rice: 3050, wheat: 2450, cotton: 6400 },
];

const sustainabilityMetrics: SustainabilityMetric[] = [
  {
    title: 'Water Conservation',
    value: '~20%',
    improvement: 'water saved through rotation',
    icon: '💧',
    color: 'from-blue-600 to-cyan-600'
  },
  {
    title: 'Soil Organic Carbon',
    value: '+15%',
    improvement: 'increase in soil carbon',
    icon: '🌱',
    color: 'from-green-600 to-emerald-600'
  },
  {
    title: 'Fertilizer Reduction',
    value: '~30%',
    improvement: 'less nitrogen fertilizer needed',
    icon: '🧪',
    color: 'from-purple-600 to-pink-600'
  },
  {
    title: 'Pest Control Cost',
    value: '-25%',
    improvement: 'reduction in pesticide use',
    icon: '🐛',
    color: 'from-orange-600 to-red-600'
  }
];

const farmingTips: FarmingTip[] = [
  {
    season: 'Kharif',
    crop: 'Rice',
    tip: 'Avoid sowing rice late in Kharif season to prevent yield loss due to early winter.',
    icon: '🌾',
    priority: 'high'
  },
  {
    season: 'Rabi',
    crop: 'Wheat',
    tip: 'Ensure proper seed bed preparation and timely sowing in November for optimal wheat yields.',
    icon: '🌾',
    priority: 'high'
  },
  {
    season: 'Kharif',
    crop: 'Cotton',
    tip: 'Monitor for bollworm attacks during flowering stage and use integrated pest management.',
    icon: '🤍',
    priority: 'medium'
  },
  {
    season: 'Rabi',
    crop: 'Mustard',
    tip: 'Apply sulfur fertilizer for better oil content and yellow color in mustard seeds.',
    icon: '🌻',
    priority: 'medium'
  },
  {
    season: 'Zaid',
    crop: 'Fodder',
    tip: 'Grow drought-resistant fodder crops in Zaid season to maintain livestock feed.',
    icon: '🌿',
    priority: 'low'
  },
  {
    season: 'All Seasons',
    crop: 'General',
    tip: 'Maintain crop residue cover to prevent soil erosion and improve water retention.',
    icon: '🛡️',
    priority: 'high'
  }
];

export default function InsightsPage() {
  const [selectedMetric, setSelectedMetric] = useState<string>('water');
  const [selectedSeason, setSelectedSeason] = useState<string>('all');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-900/20';
      case 'low': return 'border-green-500 bg-green-900/20';
      default: return 'border-gray-500 bg-gray-900/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '📌';
      default: return '📝';
    }
  };

  const filteredTips = selectedSeason === 'all' 
    ? farmingTips 
    : farmingTips.filter(tip => tip.season.toLowerCase() === selectedSeason || tip.season === 'All Seasons');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 Insights & Monitoring
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Track market trends, sustainability metrics, and get expert farming advice to optimize your agricultural practices
          </p>
        </div>

        {/* Market Price Trends Section */}
        <div className="mb-12">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="bg-green-600 p-2 rounded-lg mr-3">📊</span>
              Market Price Trends
            </h2>
            <p className="text-gray-400 mb-6">Last 6 months price trends for key crops (₹/quintal)</p>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketPriceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9CA3AF"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    fontSize={12}
                    label={{ value: 'Price (₹/quintal)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#9CA3AF' } }}
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
                  <Line 
                    type="monotone" 
                    dataKey="rice" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Rice"
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wheat" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="Wheat"
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cotton" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    name="Cotton"
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Price Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-green-400 font-semibold">Rice</h4>
                    <p className="text-white text-xl font-bold">₹3,050</p>
                    <p className="text-gray-400 text-sm">Current price</p>
                  </div>
                  <div className="text-green-400 text-sm">+7.0% ↗️</div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-blue-400 font-semibold">Wheat</h4>
                    <p className="text-white text-xl font-bold">₹2,450</p>
                    <p className="text-gray-400 text-sm">Current price</p>
                  </div>
                  <div className="text-green-400 text-sm">+8.9% ↗️</div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-yellow-400 font-semibold">Cotton</h4>
                    <p className="text-white text-xl font-bold">₹6,400</p>
                    <p className="text-gray-400 text-sm">Current price</p>
                  </div>
                  <div className="text-green-400 text-sm">+10.3% ↗️</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sustainability Metrics Section */}
        <div className="mb-12">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="bg-emerald-600 p-2 rounded-lg mr-3">🌍</span>
              Sustainability Metrics
            </h2>
            <p className="text-gray-400 mb-6">Environmental impact of following recommended farming practices</p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sustainabilityMetrics.map((metric, index) => (
                <div 
                  key={index}
                  className={`bg-gradient-to-br ${metric.color} bg-opacity-10 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:scale-105`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{metric.icon}</div>
                    <h3 className="text-white font-semibold mb-2">{metric.title}</h3>
                    <p className="text-3xl font-bold text-white mb-2">{metric.value}</p>
                    <p className="text-gray-400 text-sm">{metric.improvement}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sustainability Impact Chart */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-300 mb-4">Environmental Impact Over Time</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { year: 'Year 1', water: 100, soil: 100, carbon: 100 },
                    { year: 'Year 2', water: 85, soil: 110, carbon: 105 },
                    { year: 'Year 3', water: 75, soil: 125, carbon: 115 },
                    { year: 'Year 4', water: 70, soil: 140, carbon: 130 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis stroke="#9CA3AF" fontSize={12} />
                    <YAxis stroke="#9CA3AF" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#FFFFFF'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="water" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Water Usage %" />
                    <Area type="monotone" dataKey="soil" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="Soil Health %" />
                    <Area type="monotone" dataKey="carbon" stackId="3" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Carbon Storage %" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Farming Tips Section */}
        <div className="mb-12">
          <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <span className="bg-yellow-600 p-2 rounded-lg mr-3">🔎</span>
              Farming Tips & Seasonal Advice
            </h2>

            {/* Season Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Filter by Season:</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'kharif', 'rabi', 'zaid'].map((season) => (
                  <button
                    key={season}
                    onClick={() => setSelectedSeason(season)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      selectedSeason === season 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    }`}
                  >
                    {season.charAt(0).toUpperCase() + season.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tips Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {filteredTips.map((tip, index) => (
                <div 
                  key={index}
                  className={`rounded-xl p-6 border-l-4 ${getPriorityColor(tip.priority)} transition-all duration-200 hover:scale-105`}
                >
                  <div className="flex items-start">
                    <div className="text-2xl mr-4">{tip.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="text-white font-semibold mr-2">{tip.crop}</h4>
                        <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded-full">
                          {tip.season}
                        </span>
                        <span className="ml-2 text-lg">
                          {getPriorityIcon(tip.priority)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{tip.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Dashboard */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
            <div className="text-3xl mb-2">📈</div>
            <h3 className="text-white font-semibold mb-1">Market Trend</h3>
            <p className="text-green-400 font-bold">+8.7% Average</p>
            <p className="text-gray-500 text-xs">Price increase</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
            <div className="text-3xl mb-2">🌿</div>
            <h3 className="text-white font-semibold mb-1">Eco Score</h3>
            <p className="text-emerald-400 font-bold">85/100</p>
            <p className="text-gray-500 text-xs">Sustainability rating</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
            <div className="text-3xl mb-2">💡</div>
            <h3 className="text-white font-semibold mb-1">Active Tips</h3>
            <p className="text-yellow-400 font-bold">{filteredTips.length}</p>
            <p className="text-gray-500 text-xs">Recommendations</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-white font-semibold mb-1">Efficiency</h3>
            <p className="text-blue-400 font-bold">+22%</p>
            <p className="text-gray-500 text-xs">Yield improvement</p>
          </div>
        </div>

        {/* Key Insights Banner */}
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-8 border border-purple-800/30">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <span className="mr-3">🎯</span>
            Key Insights This Month
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start text-gray-300">
                <span className="mr-2 text-green-400">▶</span>
                <span className="text-sm">Cotton prices showing strong upward trend (+10.3%)</span>
              </div>
              <div className="flex items-start text-gray-300">
                <span className="mr-2 text-blue-400">▶</span>
                <span className="text-sm">Wheat recovery expected due to favorable weather conditions</span>
              </div>
              <div className="flex items-start text-gray-300">
                <span className="mr-2 text-yellow-400">▶</span>
                <span className="text-sm">Early Kharif sowing recommended due to good monsoon forecast</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start text-gray-300">
                <span className="mr-2 text-purple-400">▶</span>
                <span className="text-sm">Sustainable practices showing 22% efficiency improvement</span>
              </div>
              <div className="flex items-start text-gray-300">
                <span className="mr-2 text-red-400">▶</span>
                <span className="text-sm">Monitor for pest outbreaks in cotton growing regions</span>
              </div>
              <div className="flex items-start text-gray-300">
                <span className="mr-2 text-emerald-400">▶</span>
                <span className="text-sm">Crop rotation showing significant water conservation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}