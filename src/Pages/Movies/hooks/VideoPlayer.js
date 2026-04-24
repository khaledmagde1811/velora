// src/Pages/Movie/components/VideoPlayer.jsx
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
  movie,
  currentVideoUrl,
  iframeKey,
  handleIframeLoad,
  handleIframeError,
  toggleFavorite,
  isInFavorites,
}) => {
  // Prev/Next episode handlers (you'll need to implement these based on your data structure)
  const handlePrevEpisode = () => {
    // Implement prev episode logic
    console.log('Previous episode');
  };

  const handleNextEpisode = () => {
    // Implement next episode logic
    console.log('Next episode');
  };

  return (
    <div className="relative w-full bg-black h-[60vh] md:h-[70vh] lg:h-[80vh]">
      {currentVideoUrl ? (
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
      ) : (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <p className="text-white">No video source available</p>
        </div>
      )}

      {/* Fixed buttons below video */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={handlePrevEpisode}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
        >
          السابقة
        </button>
        
        <button
          onClick={handleNextEpisode}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
        >
          التالية
        </button>
        
        <ActionBtn 
          onClick={() => toggleFavorite(movie)} 
          active={isInFavorites(movie)} 
          activeIcon="❤️" 
          inactiveIcon="🤍" 
          activeColor="text-red-500" 
          label="المفضلة" 
        />
      </div>
    </div>
  );
};