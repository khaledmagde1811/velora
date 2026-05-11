// components/MovieRow.jsx
import React, { useState, useEffect, useRef } from 'react';
import tmdbApi from '../../services/tmdb';

function MovieRow({ title, fetchUrl, onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const rowRef = useRef(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response = await tmdbApi.get(fetchUrl);
        setMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [fetchUrl]);

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth 
        : scrollLeft + clientWidth;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="movie-row">
        <h2 className="movie-row-title">{title}</h2>
        <div className="loading-skeleton">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!movies.length) return null;

  return (
    <div className="movie-row">
      <h2 className="movie-row-title">{title}</h2>
      <div className="movie-row-container">
        <button className="scroll-btn left" onClick={() => scroll('left')}>‹</button>
        <div className="movie-row-list" ref={rowRef}>
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className="movie-card"
              onClick={() => onMovieClick(movie)}
            >
              <img
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                  : 'https://via.placeholder.com/300x450?text=No+Image'
                }
                alt={`بوستر فيلم ${movie.title || movie.name}`}
                onError={(e) => e.target.src = 'https://via.placeholder.com/300x450?text=No+Image'}
              />
              <div className="movie-card-overlay">
                <span>{movie.title || movie.name}</span>
                <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="scroll-btn right" onClick={() => scroll('right')}>›</button>
      </div>
    </div>
  );
}

export default MovieRow;