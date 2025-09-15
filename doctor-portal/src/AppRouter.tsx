import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { User } from 'firebase/auth';
import { getCurrentUser } from './services/authService';
import type { UserRole } from './types/auth';

// Import all page components
import Login from './pages/Login';
import Signup from './pages/Signup';
import DoctorSignup from './pages/DoctorSignup';
import PatientAppDownload from './pages/PatientAppDownload';
import ComingSoon from './pages/ComingSoon';
import VerificationPending from './pages/VerificationPending';
import DoctorDashboard from './components/DoctorDashboard';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/login' 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser.user as any);
        setUserRole(currentUser.role);
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on user's actual role
    switch (userRole) {
      case 'doctor':
        return <Navigate to="/doctor/dashboard" replace />;
      case 'patient':
        return <Navigate to="/patient/app-download" replace />;
      case 'admin':
        return <Navigate to="/admin/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

// Loading Component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">GarudX Portal</h2>
      <p className="text-gray-600">Initializing secure connection...</p>
    </div>
  </div>
);

// Main App Router Component
const AppRouter: React.FC = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Add a small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const currentUser = await getCurrentUser();
        setUser(currentUser.user as any);
        setUserRole(currentUser.role);
      } catch (error) {
        console.error('Initial auth check failed:', error);
        setUser(null);
        setUserRole(null);
      } finally {
        setInitialLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            user ? (
              // Redirect authenticated users to their appropriate dashboard
              <Navigate 
                to={
                  userRole === 'doctor' ? '/doctor/dashboard' : 
                  userRole === 'patient' ? '/patient/app-download' :
                  userRole === 'admin' ? '/admin/dashboard' :
                  '/login'
                } 
                replace 
              />
            ) : (
              <Login />
            )
          } 
        />
        
        <Route 
          path="/signup" 
          element={
            user ? (
              <Navigate 
                to={
                  userRole === 'doctor' ? '/doctor/dashboard' : 
                  userRole === 'patient' ? '/patient/app-download' :
                  userRole === 'admin' ? '/admin/dashboard' :
                  '/login'
                } 
                replace 
              />
            ) : (
              <Signup />
            )
          } 
        />

        <Route 
          path="/signup/doctor" 
          element={
            user ? (
              <Navigate 
                to={
                  userRole === 'doctor' ? '/doctor/dashboard' : 
                  userRole === 'patient' ? '/patient/app-download' :
                  userRole === 'admin' ? '/admin/dashboard' :
                  '/login'
                } 
                replace 
              />
            ) : (
              <DoctorSignup />
            )
          } 
        />

        <Route path="/verification-pending" element={<VerificationPending />} />

        {/* Patient Routes */}
        <Route path="/patient/app-download" element={<PatientAppDownload />} />

        {/* Coming Soon Routes */}
        <Route path="/pharmacy/coming-soon" element={<ComingSoon />} />
        <Route path="/pathology/coming-soon" element={<ComingSoon />} />

        {/* Protected Doctor Routes */}
        <Route 
          path="/doctor/dashboard" 
          element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Routes (for future use) */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
                  <p className="text-gray-600">Coming Soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } 
        />

        {/* Default Route - Redirect to appropriate page based on auth status */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate 
                to={
                  userRole === 'doctor' ? '/doctor/dashboard' : 
                  userRole === 'patient' ? '/patient/app-download' :
                  userRole === 'admin' ? '/admin/dashboard' :
                  '/login'
                } 
                replace 
              />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
