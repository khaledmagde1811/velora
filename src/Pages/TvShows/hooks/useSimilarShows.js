// hooks/useSimilarShows.js
import { useState, useEffect } from 'react';

export const useSimilarShows = (tvId) => {
  const [similarShows, setSimilarShows] = useState([]);
  const [similarShowsLoading, setSimilarShowsLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarShowsData = async () => {
      if (!tvId) return;
      setSimilarShowsLoading(true);
      try {
        const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.REACT_APP_TMDB_API_KEY;
        if (!API_KEY) {
          console.error('❌ NEXT_PUBLIC_TMDB_API_KEY is not defined in .env (or REACT_APP_TMDB_API_KEY legacy env)');
          setSimilarShows([]);
          setSimilarShowsLoading(false);
          return;
        }

        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tvId}/similar?api_key=${API_KEY}&language=ar-SA`
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
  }, [tvId]);

  return { similarShows, similarShowsLoading };
};