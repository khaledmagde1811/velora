// Pages/TvPage.jsx
import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTvData } from './hooks/useTvData';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { useFullscreen } from './hooks/useFullscreen';
import { useSimilarShows } from './hooks/useSimilarShows';
import { useScroll } from './hooks/useScroll';
import { LoadingState } from './hooks/LoadingState';
import { ErrorState } from './hooks/ErrorState';
import { VideoPlayer } from './hooks/VideoPlayer';
import { TvInfoSection } from './hooks/TvInfoSection';
import { EpisodeSidebar } from './hooks/EpisodeSidebar';

const TvPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  
  const scrollY = useScroll();
  const { isFullscreen, toggleFullscreen, playerContainerRef } = useFullscreen();
  const { 
    tvShow, 
    seasons, 
    episodes, 
    selectedSeason, 
    selectedEpisode, 
    loading, 
    error: tvDataError,
    handleSeasonChange, 
    handleEpisodeChange 
  } = useTvData(id);
  
  const { similarShows, similarShowsLoading } = useSimilarShows(tvShow?.id);
  
  const {
    videoError,
    isVideoLoading,
    currentVideoUrl,
    iframeKey,
    workingUrls,
    currentServerIndex,
    handleIframeLoad,
    handleIframeError,
    switchServer,
    resetPlayer,
  } = useVideoPlayer(id, selectedSeason, selectedEpisode);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Show loading state
  if (loading && !tvShow) {
    return <LoadingState />;
  }

  // Show error state
  if (tvDataError) {
    return <ErrorState message={tvDataError} onRetry={handleRetry} />;
  }

  // Don't render if no tvShow data
  if (!tvShow) {
    return null;
  }

  return (
    <div className="bg-[#141414] min-h-screen text-white">
      <div className="relative">
        {/* Hero Background with parallax effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: tvShow.backdrop_path && tvShow.backdrop_path !== null
              ? `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`
              : 'none',
            backgroundColor: !tvShow.backdrop_path ? '#141414' : 'transparent',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        
        {/* Overlay Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        
        <div className="relative z-10">
          <VideoPlayer
            isFullscreen={isFullscreen}
            playerContainerRef={playerContainerRef}
            selectedEpisode={selectedEpisode}
            selectedSeason={selectedSeason}
            tvShow={tvShow}
            currentVideoUrl={currentVideoUrl}
            videoError={videoError}
            isVideoLoading={isVideoLoading}
            iframeKey={iframeKey}
            workingUrls={workingUrls}
            currentServerIndex={currentServerIndex}
            handleIframeLoad={handleIframeLoad}
            handleIframeError={handleIframeError}
            switchServer={switchServer}
            toggleFullscreen={toggleFullscreen}
            resetPlayer={resetPlayer}
            setShowSidebar={setShowSidebar}
          />
          
          <TvInfoSection tvShow={tvShow} />
          
          {/* Mobile Toggle Button */}
          <div className="lg:hidden px-4 mb-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="flex items-center justify-between w-full px-6 py-4 bg-gray-800/50 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-gray-800/70 transition-all duration-300"
            >
              <span className="font-semibold text-base">
                {showSidebar ? 'إخفاء الحلقات' : 'عرض الحلقات'}
              </span>
              <svg className={`w-5 h-5 transition-transform duration-300 ${showSidebar ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          <EpisodeSidebar
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            seasons={seasons}
            selectedSeason={selectedSeason}
            episodes={episodes}
            selectedEpisode={selectedEpisode}
            tvShow={tvShow}
            similarShows={similarShows}
            similarShowsLoading={similarShowsLoading}
            onSeasonChange={handleSeasonChange}
            onEpisodeChange={handleEpisodeChange}
            navigate={navigate}
          />
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f1f1f;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e50914;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ff0a1a;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease forwards;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TvPage;