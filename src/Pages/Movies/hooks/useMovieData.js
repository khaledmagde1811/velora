// src/Pages/Movie/hooks/useMovieData.js
import { useState, useEffect } from 'react';
import tmdbApi from '../../../services/tmdb';

export const useMovieData = (id) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
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

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  return { movie, loading, error, suggested };
};