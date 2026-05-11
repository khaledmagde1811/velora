import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from '../next-router-dom';
import tmdbApi, { requests } from '../services/tmdb';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showMoviesDropdown, setShowMoviesDropdown] = useState(false);
  const [showTvDropdown, setShowTvDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);

  // قائمة أقسام الأفلام
  const moviesCategories = [
    { name: 'حصرياً على VELORA', sectionKey: 'netflix', sectionTitle: 'حصرياً على VELORA', type: 'movie' },
    { name: 'الأكثر مشاهدة', sectionKey: 'trending', sectionTitle: 'الأكثر مشاهدة', type: 'movie' },
    { name: 'معروضة حالياً', sectionKey: 'nowplaying', sectionTitle: 'معروضة حالياً', type: 'movie' },
    { name: 'أعلى الأفلام تقييماً', sectionKey: 'toprated', sectionTitle: 'أعلى الأفلام تقييماً', type: 'movie' },
    { name: 'أفلام عربية', sectionKey: 'arabic', sectionTitle: 'أفلام عربية', type: 'movie' },
    { name: 'أكشن', sectionKey: 'action', sectionTitle: 'أكشن', type: 'movie' },
    { name: 'كوميدي', sectionKey: 'comedy', sectionTitle: 'كوميدي', type: 'movie' },
    { name: 'رعب', sectionKey: 'horror', sectionTitle: 'رعب', type: 'movie' },
    { name: 'كرتون', sectionKey: 'animation', sectionTitle: 'كرتون', type: 'movie' },
    { name: 'رومانسي', sectionKey: 'romance', sectionTitle: 'رومانسي', type: 'movie' },
  ];

  // قائمة أقسام المسلسلات
  const tvCategories = [
    { name: 'أشهر المسلسلات', sectionKey: 'trendingTV', sectionTitle: 'أشهر المسلسلات', type: 'tv' },
    { name: 'مسلسلات Netflix الأصلية', sectionKey: 'netflixTV', sectionTitle: 'مسلسلات Netflix الأصلية', type: 'tv' },
    { name: 'الأكثر شعبية', sectionKey: 'popularTV', sectionTitle: 'الأكثر شعبية', type: 'tv' },
    { name: 'أعلى المسلسلات تقييماً', sectionKey: 'topratedTV', sectionTitle: 'أعلى المسلسلات تقييماً', type: 'tv' },
    { name: 'معروضة اليوم', sectionKey: 'airingTodayTV', sectionTitle: 'معروضة اليوم', type: 'tv' },
    { name: 'على الهواء الآن', sectionKey: 'onTheAirTV', sectionTitle: 'على الهواء الآن', type: 'tv' },
    { name: 'مسلسلات أكشن', sectionKey: 'actionTV', sectionTitle: 'مسلسلات أكشن', type: 'tv' },
    { name: 'مسلسلات كوميدية', sectionKey: 'comedyTV', sectionTitle: 'مسلسلات كوميدية', type: 'tv' },
    { name: 'مسلسلات دراما', sectionKey: 'dramaTV', sectionTitle: 'مسلسلات دراما', type: 'tv' },
    { name: 'خيال علمي وفانتازيا', sectionKey: 'scifiTV', sectionTitle: 'خيال علمي وفانتازيا', type: 'tv' },
    { name: 'مسلسلات كرتون', sectionKey: 'animationTV', sectionTitle: 'مسلسلات كرتون', type: 'tv' },
    { name: 'مسلسلات عربية', sectionKey: 'arabicTV', sectionTitle: 'مسلسلات عربية', type: 'tv' },
  ];

  // روابط التنقل
const navLinks = [
  { name: 'الرئيسية', path: '/' },
  { name: 'من نحن', path: '/about' },
  { name: 'أفلام', path: '/moviespagde', hasDropdown: true, dropdownType: 'movies' },
  { name: 'مسلسلات', path: '/tvshows', hasDropdown: true, dropdownType: 'tv' },

  { name: 'مشاهدة لاحقاً', path: '/watch-later' },
  { name: 'المفضلة', path: '/favorites' },
  { name: 'أتابع الآن', path: '/currently-watching' },
];

  const getMovieCategoryUrl = (sectionKey) => {
    const categoryUrls = {
      netflix: requests.fetchNetflixOriginals,
      trending: requests.fetchTrending,
      nowplaying: requests.fetchNowPlaying,
      toprated: requests.fetchTopRated,
      arabic: requests.fetchArabicMovies,
      action: requests.fetchActionMovies,
      comedy: requests.fetchComedyMovies,
      horror: requests.fetchHorrorMovies,
      animation: requests.fetchAnimation,
      romance: requests.fetchRomanceMovies,
    };
    return categoryUrls[sectionKey] || requests.fetchTrending;
  };

  const getTvCategoryUrl = (sectionKey) => {
    const categoryUrls = {
      trendingTV: requests.fetchTrendingTV,
      netflixTV: requests.fetchNetflixTVShows,
      popularTV: requests.fetchPopularTV,
      topratedTV: requests.fetchTopRatedTV,
      airingTodayTV: requests.fetchAiringTodayTV,
      onTheAirTV: requests.fetchOnTheAirTV,
      actionTV: requests.fetchActionTV,
      comedyTV: requests.fetchComedyTV,
      dramaTV: requests.fetchDramaTV,
      scifiTV: requests.fetchSciFiFantasyTV,
      animationTV: requests.fetchAnimationTV,
      arabicTV: requests.fetchArabicTV,
    };
    return categoryUrls[sectionKey] || requests.fetchTrendingTV;
  };

  const isInnerPage =
    location.pathname.startsWith('/movie/') ||
    location.pathname.startsWith('/tv/') ||
    location.pathname.startsWith('/search');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const searchAll = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      setSearchLoading(true);
      try {
        const [movieRes, tvRes] = await Promise.all([
          tmdbApi.get('/search/movie', {
            params: { query: searchQuery, language: 'ar-SA', page: 1 },
          }),
          tmdbApi.get('/search/tv', {
            params: { query: searchQuery, language: 'ar-SA', page: 1 },
          }),
        ]);
        const combined = [
          ...movieRes.data.results.map((m) => ({ ...m, media_type: 'movie' })),
          ...tvRes.data.results.map((t) => ({ ...t, media_type: 'tv', title: t.name })),
        ].slice(0, 5);
        setSearchResults(combined);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };
    const debounce = setTimeout(() => {
      searchAll();
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const handleMediaClick = (media) => {
    if (media.media_type === 'movie') {
      navigate(`/movie/${media.id}`);
    } else {
      navigate(`/tv/${media.id}`);
    }
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleMovieCategoryClick = (category) => {
    const apiUrl = getMovieCategoryUrl(category.sectionKey);
    const encodedTitle = encodeURIComponent(category.sectionTitle);
    const encodedUrl = encodeURIComponent(apiUrl);
    navigate(`/category/${encodedTitle}?url=${encodedUrl}&type=movie`);
    setShowMoviesDropdown(false);
  };

  const handleTvCategoryClick = (category) => {
    const apiUrl = getTvCategoryUrl(category.sectionKey);
    const encodedTitle = encodeURIComponent(category.sectionTitle);
    const encodedUrl = encodeURIComponent(apiUrl);
    navigate(`/category/${encodedTitle}?url=${encodedUrl}&type=tv`);
    setShowTvDropdown(false);
  };
  useEffect(() => {
    // التحقق من أن الزر يعمل على الموبايل
    const checkMobileMenu = () => {
      if (window.innerWidth < 1024) {
        console.log('وضع الموبايل مفعل - زر القائمة جاهز');
      }
    };
    checkMobileMenu();
    window.addEventListener('resize', checkMobileMenu);
    return () => window.removeEventListener('resize', checkMobileMenu);
  }, []);

  return (
    <nav
      dir="rtl"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-black/95 shadow-lg shadow-black/50 backdrop-blur-xl border-b border-white/10'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 lg:h-24">

          {/* ========== القسم الأيسر: الشعار + زر الرجوع ========== */}
          <div className="flex items-center gap-2 md:gap-3">
            {isInnerPage && (
              <button
                onClick={handleGoBack}
                className="group flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/5 hover:bg-white/20 text-white text-lg transition-all duration-300 hover:scale-110"
                aria-label="رجوع"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div
              className="flex items-center gap-2 cursor-pointer select-none group"
              onClick={() => navigate('/')}
            >
              <div className="relative">
                <span className="text-white font-black text-xl md:text-2xl lg:text-3xl tracking-wider bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  VELORA
                </span>
                <div className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
              </div>
              <span className="bg-gradient-to-r from-red-600 to-red-700 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-md shadow-lg">
                سينما
              </span>
            </div>
          </div>

          {/* ========== الروابط الرئيسية (Desktop) ========== */}
          {!isInnerPage && (
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => {
                    if (link.hasDropdown && link.dropdownType === 'movies') setShowMoviesDropdown(true);
                    if (link.hasDropdown && link.dropdownType === 'tv') setShowTvDropdown(true);
                  }}
                  onMouseLeave={() => {
                    setShowMoviesDropdown(false);
                    setShowTvDropdown(false);
                  }}
                >
                  <button
                    onClick={() => navigate(link.path)}
                    className={`group flex items-center gap-1.5 px-3 xl:px-4 py-2 rounded-lg text-sm xl:text-base font-medium transition-all duration-300 ${isActive(link.path)
                        ? 'text-white bg-gradient-to-r from-red-600/20 to-red-600/10 border-b-2 border-red-600'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <span>{link.name}</span>
                    {link.hasDropdown && (
                      <svg
                        className={`w-3 h-3 xl:w-4 xl:h-4 transition-transform duration-300 ${(link.dropdownType === 'movies' && showMoviesDropdown) ||
                            (link.dropdownType === 'tv' && showTvDropdown)
                            ? 'rotate-180'
                            : ''
                          }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {/* Dropdown أفلام - مطور */}
                  {link.hasDropdown && link.dropdownType === 'movies' && showMoviesDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-fadeInDown">
                      <div className="px-5 py-3 text-xs font-bold text-gray-400 border-b border-white/10 flex items-center gap-2">
                        <span>🎬</span>
                        <span>أقسام الأفلام</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {moviesCategories.map((category, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleMovieCategoryClick(category)}
                            className="group/item px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-transparent cursor-pointer transition-all duration-200 flex items-center justify-between"
                          >
                            <span>{category.name}</span>
                            <svg className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dropdown مسلسلات - مطور */}
                  {link.hasDropdown && link.dropdownType === 'tv' && showTvDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-fadeInDown">
                      <div className="px-5 py-3 text-xs font-bold text-gray-400 border-b border-white/10 flex items-center gap-2">
                        <span>📺</span>
                        <span>أقسام المسلسلات</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {tvCategories.map((category, idx) => (
                          <div
                            key={idx}
                            onClick={() => handleTvCategoryClick(category)}
                            className="group/item px-5 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-600/20 hover:to-transparent cursor-pointer transition-all duration-200 flex items-center justify-between"
                          >
                            <span>{category.name}</span>
                            <svg className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ========== القسم الأيمن: الأيقونات والبحث ========== */}
          <div className="flex items-center gap-1 md:gap-2 relative">


            {/* زر البحث المتطور */}
{/* زر البحث المتطور */}
{/* Search Wrapper */}
<div className="search-wrapper" ref={searchRef}>

  {/* Search Toggle Button */}
  <button
    onClick={() => setShowSearch(!showSearch)}
    className="search-icon-btn"
    aria-label="بحث"
  >
    <svg className="search-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  </button>

  {/* Search Dropdown */}
  {showSearch && (
    <div className="search-dropdown">

      {/* Search Input */}
      <form onSubmit={handleSearchSubmit} className="search-form">
        <input
          type="text"
          placeholder="ابحث عن فيلم أو مسلسل..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoFocus
          className="search-input"
        />
        <button type="submit" className="search-submit-btn">
          <svg className="search-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Results Panel */}
      {(searchQuery.length >= 2 || searchLoading) && (
        <div className="search-results-panel">

          {searchLoading ? (
            <div className="search-loading">
              <div className="search-spinner" />
              <span>جاري البحث...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="search-results-header">
                نتائج البحث ({searchResults.length})
              </div>

              <div className="search-results-list">
                {searchResults.map((item) => (
                  <div
                    key={`${item.media_type}-${item.id}`}
                    onClick={() => handleMediaClick(item)}
                    className="search-result-item"
                  >
                    <img
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                          : 'https://share.google/WtIWVQuaLAgqUiBRx'
                      }
                      alt={item.title || item.name}
                      className="search-result-poster"
                    />
                    <div className="search-result-info">
                      <div className="search-result-top">
                        <span className={`search-result-badge ${item.media_type === 'movie' ? 'badge-movie' : 'badge-tv'}`}>
                          {item.media_type === 'movie' ? 'فيلم' : 'مسلسل'}
                        </span>
                        <span className="search-result-title">
                          {item.title || item.name}
                        </span>
                      </div>
                      <div className="search-result-meta">
                        <span className="search-result-year">
                          {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'قريباً'}
                        </span>
                        <span className="search-result-rating">
                          ⭐ {item.vote_average?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="search-view-all-wrap">
                <button onClick={handleViewAllResults} className="search-view-all-btn">
                  <span>عرض جميع النتائج</span>
                  <svg className="search-arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          ) : searchQuery.length >= 2 ? (
            <div className="search-empty">
              <span className="search-empty-icon">🔍</span>
              <p className="search-empty-text">لا توجد نتائج لـ "{searchQuery}"</p>
              <button onClick={handleViewAllResults} className="search-empty-all-btn">
                البحث في الكل ›
              </button>
            </div>
          ) : null}

        </div>
      )}
    </div>
  )}
</div>
            {/* زر القائمة الجانبية (موبايل و Tablet) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full hover:bg-white/10 text-white transition-all duration-300 hover:scale-110"
              aria-label="القائمة"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ========== Mobile Menu Overlay ========== */}
      <div
        className={`fixed inset-0 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur-md z-40 lg:hidden transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* ========== Mobile Menu Drawer مطور ========== */}
      <div
        dir="rtl"
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-gradient-to-b from-gray-950 to-black border-l border-white/10 z-50 overflow-y-auto transition-transform duration-500 ease-out shadow-2xl lg:hidden ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header مع تأثيرات */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-950 to-black z-10">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              {isInnerPage && (
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300"
                  onClick={() => {
                    handleGoBack();
                    setMobileMenuOpen(false);
                  }}
                >
                  <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <div className="flex items-center gap-2">
                <span className="text-white font-black text-xl tracking-wider bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  VELORA
                </span>
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">سينما</span>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/10 text-white transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* الروابط في الموبايل */}
        <div className="py-4">
          {navLinks.map((link, index) => (
            <div key={index} className="border-b border-white/5">
              <button
                onClick={() => {
                  if (!link.hasDropdown) {
                    navigate(link.path);
                    setMobileMenuOpen(false);
                  }
                }}
                className={`w-full text-right px-5 py-4 text-base font-semibold transition-all duration-200 flex items-center justify-between group ${isActive(link.path)
                    ? 'text-white bg-gradient-to-r from-red-600/20 to-transparent'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span>{link.name}</span>
                {link.hasDropdown && (
                  <svg className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </button>

              {/* أقسام الأفلام في الموبايل */}
              {link.name === 'أفلام' && (
                <div className="bg-black/30 pb-2">
                  <div className="px-5 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <span>🎬</span>
                    <span>أقسام الأفلام</span>
                  </div>
                  <div className="grid grid-cols-1 gap-0">
                    {moviesCategories.map((category, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleMovieCategoryClick(category);
                          setMobileMenuOpen(false);
                        }}
                        className="text-right px-7 py-3 text-sm text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-red-600/10 hover:to-transparent transition-all duration-200 border-r-2 border-transparent hover:border-red-500 flex items-center justify-between group"
                      >
                        <span>{category.name}</span>
                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* أقسام المسلسلات في الموبايل */}
              {link.name === 'مسلسلات' && (
                <div className="bg-black/30 pb-2">
                  <div className="px-5 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                    <span>📺</span>
                    <span>أقسام المسلسلات</span>
                  </div>
                  <div className="grid grid-cols-1 gap-0">
                    {tvCategories.map((category, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleTvCategoryClick(category);
                          setMobileMenuOpen(false);
                        }}
                        className="text-right px-7 py-3 text-sm text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-red-600/10 hover:to-transparent transition-all duration-200 border-r-2 border-transparent hover:border-red-500 flex items-center justify-between group"
                      >
                        <span>{category.name}</span>
                        <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer في الموبايل */}
        <div className="px-5 py-6 border-t border-white/10 mt-4">
          <div className="text-center text-gray-500 text-xs">
            <p>© 2024 VELORA | جميع الحقوق محفوظة</p>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-fadeInDown {
      animation: fadeInDown 0.3s ease forwards;
    }
    
    /* تخصيص شريط التمرير في الموبايل */
    .overflow-y-auto::-webkit-scrollbar {
      width: 4px;
    }
    
    .overflow-y-auto::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
    }
    
    .overflow-y-auto::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 4px;
    }
    
    .overflow-y-auto::-webkit-scrollbar-thumb:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `}</style>
    </nav>
  );
};

export default Navbar;