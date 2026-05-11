import React from "react";
import { useNavigate } from '../../next-router-dom';

function NetflixHero() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#141414]">

      {/* Background Image - opacity على الصورة بس */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url('/bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.6, // ✅ غير الرقم حسب اللي يعجبك (0.1 → 1)
        }}
      />

      {/* Overlays فوق الصورة بـ opacity كاملة */}
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-start justify-center px-4 md:px-8 lg:px-16 py-0">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#e50914]/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
            <div className="w-2 h-2 bg-[#e50914] rounded-full animate-pulse"></div>
            <span className="text-[#e50914] text-xs font-semibold tracking-wide">
              الآن على VELORA
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tighter">
            ترفيه
            <span className="text-[#e50914] block">غير محدود</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl mb-6 max-w-lg">
            آلاف الأفلام والمسلسلات الجاهزة للمشاهدة. شاهد في أي وقت وفي أي مكان.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/moviespagde")}
              className="group relative px-8 py-3 bg-[#e50914] text-white rounded-md font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-[#b20710] shadow-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                ابدأ الآن
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            <button
              onClick={() => navigate("/tvshows")}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-md font-semibold text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
            >
              تصفح الآن
            </button>
          </div>

          <div className="flex gap-6 mt-8 pt-4 border-t border-white/10">
            <div>
              <p className="text-white text-xl font-bold">10K+</p>
              <p className="text-gray-500 text-xs">فيلم ومسلسل</p>
            </div>
            <div>
              <p className="text-white text-xl font-bold">500+</p>
              <p className="text-gray-500 text-xs">إنتاج أصلي</p>
            </div>
            <div>
              <p className="text-white text-xl font-bold">4.8</p>
              <p className="text-gray-500 text-xs">⭐ تقييم</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#e50914] to-transparent" />
    </div>
  );
}

export default NetflixHero;