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
import MockPatient from './components/MockPatient';

// Simple loading screen component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">GarudX Portal</h2>
      <p className="text-gray-600">Loading secure portal...</p>
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
        <Route path="/mock-patient" element={<MockPatient patientName="Test Patient" callId="test-call-123" />} />

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
