// Pages/TvShows/hooks/VideoPlayer.jsx
import React, { useState, useEffect } from 'react';

const ActionBtn = ({ onClick, active, activeIcon, inactiveIcon, activeColor, label }) => (
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

  const currentIndex = episodes?.findIndex(ep => ep.id === selectedEpisode?.id) ?? -1;
  const prevEpisode  = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode  = currentIndex !== -1 && currentIndex < (episodes?.length - 1) ? episodes[currentIndex + 1] : null;

  const ControlsBar = () => (
    <div className="controls-bar">
      <div className={`
        flex items-center justify-between gap-3 px-4 py-3
        ${isFullscreen
          ? 'absolute top-0 left-0 right-0 z-20 bg-black/90'
          : 'bg-[#1a1a1a] border-t border-white/10'
        }
      `}>
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
          <div className="bg-black/50 rounded-full px-4 py-1.5 max-w-[200px] md:max-w-xs truncate">
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
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium
                ${prevEpisode ? 'bg-black/60 cursor-pointer text-white' : 'bg-black/20 text-white/30 cursor-not-allowed'}`}
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
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium
                ${nextEpisode ? 'bg-[#e50914]/80 cursor-pointer text-white' : 'bg-black/20 text-white/30 cursor-not-allowed'}`}
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

  // Error / No Episode
  if (!selectedEpisode || !currentVideoUrl || videoError) {
    return (
      <div
        ref={playerContainerRef}
        className={`relative w-full bg-black ${
          isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[60vh] md:h-[70vh] lg:h-[80vh]'
        }`}
      >
        {videoError ? (
          <div className="w-full h-full bg-black flex flex-col items-center justify-center text-center gap-5 p-4">
            <div className="w-28 h-28 rounded-full bg-[#e50914]/10 flex items-center justify-center">
              <span className="text-6xl">⚠️</span>
            </div>
            <p className="text-[#e50914] text-2xl md:text-3xl font-bold">عذراً، لا يمكن تشغيل هذا المسلسل حالياً</p>
            <p className="text-gray-400 text-base max-w-md">جميع السيرفرات لا تعمل. يرجى المحاولة مرة أخرى لاحقاً</p>
            <div className="flex gap-4 mt-6">
              <button onClick={resetPlayer} className="bg-[#e50914] px-8 py-3.5 rounded-xl font-semibold">إعادة المحاولة</button>
              <button onClick={() => setShowSidebar(true)} className="bg-gray-700 px-8 py-3.5 rounded-xl font-semibold">اختيار حلقة أخرى</button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-black flex flex-col items-center justify-center text-center gap-5 p-4">
            <div className="w-32 h-32 rounded-full bg-[#e50914]/10 flex items-center justify-center">
              <span className="text-6xl">🎬</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white">اختر حلقة للمشاهدة</h3>
            <p className="text-gray-400 text-base max-w-md">اختر موسماً وحلقة من القائمة أدناه للبدء في مشاهدة {tvShow?.name}</p>
            <button onClick={() => setShowSidebar(true)} className="mt-6 bg-[#e50914]/20 text-white px-8 py-3 rounded-xl font-semibold border border-[#e50914]/30">استعراض الحلقات</button>
          </div>
        )}

        <div className={`${isFullscreen ? 'absolute top-0 left-0 right-0 z-20' : 'absolute bottom-0 left-0 right-0 z-20'}`}>
          <ControlsBar />
        </div>
      </div>
    );
  }

  // Player
  return (
    <div
      ref={playerContainerRef}
      className={`relative w-full bg-black ${
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
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-gray-800"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-[#e50914] border-r-[#e50914] border-b-transparent border-l-transparent animate-spin"></div>
            </div>
            <p className="text-white text-sm font-medium mb-1">جاري تحميل الحلقة...</p>
            <p className="text-gray-400 text-xs">السيرفر {currentServerIndex + 1} من {workingUrls.length}</p>
          </div>
        </div>
      )}

      <div className={`${isFullscreen ? 'absolute top-0 left-0 right-0 z-20' : 'absolute bottom-0 left-0 right-0 z-20'}`}>
        <ControlsBar />
      </div>
    </div>
  );
};