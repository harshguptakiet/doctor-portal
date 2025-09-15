import React from 'react';

const MinimalTest: React.FC = () => {
  console.log('✅ MinimalTest component is rendering');
  
  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          React is Working! 🎉
        </h1>
        <p className="text-gray-600 mb-4">
          This means the basic React setup is fine.
        </p>
        <p className="text-sm text-gray-500">
          Check the browser console for the success message.
        </p>
      </div>
    </div>
  );
};

export default MinimalTest;
