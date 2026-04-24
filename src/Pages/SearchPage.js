import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import tmdbApi from '../services/tmdb';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'movies', 'tv'
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  
  const query = React.useMemo(
    () => new URLSearchParams(location.search).get('q'),
    [location.search]
  );

  useEffect(() => {
    const searchAll = async () => {
      if (!query || query.trim() === '') {
        setMovies([]);
        setTvShows([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // ✅ بحث واحد فقط بالإنجليزية (بدون لغة)
        const [moviesRes, tvRes] = await Promise.all([
          tmdbApi.get('/search/movie', {
            params: { 
              query: query.trim(), 
              page,
              include_adult: false 
            }
          }),
          tmdbApi.get('/search/tv', {
            params: { 
              query: query.trim(), 
              page,
              include_adult: false 
            }
          })
        ]);

        const newMovies = moviesRes.data.results || [];
        const newTvShows = tvRes.data.results || [];

        if (page === 1) {
          setMovies(newMovies);
          setTvShows(newTvShows);
        } else {
          setMovies(prev => [...prev, ...newMovies]);
          setTvShows(prev => [...prev, ...newTvShows]);
        }

        const totalMovies = moviesRes.data.total_results || 0;
        const totalTv = tvRes.data.total_results || 0;
        setTotalResults(totalMovies + totalTv);

        // التحقق من وجود المزيد
        const maxPages = Math.max(
          moviesRes.data.total_pages || 0,
          tvRes.data.total_pages || 0
        );
        setHasMore(page < maxPages);
        
      } catch (error) {
        console.error('Search error:', error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    searchAll();
  }, [query, page]);

  // Reset when query changes
  useEffect(() => {
    setPage(1);
    setMovies([]);
    setTvShows([]);
    setHasMore(true);
    setTotalResults(0);
  }, [query]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const handleItemClick = (id, type) => {
    navigate(`/${type === 'movie' ? 'movie' : 'tv'}/${id}`);
  };

  // دمج النتائج للعرض حسب التبويب
  const getDisplayedResults = () => {
    if (activeTab === 'movies') return movies;
    if (activeTab === 'tv') return tvShows;
    // تبويب 'all' - دمج وترتيب حسب الشعبية
    const all = [
      ...movies.map(m => ({ ...m, media_type: 'movie' })),
      ...tvShows.map(t => ({ ...t, media_type: 'tv', title: t.name }))
    ];
    return all.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  };

  const displayedResults = getDisplayedResults();

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-[#141414] pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <button 
            className="text-white mb-4 flex items-center gap-2 hover:text-red-500 transition"
            onClick={() => navigate(-1)}
          >
            ← رجوع
          </button>
          <h1 className="text-white text-2xl font-bold mb-8">
            جاري البحث عن: "{query}"
          </h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* رأس الصفحة */}
        <button 
          className="text-white mb-4 flex items-center gap-2 hover:text-red-500 transition"
          onClick={() => navigate(-1)}
        >
          ← رجوع
        </button>
        
        <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">
          نتائج البحث عن: "{query}"
        </h1>
        <p className="text-gray-400 mb-6">
          {totalResults} نتيجة تم العثور عليها
        </p>

        {/* تبويبات التنقل */}
        <div className="flex gap-4 border-b border-gray-800 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-3 px-2 transition ${
              activeTab === 'all' 
                ? 'text-red-600 border-b-2 border-red-600' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            الكل ({movies.length + tvShows.length})
          </button>
          <button
            onClick={() => setActiveTab('movies')}
            className={`pb-3 px-2 transition ${
              activeTab === 'movies' 
                ? 'text-red-600 border-b-2 border-red-600' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            أفلام ({movies.length})
          </button>
          <button
            onClick={() => setActiveTab('tv')}
            className={`pb-3 px-2 transition ${
              activeTab === 'tv' 
                ? 'text-red-600 border-b-2 border-red-600' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            مسلسلات ({tvShows.length})
          </button>
        </div>

        {/* عرض النتائج */}
        {displayedResults.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">لا توجد نتائج مطابقة لبحثك</p>
            <p className="text-gray-500 mt-2">حاول البحث بكلمة مختلفة</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {displayedResults.map((item) => (
                <div
                  key={`${item.media_type || (item.title ? 'movie' : 'tv')}-${item.id}`}
                  className="group cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => handleItemClick(item.id, item.media_type || (item.title ? 'movie' : 'tv'))}
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={item.poster_path
                        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                        : 'https://via.placeholder.com/300x450?text=No+Poster'
                      }
                      alt={item.title || item.name}
                      className="w-full rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                      }}
                    />
                    {/* نوع المحتوى (فيلم/مسلسل) */}
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur rounded-md px-2 py-1">
                      <span className="text-xs text-white">
                        {item.media_type === 'movie' || item.title ? '🎬 فيلم' : '📺 مسلسل'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h3 className="text-white text-sm font-semibold truncate">
                      {item.title || item.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-yellow-400 text-xs">
                        ⭐ {item.vote_average?.toFixed(1) || 'N/A'}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button 
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition disabled:opacity-50"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? 'جاري التحميل...' : 'تحميل المزيد'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;