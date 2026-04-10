// src/Pages/Movie/components/ErrorState.jsx
import React from 'react';

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center gap-5 text-center px-4">
      <p className="text-[#e50914] text-lg">⚠️ {message || 'الفيلم غير موجود'}</p>
      <button
        onClick={onRetry}
        className="bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-2.5 rounded-md transition-all"
      >
        إعادة المحاولة
      </button>
    </div>
  );
};