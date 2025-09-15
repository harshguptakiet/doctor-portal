import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { testFirebaseAuth } from './utils/firebaseDebug';

// Import all working page components
import LoginEnhanced from './pages/LoginEnhanced';
import SignupEnhanced from './pages/SignupEnhanced';
import DoctorSignup from './pages/DoctorSignup';
import SimpleDoctorSignup from './pages/SimpleDoctorSignup';
import PatientAppDownload from './pages/PatientAppDownload';
import ComingSoon from './pages/ComingSoon';
import VerificationPending from './pages/VerificationPending';
import SimpleLogin from './pages/SimpleLogin';
import DoctorDashboard from './components/DoctorDashboard';
import PharmacyDashboard from './components/pharmacy/PharmacyDashboard';
import PharmacySignup from './pages/pharmacy/PharmacySignup';
import PathologySignup from './pages/pathology/PathologySignup';
import PathologyDashboard from './components/pathology/PathologyDashboard';
import LandingPageProfessional from './pages/LandingPageProfessional';

// Simple loading screen component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Medibot Portal</h2>
      <p className="text-gray-600">Loading secure portal...</p>
    </div>
  </div>
);

// Simple doctor dashboard placeholder (we'll use this instead of the complex one)
const SimpleDoctorDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🩺 Doctor Dashboard</h1>
          <p className="text-gray-600 mb-6">Welcome to your medical practice portal</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">👥 Patients</h3>
            <p className="text-3xl font-bold text-blue-600">24</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">📅 Today's Appointments</h3>
            <p className="text-3xl font-bold text-green-600">8</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">⭐ Rating</h3>
            <p className="text-3xl font-bold text-purple-600">4.9</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">🚀 Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                📋 View Patient Queue
              </button>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                📞 Start Video Call
              </button>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                📊 View Analytics
              </button>
              <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition">
                ⚙️ Settings
              </button>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              🚧 <strong>Development Note:</strong> This is a simplified dashboard. The full dashboard with Firebase integration 
              will be enabled once all routing issues are resolved.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <button 
            onClick={() => window.location.href = '/login'}
            className="text-red-600 hover:text-red-700 underline"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Admin dashboard placeholder
const SimpleAdminDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">⚡ Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Administrative portal</p>
      <p className="text-sm text-gray-500 mb-6">Coming Soon...</p>
      <button 
        onClick={() => window.location.href = '/login'}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Back to Login
      </button>
    </div>
  </div>
);

const WorkingAppRouter: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple initialization without complex Firebase auth
    const timer = setTimeout(async () => {
      // Test Firebase configuration
      console.log('🔍 Running Firebase debug test...');
      await testFirebaseAuth();
      
      setLoading(false);
      console.log('✅ WorkingAppRouter initialized successfully');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPageProfessional />} />
        <Route path="/login" element={<LoginEnhanced />} />
        <Route path="/simple-login" element={<SimpleLogin />} />
        <Route path="/signup" element={<SignupEnhanced />} />
        <Route path="/signup/doctor" element={<DoctorSignup />} />
        <Route path="/signup/doctor-simple" element={<SimpleDoctorSignup />} />
        <Route path="/signup/pharmacy" element={<PharmacySignup />} />
        <Route path="/signup/pathology" element={<PathologySignup />} />
        <Route path="/verification-pending" element={<VerificationPending />} />

        {/* Patient Routes */}
        <Route path="/patient/app-download" element={<PatientAppDownload />} />

        {/* Pharmacy Routes */}
        <Route path="/pharmacy/dashboard" element={<PharmacyDashboard />} />
        
        {/* Pathology Routes */}
        <Route path="/pathology/dashboard" element={<PathologyDashboard />} />
        
        {/* Coming Soon Routes */}
        <Route path="/pathology/coming-soon" element={<ComingSoon />} />

        {/* Dashboard Routes - Using real doctor dashboard */}
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/admin/dashboard" element={<SimpleAdminDashboard />} />

        {/* Default Routes */}
        <Route path="/dashboard" element={<Navigate to="/doctor/dashboard" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default WorkingAppRouter;
