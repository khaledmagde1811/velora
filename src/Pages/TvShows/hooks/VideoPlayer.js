
// components/VideoPlayer.jsx
import React from 'react';

export const VideoPlayer = ({
  isFullscreen,
  playerContainerRef,
  selectedEpisode,
  selectedSeason,
  tvShow,
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
  setShowSidebar,
}) => {
  if (!selectedEpisode || !currentVideoUrl || videoError) {
    return (
      <div 
        ref={playerContainerRef}
        className={`relative w-full bg-black transition-all duration-700 ease-out ${
          isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[60vh] md:h-[70vh] lg:h-[80vh]'
        }`}
      >
        {videoError ? (
          <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center text-center gap-5 p-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-[#e50914]/10 flex items-center justify-center animate-bounce">
                <span className="text-6xl">⚠️</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#e50914] rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xs font-bold">!</span>
              </div>
            </div>
            <p className="text-[#e50914] text-2xl md:text-3xl font-bold">عذراً، لا يمكن تشغيل هذا المسلسل حالياً</p>
            <p className="text-gray-400 text-base max-w-md">جميع السيرفرات لا تعمل. يرجى المحاولة مرة أخرى لاحقاً</p>
            <div className="flex gap-4 mt-6">
              <button 
                onClick={resetPlayer}
                className="bg-[#e50914] hover:bg-[#b20710] px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg"
              >
                إعادة المحاولة
              </button>
              <button 
                onClick={() => setShowSidebar(true)}
                className="bg-gray-700 hover:bg-gray-600 px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105"
              >
                اختيار حلقة أخرى
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center text-center gap-5 p-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#e50914]/30 to-[#e50914]/5 flex items-center justify-center animate-float">
                <span className="text-6xl">🎬</span>
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-[#e50914] to-[#b20710] rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse shadow-lg">
                !
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
              اختر حلقة للمشاهدة
            </h3>
            <p className="text-gray-400 text-base max-w-md">
              اختر موسماً وحلقة من القائمة أدناه للبدء في مشاهدة {tvShow?.name}
            </p>
            <div className="flex gap-3 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-600 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <button 
              onClick={() => setShowSidebar(true)}
              className="mt-6 bg-[#e50914]/20 hover:bg-[#e50914]/30 text-white px-8 py-3 rounded-xl font-semibold transition-all border border-[#e50914]/30"
            >
              استعراض الحلقات
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
<div 
  ref={playerContainerRef}
  className={`relative w-full bg-black transition-all duration-700 ease-out ${
    isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[60vh] md:h-[70vh] lg:h-[80vh]'
  }`}
>
  <iframe
    key={iframeKey}
    src={currentVideoUrl}
    title={`${tvShow?.name} - S${selectedSeason?.season_number}E${selectedEpisode.episode_number}`}
    frameBorder="0"
    allowFullScreen
    className="w-full h-full border-0"
    onLoad={handleIframeLoad}
    onError={handleIframeError}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
  />
  
  {isVideoLoading && (
    // ...继续保持原有的 loading code
    <div className="absolute inset-0 bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-md flex items-center justify-center z-10 transition-all duration-500">
      {/* ... محتوى الـ loading من غير تغيير */}
    </div>
  )}
  
  {/* الأزرار - تتغير بناءً على وضع fullscreen */}
  <div className={`
    absolute left-0 right-0 z-20 transition-all duration-300
    ${isFullscreen 
      ? 'top-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-5 opacity-0 hover:opacity-100' 
      : 'bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 opacity-0 hover:opacity-100'
    }
  `}>
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        <button
          onClick={toggleFullscreen}
          className="bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full p-2.5 transition-all hover:scale-110 group"
          title={isFullscreen ? "خروج من الشاشة الكاملة" : "شاشة كاملة"}
        >
          {isFullscreen ? (
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>
        
        {workingUrls.length > 1 && (
          <button
            onClick={switchServer}
            className="bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full p-2.5 transition-all hover:scale-110 group"
            title="تغيير السيرفر"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs font-medium hidden sm:inline">
                سيرفر {currentServerIndex + 1}/{workingUrls.length}
              </span>
            </div>
          </button>
        )}
      </div>
      
      <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5">
        <span className="text-sm text-white/90 font-medium">
          {selectedEpisode?.name}
        </span>
      </div>
    </div>
  </div>
</div>
  );
};