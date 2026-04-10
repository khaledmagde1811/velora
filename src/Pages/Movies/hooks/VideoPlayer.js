// src/Pages/Movie/components/VideoPlayer.jsx (محسن ب Tailwind CSS)
import React from 'react';

export const VideoPlayer = ({
  isFullscreen,
  playerContainerRef,
  movie,
  currentVideoUrl,
  videoError,
  isVideoLoading,
  iframeKey,
  workingUrls,
  currentServerIndex,
  handleIframeLoad,
  handleIframeError,
  switchServer,
  toggleFullscreen,
  resetPlayer,
}) => {
  return (
    <div
      ref={playerContainerRef}
      className={`
        relative w-full bg-black transition-all duration-700 ease-out
        ${isFullscreen 
          ? 'fixed inset-0 z-50 h-screen' 
          : 'h-[60vh] md:h-[70vh] lg:h-[80vh]'
        }
      `}
    >
      {/* Video Player Content */}
      {currentVideoUrl && !videoError ? (
        <div className="relative w-full h-full">
          <iframe
            key={iframeKey}
            src={currentVideoUrl.url}
            title={movie?.title}
            frameBorder="0"
            allowFullScreen
            className="w-full h-full border-0"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          />

          {/* Loading Overlay */}
          {isVideoLoading && (
            <div className="absolute inset-0 bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-md flex items-center justify-center z-10 transition-all duration-500">
              <div className="text-center transform transition-all duration-500 scale-100">
                {/* Animated Spinner */}
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-gray-800/50"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#e50914] border-r-[#e50914] border-b-transparent border-l-transparent animate-spin"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#e50914]/20 to-transparent animate-pulse"></div>
                </div>
                
                <p className="text-white text-sm md:text-base font-medium mb-2 tracking-wide">
                  جاري تحميل الفيلم...
                </p>
                
                <p className="text-gray-400 text-xs md:text-sm">
                  السيرفر {currentServerIndex + 1} من {workingUrls.length}
                </p>
                
                {/* Loading Progress Bar */}
                <div className="w-48 md:w-64 h-1 bg-gray-800 rounded-full mt-4 mx-auto overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#e50914] to-[#ff4d4d] rounded-full animate-pulse transition-all duration-300" 
                    style={{ width: `${((currentServerIndex + 1) / workingUrls.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ) : videoError ? (
        /* Error State */
        <div className="w-full h-full bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center text-center gap-4 p-4">
          <div className="relative">
            <div className="absolute inset-0 bg-[#e50914]/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-[#e50914]/10 flex items-center justify-center">
              <span className="text-6xl animate-bounce">⚠️</span>
            </div>
          </div>
          <p className="text-[#e50914] text-lg md:text-xl font-semibold">
            عذراً، لا يمكن تشغيل هذا الفيلم حالياً
          </p>
          <p className="text-gray-400 text-sm">
            جميع السيرفرات لا تعمل
          </p>
          <button
            onClick={resetPlayer}
            className="
              bg-gradient-to-r from-[#e50914] to-[#ff4d4d] 
              hover:from-[#b20710] hover:to-[#e50914] 
              px-6 py-2.5 rounded-md 
              transition-all transform hover:scale-105 
              shadow-lg
            "
          >
            إعادة المحاولة
          </button>
        </div>
      ) : (
        /* Initial Loading State */
        <div className="w-full h-full bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center text-center gap-3 p-4">
          <div className="relative">
            <div className="absolute inset-0 bg-[#e50914]/20 rounded-full blur-xl animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-[#e50914]/20 flex items-center justify-center animate-pulse">
              <span className="text-4xl animate-float">🎬</span>
            </div>
          </div>
          <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            جاري تجهيز المشغل...
          </p>
          <p className="text-gray-400 text-sm">
            سيبدأ الفيديو قريباً
          </p>
        </div>
      )}

      {/* Video Controls */}
      {!videoError && currentVideoUrl && (
        <div
          className={`
            absolute left-0 right-0 z-20 
            transition-all duration-300
            ${isFullscreen 
              ? 'top-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-5 opacity-0 hover:opacity-100' 
              : 'bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 opacity-0 hover:opacity-100'
            }
          `}
        >
          <div className="flex items-center justify-between">
            {/* Left Controls Group */}
            <div className="flex items-center gap-3">
              {/* Fullscreen Toggle Button */}
              <button
                onClick={toggleFullscreen}
                className="
                  bg-black/60 hover:bg-black/80 
                  backdrop-blur-md rounded-full p-2.5 
                  transition-all hover:scale-110 
                  group
                "
                title={isFullscreen ? "خروج من الشاشة الكاملة" : "شاشة كاملة"}
              >
                {isFullscreen ? (
                  <svg 
                    className="w-5 h-5 group-hover:scale-110 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                ) : (
                  <svg 
                    className="w-5 h-5 group-hover:scale-110 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" 
                    />
                  </svg>
                )}
              </button>

              {/* Server Switcher Button */}
              {workingUrls.length > 1 && (
                <button
                  onClick={switchServer}
                  className="
                    bg-black/60 hover:bg-black/80 
                    backdrop-blur-md rounded-full p-2.5 
                    transition-all hover:scale-110 
                    group
                  "
                  title="تغيير السيرفر"
                >
                  <div className="flex items-center gap-2">
                    <svg 
                      className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                      />
                    </svg>
                    <span className="text-xs font-medium hidden sm:inline">
                      سيرفر {currentServerIndex + 1}/{workingUrls.length}
                    </span>
                  </div>
                </button>
              )}
            </div>

            {/* Movie Title Badge */}
            <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5">
              <span className="
                text-sm text-white/90 font-medium 
                truncate block 
                max-w-[200px] md:max-w-md
              ">
                {movie?.title}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};