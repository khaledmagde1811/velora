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
        const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
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