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
    if (!tvId) return;

    const loadTvData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. جلب بيانات المسلسل
        const tvData = await fetchTvDetails(tvId);
        console.log('✅ tvData:', tvData); // ← أضفناها للتشخيص

        if (!tvData) {
          setError('المسلسل غير موجود');
          return;
        }

        // ✅ شيلنا شرط first_air_date - كان بيحجب مسلسلات كتير
        setTvShow(tvData);

        // 2. جلب المواسم
        const tvSeasons = await fetchTvSeasons(tvId);
        console.log('✅ tvSeasons:', tvSeasons); // ← للتشخيص
        setSeasons(tvSeasons);

        if (tvSeasons.length > 0) {
          const firstSeason = tvSeasons[0];
          setSelectedSeason(firstSeason);

          // 3. جلب حلقات أول موسم
          const seasonEpisodes = await fetchTvEpisodes(
            tvId,
            firstSeason.season_number
          );
          console.log('✅ seasonEpisodes:', seasonEpisodes); // ← للتشخيص
          setEpisodes(seasonEpisodes);

          if (seasonEpisodes.length > 0) {
            setSelectedEpisode(seasonEpisodes[0]);
          }
        }
      } catch (err) {
        console.error('❌ useTvData Error:', err);
        setError('حدث خطأ في تحميل بيانات المسلسل');
      } finally {
        setLoading(false);
      }
    };

    loadTvData();
  }, [tvId]);

  // باقي الكود زي ما هو...
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