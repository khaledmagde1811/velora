// src/Pages/Movie/components/VideoPlayer.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ActionBtn = ({ onClick, active, activeIcon, inactiveIcon, activeColor = 'text-red-500', label }) => (
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

const UserListButtons = ({ movie, toggleFavorite, isInFavorites, toggleWatchLater, isInWatchLater, toggleWatching, isWatching }) => {
  if (!movie) return null;
  return (
    <div className="flex items-end gap-3">
      <ActionBtn onClick={() => toggleFavorite(movie)} active={isInFavorites(movie)} activeIcon="❤️" inactiveIcon="🤍" activeColor="text-red-500" label="المفضلة" />
      <ActionBtn onClick={() => toggleWatchLater(movie)} active={isInWatchLater(movie)} activeIcon="🔖" inactiveIcon="🕐" activeColor="text-yellow-400" label="لاحقاً" />
      <ActionBtn onClick={() => toggleWatching(movie)} active={isWatching(movie)} activeIcon="▶️" inactiveIcon="⏸️" activeColor="text-green-400" label="أتابع الآن" />
    </div>
  );
};

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
  toggleFavorite,
  isInFavorites,
  toggleWatchLater,
  isInWatchLater,
  toggleWatching,
  isWatching,
}) => {

  const [showControls, setShowControls] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs لإدارة الوقت والتفاعلات
  const hideTimeoutRef = useRef(null);
  const isHoveringRef = useRef(false);
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

  // وظيفة موحدة لإخفاء الـ controls
  const hideControls = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowControls(false);
  }, []);

  // وظيفة موحدة لإظهار الـ controls وإعادة ضبط المؤقت
  const showControlsWithTimer = useCallback((customDelay = null) => {
    // تنظيف أي timeout موجود
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    // إظهار الـ controls
    setShowControls(true);
    
    // تحديد مدة الإخفاء التلقائي
    let delay = customDelay;
    
    if (delay === null) {
      if (isMobile && isFullscreen) {
        // موبايل في fullscreen: auto-hide بعد 3 ثواني بدون لمس
        delay = 3000;
      } else if (!isMobile && isFullscreen) {
        // Desktop في fullscreen: auto-hide بعد 2.5-3 ثواني
        delay = 2800;
      } else if (!isMobile && isHoveringRef.current) {
        // Desktop hover: auto-hide بعد 2.5-3 ثواني من عدم الحركة
        delay = 2800;
      } else {
        delay = null;
      }
    }
    
    // ضبط المؤقت للإخفاء التلقائي
    if (delay !== null && delay > 0) {
      hideTimeoutRef.current = setTimeout(() => {
        if (!isInteractingWithControlsRef.current) {
          setShowControls(false);
        }
        hideTimeoutRef.current = null;
      }, delay);
    }
  }, [isMobile, isFullscreen]);

  // Desktop: إظهار controls عند hover
  const handleMouseEnter = useCallback(() => {
    if (!isMobile) {
      isHoveringRef.current = true;
      showControlsWithTimer();
    }
  }, [isMobile, showControlsWithTimer]);

  // Desktop: إعادة ضبط المؤقت عند أي حركة mouse
  const handleMouseMove = useCallback(() => {
    if (!isMobile && showControls) {
      showControlsWithTimer();
    }
  }, [isMobile, showControls, showControlsWithTimer]);

  // إخفاء controls فور خروج mouse مع fade
  const handleMouseLeave = useCallback(() => {
    if (!isMobile) {
      isHoveringRef.current = false;
      hideControls();
    }
  }, [isMobile, hideControls]);

  // Mobile: إدارة الـ taps
  const handleTap = useCallback(() => {
    if (isMobile && !isInteractingWithControlsRef.current) {
      touchCountRef.current += 1;
      
      if (touchCountRef.current === 1) {
        // أول tap: إظهار controls
        showControlsWithTimer(isFullscreen ? 3000 : null);
        
        // إعادة تعيين العداد بعد فترة قصيرة
        setTimeout(() => {
          touchCountRef.current = 0;
        }, 300);
      } else if (touchCountRef.current === 2) {
        // tap ثاني: إخفاء controls
        hideControls();
        touchCountRef.current = 0;
      }
    }
  }, [isMobile, isFullscreen, showControlsWithTimer, hideControls]);

  // معالج النقر الموحد
  const handleClick = useCallback((e) => {
    // التأكد أن العنصر الذي تم النقر عليه ليس داخل الـ controls
    const isControlElement = e.target.closest('.controls-bar, button, [role="button"]');
    
    if (isMobile && !isControlElement && !videoError && currentVideoUrl) {
      handleTap();
    }
  }, [isMobile, handleTap, videoError, currentVideoUrl]);

  // منع إخفاء الـ controls عند التفاعل معها
  const handleControlsMouseEnter = useCallback(() => {
    isInteractingWithControlsRef.current = true;
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    setShowControls(true);
  }, []);

  const handleControlsMouseLeave = useCallback(() => {
    isInteractingWithControlsRef.current = false;
    
    // إعادة ضبط المؤقت للإخفاء التلقائي
    if (!isMobile && isHoveringRef.current) {
      showControlsWithTimer();
    } else if (isMobile && isFullscreen && !videoError) {
      showControlsWithTimer(3000);
    }
  }, [isMobile, isFullscreen, showControlsWithTimer, videoError]);

  // تنظيف الـ timeout عند إزالة المكون
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

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
          <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5 max-w-[200px] md:max-w-md">
            <span className="text-sm text-white/90 font-medium truncate block text-center">{movie?.title}</span>
          </div>
        </div>

        <div className="w-auto flex justify-end">
          <UserListButtons
            movie={movie}
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

  return (
    <>
      <div
        ref={playerContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className={`
          relative w-full bg-black transition-all duration-700 ease-out
          ${isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[60vh] md:h-[70vh] lg:h-[80vh]'}
        `}
      >
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

            {isVideoLoading && (
              <div className="absolute inset-0 bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-md flex items-center justify-center z-10 transition-all duration-500">
                <div className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-gray-800/50"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#e50914] border-r-[#e50914] border-b-transparent border-l-transparent animate-spin"></div>
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#e50914]/20 to-transparent animate-pulse"></div>
                  </div>
                  <p className="text-white text-sm md:text-base font-medium mb-2 tracking-wide">جاري تحميل الفيلم...</p>
                  <p className="text-gray-400 text-xs md:text-sm">السيرفر {currentServerIndex + 1} من {workingUrls.length}</p>
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
          <div className="w-full h-full bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center text-center gap-4 p-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#e50914]/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-[#e50914]/10 flex items-center justify-center">
                <span className="text-6xl animate-bounce">⚠️</span>
              </div>
            </div>
            <p className="text-[#e50914] text-lg md:text-xl font-semibold">عذراً، لا يمكن تشغيل هذا الفيلم حالياً</p>
            <p className="text-gray-400 text-sm">جميع السيرفرات لا تعمل</p>
            <button onClick={resetPlayer} className="bg-gradient-to-r from-[#e50914] to-[#ff4d4d] hover:from-[#b20710] hover:to-[#e50914] px-6 py-2.5 rounded-md transition-all transform hover:scale-105 shadow-lg">
              إعادة المحاولة
            </button>
          </div>

        ) : (
          <div className="w-full h-full bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center text-center gap-3 p-4">
            <div className="relative">
              <div className="absolute inset-0 bg-[#e50914]/20 rounded-full blur-xl animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-[#e50914]/20 flex items-center justify-center animate-pulse">
                <span className="text-4xl">🎬</span>
              </div>
            </div>
            <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">جاري تجهيز المشغل...</p>
            <p className="text-gray-400 text-sm">سيبدأ الفيديو قريباً</p>
          </div>
        )}

        {/* Controls مع transition سلس */}
        <div className={`transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${
          isFullscreen
            ? 'absolute top-0 left-0 right-0 z-20'
            : 'absolute bottom-0 left-0 right-0 z-20'
        }`}>
          <ControlsBar />
        </div>

        {/* إضافة مؤشر للإشارة إلى إمكانية النقر على المحمول في وضع ملء الشاشة */}
        {isMobile && isFullscreen && !videoError && currentVideoUrl && !showControls && !isVideoLoading && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/50 backdrop-blur-md rounded-full p-2 animate-pulse">
              <svg className="w-8 h-8 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.5 4.5l-4 4" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </>
  );
};