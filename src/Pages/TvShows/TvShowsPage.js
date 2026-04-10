// Pages/TvShows/TvShowsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import tmdbApi, { tvRequests } from '../../services/tmdb';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

// استيراد أنماط Swiper
import 'swiper/css';
import 'swiper/css/navigation';

// ========== مكون صف المسلسلات المستقل مع Swiper ==========
const TvRow = ({ title, fetchUrl, onTvClick, onViewAll }) => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        // تأكد من أن fetchUrl هو string صحيح
        const url = typeof fetchUrl === 'string' ? fetchUrl : String(fetchUrl);
        const response = await tmdbApi.get(url);
        
        let results = response.data.results || [];
        // فلترة المسلسلات الصالحة فقط (لها first_air_date)
        results = results.filter(show => show.first_air_date && show.name);
        setShows(results.slice(0, 15));
      } catch (error) {
        console.error('Error fetching TV shows for', title, ':', error);
        setFetchError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (fetchUrl) {
      fetchShows();
    }
  }, [fetchUrl, title]);

  if (loading) {
    return (
      <div className="group/movie-row relative mb-8 md:mb-10">
        <div className="flex items-center justify-between mb-3 px-4 md:px-8 lg:px-12">
          <h2 className="text-white text-lg md:text-xl lg:text-2xl font-semibold">
            {title}
          </h2>
        </div>
        <div className="flex gap-2 overflow-hidden px-4 md:px-8 lg:px-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]">
              <div className="w-full h-[200px] sm:h-[230px] md:h-[260px] lg:h-[280px] bg-gray-800 rounded-md animate-pulse"></div>
              <div className="mt-2 h-4 bg-gray-800 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="group/movie-row relative mb-8 md:mb-10">
        <div className="flex items-center justify-between mb-3 px-4 md:px-8 lg:px-12">
          <h2 className="text-white text-lg md:text-xl lg:text-2xl font-semibold">
            {title}
          </h2>
        </div>
        <div className="text-center py-8 text-gray-400">
          <p>حدث خطأ في تحميل {title}</p>
        </div>
      </div>
    );
  }

  if (!shows.length) return null;

  return (
    <div className="group/movie-row relative mb-8 md:mb-10">
      <div className="flex items-center justify-between mb-3 px-4 md:px-8 lg:px-12">
        <h2 className="text-white text-lg md:text-xl lg:text-2xl font-semibold hover:text-[#e50914] transition-colors cursor-pointer">
          {title}
        </h2>
        <button 
          onClick={onViewAll}
          className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1"
        >
          عرض المزيد 
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="relative px-4 md:px-8 lg:px-12">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={10}
          slidesPerView="auto"
          navigation={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={shows.length > 6}
          speed={800}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 8,
            },
            480: {
              slidesPerView: 2.5,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 25,
            },
          }}
          className="tv-swiper"
        >
          {shows.map((show) => (
            <SwiperSlide key={show.id} className="!w-auto">
              <div
                onClick={() => onTvClick(show.id)}
                className="relative flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10"
              >
                <div className="relative rounded-md overflow-hidden bg-gray-800">
                  <img
                    src={show.poster_path
                      ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
                      : 'https://share.google/WtIWVQuaLAgqUiBRx'
                    }
                    alt={show.name}
                    className="w-full h-[200px] sm:h-[230px] md:h-[260px] lg:h-[280px] object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://share.google/WtIWVQuaLAgqUiBRx';
                    }}
                  />
                  
                  {/* Overlay على hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white text-sm md:text-base font-semibold line-clamp-2 mb-1">
                        {show.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#46d369] font-medium">
                          ⭐ {show.vote_average?.toFixed(1) || '?'}
                        </span>
                        <span className="text-gray-300">
                          {show.first_air_date?.split('-')[0] || '?'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* عنوان مختصر تحت الصورة (للموبايل) */}
                <div className="mt-2 block md:hidden">
                  <h4 className="text-white text-xs font-medium truncate">
                    {show.name}
                  </h4>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

// ========== الصفحة الرئيسية للمسلسلات ==========
const TvShowsPage = () => {
  const [heroShow, setHeroShow] = useState(null);
  const [heroLoading, setHeroLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // تحميل مسلسل عشوائي للـ Hero
  useEffect(() => {
    const loadHeroShow = async () => {
      try {
        // استخدام endpoint صحيح بدون أحرف عربية
        const response = await tmdbApi.get('/tv/popular');
        const shows = response.data.results.filter(show => show.first_air_date && show.backdrop_path);
        if (shows.length > 0) {
          const randomIndex = Math.floor(Math.random() * shows.length);
          setHeroShow(shows[randomIndex]);
        } else {
          setError('لا توجد مسلسلات متاحة حالياً');
        }
      } catch (error) {
        console.error('Error loading hero show:', error);
        setError('حدث خطأ في تحميل المسلسلات');
      } finally {
        setHeroLoading(false);
      }
    };
    loadHeroShow();
  }, []);

  const handleTvClick = useCallback((showId) => {
    navigate(`/tv/${showId}`);
  }, [navigate]);

  const handleViewAll = useCallback((sectionTitle, fetchUrl) => {
    const encodedTitle = encodeURIComponent(sectionTitle);
    const encodedUrl = encodeURIComponent(fetchUrl);
    navigate(`/tv-category/${encodedTitle}?url=${encodedUrl}&type=tv&title=${encodedTitle}`);
  }, [navigate]);

  // أقسام المسلسلات - تأكد من أن الـ URLs صحيحة
  const sections = useMemo(() => [
    { title: 'مسلسلات Netflix الأصلية', url: tvRequests.fetchNetflixTVShows },
    { title: 'الأكثر مشاهدة', url: tvRequests.fetchTrendingTV },
    { title: 'الأكثر شعبية', url: tvRequests.fetchPopularTV },
    { title: 'أعلى المسلسلات تقييماً', url: tvRequests.fetchTopRatedTV },
    { title: 'معروضة اليوم', url: tvRequests.fetchAiringTodayTV },
    { title: 'على الهواء الآن', url: tvRequests.fetchOnTheAirTV },
    { title: 'مسلسلات أكشن', url: tvRequests.fetchActionTV },
    { title: 'مسلسلات كوميدية', url: tvRequests.fetchComedyTV },
    { title: 'مسلسلات دراما', url: tvRequests.fetchDramaTV },
    { title: 'خيال علمي وفانتازيا', url: tvRequests.fetchSciFiFantasyTV },
    { title: 'مسلسلات كرتون', url: tvRequests.fetchAnimationTV },
    { title: 'مسلسلات وثائقية', url: tvRequests.fetchDocumentaryTV },
    { title: 'مسلسلات عربية', url: tvRequests.fetchArabicTV },
  ], []);

  if (error) {
    return (
      <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center gap-5 text-center px-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-[#e50914]/10 flex items-center justify-center animate-bounce">
            <span className="text-6xl">⚠️</span>
          </div>
        </div>
        <p className="text-[#e50914] text-xl md:text-2xl font-bold">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-2.5 rounded-md transition-all transform hover:scale-105"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
        {heroShow && (
          <>
            {/* صورة الخلفية */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[20000ms]"
              style={{ 
                backgroundImage: heroShow.backdrop_path 
                  ? `url(https://image.tmdb.org/t/p/original${heroShow.backdrop_path})`
                  : 'none',
                backgroundColor: !heroShow.backdrop_path ? '#1a1a1a' : 'transparent'
              }}
            />
            
            {/* تدرج للخلفية */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent" />
            
            {/* المحتوى */}
            <div className="relative h-full flex items-center px-4 sm:px-8 md:px-12 lg:px-16">
              <div className="max-w-lg md:max-w-xl lg:max-w-2xl animate-fadeInUp">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4">
                  {heroShow.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-4">
                  <span className="text-[#46d369] font-semibold flex items-center gap-1">
                    ⭐ {heroShow.vote_average?.toFixed(1) || '?'} / 10
                  </span>
                  <span>•</span>
                  <span>{heroShow.first_air_date?.split('-')[0] || '?'}</span>
                  {heroShow.number_of_seasons && (
                    <>
                      <span>•</span>
                      <span>{heroShow.number_of_seasons} موسم</span>
                    </>
                  )}
                </div>
                
                <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6">
                  {heroShow.overview || 'لا يوجد وصف متاح لهذا المسلسل'}
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => handleTvClick(heroShow.id)}
                    className="bg-white hover:bg-gray-200 text-black px-6 md:px-8 py-2 md:py-3 rounded-md font-semibold flex items-center gap-2 transition-all transform hover:scale-105"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    تشغيل
                  </button>
                  
                  <button
                    onClick={() => handleTvClick(heroShow.id)}
                    className="bg-gray-600/70 hover:bg-gray-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-md font-semibold flex items-center gap-2 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    معلومات
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
        
        {heroLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#141414]">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-gray-700 border-t-[#e50914] rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">جاري تحميل المسلسلات...</p>
            </div>
          </div>
        )}
      </div>

      {/* صفوف المسلسلات مع Swiper */}
      <div className="pb-8 md:pb-12 -mt-10 md:-mt-16 relative z-10">
        {sections.map((section, index) => (
          <TvRow
            key={index}
            title={section.title}
            fetchUrl={section.url}
            onTvClick={handleTvClick}
            onViewAll={() => handleViewAll(section.title, section.url)}
          />
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease forwards;
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
        
        /* تخصيص أزرار التنقل في Swiper للمسلسلات */
        .tv-swiper .swiper-button-next,
        .tv-swiper .swiper-button-prev {
          color: white;
          background: rgba(0, 0, 0, 0.6);
          width: 40px;
          height: 80px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .tv-swiper .swiper-button-next:hover,
        .tv-swiper .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.05);
        }
        
        .tv-swiper .swiper-button-next:after,
        .tv-swiper .swiper-button-prev:after {
          font-size: 20px;
          font-weight: bold;
        }
        
        .tv-swiper .swiper-button-disabled {
          opacity: 0;
          cursor: default;
        }
        
        /* إخفاء الأزرار بشكل افتراضي وإظهارها عند hover */
        .group/movie-row .tv-swiper .swiper-button-next,
        .group/movie-row .tv-swiper .swiper-button-prev {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .group/movie-row:hover .tv-swiper .swiper-button-next,
        .group/movie-row:hover .tv-swiper .swiper-button-prev {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default TvShowsPage;