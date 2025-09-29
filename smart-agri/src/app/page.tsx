import React from 'react';
import { Sprout, TrendingUp, RotateCcw, BarChart3, CheckCircle, ArrowRight, Leaf, Sun, Droplets } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      title: "Crop Recommendation",
      description: "Find the right crop for your soil & season"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
      title: "Yield Prediction",
      description: "Estimate crop output before sowing"
    },
    {
      icon: <RotateCcw className="w-6 h-6 text-purple-600" />,
      title: "Rotation Planner",
      description: "Maintain soil health with sustainable sequences"
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-orange-600" />,
      title: "Insights Dashboard",
      description: "View market trends and sustainability benefits"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Floating Elements */}
            <div className="absolute top-20 left-10 animate-bounce">
              <Leaf className="w-8 h-8 text-green-400 opacity-70" />
            </div>
            <div className="absolute top-32 right-20 animate-pulse">
              <Sun className="w-10 h-10 text-yellow-400 opacity-60" />
            </div>
            <div className="absolute bottom-20 left-20 animate-bounce delay-1000">
              <Droplets className="w-6 h-6 text-blue-400 opacity-70" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Smart Agriculture
              <span className="block text-green-600">Monitoring System</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Empowering farmers with data-driven insights for better yield, 
              sustainable farming, and smart decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Smart Farming
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive suite of tools helps you make informed decisions at every stage of your farming journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Transforming Agriculture Worldwide
            </h2>
            <p className="text-xl text-green-100">
              Join thousands of farmers already using smart technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Active Farmers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-4xl font-bold mb-2">25%</div>
              <div className="text-green-100">Average Yield Increase</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey towards sustainable, data-driven agriculture today.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sprout className="w-8 h-8 text-green-600" />
              <span className="text-xl font-bold">AgriSmart</span>
            </div>
            <div className="text-gray-400">
              © 2025 Smart Agriculture Monitoring System. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}