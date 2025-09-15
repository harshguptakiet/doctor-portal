import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Stethoscope,
  Users,
  Building2,
  FlaskConical,
  Smartphone,
  Clock,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

type UserRole = 'doctor' | 'patient' | 'pharmacy' | 'pathology';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    
    // Navigate based on role
    switch (role) {
      case 'patient':
        navigate('/patient/app-download');
        break;
      case 'doctor':
        navigate('/signup/doctor');
        break;
      case 'pharmacy':
      case 'pathology':
        navigate('/signup/coming-soon', { state: { role } });
        break;
      default:
        break;
    }
  };

  const roleOptions = [
    {
      id: 'doctor' as UserRole,
      title: 'Doctor',
      subtitle: 'Healthcare Professional',
      description: 'Provide medical consultations and manage patients',
      icon: Stethoscope,
      color: 'blue',
      features: ['Video Consultations', 'Patient Management', 'Prescription Tools'],
      available: true
    },
    {
      id: 'patient' as UserRole,
      title: 'Patient',
      subtitle: 'Healthcare Consumer',
      description: 'Access healthcare services and consultations',
      icon: Users,
      color: 'green',
      features: ['Mobile App Access', 'Book Appointments', 'Health Records'],
      available: true
    },
    {
      id: 'pharmacy' as UserRole,
      title: 'Pharmacy',
      subtitle: 'Pharmaceutical Services',
      description: 'Manage prescriptions and medication delivery',
      icon: Building2,
      color: 'purple',
      features: ['Prescription Management', 'Inventory Control', 'Delivery Services'],
      available: false
    },
    {
      id: 'pathology' as UserRole,
      title: 'Pathology Lab',
      subtitle: 'Diagnostic Services',
      description: 'Provide laboratory tests and diagnostic reports',
      icon: FlaskConical,
      color: 'orange',
      features: ['Test Management', 'Report Generation', 'Sample Tracking'],
      available: false
    }
  ];

  const getColorClasses = (color: string, isHovered: boolean = false) => {
    const colors = {
      blue: {
        bg: isHovered ? 'bg-blue-50' : 'bg-white',
        border: 'border-blue-200 hover:border-blue-300',
        icon: 'bg-blue-100 text-blue-600',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      green: {
        bg: isHovered ? 'bg-green-50' : 'bg-white',
        border: 'border-green-200 hover:border-green-300',
        icon: 'bg-green-100 text-green-600',
        text: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700'
      },
      purple: {
        bg: isHovered ? 'bg-purple-50' : 'bg-white',
        border: 'border-purple-200 hover:border-purple-300',
        icon: 'bg-purple-100 text-purple-600',
        text: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      orange: {
        bg: isHovered ? 'bg-orange-50' : 'bg-white',
        border: 'border-orange-200 hover:border-orange-300',
        icon: 'bg-orange-100 text-orange-600',
        text: 'text-orange-600',
        button: 'bg-orange-600 hover:bg-orange-700'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/login" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Login
            </Link>
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">MediBot Portal</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-4 rounded-full">
              <UserPlus className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Join MediBot Healthcare Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose your role to get started with our comprehensive healthcare ecosystem
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {roleOptions.map((option) => {
            const colorClasses = getColorClasses(option.color);
            const Icon = option.icon;

            return (
              <div
                key={option.id}
                className={`relative ${colorClasses.bg} ${colorClasses.border} border-2 rounded-2xl p-8 transition-all duration-200 hover:shadow-lg ${
                  option.available ? 'cursor-pointer transform hover:-translate-y-1' : 'opacity-75'
                }`}
                onClick={() => option.available && handleRoleSelect(option.id)}
              >
                {/* Coming Soon Badge */}
                {!option.available && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Coming Soon
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`${colorClasses.icon} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className="h-8 w-8" />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {option.title}
                  </h3>
                  <p className={`text-sm font-medium ${colorClasses.text} mb-3`}>
                    {option.subtitle}
                  </p>
                  <p className="text-gray-600 text-base leading-relaxed">
                    {option.description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className={`h-4 w-4 mr-2 ${colorClasses.text}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => option.available && handleRoleSelect(option.id)}
                  disabled={!option.available}
                  className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors ${
                    option.available 
                      ? `${colorClasses.button} shadow-lg hover:shadow-xl`
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {option.available ? (
                    option.id === 'patient' ? (
                      <div className="flex items-center justify-center">
                        <Smartphone className="h-5 w-5 mr-2" />
                        Get Mobile App
                      </div>
                    ) : (
                      `Register as ${option.title}`
                    )
                  ) : (
                    'Coming Soon'
                  )}
                </button>

                {/* Special Note for Patient */}
                {option.id === 'patient' && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 text-center">
                      <Smartphone className="h-4 w-4 inline mr-1" />
                      Download our mobile app for the best patient experience
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Need Help Choosing?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our platform connects healthcare providers and patients in a seamless digital ecosystem. 
            Each role has specialized features designed for optimal healthcare delivery.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              HIPAA Compliant
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              End-to-End Encryption
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
              24/7 Support
            </div>
          </div>
        </div>

        {/* Already have account */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
