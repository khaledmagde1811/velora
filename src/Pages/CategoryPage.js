// Pages/CategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from '../next-router-dom';
import tmdbApi from '../services/tmdb';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mediaType, setMediaType] = useState('movie'); // 'movie' or 'tv'

  // جلب الـ URL و Type من Query Parameter
  const queryParams = new URLSearchParams(location.search);
  const fetchUrl = queryParams.get('url');
  const type = queryParams.get('type'); // 'movie' or 'tv'

  // تحديد نوع الوسائط (فيلم أو مسلسل)
  useEffect(() => {
    if (type === 'tv') {
      setMediaType('tv');
    } else {
      setMediaType('movie');
    }
  }, [type]);

  // جلب العناصر حسب النوع
  useEffect(() => {
    const fetchItems = async () => {
      if (!fetchUrl) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const response = await tmdbApi.get(fetchUrl, {
          params: { page: page }
        });
        
        let results = response.data.results || [];
        
        // إذا كان النوع مسلسلات، فلتر العناصر اللي لها first_air_date
        if (mediaType === 'tv') {
          results = results.filter(item => item.first_air_date);
        }
        
        if (page === 1) {
          setItems(results);
        } else {
          setItems(prev => [...prev, ...results]);
        }
        setTotalPages(response.data.total_pages || 1);
      } catch (error) {
        console.error('Error fetching category items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [fetchUrl, page, mediaType]);

  const loadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handleItemClick = (itemId) => {
    if (mediaType === 'tv') {
      navigate(`/tv/${itemId}`);
    } else {
      navigate(`/movie/${itemId}`);
    }
  };

  const decodedTitle = decodeURIComponent(categoryName || '');

  if (loading && page === 1) {
    return (
      <div className="category-page">
        <div className="category-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← رجوع</button>
          <h1 className="category-title">{decodedTitle}</h1>
        </div>
        <div className="category-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
<div className="min-h-screen bg-[#141414] pt-20 md:pt-24">
  
  {/* Header */}
  <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-4">
    <button 
      onClick={() => navigate(-1)} 
      className="text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-md transition"
    >
      ← رجوع
    </button>

    <h1 className="text-white text-lg md:text-2xl font-bold text-center flex-1">
      {decodedTitle}
      <span className="text-gray-400 text-sm md:text-base mr-2">
        {mediaType === 'tv' ? '(مسلسلات)' : '(أفلام)'}
      </span>
    </h1>

    <div className="w-[80px]" /> {/* spacer */}
  </div>

  {items.length === 0 ? (
    <div className="flex items-center justify-center min-h-[50vh] text-gray-400 text-lg">
      😞 لا توجد {mediaType === 'tv' ? 'مسلسلات' : 'أفلام'} في هذا القسم
    </div>
  ) : (
    <>
      {/* Grid */}
      <div className="px-4 md:px-8 lg:px-12 py-6">
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5 auto-rows-[180px] md:auto-rows-[220px] [&>*]:transition-all">
          
          {items.map((item, index) => {
            const posterUrl = item.poster_path
              ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
              : 'https://share.google/WtIWVQuaLAgqUiBRx';

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
                  alt={item.title || item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  
                  <h3 className="text-white text-sm font-semibold line-clamp-2 mb-1">
                    {item.title || item.name}
                  </h3>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-yellow-400 font-medium">
                      ⭐ {item.vote_average?.toFixed(1) || '?'}
                    </span>

                    <span className="text-gray-300">
                      {mediaType === 'tv'
                        ? item.first_air_date?.split('-')[0]
                        : item.release_date?.split('-')[0]
                      }
                    </span>
                  </div>
                </div>

                {/* Glow */}
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/0 group-hover:ring-white/10 transition-all duration-500" />
              </div>
            );
          })}
        </div>

        {/* Load More */}
        {page < totalPages && (
          <div className="flex justify-center mt-10">
            <button
              onClick={loadMore}
              className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-10 py-3 rounded-lg font-semibold transition-all"
            >
              تحميل المزيد
            </button>
          </div>
        )}
      </div>
    </>
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

export default CategoryPage;