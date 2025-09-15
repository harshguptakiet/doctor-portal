import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2,
  Shield,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import authService from '../services/authService';
import type { LoginCredentials } from '../types/auth';
import GarudXLogo from '../components/GarudXLogo';

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

const LoginEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((authState) => {
      if (authState.user && !authState.loading) {
        if (authState.user.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else if (authState.user.role === 'pharmacy') {
          navigate('/pharmacy/dashboard');
        } else if (authState.user.role === 'pathology') {
          navigate('/pathology/dashboard');
        } else if (authState.user.role === 'patient') {
          navigate('/patient/app-download');
        } else {
          navigate('/dashboard');
        }
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const user = await authService.login(credentials);
      
      // Navigate based on user role
      if (user.role === 'doctor') {
        navigate('/doctor/dashboard', { replace: true });
      } else if (user.role === 'pharmacy') {
        navigate('/pharmacy/dashboard', { replace: true });
      } else if (user.role === 'pathology') {
        navigate('/pathology/dashboard', { replace: true });
      } else if (user.role === 'patient') {
        navigate('/patient/app-download', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
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
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
        
        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out;
        }
        
        .animate-pulse-ring {
          animation: pulse 2s infinite;
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
              to="/"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors glass rounded-lg px-4 py-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 pt-24">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className={`glass rounded-3xl shadow-2xl overflow-hidden transition-all duration-1000 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            {/* Header */}
            <div className="p-8 text-center border-b border-white/20">
              <div className="flex justify-center mb-6">
                <FloatingElement delay={0.5} duration={2}>
                  <GarudXLogo 
                    size="xl" 
                    variant="gradient" 
                    animated={true} 
                    showText={false}
                  />
                </FloatingElement>
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your GarudX account</p>
            </div>

            {/* Form Section */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Display */}
                {error && (
                  <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 flex items-start space-x-3 animate-fadeInUp">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={credentials.email}
                      onChange={handleInputChange}
                      className="block w-full pl-12 pr-4 py-4 glass border border-white/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={credentials.password}
                      onChange={handleInputChange}
                      className="block w-full pl-12 pr-12 py-4 glass border border-white/30 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 text-gray-900 placeholder-gray-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-green-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-3" />
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Forgot Password */}
              <div className="mt-6 text-center">
                <Link 
                  to="/forgot-password" 
                  className="text-green-600 hover:text-green-700 font-medium transition-colors hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Divider */}
              <div className="mt-8 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200/50" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 glass text-gray-500">Don't have an account?</span>
                </div>
              </div>

              {/* Signup Link */}
              <div className="mt-6">
                <Link
                  to="/signup"
                  className="w-full flex items-center justify-center px-6 py-4 border-2 border-green-200 rounded-xl glass hover:bg-green-50/50 transition-all duration-300 font-semibold text-green-700 hover:text-green-800 hover:border-green-300 transform hover:scale-[1.02]"
                >
                  Create New Account
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-white/20 bg-white/10">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-green-600" />
                  <span className="font-medium">Secure & Encrypted</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                  <span className="font-medium">HIPAA Compliant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center glass rounded-xl p-4">
            <p className="text-sm text-gray-600">
              Having trouble signing in?{' '}
              <Link to="/support" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginEnhanced;
