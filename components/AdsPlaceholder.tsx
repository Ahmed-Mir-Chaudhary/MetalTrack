import React from 'react';

const AdsPlaceholder: React.FC = () => {
  return (
    <div className="my-6 w-full h-[100px] bg-gray-200 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 overflow-hidden relative">
      <span className="text-sm font-semibold uppercase tracking-wider">Advertisement</span>
      <span className="text-xs mt-1">Google Ads Placeholder</span>
      <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-gray-300 rounded-full opacity-20"></div>
      <div className="absolute -left-2 -top-2 w-16 h-16 bg-gray-300 rounded-full opacity-20"></div>
    </div>
  );
};

export default AdsPlaceholder;