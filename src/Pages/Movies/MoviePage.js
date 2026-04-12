import React, { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovieData } from './hooks/useMovieData';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { useFullscreen } from './hooks/useFullscreen';

import { LoadingState } from './hooks/LoadingState';
import { ErrorState } from './hooks/ErrorState';
import { VideoPlayer } from './hooks/VideoPlayer';
import { MovieInfoSection } from './hooks/MovieInfoSection';
import { SuggestedMovies } from './hooks/SuggestedMovies';

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  // Reset scroll to top when movie changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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
    <div className="bg-[#141414] min-h-screen text-white overflow-x-hidden">
      <div className="relative">
        {/* Hero Background - بدون parallax وتأثيرات حركة */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundColor: !movie.backdrop_path ? '#141414' : 'transparent',
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
    </div>
  );
};

export default MoviePage;