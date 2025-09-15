import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import pages
import SimpleLogin from './pages/SimpleLogin';
import Signup from './pages/Signup';
import DoctorSignup from './pages/DoctorSignup';
import PatientAppDownload from './pages/PatientAppDownload';
import ComingSoon from './pages/ComingSoon';
import VerificationPending from './pages/VerificationPending';

// Simple loading component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">GarudX Portal</h2>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Simple doctor dashboard placeholder
const SimpleDoctorDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Doctor Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome to your doctor portal!</p>
      <button 
        onClick={() => window.location.href = '/login'}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back to Login
      </button>
    </div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Router Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-700 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const SimpleAppRouter: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initialization
    const timer = setTimeout(() => {
      setLoading(false);
      console.log('✅ Simple App Router initialized');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<SimpleLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signup/doctor" element={<DoctorSignup />} />
          <Route path="/verification-pending" element={<VerificationPending />} />

          {/* Patient Routes */}
          <Route path="/patient/app-download" element={<PatientAppDownload />} />

          {/* Coming Soon Routes */}
          <Route path="/pharmacy/coming-soon" element={<ComingSoon />} />
          <Route path="/pathology/coming-soon" element={<ComingSoon />} />

          {/* Simple Doctor Dashboard */}
          <Route path="/doctor/dashboard" element={<SimpleDoctorDashboard />} />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
};

export default SimpleAppRouter;
