// Pages/TvCategoryPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import tmdbApi from '../../../services/tmdb';

const TvCategoryPage = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [imageErrors, setImageErrors] = useState({});

  // جلب الـ URL من Query Parameter
  const queryParams = new URLSearchParams(location.search);
  const fetchUrl = queryParams.get('url');
  const categoryTitle = queryParams.get('title') || decodeURIComponent(categoryName || '');

  // جلب المسلسلات
  const fetchItems = useCallback(async (pageNum, isLoadMore = false) => {
    if (!fetchUrl) {
      setLoading(false);
      return;
    }
    
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await tmdbApi.get(fetchUrl, {
        params: { page: pageNum, language: 'ar-SA' }
      });
      
      let results = response.data.results || [];
      
      // فلترة المسلسلات الصالحة فقط (لها first_air_date)
      results = results.filter(item => item.first_air_date && item.name);
      
      if (pageNum === 1) {
        setItems(results);
      } else {
        setItems(prev => [...prev, ...results]);
      }
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error('Error fetching TV category:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [fetchUrl]);

  // تحميل البيانات عند تغيير الصفحة
  useEffect(() => {
    setPage(1);
    setItems([]);
    fetchItems(1);
  }, [fetchUrl, fetchItems]);

  // تحميل المزيد
  const loadMore = () => {
    if (page < totalPages && !loadingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchItems(nextPage, true);
    }
  };

  // معالجة أخطاء الصور
  const handleImageError = useCallback((itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  }, []);

  // التوجيه إلى صفحة المسلسل
  const handleItemClick = (itemId) => {
    navigate(`/tv/${itemId}`);
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-[#141414]">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-b from-black/95 to-transparent backdrop-blur-sm">
          <div className="flex items-center gap-4 px-4 md:px-8 lg:px-12 py-4">
            <button 
              onClick={() => navigate(-1)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full w-9 h-9 md:w-10 md:h-10 flex items-center justify-center transition-all hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
              {categoryTitle}
            </h1>
            <span className="text-gray-400 text-sm bg-white/10 px-2 py-1 rounded">
              مسلسلات
            </span>
          </div>
        </div>
        
        {/* Loading Spinner */}
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-[#e50914] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">جاري تحميل المسلسلات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-[#141414] pt-20 md:pt-24">
  {items.length === 0 ? (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-6xl mb-4">📺</div>
      <p className="text-gray-400 text-lg">لا توجد مسلسلات في هذا القسم</p>
      <button 
        onClick={() => navigate(-1)}
        className="mt-6 bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-2 rounded-md transition-all"
      >
        العودة للخلف
      </button>
    </div>
  ) : (
    <div className="px-4 md:px-8 lg:px-12 py-8">
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 auto-rows-[180px] md:auto-rows-[220px] [&>*]:transition-all">
        
        {items.map((item, index) => {
          const posterUrl = imageErrors[item.id]
            ? 'https://via.placeholder.com/300x450?text=No+Image'
            : item.poster_path
              ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
              : 'https://via.placeholder.com/300x450?text=No+Image';

          return (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`
                group relative rounded-xl overflow-hidden cursor-pointer bg-gray-900 
                transition-all duration-500 ease-out hover:-translate-y-2 hover:z-20
                
                ${index === 0 ? "col-span-2 row-span-2" : ""}
                ${index === 1 ? "col-span-2 row-span-1" : ""}
              `}
            >
              {/* Image */}
              <img
                src={posterUrl}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={() => handleImageError(item.id)}
              />

              {/* Glass Overlay */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                
                <h3 className="text-white text-sm font-semibold line-clamp-2 mb-1">
                  {item.name}
                </h3>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-yellow-400 font-medium">
                    ⭐ {item.vote_average?.toFixed(1) || '?'}
                  </span>
                  <span className="text-gray-300">
                    {item.first_air_date?.split('-')[0] || '?'}
                  </span>
                </div>

                {item.number_of_seasons && (
                  <div className="mt-1 text-gray-300 text-[10px]">
                    🎬 {item.number_of_seasons} موسم
                  </div>
                )}
              </div>

              {/* Glow */}
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/0 group-hover:ring-white/10 transition-all duration-500" />

              {/* New Badge */}
              {item.last_episode_to_air?.air_date && (
                <div className="absolute top-2 right-2 bg-[#e50914] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">
                  جديد
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Load More */}
      {page < totalPages && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-10 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loadingMore ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري التحميل...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                تحميل المزيد
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )}

  <style>{`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `}</style>
</div>
  );
};

export default TvCategoryPage;