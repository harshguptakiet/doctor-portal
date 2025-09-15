import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2,
  Stethoscope
} from 'lucide-react';

const SimpleLogin: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      console.log('🔑 TEST LOGIN: Attempting login with:', credentials.email);
      
      // Simulate login - for testing purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if this looks like a test account that was created via signup
      console.log('💾 Checking localStorage for test accounts...');
      const testAccountsStr = localStorage.getItem('testAccounts');
      console.log('💾 Raw localStorage testAccounts:', testAccountsStr);
      
      let testAccounts = [];
      try {
        testAccounts = JSON.parse(testAccountsStr || '[]');
        console.log('💾 Parsed test accounts:', testAccounts);
      } catch (parseError) {
        console.error('❌ Error parsing test accounts:', parseError);
        testAccounts = [];
      }
      
      const foundAccount = testAccounts.find((acc: any) => acc.email === credentials.email);
      console.log('🔍 Looking for account with email:', credentials.email);
      console.log('🔍 Found account:', foundAccount);
      
      if (foundAccount) {
        console.log('✅ Found test account with role:', foundAccount.role);
        // Route based on the saved account role
        if (foundAccount.role === 'doctor') {
          console.log('🏅 Navigating to doctor dashboard...');
          navigate('/doctor/dashboard', { replace: true });
        } else {
          console.log('🏅 Navigating to patient app download...');
          navigate('/patient/app-download', { replace: true });
        }
      } else {
        console.log('⚠️ No test account found, using fallback email-based routing');
        // Fallback to email-based routing for quick testing
        if (credentials.email.includes('doctor')) {
          console.log('🏅 Email contains "doctor", navigating to doctor dashboard...');
          navigate('/doctor/dashboard', { replace: true });
        } else if (credentials.email.includes('patient')) {
          console.log('🏅 Email contains "patient", navigating to patient app download...');
          navigate('/patient/app-download', { replace: true });
        } else {
          console.log('🏅 Default navigation to doctor dashboard...');
          navigate('/doctor/dashboard', { replace: true });
        }
      }
      
      console.log('✅ TEST LOGIN successful - navigation triggered');
    } catch (error: any) {
      console.error('❌ TEST LOGIN failed:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Stethoscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MediBot Portal</h1>
          <p className="text-gray-600">Sign in to your account</p>
          <p className="text-sm text-green-600 mt-2">✅ Routing Test Mode</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={credentials.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="doctor@example.com or patient@example.com"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use "doctor@example.com" to test doctor flow, "patient@example.com" for patient flow
                </p>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter any password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Sign In (Test Mode)'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>

            {/* Signup Options */}
            <div className="mt-6 space-y-3">
              <Link
                to="/signup"
                className="w-full flex items-center justify-center px-4 py-3 border border-blue-200 rounded-lg shadow-sm bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium"
              >
                Create New Account
              </Link>
            </div>

            {/* Test Links */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-3">Quick Test Links:</p>
              <div className="space-y-2">
                <Link 
                  to="/doctor/dashboard" 
                  className="block text-sm text-blue-600 hover:text-blue-700"
                >
                  → Doctor Dashboard
                </Link>
                <Link 
                  to="/patient/app-download" 
                  className="block text-sm text-green-600 hover:text-green-700"
                >
                  → Patient App Download
                </Link>
                <Link 
                  to="/signup" 
                  className="block text-sm text-purple-600 hover:text-purple-700"
                >
                  → Signup Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;
