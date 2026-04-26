// Pages/TvShows/hooks/VideoPlayer.jsx
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

const UserListButtons = ({ tvShow, toggleFavorite, isInFavorites, toggleWatchLater, isInWatchLater, toggleWatching, isWatching }) => {
  if (!tvShow) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
      <ActionBtn onClick={() => toggleFavorite(tvShow)} active={isInFavorites(tvShow)} activeIcon="❤️" inactiveIcon="🤍" activeColor="red" label="المفضلة" />
      <ActionBtn onClick={() => toggleWatchLater(tvShow)} active={isInWatchLater(tvShow)} activeIcon="🔖" inactiveIcon="🕐" activeColor="yellow" label="لاحقاً" />
      <ActionBtn onClick={() => toggleWatching(tvShow)} active={isWatching(tvShow)} activeIcon="▶️" inactiveIcon="⏸️" activeColor="green" label="أتابع الآن" />
    </div>
  );
};

const LoadingOverlay = ({ currentServerIndex, workingUrls }) => (
  <div style={{
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 12, zIndex: 10,
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
    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, margin: 0 }}>جاري تحميل الحلقة...</p>
    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: 0 }}>
      السيرفر {currentServerIndex + 1} من {workingUrls.length}
    </p>
  </div>
);

const ErrorState = ({ resetPlayer, setShowSidebar }) => (
  <div style={{
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 14, textAlign: 'center', padding: 24,
  }}>
    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      background: 'rgba(229,9,20,0.12)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 36,
    }}>⚠</div>
    <p style={{ color: '#ff4d4d', fontSize: 18, fontWeight: 500, margin: 0 }}>
      عذراً، لا يمكن تشغيل هذا المسلسل حالياً
    </p>
    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: 0 }}>
      جميع السيرفرات لا تعمل. يرجى المحاولة مرة أخرى لاحقاً
    </p>
    <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
      <button
        onClick={resetPlayer}
        style={{
          padding: '9px 24px', background: '#e50914',
          color: '#fff', border: 'none', borderRadius: 8,
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}
      >
        إعادة المحاولة
      </button>
      <button
        onClick={() => setShowSidebar(true)}
        style={{
          padding: '9px 24px', background: 'rgba(255,255,255,0.08)',
          color: '#fff', border: '0.5px solid rgba(255,255,255,0.15)',
          borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
        }}
      >
        اختيار حلقة أخرى
      </button>
    </div>
  </div>
);

const EmptyState = ({ tvShow, setShowSidebar }) => (
  <div style={{
    width: '100%', height: '100%',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 14, textAlign: 'center', padding: 24,
  }}>
    <div style={{
      width: 88, height: 88, borderRadius: '50%',
      background: 'rgba(229,9,20,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 40,
    }}>🎬</div>
    <p style={{ color: '#fff', fontSize: 20, fontWeight: 500, margin: 0 }}>
      اختر حلقة للمشاهدة
    </p>
    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, margin: 0, maxWidth: 340 }}>
      اختر موسماً وحلقة من القائمة للبدء في مشاهدة {tvShow?.name}
    </p>
    <button
      onClick={() => setShowSidebar(true)}
      style={{
        marginTop: 8, padding: '9px 24px',
        background: 'rgba(229,9,20,0.15)',
        color: '#fff',
        border: '0.5px solid rgba(229,9,20,0.35)',
        borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
      }}
    >
      استعراض الحلقات
    </button>
  </div>
);

const EpisodeNav = ({ prevEpisode, nextEpisode, onEpisodeChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <button
      onClick={() => prevEpisode && onEpisodeChange(prevEpisode)}
      disabled={!prevEpisode}
      title={prevEpisode ? `الحلقة ${prevEpisode.episode_number}: ${prevEpisode.name}` : 'لا توجد حلقة سابقة'}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '5px 10px',
        background: prevEpisode ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
        border: `0.5px solid ${prevEpisode ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)'}`,
        borderRadius: 99,
        color: prevEpisode ? '#fff' : 'rgba(255,255,255,0.25)',
        fontSize: 12, cursor: prevEpisode ? 'pointer' : 'not-allowed',
        transition: 'all 0.15s',
      }}
    >
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      السابقة
    </button>

    <button
      onClick={() => nextEpisode && onEpisodeChange(nextEpisode)}
      disabled={!nextEpisode}
      title={nextEpisode ? `الحلقة ${nextEpisode.episode_number}: ${nextEpisode.name}` : 'لا توجد حلقة تالية'}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '5px 10px',
        background: nextEpisode ? '#e50914' : 'rgba(255,255,255,0.03)',
        border: `0.5px solid ${nextEpisode ? '#e50914' : 'rgba(255,255,255,0.05)'}`,
        borderRadius: 99,
        color: nextEpisode ? '#fff' : 'rgba(255,255,255,0.25)',
        fontSize: 12, cursor: nextEpisode ? 'pointer' : 'not-allowed',
        transition: 'all 0.15s',
      }}
    >
      التالية
      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </div>
);

const ControlsBar = ({
  isFullscreen, toggleFullscreen,
  workingUrls, currentServerIndex, switchServer,
  selectedEpisode,
  prevEpisode, nextEpisode, onEpisodeChange,
  tvShow, toggleFavorite, isInFavorites,
  toggleWatchLater, isInWatchLater,
  toggleWatching, isWatching,
  showControls,
}) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.7), transparent)',
    borderTop: showControls ? '0.5px solid rgba(255,255,255,0.1)' : 'none',
    opacity: showControls ? 1 : 0,
    visibility: showControls ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
  }}>
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
            display: 'flex', alignItems: 'center', gap: 5,
            padding: '5px 10px',
            background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: 99,
            color: '#fff', fontSize: 12, cursor: 'pointer',
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

    <div style={{
      flex: 1, minWidth: 0,
      background: 'rgba(255,255,255,0.06)',
      border: '0.5px solid rgba(255,255,255,0.1)',
      borderRadius: 99,
      padding: '5px 14px',
      textAlign: 'center',
    }}>
      <span style={{
        fontSize: 13, fontWeight: 500, color: '#fff',
        whiteSpace: 'nowrap', overflow: 'hidden',
        textOverflow: 'ellipsis', display: 'block',
      }}>
        {selectedEpisode?.name}
      </span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <EpisodeNav
        prevEpisode={prevEpisode}
        nextEpisode={nextEpisode}
        onEpisodeChange={onEpisodeChange}
      />
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
);

export const VideoPlayer = ({
  isFullscreen,
  setIsFullscreen,
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
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const [isMouseMoving, setIsMouseMoving] = useState(false);

  const currentIndex = episodes?.findIndex(ep => ep.id === selectedEpisode?.id) ?? -1;
  const prevEpisode  = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode  = currentIndex !== -1 && currentIndex < (episodes?.length - 1) ? episodes[currentIndex + 1] : null;

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
      setIsFullscreen(fullscreen);
      
      // Reset controls visibility when exiting fullscreen
      if (!fullscreen) {
        setShowControls(true);
        if (controlsTimeout) clearTimeout(controlsTimeout);
      } else {
        // When entering fullscreen, show controls then auto-hide
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
  }, [setIsFullscreen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) clearTimeout(controlsTimeout);
    };
  }, [controlsTimeout]);

  const sharedControlsProps = {
    isFullscreen, toggleFullscreen,
    workingUrls, currentServerIndex, switchServer,
    selectedEpisode,
    prevEpisode, nextEpisode, onEpisodeChange,
    tvShow, toggleFavorite, isInFavorites,
    toggleWatchLater, isInWatchLater,
    toggleWatching, isWatching,
    showControls: showControls || !isFullscreen, // Always show if not fullscreen
  };

  return (
    <>
      <style>{`
        @keyframes vp-spin { to { transform: rotate(360deg); } }
        #vp-container:-webkit-full-screen { width: 100%; height: 100%; }
        #vp-container:-moz-full-screen    { width: 100%; height: 100%; }
        #vp-container:fullscreen          { width: 100%; height: 100%; background: #000; }
        
        /* Hide cursor when controls are hidden in fullscreen */
        #vp-container:fullscreen {
          cursor: ${isFullscreen && !showControls ? 'none' : 'auto'};
        }
      `}</style>

      <div
        id="vp-container"
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
            // Toggle controls on click in fullscreen mode
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
        {!selectedEpisode || !currentVideoUrl || videoError ? (
          <div style={{ flex: 1, position: 'relative' }}>
            {videoError
              ? <ErrorState resetPlayer={resetPlayer} setShowSidebar={setShowSidebar} />
              : <EmptyState tvShow={tvShow} setShowSidebar={setShowSidebar} />
            }
          </div>
        ) : (
          <>
            <iframe
              key={iframeKey}
              src={currentVideoUrl}
              title={`${tvShow?.name} - S${selectedSeason?.season_number}E${selectedEpisode.episode_number}`}
              frameBorder="0"
              allowFullScreen
              style={{ width: '100%', flex: 1, border: 0, display: 'block' }}
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
          </>
        )}

        <div 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            zIndex: 20,
            pointerEvents: showControls || !isFullscreen ? 'auto' : 'none',
          }}
        >
          <ControlsBar {...sharedControlsProps} />
        </div>
      </div>
    </>
  );
};