import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  fetchTvDetails, 
  fetchTvSeasons, 
  fetchTvEpisodes,
  getEpisodeEmbedUrls
} from '../../services/tmdb';

const TvPage = () => {
  const { id } = useParams();
const navigate = useNavigate();
  // State
const [similarShows, setSimilarShows] = useState([]);
const [similarShowsLoading, setSimilarShowsLoading] = useState(true);
const [scrollY, setScrollY] = useState(0);
  const [tvShow, setTvShow] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoError, setVideoError] = useState(false);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState('episodes');
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [failedServers, setFailedServers] = useState([]);
  
  // Refs
  const playerContainerRef = useRef(null);
  const iframeRef = useRef(null);
  
  // Get available video URLs using useMemo (not useCallback)
  const availableUrls = useMemo(() => {
    if (!selectedSeason || !selectedEpisode || !tvShow) return [];
    return getEpisodeEmbedUrls(id, selectedSeason.season_number, selectedEpisode.episode_number);
  }, [id, selectedSeason, selectedEpisode, tvShow]);
  
  // Get working servers (filter out failed ones)
  const workingUrls = useMemo(() => {
    return availableUrls.filter((_, index) => !failedServers.includes(index));
  }, [availableUrls, failedServers]);
  
  // Current video URL
  const currentVideoUrl = useMemo(() => {
    if (workingUrls.length === 0) return null;
    return workingUrls[currentServerIndex] || workingUrls[0];
  }, [workingUrls, currentServerIndex]);
  
  // Stable iframe key (only changes when episode changes, not when server changes)
  const iframeKey = useMemo(() => {
    if (!selectedEpisode) return null;
    return `${selectedEpisode.id}`;
  }, [selectedEpisode]);
  
  // Load TV show data
  useEffect(() => {
    const loadTvData = async () => {
      setLoading(true);
      setError(null);
      try {
        const tvData = await fetchTvDetails(id);
        
        if (!tvData || !tvData.first_air_date) {
          setError('المسلسل غير موجود');
          return;
        }
        
        setTvShow(tvData);
        
        const tvSeasons = await fetchTvSeasons(id);
        setSeasons(tvSeasons);
        
        if (tvSeasons.length > 0) {
          const firstSeason = tvSeasons[0];
          setSelectedSeason(firstSeason);
          
          const seasonEpisodes = await fetchTvEpisodes(id, firstSeason.season_number);
          setEpisodes(seasonEpisodes);
          
          if (seasonEpisodes.length > 0) {
            setSelectedEpisode(seasonEpisodes[0]);
          }
        }
      } catch (err) {
        console.error('❌ Error:', err);
        setError('حدث خطأ في تحميل بيانات المسلسل');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) loadTvData();
  }, [id]);
  
  
  // Handle season change
  const handleSeasonChange = async (season) => {
    setSelectedSeason(season);
    setLoading(true);
    setVideoError(false);
    setCurrentServerIndex(0);
    setFailedServers([]);
    setIsVideoLoading(true);
    
    try {
      const seasonEpisodes = await fetchTvEpisodes(id, season.season_number);
      setEpisodes(seasonEpisodes);
      if (seasonEpisodes.length > 0) {
        setSelectedEpisode(seasonEpisodes[0]);
      }
    } catch (err) {
      console.error('Error loading episodes:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle episode change
  const handleEpisodeChange = (episode) => {
    setSelectedEpisode(episode);
    setVideoError(false);
    setCurrentServerIndex(0);
    setFailedServers([]);
    setIsVideoLoading(true);
    
    if (window.innerWidth < 768) {
      setShowSidebar(false);
    }
  };
  
  // Handle iframe load success
  const handleIframeLoad = useCallback(() => {
    setIsVideoLoading(false);
    setVideoError(false);
  }, []);
  
  // Handle iframe error - switch to next server
  const handleIframeError = useCallback(() => {
    const currentIndex = currentServerIndex;
    
    // Mark current server as failed
    setFailedServers(prev => [...prev, currentIndex]);
    
    // Try next server
    if (currentServerIndex + 1 < workingUrls.length) {
      setCurrentServerIndex(prev => prev + 1);
      setIsVideoLoading(true);
    } else {
      // All servers failed
      setVideoError(true);
      setIsVideoLoading(false);
    }
  }, [currentServerIndex, workingUrls.length]);
  
  // Manual server switch
  const switchServer = useCallback(() => {
    if (currentServerIndex + 1 < workingUrls.length) {
      setCurrentServerIndex(prev => prev + 1);
      setIsVideoLoading(true);
      setVideoError(false);
    } else if (workingUrls.length > 0) {
      // Loop back to first server
      setCurrentServerIndex(0);
      setIsVideoLoading(true);
      setVideoError(false);
    }
  }, [currentServerIndex, workingUrls.length]);
  
  // Fullscreen toggle - robust cross-browser
  const toggleFullscreen = useCallback(async () => {
    const element = playerContainerRef.current;
    if (!element) return;
    
    try {
      if (!document.fullscreenElement) {
        // Enter fullscreen
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        // Exit fullscreen
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
  
  useEffect(() => {
    const fetchSimilarShowsData = async () => {
      if (!tvShow?.id) return;
      setSimilarShowsLoading(true);
      try {
        // استخدام fetch مع API key من env
        const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tvShow.id}/similar?api_key=${API_KEY}&language=ar-SA`
        );
        const data = await response.json();
        setSimilarShows(data.results.slice(0, 8));
      } catch (error) {
        console.error('Error fetching similar shows:', error);
        setSimilarShows([]);
      } finally {
        setSimilarShowsLoading(false);
      }
    };
    
    fetchSimilarShowsData();
  }, [tvShow?.id]);

  // ========== إضافة تتبع التمرير للتأثير الـ parallax ==========
useEffect(() => {
  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  return () => window.removeEventListener('scroll', handleScroll);
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
  
  // Reset video loading state when episode or server changes
  useEffect(() => {
    setIsVideoLoading(true);
    setVideoError(false);
  }, [selectedEpisode, currentServerIndex]);
  
  // Loading state
  if (loading && !tvShow) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-[#e50914] rounded-full animate-spin"></div>
        <p className="text-white mt-4">جاري تحميل المسلسل...</p>
      </div>
    );
  }
  
  
  // Error state

  return (
<div className="bg-[#141414] min-h-screen text-white">
  <div className="relative">
    {/* Hero Background مع تأثير parallax محسن */}
    <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: tvShow.backdrop_path && tvShow.backdrop_path !== null
      ? `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`
      : 'none',
    backgroundColor: !tvShow.backdrop_path ? '#141414' : 'transparent',
  }}
/>
    
    {/* Overlay Layers محسنة جداً */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/30 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
    
    <div className="relative z-10">
      {/* Video Player Container محسن مع تأثيرات */}
      <div 
        ref={playerContainerRef}
        className={`relative w-full bg-black transition-all duration-700 ease-out ${
          isFullscreen ? 'fixed inset-0 z-50 h-screen' : 'h-[60vh] md:h-[70vh] lg:h-[80vh]'
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
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          idx === currentServerIndex ? 'w-8 bg-[#e50914]' : 'w-2 bg-gray-600'
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
        
        {/* Video Controls Overlay محسن جداً */}
        {selectedEpisode && !videoError && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 opacity-0 hover:opacity-100 transition-all duration-300 z-20">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <button
                  onClick={toggleFullscreen}
                  className="bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full p-2.5 transition-all hover:scale-110 group"
                  title={isFullscreen ? "خروج من الشاشة الكاملة" : "شاشة كاملة"}
                >
                  {isFullscreen ? (
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                  )}
                </button>
                
                {workingUrls.length > 1 && (
                  <button
                    onClick={switchServer}
                    className="bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full p-2.5 transition-all hover:scale-110 group"
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
                  </button>
                )}
              </div>
              
              <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-1.5">
                <span className="text-sm text-white/90 font-medium">
                  {selectedEpisode?.name}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
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
              <div className="hidden sm:flex flex-col items-center">
                <div className="relative w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#2a2a2a"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={tvShow.vote_average > 7 ? '#46d369' : tvShow.vote_average > 5 ? '#ffa500' : '#e50914'}
                      strokeWidth="3"
                      strokeDasharray={`${(tvShow.vote_average / 10) * 100}, 100`}
                      strokeLinecap="round"
                    />
                    <text x="18" y="22" textAnchor="middle" className="text-sm font-bold fill-white">
                      {tvShow.vote_average?.toFixed(1)}
                    </text>
                  </svg>
                </div>
                <span className="text-xs text-gray-500 mt-2">تقييم الجمهور</span>
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
      
      {/* Seasons & Episodes Sidebar محسن جداً */}
 <div className={`border-t border-gray-800 transition-all duration-500 ${
  showSidebar ? 'block' : 'hidden lg:block'
}`}>
        <div className="px-4 md:px-8 lg:px-12 py-8">
          {/* Mobile Tabs محسنة */}
          <div className="lg:hidden flex gap-3 mb-8">
            {[
              { id: 'episodes', label: ' الحلقات', icon: '' },
              { id: 'details', label: ' التفاصيل', icon: '' },
              { id: 'similar', label: ' مقترحات', icon: '' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3.5 text-center font-medium rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-lg transform scale-105'
                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* Seasons - محسن */}
          <div className="mb-8">
            <h3 className="text-[#e50914] font-semibold mb-4 flex items-center gap-2 text-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              المواسم
            </h3>
            <div className="flex flex-wrap gap-3">
              {seasons.map((season) => (
                <button
                  key={season.season_number}
                  onClick={() => handleSeasonChange(season)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedSeason?.season_number === season.season_number
                      ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  الموسم {season.season_number}
                  <span className="hidden sm:inline ml-2 text-xs opacity-80">
                    ({season.episode_count} حلقة)
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Episodes List - محسن جداً مع أنيميشن */}
          <div className={`${activeTab === 'episodes' ? 'block' : 'hidden lg:block'}`}>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              حلقات الموسم {selectedSeason?.season_number}
              <span className="text-sm text-gray-400">({episodes.length} حلقة)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {episodes.map((episode, idx) => (
                <div
                  key={episode.id}
                  onClick={() => handleEpisodeChange(episode)}
                  className={`group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 animate-fadeInUp ${
                    selectedEpisode?.id === episode.id
                      ? 'bg-gradient-to-r from-[#e50914]/20 to-transparent border-r-4 border-[#e50914] shadow-lg'
                      : 'hover:bg-gray-800/50 hover:scale-[1.02]'
                  }`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Episode Number Badge محسن */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 transition-all duration-300 ${
                    selectedEpisode?.id === episode.id
                      ? 'bg-gradient-to-br from-[#e50914] to-[#b20710] text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                  }`}>
                    {episode.episode_number}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm md:text-base truncate group-hover:text-[#e50914] transition-colors">
                        {episode.name}
                      </h4>
                      {episode.runtime && (
                        <span className="text-xs text-gray-400 whitespace-nowrap bg-gray-800/50 px-2 py-1 rounded-md">
                          {episode.runtime} دقيقة
                        </span>
                      )}
                    </div>
                    {episode.overview && (
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                        {episode.overview}
                      </p>
                    )}
                    {episode.air_date && (
                      <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {episode.air_date}
                      </p>
                    )}
                  </div>
                  
                  {selectedEpisode?.id === episode.id && (
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-[#e50914] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Details Tab - محسن جداً */}
          <div className={`${activeTab === 'details' ? 'block' : 'hidden lg:hidden'}`}>
            <div className="space-y-8">
              {tvShow.poster_path && (
                <div className="lg:hidden w-40 mx-auto rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-300 hover:scale-105">
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                    alt={tvShow.name}
                    className="w-full h-auto"
                  />
                </div>
              )}
              
              {tvShow.overview && (
                <div className="bg-gray-800/30 rounded-2xl p-6">
                  <h4 className="text-[#e50914] font-semibold mb-3 flex items-center gap-2 text-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    القصة
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">{tvShow.overview}</p>
                </div>
              )}
              
              {tvShow.genres && tvShow.genres.length > 0 && (
                <div className="bg-gray-800/30 rounded-2xl p-6">
                  <h4 className="text-[#e50914] font-semibold mb-3 flex items-center gap-2 text-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                    التصنيفات
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {tvShow.genres.map((genre) => (
                      <span key={genre.id} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full text-sm transition-all duration-300 cursor-pointer">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-gray-800/30 rounded-2xl p-6">
                <h4 className="text-[#e50914] font-semibold mb-4 flex items-center gap-2 text-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  معلومات إضافية
                </h4>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'تاريخ العرض', value: tvShow.first_air_date || 'غير معروف', icon: '📅' },
                    { label: 'التقييم', value: `⭐ ${tvShow.vote_average?.toFixed(1)}/10`, icon: '🎯' },
                    { label: 'عدد الأصوات', value: tvShow.vote_count?.toLocaleString(), icon: '👥' },
                    { label: 'عدد المواسم', value: tvShow.number_of_seasons, icon: '📚' },
                    { label: 'عدد الحلقات', value: tvShow.number_of_episodes, icon: '🎬' },
                    { label: 'الحالة', value: tvShow.status || 'غير معروف', icon: '📺' },
                    { label: 'اللغة الأصلية', value: tvShow.original_language?.toUpperCase() || 'غير معروف', icon: '🌐' }
                  ].map(info => (
                    <div key={info.label} className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0 group hover:bg-gray-700/30 px-3 rounded-lg transition-all">
                      <span className="text-gray-400 flex items-center gap-2">
                        <span>{info.icon}</span>
                        <span>{info.label}</span>
                      </span>
                      <span className="text-white font-medium">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Similar TV Shows - اقتراحات مسلسلات مشابهة محسنة جداً */}
         <div className="block lg:block">
  <h3 className="text-white font-semibold mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-lg md:text-xl">
    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#e50914] to-[#b20710] rounded-xl flex items-center justify-center">
      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    </div>
    <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
      مسلسلات قد تعجبك أيضاً
    </span>
  </h3>
  
  {similarShowsLoading ? (
    <div className="flex justify-center py-12 md:py-16">
      <div className="text-center">
        <div className="relative">
          <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-gray-700 border-t-[#e50914] rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-transparent border-b-[#e50914] rounded-full animate-spin-slow"></div>
          </div>
        </div>
        <p className="text-gray-400 text-xs md:text-sm mt-4">جاري البحث عن اقتراحات...</p>
      </div>
    </div>
  ) : similarShows.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
      {similarShows.map((show, idx) => (
        <div
          key={show.id}
          onClick={() => navigate(`/tv/${show.id}`)}
          className="group cursor-pointer transition-all duration-300 hover:scale-105 animate-fadeInUp"
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <div className="relative rounded-lg md:rounded-xl overflow-hidden shadow-lg">
            <img
              src={show.poster_path
                ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
                : 'https://via.placeholder.com/300x450?text=No+Image'
              }
              alt={show.name}
              className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h4 className="text-white text-xs md:text-sm font-bold truncate mb-1 md:mb-2">{show.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 text-[10px] md:text-xs flex items-center gap-1">
                    <svg className="w-2 h-2 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {show.vote_average?.toFixed(1)}
                  </span>
                  <span className="text-gray-300 text-[10px] md:text-xs">{show.first_air_date?.split('-')[0]}</span>
                </div>
                <button className="w-full mt-2 md:mt-3 bg-[#e50914] hover:bg-[#b20710] text-white text-[10px] md:text-xs py-1 md:py-1.5 rounded-lg transition-all transform hover:scale-105">
                  مشاهدة
                </button>
              </div>
            </div>
            <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5 md:px-2 md:py-1 text-[9px] md:text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              {show.number_of_seasons} مواسم
            </div>
          </div>
          <h4 className="text-gray-300 text-xs md:text-sm text-center mt-2 md:mt-3 truncate group-hover:text-white transition-colors font-medium">
            {show.name}
          </h4>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-12 md:py-16 bg-gray-800/30 rounded-xl md:rounded-2xl">
      <span className="text-4xl md:text-6xl mb-3 md:mb-4 block animate-bounce">🎬</span>
      <p className="text-gray-400 text-sm md:text-base">لا توجد مسلسلات مشابهة حالياً</p>
      <p className="text-gray-500 text-xs md:text-sm mt-1 md:mt-2">سوف نضيف المزيد قريباً</p>
    </div>
  )}
</div>
        </div>
      </div>
    </div>
  </div>
  {error && (
  <div className="px-4 md:px-8 lg:px-12 py-4 text-red-400">
    {error}
  </div>
)}
style={{
  transform: `translateY(${scrollY * 0.15}px)`,
  backgroundImage: tvShow.backdrop_path && tvShow.backdrop_path !== null
    ? `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})`
    : 'none',
  backgroundColor: !tvShow.backdrop_path ? '#141414' : 'transparent',
}}
</div>
  );
};

export default TvPage;