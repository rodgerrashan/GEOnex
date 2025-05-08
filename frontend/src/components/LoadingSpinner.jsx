import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-5 w-5 border-2 border-t-gray-900 border-gray-300"></div>
    </div>
  );
};

export default LoadingSpinner;
