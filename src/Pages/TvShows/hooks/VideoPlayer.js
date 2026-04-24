// src/Pages/TvShows/hooks/VideoPlayer.jsx
import React from 'react';

const ActionBtn = ({ onClick, active, activeIcon, inactiveIcon, activeColor = 'text-red-500', label }) => (
  <button
    onClick={onClick}
    title={label}
    className="flex flex-col items-center gap-1"
  >
    <div className={`
      w-10 h-10 rounded-full flex items-center justify-center
      bg-black/60 border border-white/20
      ${active ? activeColor : 'text-white'}
    `}>
      <span className="text-lg leading-none">{active ? activeIcon : inactiveIcon}</span>
    </div>
    <span className="text-[10px] text-white/70 hidden sm:block">{label}</span>
  </button>
);

export const VideoPlayer = ({
  selectedEpisode,
  selectedSeason,
  tvShow,
  currentVideoUrl,
  iframeKey,
  handleIframeLoad,
  handleIframeError,
  episodes,
  onEpisodeChange,
  toggleFavorite,
  isInFavorites,
}) => {
  // Get prev/next episodes
  const currentIndex = episodes?.findIndex(ep => ep.id === selectedEpisode?.id) ?? -1;
  const prevEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex !== -1 && currentIndex < (episodes?.length - 1) ? episodes[currentIndex + 1] : null;

  // Handle episode navigation
  const handlePrevEpisode = () => {
    if (prevEpisode) onEpisodeChange(prevEpisode);
  };

  const handleNextEpisode = () => {
    if (nextEpisode) onEpisodeChange(nextEpisode);
  };

  // Don't render if no episode selected or no video URL
  if (!selectedEpisode || !currentVideoUrl) {
    return (
      <div className="relative w-full bg-black h-[60vh] md:h-[70vh] lg:h-[80vh] flex items-center justify-center">
        <p className="text-white/70">اختر حلقة للمشاهدة</p>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-black h-[60vh] md:h-[70vh] lg:h-[80vh]">
      {/* Video iframe */}
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

      {/* Fixed buttons below video */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={handlePrevEpisode}
          disabled={!prevEpisode}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            prevEpisode 
              ? 'bg-white/10 hover:bg-white/20 text-white cursor-pointer' 
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          السابقة
        </button>
        
        <button
          onClick={handleNextEpisode}
          disabled={!nextEpisode}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            nextEpisode 
              ? 'bg-white/10 hover:bg-white/20 text-white cursor-pointer' 
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          التالية
        </button>
        
        <ActionBtn 
          onClick={() => toggleFavorite(tvShow)} 
          active={isInFavorites(tvShow)} 
          activeIcon="❤️" 
          inactiveIcon="🤍" 
          activeColor="text-red-500" 
          label="المفضلة" 
        />
      </div>
    </div>
  );
};