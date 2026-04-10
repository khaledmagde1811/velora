// hooks/useTvData.js
import { useState, useEffect, useCallback } from 'react';
import { fetchTvDetails, fetchTvSeasons, fetchTvEpisodes } from '../../../services/tmdb';

export const useTvData = (tvId) => {
  const [tvShow, setTvShow] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTvData = async () => {
      if (!tvId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const tvData = await fetchTvDetails(tvId);
        
        if (!tvData || !tvData.first_air_date) {
          setError('المسلسل غير موجود');
          return;
        }
        
        setTvShow(tvData);
        
        const tvSeasons = await fetchTvSeasons(tvId);
        setSeasons(tvSeasons);
        
        if (tvSeasons.length > 0) {
          const firstSeason = tvSeasons[0];
          setSelectedSeason(firstSeason);
          
          const seasonEpisodes = await fetchTvEpisodes(tvId, firstSeason.season_number);
          setEpisodes(seasonEpisodes);
          
          if (seasonEpisodes.length > 0) {
            setSelectedEpisode(seasonEpisodes[0]);
          }
        }
      } catch (err) {
        console.error('❌ Error:', err);
        setError('حدث خطأ في تحميل بيانات المسلسل');
      } finally {
        setLoading(false);
      }
    };
    
    loadTvData();
  }, [tvId]);

  const handleSeasonChange = useCallback(async (season) => {
    if (!tvId) return;
    
    setSelectedSeason(season);
    setLoading(true);
    setError(null);
    
    try {
      const seasonEpisodes = await fetchTvEpisodes(tvId, season.season_number);
      setEpisodes(seasonEpisodes);
      if (seasonEpisodes.length > 0) {
        setSelectedEpisode(seasonEpisodes[0]);
      }
    } catch (err) {
      console.error('Error loading episodes:', err);
      setError('حدث خطأ في تحميل الحلقات');
    } finally {
      setLoading(false);
    }
  }, [tvId]);

  const handleEpisodeChange = useCallback((episode) => {
    setSelectedEpisode(episode);
  }, []);

  return {
    tvShow,
    seasons,
    episodes,
    selectedSeason,
    selectedEpisode,
    loading,
    error,
    handleSeasonChange,
    handleEpisodeChange,
  };
};