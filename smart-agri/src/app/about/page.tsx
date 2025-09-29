'use client';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  description: string;
}

interface Feature {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const features: Feature[] = [
  {
    title: 'Crop Recommendation',
    description: 'AI-powered suggestions based on soil type, location, and seasonal conditions',
    icon: '🌱',
    color: 'from-green-600 to-emerald-600'
  },
  {
    title: 'Yield Prediction',
    description: 'Advanced analytics to forecast crop yields with confidence metrics',
    icon: '📊',
    color: 'from-blue-600 to-purple-600'
  },
  {
    title: 'Rotation Planning',
    description: 'Sustainable crop rotation plans to improve soil health and reduce pests',
    icon: '🔄',
    color: 'from-purple-600 to-pink-600'
  },
  {
    title: 'Market Insights',
    description: 'Real-time market trends and sustainability metrics for informed decisions',
    icon: '📈',
    color: 'from-orange-600 to-red-600'
  }
];

const teamMembers: TeamMember[] = [
  {
    name: 'Dr. Rajesh Kumar',
    role: 'Project Guide / Professor',
    avatar: '👨‍🏫',
    description: 'Agricultural Engineering Expert with 15+ years in precision farming'
  },
  {
    name: 'Priya Sharma',
    role: 'Lead Developer',
    avatar: '👩‍💻',
    description: 'Full-stack developer specializing in agricultural technology solutions'
  },
  {
    name: 'Arjun Patel',
    role: 'Data Scientist',
    avatar: '👨‍🔬',
    description: 'Machine learning engineer focused on crop prediction algorithms'
  },
  {
    name: 'Kavya Singh',
    role: 'Agricultural Consultant',
    avatar: '👩‍🌾',
    description: 'Field expert in sustainable farming practices and crop management'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            About Smart Agriculture Monitoring System
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            This system is designed to help farmers take smarter decisions with the help of data. 
            It integrates crop recommendation, yield prediction, and sustainable crop rotation planning 
            into a single, comprehensive platform.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-12 mb-12 border border-gray-800">
          <div className="text-center">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🎯</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-2xl text-gray-300 font-medium max-w-3xl mx-auto leading-relaxed">
              "To improve farmer productivity, ensure sustainability, and make agriculture smarter."
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="text-green-400 font-semibold mb-2">Productivity</h3>
                <p className="text-gray-400 text-sm">Maximize crop yields through data-driven insights</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-3xl mb-3">🌍</div>
                <h3 className="text-blue-400 font-semibold mb-2">Sustainability</h3>
                <p className="text-gray-400 text-sm">Promote eco-friendly farming practices</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-purple-400 font-semibold mb-2">Innovation</h3>
                <p className="text-gray-400 text-sm">Leverage AI and technology for smarter decisions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-10">System Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gray-900 rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:scale-105"
              >
                <div className={`bg-gradient-to-r ${feature.color} rounded-full w-16 h-16 flex items-center justify-center mb-6`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 mb-12 border border-gray-800">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="text-center bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-3xl">
                  {member.avatar}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{member.name}</h3>
                <p className="text-purple-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 mb-12 border border-gray-800">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Technology Stack</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: 'Next.js', icon: '⚡', color: 'text-blue-400' },
              { name: 'TypeScript', icon: '📘', color: 'text-blue-500' },
              { name: 'Tailwind CSS', icon: '🎨', color: 'text-cyan-400' },
              { name: 'Machine Learning', icon: '🤖', color: 'text-purple-400' },
              { name: 'Data Analytics', icon: '📊', color: 'text-green-400' }
            ].map((tech, index) => (
              <div 
                key={index}
                className="text-center bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="text-2xl mb-2">{tech.icon}</div>
                <h4 className={`font-semibold ${tech.color}`}>{tech.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Get In Touch</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-center text-gray-300">
                <div className="bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Email</h4>
                  <p className="text-gray-400">contact@smartagri.in</p>
                </div>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-xl">📱</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Phone</h4>
                  <p className="text-gray-400">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center text-gray-300">
                <div className="bg-purple-600 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-xl">🌐</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Website</h4>
                  <p className="text-gray-400">www.smartagri.in</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h4 className="font-semibold text-white mb-4">Project Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Version:</span>
                  <span className="text-white">v2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Release Date:</span>
                  <span className="text-white">August 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Platform:</span>
                  <span className="text-white">Web Application</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">License:</span>
                  <span className="text-white">Open Source</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Institution:</span>
                  <span className="text-white">Agricultural University</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl p-8 border border-gray-700">
            <p className="text-xl text-gray-300 italic mb-4">
              "Technology is best when it brings people together and solves real problems."
            </p>
            <p className="text-gray-400">— Smart Agriculture Team</p>
          </div>
        </div>
      </div>
    </div>
  );
}