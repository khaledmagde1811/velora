// src/Pages/MoviePage.jsx
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tmdbApi from '../../services/tmdb';

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State

  const [selectedEpisode, setSelectedEpisode] = useState(null); 
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [failedServers, setFailedServers] = useState([]);
  const [showFullInfo, setShowFullInfo] = useState(false);

  // Refs
  const playerContainerRef = useRef(null);
  const iframeRef = useRef(null);

  // Video sources with TMDB ID
  const videoSources = useMemo(() => [
    { label: 'VidSrc 1', url: `https://vidsrc.xyz/embed/movie?tmdb=${id}`, priority: 1 },
    { label: 'VidSrc 2', url: `https://vidsrc.to/embed/movie?tmdb=${id}`, priority: 2 },
    { label: 'Embed.su', url: `https://embed.su/embed/movie/${id}`, priority: 3 },
    { label: '2Embed', url: `https://2embed.cc/embed/${id}`, priority: 4 },
    { label: 'VidSrc Pro', url: `https://vidsrc.net/embed/movie/${id}`, priority: 5 },
  ], [id]);

  // Filter working servers
  const workingSources = useMemo(() => {
    return videoSources.filter((_, index) => !failedServers.includes(index));
  }, [videoSources, failedServers]);

  // Current source
  const currentSource = useMemo(() => {
    if (workingSources.length === 0) return null;
    return workingSources[currentServerIndex] || workingSources[0];
  }, [workingSources, currentServerIndex]);

  // Stable iframe key
  const iframeKey = useMemo(() => {
    if (!currentSource) return null;
    return `${id}-${currentSource.label}-${currentServerIndex}`;
  }, [id, currentSource, currentServerIndex]);

  // Fetch movie data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [movieRes, suggestedRes] = await Promise.all([
          tmdbApi.get(`/movie/${id}`),
          tmdbApi.get(`/movie/${id}/similar`),
        ]);
        
        if (!movieRes.data) {
          setError('الفيلم غير موجود');
          return;
        }
        
        setMovie(movieRes.data);
        setSuggested(suggestedRes.data.results.slice(0, 18));
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError('حدث خطأ في تحميل بيانات الفيلم');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchData();
      window.scrollTo(0, 0);
    }
  }, [id]);

  // Handle iframe load success
  const handleIframeLoad = useCallback(() => {
    setIsVideoLoading(false);
    setVideoError(false);
  }, []);

  // Handle iframe error - switch to next server
  const handleIframeError = useCallback(() => {
    const currentIndex = currentServerIndex;
    
    setFailedServers(prev => [...prev, currentIndex]);
    
    if (currentServerIndex + 1 < workingSources.length) {
      setCurrentServerIndex(prev => prev + 1);
      setIsVideoLoading(true);
    } else {
      setVideoError(true);
      setIsVideoLoading(false);
    }
  }, [currentServerIndex, workingSources.length]);

  // Manual server switch
  const switchServer = useCallback(() => {
    if (currentServerIndex + 1 < workingSources.length) {
      setCurrentServerIndex(prev => prev + 1);
      setIsVideoLoading(true);
      setVideoError(false);
    } else if (workingSources.length > 0) {
      setCurrentServerIndex(0);
      setIsVideoLoading(true);
      setVideoError(false);
    }
  }, [currentServerIndex, workingSources.length]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    const element = playerContainerRef.current;
    if (!element) return;
    
    try {
      if (!document.fullscreenElement) {
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, []);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Reset video state when movie changes
  useEffect(() => {
    setIsVideoLoading(true);
    setVideoError(false);
    setCurrentServerIndex(0);
    setFailedServers([]);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-[#e50914] rounded-full animate-spin"></div>
        <p className="text-white mt-4 text-sm sm:text-base">جاري تحميل الفيلم...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center gap-5 text-center px-4">
        <p className="text-[#e50914] text-lg">⚠️ {error || 'الفيلم غير موجود'}</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-2.5 rounded-md transition-all"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const year = movie.release_date?.split('-')[0] || 'قريباً';
  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const mins = movie.runtime ? movie.runtime % 60 : 0;
  const runtimeText = movie.runtime
    ? `${hours > 0 ? `${hours} ساعة ` : ''}${mins > 0 ? `${mins} دقيقة` : ''}`
    : null;
  const matchScore = movie.vote_average
    ? Math.round((movie.vote_average / 10) * 100)
    : null;

  return (
    <div className="bg-[#141414] min-h-screen text-white">
      <div className="relative">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: movie.backdrop_path 
              ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
              : 'none',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#141414]/80 via-[#141414]/60 to-[#141414]" />
        
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

          {/* Video Player Container */}
          <div 
            ref={playerContainerRef}
            className={`relative w-full bg-black transition-all duration-300 ${
              isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[70vh]'
            }`}
          >
            {/* Iframe Player */}
            {currentSource && !videoError ? (
              <>
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={currentSource.url}
                  title={movie.title}
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full border-0"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                />
                
                {/* Loading Overlay */}
                {isVideoLoading && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10 transition-opacity duration-300">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-gray-700 border-t-[#e50914] rounded-full animate-spin mx-auto mb-3"></div>
                      <p className="text-white text-sm">جاري تحميل الفيلم...</p>
                      <p className="text-gray-400 text-xs mt-2">
                        السيرفر {currentServerIndex + 1} من {workingSources.length}
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : videoError ? (
              // Error UI
              <div className="w-full h-full bg-black flex flex-col items-center justify-center text-center gap-4 p-4">
                <div className="text-6xl mb-2">⚠️</div>
                <p className="text-[#e50914] text-lg font-semibold">عذراً، لا يمكن تشغيل هذا الفيلم حالياً</p>
                <p className="text-gray-400 text-sm">جميع السيرفرات لا تعمل</p>
                <div className="flex gap-3 mt-2">
                  <button 
                    onClick={() => {
                      setVideoError(false);
                      setCurrentServerIndex(0);
                      setFailedServers([]);
                      setIsVideoLoading(true);
                    }}
                    className="bg-[#e50914] hover:bg-[#b20710] px-6 py-2.5 rounded-md transition-all"
                  >
                    إعادة المحاولة
                  </button>
                </div>
              </div>
            ) : (
              // No source available
              <div className="w-full h-full bg-black flex flex-col items-center justify-center text-center gap-3 p-4">
                <div className="w-20 h-20 rounded-full bg-[#e50914]/20 flex items-center justify-center">
                  <span className="text-4xl">🎬</span>
                </div>
                <p className="text-xl font-semibold">جاري تجهيز المشغل...</p>
                <p className="text-gray-400 text-sm">سيبدأ الفيديو قريباً</p>
              </div>
            )}
            
          {/* Video Controls Overlay */}
{/* Video Controls Overlay */}
{!videoError && currentSource && (
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
        {workingSources.length > 1 && (
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
                سيرفر {currentServerIndex + 1}/{workingSources.length}
              </span>
            </div>

            {/* Mobile hint */}
            <div className="absolute -bottom-6 left-0 text-[10px] text-white/60 sm:hidden whitespace-nowrap">
              لو الفيديو مش شغال جرّب سيرفر تاني
            </div>
          </button>
        )}
      </div>

      {/* MOVIE NAME بدل EPISODE */}
      <div className="bg-transparent px-3 py-1.5 max-w-[70%] sm:max-w-none">
        <span className="text-xs sm:text-sm text-white/90 font-medium truncate block">
          {movie?.title}
        </span>
      </div>

    </div>
  </div>
)}

      {/* EPISODE NAME */}
      <div className="bg-transparent px-3 py-1.5 max-w-[70%] sm:max-w-none">
        <span className="text-xs sm:text-sm text-white/90 font-medium truncate block">
          {selectedEpisode?.name}
        </span>
      </div>

    </div>
  </div>
)}
          
          {/* Movie Info */}
          <div className="px-4 md:px-8 lg:px-12 py-6">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                  {movie.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
                  {matchScore && (
                    <span className="text-[#46d369] font-bold text-sm">
                      {matchScore}% تطابق
                    </span>
                  )}
                  <span>•</span>
                  <span>{year}</span>
                  {runtimeText && (
                    <>
                      <span>•</span>
                      <span>{runtimeText}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="border border-gray-500 text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded">HD</span>
                  {movie.vote_average > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-yellow-500">
                        ⭐ {movie.vote_average.toFixed(1)} / 10
                      </span>
                    </>
                  )}
                </div>
                
                {/* Genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genres.map((genre) => (
                      <span key={genre.id} className="bg-white/10 px-3 py-1 rounded-full text-xs">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Overview */}
                <p className={`text-gray-300 text-sm md:text-base leading-relaxed mb-4 max-w-2xl transition-all duration-300 ${
                  !showFullInfo && 'line-clamp-3'
                }`}>
                  {movie.overview || 'لا يوجد وصف متاح لهذا الفيلم'}
                </p>
                
                {/* Show More Button */}
                {movie.overview && movie.overview.length > 200 && (
                  <button
                    onClick={() => setShowFullInfo(!showFullInfo)}
                    className="text-[#e50914] text-sm hover:underline mb-4"
                  >
                    {showFullInfo ? 'إظهار أقل' : 'عرض المزيد'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Suggested Movies Section */}
{suggested.length > 0 && (
  <div className="px-4 md:px-8 lg:px-12 py-8">
    <h3 className="text-white font-semibold mb-6 flex items-center gap-3 text-xl">
      <div className="w-10 h-10 bg-gradient-to-br from-[#e50914] to-[#b20710] rounded-xl flex items-center justify-center">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      </div>
      <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
        أفلام قد تعجبك أيضاً
      </span>
    </h3>
    
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {suggested.map((movie, idx) => (
        <div
          key={movie.id}
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="group cursor-pointer transition-all duration-300 hover:scale-105 animate-fadeInUp"
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src={movie.poster_path
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : 'https://via.placeholder.com/300x450?text=No+Image'
              }
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="text-white text-sm font-bold truncate mb-2">{movie.title}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 text-xs flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {movie.vote_average?.toFixed(1) || '?'}
                  </span>
                  <span className="text-gray-300 text-xs">{movie.release_date?.split('-')[0] || '?'}</span>
                </div>
                <button className="w-full mt-3 bg-[#e50914] hover:bg-[#b20710] text-white text-xs py-1.5 rounded-lg transition-all transform hover:scale-105">
                  مشاهدة
                </button>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              فيلم
            </div>
          </div>
          <h4 className="text-gray-300 text-sm text-center mt-3 truncate group-hover:text-white transition-colors font-medium">
            {movie.title}
          </h4>
        </div>
      ))}
    </div>
  </div>
)}
        </div>
      </div>

      <style>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MoviePage;
