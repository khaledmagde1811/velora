// src/Pages/MoviePage.jsx (المُعاد هيكلته)
import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieData } from './hooks/useMovieData';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { useFullscreen } from './hooks/useFullscreen';
import { useScroll } from './hooks/useScroll';
import { LoadingState } from './hooks/LoadingState';
import { ErrorState } from './hooks/ErrorState';
import { VideoPlayer } from './hooks/VideoPlayer';
import { MovieInfoSection } from './hooks/MovieInfoSection';
import { SuggestedMovies } from './hooks/SuggestedMovies';

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const scrollY = useScroll();
  const { isFullscreen, toggleFullscreen, playerContainerRef } = useFullscreen();
  const { movie, loading, error, suggested } = useMovieData(id);
  
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
  } = useVideoPlayer(id);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Show loading state
  if (loading && !movie) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  // Don't render if no movie data
  if (!movie) {
    return null;
  }

  return (
    <div className="bg-[#141414] min-h-screen text-white">
      <div className="relative">
        {/* Hero Background with parallax effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: movie.backdrop_path && movie.backdrop_path !== null
              
            backgroundColor: !movie.backdrop_path ? '#141414' : 'transparent',
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />
        
        {/* Overlay Layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        
        <div className="relative z-10">
          {/* Navbar */}
          <nav className="fixed top-0 left-0 right-0 h-14 md:h-16 flex items-center px-4 md:px-6 gap-4 bg-gradient-to-b from-black/95 to-transparent z-50">
            <div
              onClick={() => navigate('/')}
              className="text-xl md:text-2xl font-black text-[#e50914] cursor-pointer hover:scale-105 transition-transform"
            >
              VELORA
            </div>
          </nav>
          
          <VideoPlayer
            isFullscreen={isFullscreen}
            playerContainerRef={playerContainerRef}
            movie={movie}
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
          />
          
          <MovieInfoSection movie={movie} />
          
          <SuggestedMovies suggested={suggested} navigate={navigate} />
        </div>
      </div>
      
      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
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
      `}</style>
    </div>
  );
};

export default MoviePage;
