// components/ErrorState.jsx
import React from 'react';

export const ErrorState = ({ message, onRetry }) => (
  <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center p-4">
    <div className="relative">
      <div className="w-28 h-28 rounded-full bg-[#e50914]/10 flex items-center justify-center animate-bounce">
        <span className="text-6xl">⚠️</span>
      </div>
      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#e50914] rounded-full flex items-center justify-center animate-pulse">
        <span className="text-white text-xs font-bold">!</span>
      </div>
    </div>
    <p className="text-[#e50914] text-2xl md:text-3xl font-bold mt-6 text-center">
      {message || 'حدث خطأ في تحميل المسلسل'}
    </p>
    <p className="text-gray-400 text-base max-w-md text-center mt-3">
      يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى
    </p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="mt-8 bg-[#e50914] hover:bg-[#b20710] px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg"
      >
        إعادة المحاولة
      </button>
    )}
  </div>
);