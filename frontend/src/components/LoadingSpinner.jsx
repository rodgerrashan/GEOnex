import React from 'react';

const LoadingSpinner = ({ size = 5 }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className={`animate-spin rounded-full h-${size} w-${size} border-2 border-t-gray-900 border-gray-300`}></div>
    </div>
  );
};

export default LoadingSpinner;
