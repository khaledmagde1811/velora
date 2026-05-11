// src/Pages/Movie/components/VideoPlayer.jsx
import React, { useEffect, useState } from 'react';

const ActionBtn = ({ onClick, active, activeIcon, inactiveIcon, activeColor, label }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    title={label}
    style={{
      width: 36, height: 36,
      borderRadius: '50%',
      background: active
        ? activeColor === 'red' ? 'rgba(229,9,20,0.12)'
        : activeColor === 'yellow' ? 'rgba(250,204,21,0.08)'
        : 'rgba(74,222,128,0.08)'
        : 'rgba(255,255,255,0.05)',
      border: `0.5px solid ${
        active
          ? activeColor === 'red' ? 'rgba(229,9,20,0.5)'
          : activeColor === 'yellow' ? 'rgba(250,204,21,0.4)'
          : 'rgba(74,222,128,0.4)'
          : 'rgba(255,255,255,0.1)'
      }`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 15,
      transition: 'all 0.15s',
      flexShrink: 0,
    }}
  >
    {active ? activeIcon : inactiveIcon}
  </button>
);

const UserListButtons = ({ movie, toggleFavorite, isInFavorites, toggleWatchLater, isInWatchLater, toggleWatching, isWatching }) => {
  if (!movie) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
      <ActionBtn onClick={() => toggleFavorite(movie)} active={isInFavorites(movie)} activeIcon="❤️" inactiveIcon="🤍" activeColor="red" label="المفضلة" />
      <ActionBtn onClick={() => toggleWatchLater(movie)} active={isInWatchLater(movie)} activeIcon="🔖" inactiveIcon="🕐" activeColor="yellow" label="لاحقاً" />
      <ActionBtn onClick={() => toggleWatching(movie)} active={isWatching(movie)} activeIcon="▶️" inactiveIcon="⏸️" activeColor="green" label="أتابع الآن" />
    </div>
  );
};

const LoadingOverlay = ({ currentServerIndex, workingUrls }) => (
  <div style={{
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 14, zIndex: 10,
  }}>
    <div style={{ position: 'relative', width: 56, height: 56 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.08)',
      }} />
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '3px solid transparent',
        borderTopColor: '#e50914', borderRightColor: '#e50914',
        animation: 'vp-spin 0.9s linear infinite',
      }} />
    </div>
    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0 }}>جاري تحميل الفيلم...</p>
    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
      السيرفر {currentServerIndex + 1} من {workingUrls.length}
    </p>
    <div style={{ width: 180, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 99,
        background: '#e50914',
        width: `${((currentServerIndex + 1) / workingUrls.length) * 100}%`,
        transition: 'width 0.3s',
      }} />
    </div>
  </div>
);

const ErrorState = ({ resetPlayer }) => (
  <div style={{
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 14, textAlign: 'center', padding: 16,
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: 'rgba(229,9,20,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 32,
    }}>⚠</div>
    <p style={{ color: '#ff4d4d', fontSize: 15, fontWeight: 500, margin: 0 }}>
      عذراً، لا يمكن تشغيل هذا الفيلم حالياً
    </p>
    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, margin: 0 }}>
      جميع السيرفرات لا تعمل
    </p>
    <button
      onClick={resetPlayer}
      style={{
        padding: '8px 22px', background: '#e50914',
        color: '#fff', border: 'none', borderRadius: 6,
        fontSize: 13, cursor: 'pointer',
      }}
    >
      إعادة المحاولة
    </button>
  </div>
);

const ReadyState = () => (
  <div style={{
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: 10,
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: 'rgba(229,9,20,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 32,
    }}>🎬</div>
    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: 500, margin: 0 }}>
      جاري تجهيز المشغل...
    </p>
    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>
      سيبدأ الفيديو قريباً
    </p>
  </div>
);

const ControlsBar = ({
  isFullscreen, toggleFullscreen,
  movie, workingUrls, currentServerIndex, switchServer,
  toggleFavorite, isInFavorites, toggleWatchLater, isInWatchLater, toggleWatching, isWatching,
}) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px',
    background: '#1a1a1a',
    borderTop: '0.5px solid rgba(255,255,255,0.1)',
  
  }}>
    {/* Right: fullscreen + server */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'خروج من الشاشة الكاملة' : 'شاشة كاملة'}
        style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          border: '0.5px solid rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#fff', transition: 'all 0.15s',
        }}
      >
        {isFullscreen ? (
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        )}
      </button>

      {workingUrls.length > 1 && (
        <button
          onClick={switchServer}
          title="تغيير السيرفر"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 10px',
            background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: 99,
            color: '#fff', fontSize: 12, cursor: 'pointer',
            flexShrink: 0, whiteSpace: 'nowrap',
            transition: 'all 0.15s',
          }}
        >
          <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {currentServerIndex + 1}/{workingUrls.length}
        </button>
      )}
    </div>

    {/* Center: title */}
    <div style={{
      flex: 1, minWidth: 0,
      background: 'rgba(255,255,255,0.06)',
      border: '0.5px solid rgba(255,255,255,0.1)',
      borderRadius: 99,
      padding: '6px 14px',
      textAlign: 'center', overflow: 'hidden',
    }}>
      <span style={{
        fontSize: 13, fontWeight: 500, color: '#fff',
        whiteSpace: 'nowrap', overflow: 'hidden',
        textOverflow: 'ellipsis', display: 'block',
      }}>
        {movie?.title}
      </span>
    </div>

    {/* Left: list buttons */}
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
);

export const VideoPlayer = ({
  playerContainerRef,
  isFullscreen,
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
  resetPlayer,
  toggleFavorite,
  isInFavorites,
  toggleWatchLater,
  isInWatchLater,
  toggleWatching,
  isWatching,
}) => {
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const [isMouseMoving, setIsMouseMoving] = useState(false);

  // ── Fullscreen API ──────────────────────────────────────────────────────────
  const toggleFullscreen = () => {
    const el = playerContainerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      (el.requestFullscreen?.()
        ?? el.webkitRequestFullscreen?.()
        ?? el.mozRequestFullScreen?.()
        ?? el.msRequestFullscreen?.());
    } else {
      (document.exitFullscreen?.()
        ?? document.webkitExitFullscreen?.()
        ?? document.mozCancelFullScreen?.()
        ?? document.msExitFullscreen?.());
    }
  };

  // Auto-hide controls in fullscreen mode
  const resetControlsTimer = () => {
    if (!isFullscreen) return;
    
    setShowControls(true);
    setIsMouseMoving(true);
    
    if (controlsTimeout) clearTimeout(controlsTimeout);
    
    const newTimeout = setTimeout(() => {
      if (isFullscreen) {
        setShowControls(false);
        setIsMouseMoving(false);
      }
    }, 3000);
    
    setControlsTimeout(newTimeout);
  };

  // Show controls on mouse move in fullscreen
  const handleMouseMove = () => {
    if (isFullscreen) {
      resetControlsTimer();
    }
  };

  // Handle mouse leave to hide controls faster
  const handleMouseLeave = () => {
    if (isFullscreen && !isMouseMoving) {
      setShowControls(false);
    }
  };

  // Handle touch for mobile devices
  const handleTouchStart = () => {
    if (isFullscreen) {
      if (showControls) {
        // If controls are visible, hide them after 2 seconds
        if (controlsTimeout) clearTimeout(controlsTimeout);
        const newTimeout = setTimeout(() => {
          if (isFullscreen) setShowControls(false);
        }, 2000);
        setControlsTimeout(newTimeout);
      } else {
        // If controls are hidden, show them
        setShowControls(true);
        // Auto hide after 3 seconds
        if (controlsTimeout) clearTimeout(controlsTimeout);
        const newTimeout = setTimeout(() => {
          if (isFullscreen) setShowControls(false);
        }, 3000);
        setControlsTimeout(newTimeout);
      }
    }
  };

  // مزامنة الـ state مع المتصفح (Escape مثلاً)
  useEffect(() => {
    const handler = () => {
      const fullscreen = !!document.fullscreenElement;

      // Parent fullscreen hook already updates isFullscreen.
      // Here we only reset control visibility when fullscreen changes.
      if (!fullscreen) {
        setShowControls(true);
        if (controlsTimeout) clearTimeout(controlsTimeout);
      } else {
        setShowControls(true);
        const timeout = setTimeout(() => {
          if (fullscreen) setShowControls(false);
        }, 3000);
        setControlsTimeout(timeout);
      }
    };

    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [controlsTimeout]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [controlsTimeout]);
  // ───────────────────────────────────────────────────────────────────────────

  return (
  <>
    <style>{`
      @keyframes vp-spin { to { transform: rotate(360deg); } }
      #vp-movie-container:fullscreen          { width: 100%; height: 100%; background: #000; }
      #vp-movie-container:-webkit-full-screen { width: 100%; height: 100%; }
      #vp-movie-container:-moz-full-screen    { width: 100%; height: 100%; }
      
      /* Hide cursor when controls are hidden in fullscreen */
      #vp-movie-container:fullscreen {
        cursor: ${isFullscreen && !showControls ? 'none' : 'auto'};
      }
    `}</style>

    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Video Container */}
      <div
        id="vp-movie-container"
        ref={playerContainerRef}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          cursor: isFullscreen && !showControls ? 'none' : 'auto',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onClick={() => {
          if (isFullscreen) {
            if (showControls) {
              setShowControls(false);
              if (controlsTimeout) clearTimeout(controlsTimeout);
            } else {
              setShowControls(true);
              resetControlsTimer();
            }
          }
        }}
      >
        {currentVideoUrl && !videoError ? (
          <div style={{ position: 'relative', width: '100%', flex: 1 }}>
            <iframe
              key={iframeKey}
              src={currentVideoUrl.url}
              title={movie?.title}
              frameBorder="0"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            />
            {isVideoLoading && (
              <LoadingOverlay
                currentServerIndex={currentServerIndex}
                workingUrls={workingUrls}
              />
            )}
          </div>
        ) : videoError ? (
          <div style={{ flex: 1 }}>
            <ErrorState resetPlayer={resetPlayer} />
          </div>
        ) : (
          <div style={{ flex: 1 }}>
            <ReadyState />
          </div>
        )}
      </div>

      {/* Controls Bar - Now outside the video container */}
      <div 
        style={{ 
          width: '100%',
          pointerEvents: showControls || !isFullscreen ? 'auto' : 'none',
        }}
      >
        <ControlsBar
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          movie={movie}
          workingUrls={workingUrls}
          currentServerIndex={currentServerIndex}
          switchServer={switchServer}
          toggleFavorite={toggleFavorite}
          isInFavorites={isInFavorites}
          toggleWatchLater={toggleWatchLater}
          isInWatchLater={isInWatchLater}
          toggleWatching={toggleWatching}
          isWatching={isWatching}
          showControls={showControls || !isFullscreen}
        />
      </div>
    </div>
  </>
);
};