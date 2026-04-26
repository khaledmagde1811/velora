// src/Pages/Movie/components/VideoPlayer.jsx
import React, { useState, useEffect, useCallback } from 'react';

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
  movie, workingUrls, currentServerIndex, switchServer,
  toggleFavorite, isInFavorites, toggleWatchLater, isInWatchLater, toggleWatching, isWatching,
}) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '10px 14px',
    background: '#1a1a1a',
    borderTop: '0.5px solid rgba(255,255,255,0.1)',
  }}>
    {workingUrls.length > 1 && (
      <button
        onClick={switchServer}
        title="تغيير السيرفر"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.05)',
          border: '0.5px solid rgba(255,255,255,0.1)',
          borderRadius: 99,
          color: '#fff', fontSize: 12, cursor: 'pointer',
          flexShrink: 0, whiteSpace: 'nowrap',
          transition: 'border-color 0.15s',
        }}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {currentServerIndex + 1}/{workingUrls.length}
      </button>
    )}

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
}) => (
  <>
    <style>{`@keyframes vp-spin { to { transform: rotate(360deg); } }`}</style>

    <div
      ref={playerContainerRef}
      style={{
        position: 'relative', width: '100%',
        background: '#000',
        aspectRatio: '16/9',
      }}
    >
      {currentVideoUrl && !videoError ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
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
        <ErrorState resetPlayer={resetPlayer} />
      ) : (
        <ReadyState />
      )}

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20 }}>
        <ControlsBar
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
        />
      </div>
    </div>
  </>
);