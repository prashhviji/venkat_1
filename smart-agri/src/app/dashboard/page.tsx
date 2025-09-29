'use client';
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Wheat, 
  TrendingUp, 
  RotateCcw, 
  Plus, 
  ArrowRight, 
  Calendar,
  MapPin,
  Thermometer,
  Droplets,
  Sun
} from 'lucide-react';

export default function DashboardPage() {
  const farmerName = "Lohita";

  // Sample data for yield prediction chart
  const yieldData = [
    { year: '2020', yield: 2.8, predicted: false },
    { year: '2021', yield: 3.2, predicted: false },
    { year: '2022', yield: 3.5, predicted: false },
    { year: '2023', yield: 3.1, predicted: false },
    { year: '2024', yield: 3.8, predicted: false },
    { year: '2025', yield: 4.2, predicted: true },
    { year: '2026', yield: 4.5, predicted: true },
  ];

  const rotationPlan = [
    { crop: "Wheat", season: "Winter 2024", status: "current", icon: "🌾" },
    { crop: "Chickpea", season: "Summer 2025", status: "next", icon: "🫘" },
    { crop: "Maize", season: "Monsoon 2025", status: "planned", icon: "🌽" },
    { crop: "Mustard", season: "Winter 2025", status: "planned", icon: "🌻" },
  ];

  const weatherData = [
    { label: "Temperature", value: "28°C", icon: <Thermometer className="w-5 h-5" />, color: "text-orange-500" },
    { label: "Humidity", value: "65%", icon: <Droplets className="w-5 h-5" />, color: "text-blue-500" },
    { label: "Sunshine", value: "8.2 hrs", icon: <Sun className="w-5 h-5" />, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Hello, {farmerName} 👋
              </h1>
              <p className="text-green-100 text-lg">
                Welcome back to your Smart Agriculture Dashboard
              </p>
              <div className="flex items-center mt-2 text-green-100">
                <MapPin className="w-4 h-4 mr-2" />
                <span>Farm Location: Punjab, India</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="text-right">
                <p className="text-green-100 text-sm">Last Updated</p>
                <p className="text-white font-semibold">Today, 2:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Recommended Crop Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Wheat className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl">🌾</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Recommended Crop
            </h3>
            <p className="text-3xl font-bold text-green-600 mb-2">Wheat</p>
            <p className="text-gray-600 text-sm">
              Best suited for current season and soil conditions
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Confidence: 94%</p>
            </div>
          </div>

          {/* Predicted Yield Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Predicted Yield
            </h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">3.8 tons</p>
            <p className="text-gray-600 text-sm">per hectare for this season</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-green-600">↑ 12% from last year</p>
            </div>
          </div>

          {/* Next Rotation Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <RotateCcw className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-2xl">🔄</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Next Crop Rotation
            </h3>
            <p className="text-xl font-bold text-purple-600 mb-2">
              Chickpea → Maize
            </p>
            <p className="text-gray-600 text-sm">Optimized for soil health</p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">Starting: Summer 2025</p>
            </div>
          </div>
        </div>

        {/* Weather Strip */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Today's Weather</h3>
            <div className="flex items-center space-x-6">
              {weatherData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={item.color}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <p className="font-semibold text-gray-900">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Yield Prediction Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Yield Prediction Trend
              </h3>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Actual</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-600">Predicted</span>
                </div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yieldData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="yield" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Crop Rotation Timeline */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Crop Rotation Plan
            </h3>
            
            <div className="space-y-4">
              {rotationPlan.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                    item.status === 'current' 
                      ? 'bg-green-100 border-2 border-green-500' 
                      : item.status === 'next'
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-100 border-2 border-gray-300'
                  }`}>
                    {item.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{item.crop}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'current'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'next'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {item.status === 'current' ? 'Active' : item.status === 'next' ? 'Up Next' : 'Planned'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {item.season}
                    </p>
                  </div>

                  {index < rotationPlan.length - 1 && (
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <button className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 hover:from-green-100 hover:to-green-200 transition-all duration-200 group">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Get New</p>
                  <p className="font-semibold text-gray-900">Recommendation</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 group">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Predict</p>
                  <p className="font-semibold text-gray-900">Yield</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 group">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                  <RotateCcw className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">View</p>
                  <p className="font-semibold text-gray-900">Insights</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Wheat recommendation generated</p>
                  <p className="text-sm text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Yield prediction updated</p>
                  <p className="text-sm text-gray-600">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Rotation plan optimized</p>
                  <p className="text-sm text-gray-600">3 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Farm Overview */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Farm Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">15.2</p>
                <p className="text-sm text-gray-600">Total Area (hectares)</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-600">Active Fields</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">4</p>
                <p className="text-sm text-gray-600">Crop Varieties</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">92%</p>
                <p className="text-sm text-gray-600">Efficiency Score</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}