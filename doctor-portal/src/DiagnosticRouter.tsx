import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// We'll import pages one by one to test them
import Login from './pages/Login';
import Signup from './pages/Signup';
// import DoctorSignup from './pages/DoctorSignup';
import PatientAppDownload from './pages/PatientAppDownload';
// import ComingSoon from './pages/ComingSoon';
// import VerificationPending from './pages/VerificationPending';

const DiagnosticRouter: React.FC = () => {

  const TestPage: React.FC<{name: string, component: React.ComponentType}> = ({ name, component: Component }) => {
    try {
      return (
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h2 className="text-xl font-semibold text-green-800 mb-2">✅ {name} Component Test</h2>
              <p className="text-green-700">This component loaded successfully!</p>
              <Link to="/" className="text-blue-600 hover:text-blue-700 underline mt-2 inline-block">
                ← Back to Diagnostic Menu
              </Link>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg">
              <Component />
            </div>
          </div>
        </div>
      );
    } catch (error) {
      return (
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-red-800 mb-2">❌ {name} Component Error</h2>
            <p className="text-red-700 mb-2">This component failed to load:</p>
            <pre className="text-sm bg-red-100 p-2 rounded overflow-auto">
              {error instanceof Error ? error.message : String(error)}
            </pre>
            <Link to="/" className="text-blue-600 hover:text-blue-700 underline mt-2 inline-block">
              ← Back to Diagnostic Menu
            </Link>
          </div>
        </div>
      );
    }
  };

  const DiagnosticMenu = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">🔍 Component Diagnostic Tool</h1>
          <p className="text-gray-600">Click on each component to test if it loads properly</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">✅ Working Components</h2>
          <div className="grid grid-cols-1 gap-2">
            <div className="text-sm text-green-600">✅ React + TypeScript</div>
            <div className="text-sm text-green-600">✅ Tailwind CSS</div>
            <div className="text-sm text-green-600">✅ React Router</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🧪 Test Individual Pages</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="font-medium">Login Component</span>
              <button 
                onClick={() => window.location.href = '/test-login'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Test Load
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="font-medium">Signup Component</span>
              <button 
                onClick={() => window.location.href = '/test-signup'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                Test Load
              </button>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="font-medium">SimpleLogin Component</span>
              <button 
                onClick={() => window.location.href = '/test-simple-login'}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              >
                Test Load
              </button>
            </div>

            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="font-medium">PatientAppDownload Component</span>
              <button 
                onClick={() => window.location.href = '/test-patient-app'}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
              >
                Test Load
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">💡 How to use:</h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Click "Test Load" for each component</li>
              <li>2. If it loads ✅ - that component is fine</li>
              <li>3. If it shows a white screen ❌ - that component has issues</li>
              <li>4. Check browser console (F12) for specific errors</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DiagnosticMenu />} />
        
        {/* We'll add test routes as we uncomment the imports above */}
        <Route path="/test-login" element={<TestPage name="Login" component={Login} />} />
        <Route path="/test-signup" element={<TestPage name="Signup" component={Signup} />} />
        <Route path="/test-patient-app" element={<TestPage name="PatientAppDownload" component={PatientAppDownload} />} />
        
        <Route 
          path="/test-simple-login" 
          element={
            <div className="p-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-2">🧪 Testing SimpleLogin Import</h2>
                <Link to="/" className="text-blue-600 hover:text-blue-700 underline">
                  ← Back to Menu
                </Link>
              </div>
              <p className="text-gray-600">SimpleLogin component would load here (not imported yet)</p>
            </div>
          } 
        />

        <Route 
          path="*" 
          element={
            <div className="min-h-screen bg-red-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Route Not Found</h1>
                <Link to="/" className="text-blue-600 hover:text-blue-700 underline">
                  ← Back to Diagnostic Menu
                </Link>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

export default DiagnosticRouter;
