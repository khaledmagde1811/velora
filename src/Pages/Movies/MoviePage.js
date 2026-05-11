import React, { useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from '../../next-router-dom';
import { useMovieData } from './hooks/useMovieData';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { useFullscreen } from './hooks/useFullscreen';
import { LoadingState } from './hooks/LoadingState';
import { ErrorState } from './hooks/ErrorState';
import { VideoPlayer } from './hooks/VideoPlayer';
import { MovieInfoSection } from './hooks/MovieInfoSection';
import { SuggestedMovies } from './hooks/SuggestedMovies';
import { useUserLists } from '../../context/UserListsContext';

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ جوه الـ component صح
  const {
    toggleFavorite,
    isInFavorites,
    toggleWatchLater,
    isInWatchLater,
    toggleWatching,
    isWatching,
  } = useUserLists();

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.overflow = isFullscreen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isFullscreen]);

  if (loading && !movie) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={handleRetry} />;
  if (!movie) return null;

  const movieTitle = movie.title || movie.name || 'فيلم';
  const movieDescription = movie.overview
    ? `${movie.overview.slice(0, 155)}... شاهد ${movieTitle} أونلاين بجودة عالية على VELORA.`
    : `شاهد ${movieTitle} أونلاين على VELORA.`;

  return (
    <div style={{ backgroundColor: '#141414', color: 'white', overflowX: 'hidden' }}>
      <Helmet>
        <title>{`${movieTitle} - مشاهدة فيلم أون لاين | VELORA`}</title>
        <meta name="description" content={movieDescription} />
        <meta
          name="keywords"
          content={`${movieTitle}, فيلم, مشاهدة أون لاين, ${movie.genres?.map((g) => g.name).join(', ') || ''}, VELORA`}
        />
        <meta name="author" content="VELORA" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${movieTitle} - مشاهدة فيلم أون لاين | VELORA`} />
        <meta property="og:description" content={movieDescription} />
        <meta property="og:image" content={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
        <meta property="og:url" content={`https://www.veloravelora.online/movie/${id}`} />
        <meta property="og:type" content="video.movie" />
        <meta property="og:site_name" content="VELORA" />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${movieTitle} - مشاهدة فيلم أون لاين | VELORA`} />
        <meta name="twitter:description" content={movieDescription} />
        <meta name="twitter:image" content={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
        <link rel="canonical" href={`https://www.veloravelora.online/movie/${id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Movie',
            'name': movieTitle,
            'description': movie.overview || '',
            'image': `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            'genre': movie.genres?.map((g) => g.name),
            'datePublished': movie.release_date,
            'duration': movie.runtime ? `PT${movie.runtime}M` : undefined,
            'url': `https://www.veloravelora.online/movie/${id}`,
            'aggregateRating': movie.vote_average
              ? {
                  '@type': 'AggregateRating',
                  'ratingValue': movie.vote_average,
                  'ratingCount': movie.vote_count
                }
              : undefined
          })}
        </script>
      </Helmet>
      <div style={{ position: 'relative', overflow: 'hidden' }}>

        {/* Hero Background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'none',
          backgroundColor: !movie.backdrop_path ? '#141414' : 'transparent',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100%',
          zIndex: 0,
        }} />

        {/* Overlay Layers */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top, #141414, rgba(20,20,20,0.8), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to right, #141414, rgba(20,20,20,0.3), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent, transparent)' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
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
            // ✅ الأزرار
            movie={movie}
            toggleFavorite={toggleFavorite}
            isInFavorites={isInFavorites}
            toggleWatchLater={toggleWatchLater}
            isInWatchLater={isInWatchLater}
            toggleWatching={toggleWatching}
            isWatching={isWatching}
          />

          <MovieInfoSection movie={movie} />
          <SuggestedMovies suggested={suggested} navigate={navigate} />
        </div>
      </div>
    </div>
  );
};

export default MoviePage;