import React, { useState, useEffect } from 'react';
import { useNavigate } from '../../next-router-dom';
import tmdbApi, { requests } from '../../services/tmdb';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Helmet } from 'react-helmet-async';

// استيراد أنماط Swiper
import 'swiper/css';
import 'swiper/css/navigation';

const MovieRow = ({ title, fetchUrl, onMovieClick, onViewAll }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await tmdbApi.get(fetchUrl);
        setMovies(response.data.results.slice(0, 15));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [fetchUrl]);

  if (loading) {
    return (
      <div className="movie-row mb-8">
        <div className="movie-row-header px-4 mb-4">
          <h2 className="text-white text-2xl font-bold">{title}</h2>
        </div>
        <div className="flex gap-4 overflow-hidden px-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="w-[180px] md:w-[200px] flex-shrink-0">
              <div className="h-[270px] md:h-[300px] bg-gray-800 rounded-lg animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies.length) return null;

  return (
    <div className="movie-row mb-8 group">
      <div className="movie-row-header flex justify-between items-center px-4 md:px-8 mb-4">
        <h2 className="text-white text-xl md:text-2xl font-bold hover:text-red-500 transition">
          {title}
        </h2>
        <button 
          className="text-gray-300 hover:text-white text-sm md:text-base transition"
          onClick={onViewAll}
        >
          عرض المزيد ›
        </button>
      </div>
      
      <div className="relative px-4 md:px-8">
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={10}
          slidesPerView="auto"
          navigation={true} // استخدام navigation المدمج في Swiper
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={movies.length > 6}
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
          className="movie-swiper"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} className="!w-auto">
              <div
                className="movie-card relative w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10"
                onClick={() => onMovieClick(movie)}
              >
                <img
                  src={movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : 'https://share.google/WtIWVQuaLAgqUiBRx'
                  }
                  alt={`بوستر فيلم ${movie.title || movie.name}`}
                  className="w-full rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.src = 'https://share.google/WtIWVQuaLAgqUiBRx';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex flex-col justify-end p-3">
                  <span className="text-white text-sm font-semibold truncate">
                    {movie.title || movie.name}
                  </span>
                  <span className="text-yellow-400 text-xs mt-1">
                    ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

const MoviesPagde = () => {
  const navigate = useNavigate();
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide للـ Hero
  useEffect(() => {
    if (!heroMovies.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroMovies]);

  const currentMovie = heroMovies[currentIndex];

  useEffect(() => {
    const loadHeroMovies = async () => {
      try {
        const response = await tmdbApi.get('/movie/popular');
        setHeroMovies(response.data.results.slice(0, 7));
      } catch (err) {
        console.error(err);
      }
    };
    loadHeroMovies();
  }, []);

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleViewAll = (sectionTitle, fetchUrl) => {
    const encodedTitle = encodeURIComponent(sectionTitle);
    const encodedUrl = encodeURIComponent(fetchUrl);
    navigate(`/category/${encodedTitle}?url=${encodedUrl}`);
  };

  const sections = [
    
    { title: 'الأكثر مشاهدة', url: requests.fetchTrending },
    { title: 'معروضة حالياً', url: requests.fetchNowPlaying },
    { title: 'قادمة قريباً', url: requests.fetchUpcoming },
    { title: 'أعلى الأفلام تقييماً', url: requests.fetchTopRated },
    { title: 'أفلام عربية', url: requests.fetchArabicMovies },
    { title: 'أحدث الأفلام العربية', url: requests.fetchLatestArabicMovies },
    { title: 'أفضل الأفلام العربية', url: requests.fetchTopRatedArabic },
    { title: 'أكشن', url: requests.fetchActionMovies },
    { title: 'كوميدي', url: requests.fetchComedyMovies },
    { title: 'رعب', url: requests.fetchHorrorMovies },
    { title: 'كرتون', url: requests.fetchAnimation },
    { title: 'خيال علمي', url: requests.fetchScienceFiction },
    { title: 'رومانسي', url: requests.fetchRomanceMovies },
    { title: 'دراما', url: requests.fetchDrama },
    { title: 'وثائقي', url: requests.fetchDocumentaries },
  ];

  return (
    <div className="min-h-screen bg-[#141414]">
      <Helmet>
        <title>VELORA | أحدث الأفلام أون لاين مجاناً</title>
        <meta
          name="description"
          content="اكتشف أحدث الأفلام العربية والعالمية على VELORA. تصفح أفلام أكشن، كوميديا، رعب، رومانسية، وثائقيات بجودة عالية أون لاين."
        />
        <meta
          name="keywords"
          content="VELORA, أفلام, مشاهدة أون لاين, أفلام عربية, أفلام أجنبية, أفلام 4K, أفلام أكشن, أفلام كوميدي"
        />
        <meta name="author" content="VELORA" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="VELORA | أحدث الأفلام أون لاين مجاناً" />
        <meta
          property="og:description"
          content="استمتع بمكتبة أفلام واسعة على VELORA مع توصيات جديدة يومياً ومشاهدة مباشرة بدون تعقيد."
        />
        <meta property="og:image" content="https://www.veloravelora.online/VELORA-512.png" />
        <meta property="og:url" content="https://www.veloravelora.online/moviespagde" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VELORA" />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VELORA | أحدث الأفلام أون لاين مجاناً" />
        <meta
          name="twitter:description"
          content="استمتع بأحدث الأفلام العربية والعالمية على VELORA. تصفح مكتبة واسعة بجودة عالية."
        />
        <meta name="twitter:image" content="https://www.veloravelora.online/VELORA-512.png" />
        <link rel="canonical" href="https://www.veloravelora.online/moviespagde" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': 'أفلام VELORA',
            'description': 'اكتشف أحدث الأفلام العربية والعالمية على VELORA مع توصيات يومية ومحتوى منظم.',
            'url': 'https://www.veloravelora.online/moviespagde',
            'publisher': {
              '@type': 'Organization',
              'name': 'VELORA',
              'url': 'https://www.veloravelora.online'
            }
          })}
        </script>
      </Helmet>
      {/* Hero Section */}
      <div className="relative h-[70vh] md:h-[85vh] w-full overflow-hidden">
        {currentMovie && (
          <>
            <img
              className="absolute inset-0 w-full h-full object-cover"
              src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
              alt={`خلفية فيلم ${currentMovie.title}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
            
            <div className="relative z-10 h-full flex items-center px-4 md:px-10 lg:px-16">
              <div className="max-w-xl space-y-4">
                <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {currentMovie.title}
                </h1>
                <p className="text-gray-300 text-sm md:text-base line-clamp-3 max-w-lg">
                  {currentMovie.overview}
                </p>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => navigate(`/movie/${currentMovie.id}`)}
                    className="bg-white text-black px-6 py-2 rounded-md font-semibold hover:bg-gray-200 transition"
                  >
                    ▶ تشغيل
                  </button>
                  <button className="bg-gray-600/50 backdrop-blur text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-600/70 transition">
                    ℹ معلومات
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Movies Sections */}
      <div className="relative z-10 -mt-20 md:-mt-32 pb-10">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <MovieRow
              key={index}
              title={section.title}
              fetchUrl={section.url}
              onMovieClick={handleMovieClick}
              onViewAll={() => handleViewAll(section.title, section.url)}
            />
          ))}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        /* تخصيص أزرار التنقل في Swiper */
        :global(.movie-swiper .swiper-button-next),
        :global(.movie-swiper .swiper-button-prev) {
          color: white;
          background: rgba(0, 0, 0, 0.6);
          width: 40px;
          height: 80px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        :global(.movie-swiper .swiper-button-next:hover),
        :global(.movie-swiper .swiper-button-prev:hover) {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.05);
        }
        
        :global(.movie-swiper .swiper-button-next:after),
        :global(.movie-swiper .swiper-button-prev:after) {
          font-size: 20px;
          font-weight: bold;
        }
        
        :global(.movie-swiper .swiper-button-disabled) {
          opacity: 0;
          cursor: default;
        }
        
        /* إخفاء الأزرار بشكل افتراضي وإظهارها عند hover */
        :global(.movie-row .swiper-button-next),
        :global(.movie-row .swiper-button-prev) {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        :global(.movie-row:hover .swiper-button-next),
        :global(.movie-row:hover .swiper-button-prev) {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default MoviesPagde;
