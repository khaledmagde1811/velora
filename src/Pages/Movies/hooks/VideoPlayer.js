// src/Pages/Movie/components/VideoPlayer.jsx
import React from 'react';

const ActionBtn = ({ onClick, active, activeIcon, inactiveIcon, activeColor = 'text-red-500', label }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    title={label}
    className="flex flex-col items-center gap-1"
  >
    <div className={`
      w-10 h-10 rounded-full flex items-center justify-center
      bg-black/60 border border-white/10
      ${active ? activeColor : 'text-white'}
    `}>
      <span className="text-lg leading-none">{active ? activeIcon : inactiveIcon}</span>
    </div>
    <span className="text-[10px] text-white/70 hidden sm:block">{label}</span>
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
  playerContainerRef,
  movie,
  currentVideoUrl,
  iframeKey,
  workingUrls,
  currentServerIndex,
  handleIframeLoad,
  handleIframeError,
  switchServer,
  toggleFavorite,
  isInFavorites,
  toggleWatchLater,
  isInWatchLater,
  toggleWatching,
  isWatching,
}) => {

  const ControlsBar = () => (
    <div className="controls-bar">
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-3 px-4 py-3 bg-[#1a1a1a] border-t border-white/10">
        <div className="flex items-center gap-2">
          {workingUrls.length > 1 && (
            <button
              onClick={switchServer}
              className="bg-black/60 rounded-full p-2.5"
              title="تغيير السيرفر"
            >
              <div className="flex items-center gap-1.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="bg-black/50 rounded-full px-4 py-1.5 max-w-[200px] md:max-w-md">
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

  // حالة عدم وجود رابط فيديو
  if (!currentVideoUrl) {
    return (
      <div
        ref={playerContainerRef}
        className="relative w-full bg-black h-[60vh] md:h-[70vh] lg:h-[80vh]"
      >
        <div className="w-full h-full bg-black flex flex-col items-center justify-center text-center gap-5 p-4">
          <div className="w-20 h-20 rounded-full bg-[#e50914]/10 flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
          <p className="text-white text-lg">الفيلم غير متاح حالياً</p>
        </div>
        <ControlsBar />
      </div>
    );
  }

  // المشغل الأساسي
  return (
    <div
      ref={playerContainerRef}
      className="relative w-full bg-black h-[60vh] md:h-[70vh] lg:h-[80vh]"
    >
      <iframe
        key={iframeKey}
        src={currentVideoUrl}
        title={movie?.title}
        frameBorder="0"
        allowFullScreen
        className="w-full h-full border-0"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      />
      <ControlsBar />
    </div>
  );
};