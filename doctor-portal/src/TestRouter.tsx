import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const TestRouter: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="text-center">
                <h1 className="text-4xl font-bold text-blue-600 mb-4">
                  GarudX Portal - Test
                </h1>
                <p className="text-gray-600">
                  If you can see this, React Router is working!
                </p>
              </div>
            } 
          />
          <Route 
            path="*" 
            element={
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">
                  404 - Route Not Found
                </h1>
                <p className="text-gray-600">
                  This route doesn't exist
                </p>
              </div>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default TestRouter;
