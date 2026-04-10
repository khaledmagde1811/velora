// src/Pages/Movie/components/LoadingState.jsx
import React from 'react';

export const LoadingState = () => {
  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-gray-700 border-t-[#e50914] rounded-full animate-spin"></div>
      <p className="text-white mt-4 text-sm sm:text-base">جاري تحميل الفيلم...</p>
    </div>
  );
};