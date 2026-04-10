import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import tmdbApi from '../services/tmdb';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  
  const query = React.useMemo(
    () => new URLSearchParams(location.search).get('q'),
    [location.search]
  );

  useEffect(() => {
    const searchMovies = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const response = await tmdbApi.get('/search/movie', {
          params: { 
            query: query, 
            language: 'ar-SA',
            page: page 
          }
        });
        
        if (page === 1) {
          setMovies(response.data.results);
        } else {
          setMovies(prev => [...prev, ...response.data.results]);
        }
        
        const hasMorePages = page < response.data.total_pages;
        setHasMore(hasMorePages);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Search error:', error);
        setHasMore(false);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    searchMovies();
  }, [query, page]);

  // Reset pagination when query changes
  useEffect(() => {
    setPage(1);
    setMovies([]);
    setHasMore(true);
    setTotalPages(0);
  }, [query]);

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading && page === 1) {
    return (
      <div className="search-page">
        <div className="search-header">
          <button className="back-btn" onClick={() => navigate(-1)}>← رجوع</button>
          <h1 className="search-title">جاري البحث عن: "{query}"</h1>
        </div>
        <div className="search-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-page">
      <div className="search-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← رجوع</button>
        <h1 className="search-title">
          نتائج البحث عن: "{query}"
          <span className="search-count"> ({movies.length} فيلماً من {totalPages} صفحة)</span>
        </h1>
      </div>

      {movies.length === 0 ? (
        <div className="no-results">
          <p> لا توجد نتائج مطابقة لبحثك</p>
          <p>حاول البحث بكلمة مختلفة</p>
        </div>
      ) : (
        <>
          <div className="search-results-grid">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="search-movie-card"
                onClick={() => handleMovieClick(movie.id)}
              >
                <img
                  src={movie.poster_path
                    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                    : 'https://share.google/WtIWVQuaLAgqUiBRx'
                  }
                  alt={movie.title}
                  className="search-movie-poster"
                />
                <div className="search-movie-info">
                  <h3>{movie.title}</h3>
                  <div className="search-movie-year">
                    {movie.release_date?.split('-')[0]}
                  </div>
                  <div className="search-movie-rating">
                    ⭐ {movie.vote_average?.toFixed(1)} / 10
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="load-more-container">
              <button 
                className="load-more-btn" 
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? 'جاري التحميل...' : 'تحميل المزيد'}
              </button>
            </div>
          )}
          
          {!hasMore && movies.length > 0 && (
            <div className="load-more-container">
              <p className="text-gray-500 text-sm">تم عرض جميع النتائج</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;