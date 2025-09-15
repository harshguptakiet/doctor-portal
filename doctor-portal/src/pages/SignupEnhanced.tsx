import React, { useState, useEffect } from 'react';
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
  CheckCircle,
  Star,
  Shield
} from 'lucide-react';
import GarudXLogo from '../components/GarudXLogo';

type UserRole = 'doctor' | 'patient' | 'pharmacy' | 'pathology';

// Floating animation component
const FloatingElement: React.FC<{ children: React.ReactNode; delay?: number; duration?: number }> = ({ 
  children, 
  delay = 0, 
  duration = 3 
}) => (
  <div 
    className="animate-float" 
    style={{ 
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`
    }}
  >
    {children}
  </div>
);

const SignupEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [, setSelectedRole] = useState<UserRole | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
        navigate('/signup/pharmacy');
        break;
      case 'pathology':
        navigate('/signup/pathology');
        break;
      default:
        break;
    }
  };

  const roleOptions = [
    {
      id: 'doctor' as UserRole,
      title: 'Healthcare Provider',
      subtitle: 'Join as Doctor',
      description: 'Provide medical consultations and manage patients through our platform',
      icon: Stethoscope,
      color: 'blue',
      features: ['Video Consultations', 'Patient Management', 'Digital Prescriptions'],
      stats: ['2,500+ Doctors', '50k+ Consultations'],
      available: true,
      popular: true
    },
    {
      id: 'patient' as UserRole,
      title: 'Healthcare Consumer',
      subtitle: 'Get Care as Patient',
      description: 'Access healthcare services and consultations from verified doctors',
      icon: Users,
      color: 'green',
      features: ['Mobile App Access', 'Book Appointments', 'Health Records'],
      stats: ['50k+ Patients', '24/7 Available'],
      available: true,
      popular: true
    },
    {
      id: 'pharmacy' as UserRole,
      title: 'Pharmaceutical Partner',
      subtitle: 'Partner Pharmacy',
      description: 'Manage prescriptions and provide medication delivery services',
      icon: Building2,
      color: 'purple',
      features: ['Prescription Management', 'Inventory Control', 'Delivery Services'],
      stats: ['200+ Partners', 'Same Day Delivery'],
      available: true,
      popular: false
    },
    {
      id: 'pathology' as UserRole,
      title: 'Diagnostic Partner',
      subtitle: 'Lab Services',
      description: 'Provide laboratory tests and diagnostic reports digitally',
      icon: FlaskConical,
      color: 'orange',
      features: ['Test Management', 'Digital Reports', 'Sample Tracking'],
      stats: ['150+ Labs', 'Quick Results'],
      available: true,
      popular: false
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'from-blue-50 to-blue-100',
        border: 'border-blue-200 hover:border-blue-400',
        icon: 'bg-blue-100 text-blue-600',
        text: 'text-blue-600',
        button: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
        glow: 'shadow-blue-200/50'
      },
      green: {
        bg: 'from-green-50 to-green-100',
        border: 'border-green-200 hover:border-green-400',
        icon: 'bg-green-100 text-green-600',
        text: 'text-green-600',
        button: 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800',
        glow: 'shadow-green-200/50'
      },
      purple: {
        bg: 'from-purple-50 to-purple-100',
        border: 'border-purple-200 hover:border-purple-300',
        icon: 'bg-purple-100 text-purple-600',
        text: 'text-purple-600',
        button: 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800',
        glow: 'shadow-purple-200/50'
      },
      orange: {
        bg: 'from-orange-50 to-orange-100',
        border: 'border-orange-200 hover:border-orange-300',
        icon: 'bg-orange-100 text-orange-600',
        text: 'text-orange-600',
        button: 'from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800',
        glow: 'shadow-orange-200/50'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Advanced CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(1deg); }
          50% { transform: translateY(-10px) rotate(-1deg); }
          75% { transform: translateY(-15px) rotate(0.5deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: scale(0.8) translateY(50px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-slideInScale {
          animation: slideInScale 0.6s ease-out;
        }
        
        .glass {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #10b981, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingElement delay={0} duration={4}>
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-300 rounded-full opacity-10 blur-xl"></div>
        </FloatingElement>
        <FloatingElement delay={1} duration={5}>
          <div className="absolute top-40 right-20 w-24 h-24 bg-blue-300 rounded-full opacity-10 blur-xl"></div>
        </FloatingElement>
        <FloatingElement delay={2} duration={3}>
          <div className="absolute bottom-20 left-20 w-20 h-20 bg-purple-300 rounded-full opacity-10 blur-xl"></div>
        </FloatingElement>
      </div>

      {/* Header */}
      <header className="glass fixed top-0 w-full z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center group cursor-pointer">
              <GarudXLogo 
                size="md" 
                variant="primary" 
                animated={true} 
                showText={true}
              />
            </Link>
            
            <Link
              to="/login"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors glass rounded-lg px-4 py-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Page Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
          <div className="flex justify-center mb-8">
            <FloatingElement delay={0.5} duration={2}>
              <div className="glass rounded-3xl p-6 shadow-xl">
                <UserPlus className="h-16 w-16 text-green-600 mx-auto" />
              </div>
            </FloatingElement>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
            Join GarudX Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose your role and become part of our comprehensive healthcare ecosystem, 
            serving rural communities across India
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {roleOptions.map((option, index) => {
            const colorClasses = getColorClasses(option.color);
            const Icon = option.icon;

            return (
              <div
                key={option.id}
                className={`
                  relative glass rounded-3xl border-2 ${colorClasses.border} p-8 
                  transition-all duration-500 hover:shadow-2xl ${colorClasses.glow}
                  ${option.available ? 'cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]' : 'opacity-75'}
                  animate-slideInScale
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => option.available && handleRoleSelect(option.id)}
              >
                {/* Popular Badge */}
                {option.popular && (
                  <div className="absolute -top-3 left-6">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center shadow-lg">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Coming Soon Badge */}
                {!option.available && (
                  <div className="absolute top-6 right-6">
                    <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-2 rounded-full flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Coming Soon
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`${colorClasses.icon} w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="h-10 w-10" />
                </div>

                {/* Content */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {option.title}
                    </h3>
                  </div>
                  <p className={`text-sm font-semibold ${colorClasses.text} mb-4`}>
                    {option.subtitle}
                  </p>
                  <p className="text-gray-600 text-base leading-relaxed mb-6">
                    {option.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {option.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="text-center bg-white/50 rounded-lg py-2 px-3">
                        <span className="text-sm font-semibold text-gray-700">{stat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h4 className="text-sm font-bold text-gray-700 mb-4">Key Features:</h4>
                  <ul className="space-y-3">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className={`w-5 h-5 rounded-full ${colorClasses.icon} flex items-center justify-center mr-3`}>
                          <CheckCircle className="h-3 w-3" />
                        </div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => option.available && handleRoleSelect(option.id)}
                  disabled={!option.available}
                  className={`
                    w-full py-4 px-6 rounded-xl text-white font-semibold text-lg 
                    transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]
                    ${option.available 
                      ? `bg-gradient-to-r ${colorClasses.button}` 
                      : 'bg-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {option.available ? (
                    option.id === 'patient' ? (
                      <div className="flex items-center justify-center">
                        <Smartphone className="h-5 w-5 mr-3" />
                        Get Mobile App
                      </div>
                    ) : (
                      `Join as ${option.subtitle}`
                    )
                  ) : (
                    'Coming Soon'
                  )}
                </button>

                {/* Special Note for Patient */}
                {option.id === 'patient' && (
                  <div className="mt-6 p-4 bg-green-50/80 rounded-xl border border-green-200">
                    <p className="text-sm text-green-700 text-center font-medium">
                      <Smartphone className="h-4 w-4 inline mr-2" />
                      Download our mobile app for the best patient experience
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Platform Benefits */}
        <div className="glass rounded-3xl border border-white/30 p-8 md:p-12 text-center mb-12">
          <div className="flex justify-center mb-6">
            <GarudXLogo 
              size="lg" 
              variant="gradient" 
              animated={true} 
              showText={false}
            />
          </div>
          <h3 className="text-3xl font-bold gradient-text mb-6">
            Why Choose GarudX Platform?
          </h3>
          <p className="text-gray-600 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
            Our platform connects healthcare providers and patients in a seamless digital ecosystem, 
            specifically designed for rural healthcare delivery in India.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            {[
              { icon: Shield, text: 'HIPAA Compliant', color: 'text-green-600' },
              { icon: CheckCircle, text: 'End-to-End Encryption', color: 'text-blue-600' },
              { icon: Users, text: '50,000+ Active Users', color: 'text-purple-600' },
              { icon: Star, text: '24/7 Support', color: 'text-yellow-600' }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-white/70 rounded-full flex items-center justify-center">
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <span className="font-semibold text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Already have account */}
        <div className="text-center glass rounded-xl p-6">
          <p className="text-gray-600 text-lg">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupEnhanced;
