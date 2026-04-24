// Pages/TvShows/hooks/VideoPlayer.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ActionBtn = ({ onClick, active, activeIcon, inactiveIcon, activeColor, label }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    title={label}
    className="flex flex-col items-center gap-1 group transition-all duration-200 hover:scale-110 active:scale-95"
  >
    <div className={`
      w-10 h-10 rounded-full flex items-center justify-center
      bg-black/60 backdrop-blur-md border border-white/10
      group-hover:border-white/30 transition-all duration-200
      ${active ? activeColor : 'text-white'}
    `}>
      <span className="text-lg leading-none">{active ? activeIcon : inactiveIcon}</span>
    </div>
    <span className="text-[10px] text-white/70 group-hover:text-white transition hidden sm:block">{label}</span>
  </button>
);

const UserListButtons = ({ tvShow, toggleFavorite, isInFavorites, toggleWatchLater, isInWatchLater, toggleWatching, isWatching }) => {
  if (!tvShow) return null;
  return (
    <div className="flex items-end gap-3">
      <ActionBtn onClick={() => toggleFavorite(tvShow)} active={isInFavorites(tvShow)} activeIcon="❤️" inactiveIcon="🤍" activeColor="text-red-500" label="المفضلة" />
      <ActionBtn onClick={() => toggleWatchLater(tvShow)} active={isInWatchLater(tvShow)} activeIcon="🔖" inactiveIcon="🕐" activeColor="text-yellow-400" label="لاحقاً" />
      <ActionBtn onClick={() => toggleWatching(tvShow)} active={isWatching(tvShow)} activeIcon="▶️" inactiveIcon="⏸️" activeColor="text-green-400" label="أتابع الآن" />
    </div>
  );
};

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
  episodes,
  onEpisodeChange,
  toggleFavorite,
  isInFavorites,
  toggleWatchLater,
  isInWatchLater,
  toggleWatching,
  isWatching,
}) => {

  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Refs لتتبع الوقت و state الحالي
  const controlsTimeoutRef = useRef(null);
  const isInteractingWithControlsRef = useRef(false);
  const touchCountRef = useRef(0);

  // كشف إذا كان الجهاز محمول
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // وظيفة موحدة لإخفاء الـ controls مع fade
  const hideControlsWithFade = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
    setShowControls(false);
  }, []);

  // وظيفة موحدة لإظهار الـ controls وإعادة ضبط المؤقت
  const showControlsWithTimer = useCallback((autoHideDelay = null) => {
    // تنظيف أي timeout موجود
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
    
    // إظهار الـ controls
    setShowControls(true);
    
    // تحديد المدة المطلوبة للإخفاء التلقائي
    let delay = autoHideDelay;
    
    // إذا لم يتم تحديد مدة، نحددها حسب الحالة
    if (delay === null) {
      if (isMobile && isFullscreen) {
        // موبايل في fullscreen: auto-hide بعد 3 ثواني (بدون لمس)
        delay = 3000;
      } else if (!isMobile && isFullscreen) {
        // Desktop في fullscreen: auto-hide بعد 2.5-3 ثواني
        delay = 2800;
      } else if (!isMobile && isHovering) {
        // Desktop hover: auto-hide بعد 2.5-3 ثواني من عدم الحركة
        delay = 2800;
      } else {
        // حالات أخرى لا تحتاج auto-hide
        delay = null;
      }
    }
    
    // ضبط المؤقت للإخفاء التلقائي إذا لزم الأمر
    if (delay !== null && delay > 0) {
      controlsTimeoutRef.current = setTimeout(() => {
        // لا نخفي الـ controls إذا كان المستخدم يتفاعل معها
        if (!isInteractingWithControlsRef.current) {
          setShowControls(false);
        }
        controlsTimeoutRef.current = null;
      }, delay);
    }
  }, [isMobile, isFullscreen, isHovering]);

  // Desktop: إظهار controls عند hover
  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      setIsHovering(true);
      showControlsWithTimer();
    }
  }, [isMobile, showControlsWithTimer]);

  // Desktop: إعادة ضبط المؤقت عند أي حركة mouse
  const handleMouseMove = useCallback(() => {
    if (!isMobile && showControls) {
      showControlsWithTimer();
    }
  }, [isMobile, showControls, showControlsWithTimer]);

  // Desktop/Mobile: إخفاء controls عند خروج mouse مع fade
  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      setIsHovering(false);
      hideControlsWithFade();
    } else {
      // Mobile: عند خروج اللمس من منطقة الفيديو (في fullscreen)
      if (isFullscreen) {
        // في fullscreen على الموبايل، نخفي بعد 3 ثواني فقط إذا لم يتم التفاعل
        if (!isInteractingWithControlsRef.current) {
          showControlsWithTimer(3000);
        }
      } else {
        hideControlsWithFade();
      }
    }
  }, [isMobile, isFullscreen, hideControlsWithFade, showControlsWithTimer]);

  // Mobile: إدارة الـ taps
  const handleTap = useCallback(() => {
    if (isMobile) {
      // نتأكد أننا لا نتفاعل مع الـ controls
      if (isInteractingWithControlsRef.current) {
        return;
      }
      
      // زيادة عداد اللمسات
      touchCountRef.current += 1;
      
      // أول tap: إظهار controls
      if (touchCountRef.current === 1) {
        showControlsWithTimer(isFullscreen ? 3000 : null);
        
        // إعادة تعيين العداد بعد فترة قصيرة
        setTimeout(() => {
          touchCountRef.current = 0;
        }, 300);
      } 
      // tap ثاني: إخفاء controls (فقط إذا لم يتم التفاعل مع الـ controls)
      else if (touchCountRef.current === 2) {
        hideControlsWithFade();
        touchCountRef.current = 0;
      }
    }
  }, [isMobile, isFullscreen, showControlsWithTimer, hideControlsWithFade]);

  // تفعيل الـ taps على الموبايل
  const handleClick = useCallback((e) => {
    // نتأكد أن العنصر الذي تم النقر عليه ليس داخل الـ controls
    const isControlElement = e.target.closest('.controls-bar, button, [role="button"]');
    
    if (isMobile && !isControlElement) {
      handleTap();
    }
  }, [isMobile, handleTap]);

  // منع إخفاء الـ controls عند التفاعل معها
  const handleControlsMouseEnter = useCallback(() => {
    isInteractingWithControlsRef.current = true;
    
    // إلغاء أي timeout للإخفاء
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = null;
    }
    
    // التأكد من أن الـ controls ظاهرة
    setShowControls(true);
  }, []);

  const handleControlsMouseLeave = useCallback(() => {
    isInteractingWithControlsRef.current = false;
    
    // إعادة ضبط المؤقت للإخفاء التلقائي إذا كنا في حالة تتطلب ذلك
    if (!isMobile && isHovering) {
      showControlsWithTimer();
    } else if (isMobile && isFullscreen) {
      showControlsWithTimer(3000);
    }
  }, [isMobile, isFullscreen, isHovering, showControlsWithTimer]);

  // تنظيف الـ timeout عند إزالة المكون
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const currentIndex = episodes?.findIndex(ep => ep.id === selectedEpisode?.id) ?? -1;
  const prevEpisode  = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode  = currentIndex !== -1 && currentIndex < (episodes?.length - 1) ? episodes[currentIndex + 1] : null;

  const ControlsBar = () => (
    <div 
      className="controls-bar"
      onMouseEnter={handleControlsMouseEnter}
      onMouseLeave={handleControlsMouseLeave}
    >
      <div className={`
        flex items-center justify-between gap-3 px-4 py-3
        ${isFullscreen
          ? 'absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/90 via-black/50 to-transparent'
          : 'bg-[#1a1a1a] border-t border-white/10'
        }
      `}>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full p-2.5 transition-all hover:scale-110 group"
            title={isFullscreen ? 'خروج من الشاشة الكاملة' : 'شاشة كاملة'}
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

        <div className="flex-1 flex justify-center">
          <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 max-w-[200px] md:max-w-xs truncate">
            <span className="text-sm text-white/90 font-medium truncate block text-center">
              {selectedEpisode?.name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => prevEpisode && onEpisodeChange(prevEpisode)}
              disabled={!prevEpisode}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all backdrop-blur-md
                ${prevEpisode ? 'bg-black/60 hover:bg-[#e50914]/80 hover:scale-105 cursor-pointer text-white' : 'bg-black/20 text-white/30 cursor-not-allowed'}`}
              title={prevEpisode ? `الحلقة ${prevEpisode.episode_number}: ${prevEpisode.name}` : 'لا توجد حلقة سابقة'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="hidden sm:inline">السابقة</span>
            </button>

            <button
              onClick={() => nextEpisode && onEpisodeChange(nextEpisode)}
              disabled={!nextEpisode}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition-all backdrop-blur-md
                ${nextEpisode ? 'bg-[#e50914]/80 hover:bg-[#e50914] hover:scale-105 cursor-pointer text-white' : 'bg-black/20 text-white/30 cursor-not-allowed'}`}
              title={nextEpisode ? `الحلقة ${nextEpisode.episode_number}: ${nextEpisode.name}` : 'لا توجد حلقة تالية'}
            >
              <span className="hidden sm:inline">التالية</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <UserListButtons
            tvShow={tvShow}
            toggleFavorite={toggleFavorite}
            isInFavorites={isInFavorites}
            toggleWatchLater={toggleWatchLater}
            isInWatchLater={isInWatchLater}
            toggleWatching={toggleWatching}
            isWatching={isWatching}
          />
        </div>
      </div>
    </div>
  );

  // ─── Error / No Episode ─────────────────────────────────────────────────────
  if (!selectedEpisode || !currentVideoUrl || videoError) {
    return (
      <div
        ref={playerContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
            </div>
            <p className="text-[#e50914] text-2xl md:text-3xl font-bold">عذراً، لا يمكن تشغيل هذا المسلسل حالياً</p>
            <p className="text-gray-400 text-base max-w-md">جميع السيرفرات لا تعمل. يرجى المحاولة مرة أخرى لاحقاً</p>
            <div className="flex gap-4 mt-6">
              <button onClick={resetPlayer} className="bg-[#e50914] hover:bg-[#b20710] px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105">إعادة المحاولة</button>
              <button onClick={() => setShowSidebar(true)} className="bg-gray-700 hover:bg-gray-600 px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105">اختيار حلقة أخرى</button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center text-center gap-5 p-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#e50914]/30 to-[#e50914]/5 flex items-center justify-center animate-float">
                <span className="text-6xl">🎬</span>
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">اختر حلقة للمشاهدة</h3>
            <p className="text-gray-400 text-base max-w-md">اختر موسماً وحلقة من القائمة أدناه للبدء في مشاهدة {tvShow?.name}</p>
            <button onClick={() => setShowSidebar(true)} className="mt-6 bg-[#e50914]/20 hover:bg-[#e50914]/30 text-white px-8 py-3 rounded-xl font-semibold transition-all border border-[#e50914]/30">استعراض الحلقات</button>
          </div>
        )}

        {/* في حالة الخطأ أو عدم وجود حلقة، نظهر الأزرار دائماً على المحمول */}
        <div className={`transition-opacity duration-300 ${
          (isMobile && (videoError || !selectedEpisode)) 
            ? 'opacity-100' 
            : (showControls ? 'opacity-100' : 'opacity-0 pointer-events-none')
        } ${
          isFullscreen ? 'absolute top-0 left-0 right-0 z-20' : 'absolute bottom-0 left-0 right-0 z-20'
        }`}>
          <ControlsBar />
        </div>
      </div>
    );
  }

  // ─── Player ─────────────────────────────────────────────────────────────────
  return (
    <div
      ref={playerContainerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
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

      {/* شريط التحكم - سلوك موحد مع fade */}
      <div className={`transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } ${
        isFullscreen ? 'absolute top-0 left-0 right-0 z-20' : 'absolute bottom-0 left-0 right-0 z-20'
      }`}>
        <ControlsBar />
      </div>

      {/* إضافة مؤشر للإشارة إلى إمكانية النقر على المحمول في وضع ملء الشاشة */}
      {isMobile && isFullscreen && !showControls && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/50 backdrop-blur-md rounded-full p-2">
            <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.5 4.5l-4 4" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};