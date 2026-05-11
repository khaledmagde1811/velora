// Pages/TvPage.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from '../../next-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTvData } from './hooks/useTvData';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import { useFullscreen } from './hooks/useFullscreen';
import { useSimilarShows } from './hooks/useSimilarShows';
import { LoadingState } from './hooks/LoadingState';
import { ErrorState } from './hooks/ErrorState';
import { VideoPlayer } from './hooks/VideoPlayer';
import { TvInfoSection } from './hooks/TvInfoSection';
import { EpisodeSidebar } from './hooks/EpisodeSidebar';
import { SimilarShows } from './hooks/SimilarShows';
import { useUserLists } from '../../context/UserListsContext';

const TvPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);
  
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

  const {
    toggleFavorite,
    isInFavorites,
    toggleWatchLater,
    isInWatchLater,
    toggleWatching,
    isWatching,
  } = useUserLists();

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

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

  if (loading && !tvShow) return <LoadingState />;
  if (tvDataError) return <ErrorState message={tvDataError} onRetry={handleRetry} />;
  if (!tvShow) return null;

  return (
    <div style={{ backgroundColor: '#141414', color: 'white', overflowX: 'hidden' }}>

      <Helmet>
        <title>{tvShow.name} - مشاهدة اون لاين مجاناً | Velora</title>
        <meta name="description" content={`${tvShow.overview?.slice(0, 155)}... شاهد ${tvShow.name} بجودة عالية على Velora.`} />
        <meta name="keywords" content={`${tvShow.name}, مسلسل, مشاهدة اون لاين, ${tvShow.genres?.map(g => g.name).join(', ')}, عربي, HD`} />
        <meta name="author" content="Velora" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={`${tvShow.name} - مشاهدة اون لاين | Velora`} />
        <meta property="og:description" content={`${tvShow.overview?.slice(0, 155)}... شاهد الآن!`} />
        <meta property="og:image" content={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`} />
        <meta property="og:image:width" content="500" />
        <meta property="og:image:height" content="750" />
        <meta property="og:url" content={`https://www.veloravelora.online/tv/${id}`} />
        <meta property="og:type" content="video.tv_show" />
        <meta property="og:site_name" content="Velora" />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${tvShow.name} - مشاهدة اون لاين | Velora`} />
        <meta name="twitter:description" content={`${tvShow.overview?.slice(0, 155)}...`} />
        <meta name="twitter:image" content={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`} />
        <link rel="canonical" href={`https://www.veloravelora.online/tv/${id}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TVSeries",
            "name": tvShow.name,
            "description": tvShow.overview,
            "image": `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`,
            "genre": tvShow.genres?.map(g => g.name),
            "datePublished": tvShow.first_air_date,
            "numberOfSeasons": tvShow.number_of_seasons,
            "url": `https://www.veloravelora.online/tv/${id}`,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": tvShow.vote_average,
              "ratingCount": tvShow.vote_count
            }
          })}
        </script>
      </Helmet>
      
      <div style={{ position: 'relative', overflow: 'hidden' }}>

        {/* Hero Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: tvShow.backdrop_path
              ? `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`
              : 'none',
            backgroundColor: !tvShow.backdrop_path ? '#141414' : 'transparent',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            zIndex: 0,
          }}
        />

        {/* Overlay Layers */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to top, #141414, rgba(20,20,20,0.8), transparent)'
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to right, #141414, rgba(20,20,20,0.3), transparent)'
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent, transparent)'
        }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
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
            episodes={episodes}
            onEpisodeChange={handleEpisodeChange}
            toggleFavorite={toggleFavorite}
            isInFavorites={isInFavorites}
            toggleWatchLater={toggleWatchLater}
            isInWatchLater={isInWatchLater}
            toggleWatching={toggleWatching}
            isWatching={isWatching}
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
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${showSidebar ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
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

          <SimilarShows
            similarShows={similarShows}
            similarShowsLoading={similarShowsLoading}
            navigate={navigate}
          />
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1f1f1f; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e50914; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ff0a1a; }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.5s ease forwards; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default TvPage;