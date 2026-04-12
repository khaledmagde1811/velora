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
  // ✅ props جديدة للحلقة السابقة والتالية
  episodes,
  onEpisodeChange,
}) => {

  // ✅ حساب الحلقة السابقة والتالية
  const currentIndex = episodes?.findIndex(ep => ep.id === selectedEpisode?.id) ?? -1;
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex !== -1 && currentIndex < (episodes?.length - 1) ? episodes[currentIndex + 1] : null;

  // ✅ شريط الكنترول - هيتعرض تحت الفيديو أو فوقه حسب الـ fullscreen
  const ControlsBar = () => (
    <div className={`
      flex items-center justify-between gap-3 px-4 py-3
      ${isFullscreen 
        ? 'absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 via-black/50 to-transparent' 
        : 'bg-[#1a1a1a] border-t border-white/10'
      }
    `}>
      {/* ✅ مجموعة اليسار: fullscreen + server */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleFullscreen}
          className="bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full p-2.5 transition-all hover:scale-110 group"
          title={isFullscreen ? "خروج من الشاشة الكاملة" : "شاشة كاملة"}
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="flex items-center gap-1.5">
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs font-medium hidden sm:inline">
                {currentServerIndex + 1}/{workingUrls.length}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* ✅ الوسط: اسم الحلقة */}
      <div className="flex-1 flex justify-center">
        <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 max-w-[200px] md:max-w-xs truncate">
          <span className="text-sm text-white/90 font-medium truncate block text-center">
            {selectedEpisode?.name}
          </span>
        </div>
      </div>

      {/* ✅ مجموعة اليمين: الحلقة السابقة والتالية */}
      <div className="flex items-center gap-2">
        {/* زر الحلقة السابقة */}
        <button
          onClick={() => prevEpisode && onEpisodeChange(prevEpisode)}
          disabled={!prevEpisode}
          className={`
            flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium
            transition-all backdrop-blur-md
            ${prevEpisode 
              ? 'bg-black/60 hover:bg-[#e50914]/80 hover:scale-105 cursor-pointer text-white' 
              : 'bg-black/20 text-white/30 cursor-not-allowed'
            }
          `}
          title={prevEpisode ? `الحلقة ${prevEpisode.episode_number}: ${prevEpisode.name}` : 'لا توجد حلقة سابقة'}
        >
          {/* سهم لليمين (RTL = سابقة) */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="hidden sm:inline">السابقة</span>
        </button>

        {/* زر الحلقة التالية */}
        <button
          onClick={() => nextEpisode && onEpisodeChange(nextEpisode)}
          disabled={!nextEpisode}
          className={`
            flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium
            transition-all backdrop-blur-md
            ${nextEpisode 
              ? 'bg-[#e50914]/80 hover:bg-[#e50914] hover:scale-105 cursor-pointer text-white' 
              : 'bg-black/20 text-white/30 cursor-not-allowed'
            }
          `}
          title={nextEpisode ? `الحلقة ${nextEpisode.episode_number}: ${nextEpisode.name}` : 'لا توجد حلقة تالية'}
        >
          <span className="hidden sm:inline">التالية</span>
          {/* سهم لليسار (RTL = تالية) */}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  );

  // ✅ حالة Error أو مفيش حلقة مختارة
  if (!selectedEpisode || !currentVideoUrl || videoError) {
    return (
      <>
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
                <button onClick={resetPlayer} className="bg-[#e50914] hover:bg-[#b20710] px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg">
                  إعادة المحاولة
                </button>
                <button onClick={() => setShowSidebar(true)} className="bg-gray-700 hover:bg-gray-600 px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105">
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
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-[#e50914] to-[#b20710] rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse shadow-lg">!</div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">اختر حلقة للمشاهدة</h3>
              <p className="text-gray-400 text-base max-w-md">اختر موسماً وحلقة من القائمة أدناه للبدء في مشاهدة {tvShow?.name}</p>
              <button onClick={() => setShowSidebar(true)} className="mt-6 bg-[#e50914]/20 hover:bg-[#e50914]/30 text-white px-8 py-3 rounded-xl font-semibold transition-all border border-[#e50914]/30">
                استعراض الحلقات
              </button>
            </div>
          )}
        </div>

        {/* ✅ شريط الكنترول تحت الفيديو حتى في حالة Error */}
        {!isFullscreen && <ControlsBar />}
      </>
    );
  }

  return (
    <>
      {/* Player Container */}
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

        {/* Loading Overlay */}
        {isVideoLoading && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-md flex items-center justify-center z-10">
            <div className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-gray-800/50"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-[#e50914] border-r-[#e50914] border-b-transparent border-l-transparent animate-spin"></div>
              </div>
              <p className="text-white text-sm font-medium mb-1">جاري تحميل الحلقة...</p>
              <p className="text-gray-400 text-xs">السيرفر {currentServerIndex + 1} من {workingUrls.length}</p>
            </div>
          </div>
        )}

        {/* ✅ الكنترول فوق الفيديو فقط في fullscreen */}
        {isFullscreen && <ControlsBar />}
      </div>

      {/* ✅ الكنترول تحت الفيديو في الوضع العادي */}
      {!isFullscreen && <ControlsBar />}
    </>
  );
};