import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Building2,
  FlaskConical,
  Mail,
  Bell,
  CheckCircle,
  Calendar,
  Stethoscope
} from 'lucide-react';

const ComingSoon: React.FC = () => {
  const location = useLocation();
  const role = location.state?.role || 'pharmacy';

  const roleConfig = {
    pharmacy: {
      icon: Building2,
      title: 'Pharmacy Portal',
      description: 'Comprehensive pharmacy management system for modern healthcare',
      color: 'purple',
      features: [
        'Prescription Management',
        'Inventory Control',
        'Automated Dispensing',
        'Insurance Processing',
        'Patient Communication',
        'Delivery Tracking'
      ]
    },
    pathology: {
      icon: FlaskConical,
      title: 'Pathology Lab Portal',
      description: 'Advanced laboratory management system for diagnostic services',
      color: 'orange',
      features: [
        'Test Management',
        'Sample Tracking',
        'Report Generation',
        'Quality Control',
        'Equipment Integration',
        'Result Analytics'
      ]
    }
  };

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.pharmacy;
  const Icon = config.icon;

  const getColorClasses = (color: string) => {
    const colors = {
      purple: {
        bg: 'from-purple-50 via-white to-purple-50',
        icon: 'bg-purple-600',
        iconBg: 'bg-purple-100',
        iconText: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700',
        accent: 'text-purple-600'
      },
      orange: {
        bg: 'from-orange-50 via-white to-orange-50',
        icon: 'bg-orange-600',
        iconBg: 'bg-orange-100',
        iconText: 'text-orange-600',
        button: 'bg-orange-600 hover:bg-orange-700',
        accent: 'text-orange-600'
      }
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  const colorClasses = getColorClasses(config.color);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colorClasses.bg}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/signup" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Signup
            </Link>
            <div className="flex items-center">
              <div className={`${colorClasses.icon} p-2 rounded-lg mr-3`}>
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">MediBot Portal</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className={`${colorClasses.icon} p-8 rounded-3xl shadow-2xl`}>
                <Icon className="h-20 w-20 text-white" />
              </div>
              <div className="absolute -top-3 -right-3 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold animate-bounce">
                COMING SOON
              </div>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {config.title} is <span className={config.color === 'purple' ? 'text-purple-600' : 'text-orange-600'}>Coming Soon!</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            {config.description}. We're working hard to bring you the best experience in healthcare technology.
          </p>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-12 shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <Clock className={`h-8 w-8 ${colorClasses.accent} mr-3`} />
              <h2 className="text-2xl font-bold text-gray-900">Expected Launch Timeline</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className={`${colorClasses.iconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Calendar className={`h-8 w-8 ${colorClasses.iconText}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Q1 2024</h3>
                <p className="text-sm text-gray-600">Beta Testing Phase</p>
              </div>
              
              <div className="text-center">
                <div className={`${colorClasses.iconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Bell className={`h-8 w-8 ${colorClasses.iconText}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Q2 2024</h3>
                <p className="text-sm text-gray-600">Early Access Launch</p>
              </div>
              
              <div className="text-center">
                <div className={`${colorClasses.iconBg} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <CheckCircle className={`h-8 w-8 ${colorClasses.iconText}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Q3 2024</h3>
                <p className="text-sm text-gray-600">Full Public Release</p>
              </div>
            </div>

            <div className={`${colorClasses.iconBg} rounded-lg p-4 text-center`}>
              <p className={`text-sm ${colorClasses.iconText} font-medium`}>
                🚀 Join our early access program and be among the first to experience the future of {role} management!
              </p>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              What to Expect
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {config.features.map((feature, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center">
                    <CheckCircle className={`h-5 w-5 ${colorClasses.accent} mr-3 flex-shrink-0`} />
                    <span className="font-medium text-gray-900">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Signup */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Get Notified When We Launch
            </h2>
            <p className="text-gray-600 mb-6">
              Be the first to know when the {config.title} goes live. We'll send you an exclusive invitation!
            </p>
            
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <button className={`${colorClasses.button} text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl`}>
                  Notify Me
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                We'll never spam you. You can unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Current Alternatives */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Meanwhile, Explore Our Other Services
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link
              to="/signup/doctor"
              className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Stethoscope className="h-5 w-5 mr-2" />
              Register as Doctor
            </Link>
            
            <Link
              to="/patient/app-download"
              className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Get Patient App
            </Link>
            
            <Link
              to="/login"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
