// TvPage.jsx
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
<<<<<<< HEAD
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
=======
          {/* Video Player Container محسن مع تأثيرات */}
          <div
            ref={playerContainerRef}
            className={`relative w-full bg-black transition-all duration-700 ease-out ${isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[60vh] md:h-[70vh] lg:h-[80vh]'
              }`}
          >
            {selectedEpisode && currentVideoUrl && !videoError ? (
              <>
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={currentVideoUrl}
                  title={`${tvShow.name} - S${selectedSeason?.season_number}E${selectedEpisode.episode_number}`}
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                />

                {/* Loading Overlay محسن جداً */}
                {isVideoLoading && (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/95 to-black/80 backdrop-blur-md flex items-center justify-center z-10 transition-all duration-500">
                    <div className="text-center transform transition-all duration-500 scale-100 animate-fadeIn">
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-gray-700 border-t-[#e50914] rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 border-4 border-transparent border-b-[#e50914] rounded-full animate-spin-slow"></div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#e50914] rounded-full animate-ping opacity-75"></div>
                      </div>
                      <p className="text-white text-base md:text-lg font-semibold mb-2">جاري تجهيز الحلقة...</p>
                      <p className="text-gray-400 text-sm">
                        السيرفر {currentServerIndex + 1} من {workingUrls.length}
                      </p>
                      <div className="flex gap-1.5 justify-center mt-4">
                        {workingUrls.map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentServerIndex ? 'w-8 bg-[#e50914]' : 'w-2 bg-gray-600'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : videoError ? (
              // Error UI محسن جداً
              <div className="w-full h-full bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center text-center gap-5 p-4">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full bg-[#e50914]/10 flex items-center justify-center animate-bounce">
                    <span className="text-6xl">⚠️</span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#e50914] rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>
                <p className="text-[#e50914] text-2xl md:text-3xl font-bold">عذراً، لا يمكن تشغيل هذا المسلسل حالياً</p>
                <p className="text-gray-400 text-base max-w-md">جميع السيرفرات لا تعمل. يرجى المحاولة مرة أخرى لاحقاً</p>
                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      setVideoError(false);
                      setCurrentServerIndex(0);
                      setFailedServers([]);
                      setIsVideoLoading(true);
                    }}
                    className="bg-[#e50914] hover:bg-[#b20710] px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg"
                  >
                    إعادة المحاولة
                  </button>
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="bg-gray-700 hover:bg-gray-600 px-8 py-3.5 rounded-xl font-semibold transition-all transform hover:scale-105"
                  >
                    اختيار حلقة أخرى
                  </button>
                </div>
              </div>
            ) : (
              // No episode selected - تصميم جذاب جداً
              <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col items-center justify-center text-center gap-5 p-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#e50914]/30 to-[#e50914]/5 flex items-center justify-center animate-float">
                    <span className="text-6xl">🎬</span>
                  </div>
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-r from-[#e50914] to-[#b20710] rounded-full flex items-center justify-center text-white text-sm font-bold animate-pulse shadow-lg">
                    !
                  </div>
                </div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gray-300 to-gray-400 bg-clip-text text-transparent">
                  اختر حلقة للمشاهدة
                </h3>
                <p className="text-gray-400 text-base max-w-md">
                  اختر موسماً وحلقة من القائمة أدناه للبدء في مشاهدة {tvShow.name}
                </p>
                <div className="flex gap-3 mt-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full bg-gray-600 animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <button
                  onClick={() => setShowSidebar(true)}
                  className="mt-6 bg-[#e50914]/20 hover:bg-[#e50914]/30 text-white px-8 py-3 rounded-xl font-semibold transition-all border border-[#e50914]/30"
                >
                  استعراض الحلقات
                </button>
              </div>
            )}

  {/* Video Controls Overlay */}
{selectedEpisode && !videoError && (
  <div 
    className={`
      absolute left-0 right-0 
      bg-gradient-to-t from-black/60 via-black/30 to-transparent 
      p-4 sm:p-5 
      opacity-100 md:opacity-0 md:hover:opacity-100 
      transition-all duration-300 
      z-20
      ${isFullscreen 
        ? 'top-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent' 
        : 'bottom-0'
      }
    `}
  >

    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

      {/* LEFT CONTROLS */}
      <div className="flex items-center justify-between sm:justify-start gap-3">

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="bg-transparent text-white/80 hover:text-white active:bg-white/10 rounded-full p-3 transition-all active:scale-95"
          title={isFullscreen ? "خروج من الشاشة الكاملة" : "شاشة كاملة"}
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          )}
        </button>

        {/* Server Switch */}
        {workingUrls.length > 1 && (
          <button
            onClick={switchServer}
            className="relative bg-transparent text-white/80 hover:text-white active:bg-white/10 rounded-full p-3 transition-all active:scale-95 group"
            title="تغيير السيرفر"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-xs font-medium hidden sm:inline">
                سيرفر {currentServerIndex + 1}/{workingUrls.length}
              </span>
            </div>

            {/* Mobile hint */}
            <div className="absolute -bottom-6 left-0 text-[10px] text-white/60 sm:hidden whitespace-nowrap">
              لو الفيديو مش شغال جرّب سيرفر تاني
            </div>
          </button>
        )}
      </div>

      {/* EPISODE NAME */}
      <div className="bg-transparent px-3 py-1.5 max-w-[70%] sm:max-w-none">
        <span className="text-xs sm:text-sm text-white/90 font-medium truncate block">
          {selectedEpisode?.name}
        </span>
      </div>

    </div>
  </div>
)}

          {/* TV Show Info - محسن جداً */}
          <div className="px-4 md:px-8 lg:px-12 py-8 md:py-10">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
              {/* Poster (Desktop) مع تأثير hover */}
              {tvShow.poster_path && (
                <div className="hidden lg:block w-56 xl:w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                    alt={tvShow.name}
                    className="w-full h-auto"
                  />
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                      {tvShow.name}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-5">
                      <span className="flex items-center gap-1.5 bg-yellow-500/15 px-3 py-1.5 rounded-full">
                        <span className="text-yellow-500 text-lg">⭐</span>
                        <span className="text-white font-semibold">{tvShow.vote_average?.toFixed(1)}</span>
                        <span className="text-gray-500 text-xs">/10</span>
                      </span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span className="px-2 py-1 bg-gray-800 rounded-md">{tvShow.first_air_date?.split('-')[0] || '?'}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span className="bg-[#e50914]/20 px-3 py-1.5 rounded-full text-xs font-semibold">
                        {tvShow.number_of_seasons} مواسم
                      </span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span className="bg-blue-500/20 px-3 py-1.5 rounded-full text-xs font-semibold">
                        {tvShow.number_of_episodes} حلقة
                      </span>
                    </div>
                  </div>

                  {/* Rating Circle محسن */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-gray-400 mb-5">
                    {/* Rating Badge */}
                    <div className="flex items-center gap-1.5 bg-yellow-500/15 px-2.5 md:px-3 py-1.5 rounded-full">
                      <span className="text-yellow-500 text-sm md:text-base">⭐</span>
                      <span className="text-white font-semibold text-sm md:text-base">{tvShow.vote_average?.toFixed(1)}</span>
                      <span className="text-gray-500 text-xs hidden sm:inline">/10</span>
                    </div>

                    {/* Separator - hidden on very small screens */}
                    <div className="w-1 h-1 bg-gray-600 rounded-full hidden sm:block"></div>

                    {/* Year Badge */}
                    <div className="px-2.5 md:px-3 py-1.5 bg-gray-800 rounded-full">
                      <span className="text-xs md:text-sm whitespace-nowrap">{tvShow.first_air_date?.split('-')[0] || '?'}</span>
                    </div>

                    {/* Separator */}
                    <div className="w-1 h-1 bg-gray-600 rounded-full hidden sm:block"></div>

                    {/* Seasons Badge */}
                    <div className="bg-[#e50914]/20 px-2.5 md:px-3 py-1.5 rounded-full">
                      <span className="text-xs md:text-sm font-semibold whitespace-nowrap">
                        {tvShow.number_of_seasons} مواسم
                      </span>
                    </div>

                    {/* Separator - hidden on very small screens */}
                    <div className="w-1 h-1 bg-gray-600 rounded-full hidden sm:block"></div>

                    {/* Episodes Badge */}
                    <div className="bg-blue-500/20 px-2.5 md:px-3 py-1.5 rounded-full">
                      <span className="text-xs md:text-sm font-semibold whitespace-nowrap">
                        {tvShow.number_of_episodes} حلقة
                      </span>
                    </div>
                  </div>
                </div>

                {tvShow.overview && (
                  <div className="mb-6">
                    <h3 className="text-[#e50914] text-base font-semibold mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      القصة
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-4xl">
                      {tvShow.overview}
                    </p>
                  </div>
                )}

                {tvShow.genres && tvShow.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tvShow.genres.map((genre) => (
                      <span key={genre.id} className="bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full text-sm transition-all duration-300 cursor-pointer hover:scale-105">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Toggle Button محسن */}
>>>>>>> f5b2e2ad58b3e7eba4f0708d5a859b7b6ecdf664
          <div className="lg:hidden px-4 mb-4">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="flex items-center justify-between w-full px-6 py-4 bg-gray-800/50 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-gray-800/70 transition-all duration-300"
            >
              <span className="font-semibold text-base">
                {showSidebar ? ' إخفاء الحلقات' : ' عرض الحلقات'}
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
