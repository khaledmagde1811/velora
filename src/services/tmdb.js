// services/tmdb.js

import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.REACT_APP_TMDB_API_KEY;

if (!API_KEY) {
  console.error('❌ NEXT_PUBLIC_TMDB_API_KEY is not defined in .env (or REACT_APP_TMDB_API_KEY legacy env)');
}

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

tmdbApi.interceptors.request.use(
  (config) => {
    if (!config.params) config.params = {};
    config.params.api_key = API_KEY;
    if (!config.url.includes('/search/')) {
      config.params.language = 'ar-SA';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// ========== TV REQUESTS ==========
export const tvRequests = {
  fetchTrendingTV: `/trending/tv/week`,
  fetchPopularTV: `/tv/popular`,
  fetchTopRatedTV: `/tv/top_rated`,
  fetchAiringTodayTV: `/tv/airing_today`,
  fetchOnTheAirTV: `/tv/on_the_air`,
  fetchNetflixTVShows: `/discover/tv?with_networks=213`,
  fetchActionTV: `/discover/tv?with_genres=10759`,
  fetchComedyTV: `/discover/tv?with_genres=35`,
  fetchDramaTV: `/discover/tv?with_genres=18`,
  fetchSciFiFantasyTV: `/discover/tv?with_genres=10765`,
  fetchAnimationTV: `/discover/tv?with_genres=16`,
  fetchDocumentaryTV: `/discover/tv?with_genres=99`,
  fetchArabicTV: `/discover/tv?with_original_language=ar`,
};

// ========== TV EMBED URLS ==========
export const getTvEmbedUrl = (tmdbId) => {
  if (!tmdbId) return null;
  return `https://vidsrc.me/embed/tv?tmdb=${tmdbId}`;
};

export const getEpisodeEmbedUrl = (tmdbId, season, episode) => {
  if (!tmdbId || !season || !episode) return null;
  return `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`;
};

export const getEpisodeEmbedUrls = (tmdbId, season, episode) => {
  return [
    `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`, // ← الافتراضي
    `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`,
    `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`,
    `https://2embed.cc/embed/tv/${tmdbId}/${season}/${episode}`,
    `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`,
    `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`,
  ];
};

// ========== MOVIE EMBED URLS ==========
export const getMovieEmbedUrl = (tmdbId) => {
  if (!tmdbId) return null;
  return `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`;
};

export const getMovieEmbedUrls = (tmdbId) => {
  return [
    `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`, // ← الافتراضي
    `https://vidsrc.to/embed/movie/${tmdbId}`,
    `https://vidlink.pro/movie/${tmdbId}`,
    `https://2embed.cc/embed/${tmdbId}`,
    `https://embed.su/embed/movie/${tmdbId}`,
    `https://autoembed.co/movie/tmdb/${tmdbId}`,
  ];
};

// ========== TV FUNCTIONS ==========
export const fetchLatestTvShows = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/on_the_air', { params: { page } });
    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching latest TV shows:', error);
    return [];
  }
};

export const fetchLatestEpisodes = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/airing_today', { params: { page } });
    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching latest episodes:', error);
    return [];
  }
};

export const fetchTvDetails = async (tvId) => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching TV details for ${tvId}:`, error);
    return null;
  }
};

export const fetchAllTvSections = async () => {
  const sections = [
    { title: 'أشهر المسلسلات', url: tvRequests.fetchTrendingTV },
    { title: 'مسلسلات Netflix الأصلية', url: tvRequests.fetchNetflixTVShows },
    { title: 'الأكثر شعبية', url: tvRequests.fetchPopularTV },
    { title: 'أعلى المسلسلات تقييماً', url: tvRequests.fetchTopRatedTV },
    { title: 'معروضة اليوم', url: tvRequests.fetchAiringTodayTV },
    { title: 'على الهواء الآن', url: tvRequests.fetchOnTheAirTV },
    { title: 'مسلسلات أكشن', url: tvRequests.fetchActionTV },
    { title: 'مسلسلات كوميدية', url: tvRequests.fetchComedyTV },
    { title: 'مسلسلات دراما', url: tvRequests.fetchDramaTV },
    { title: 'خيال علمي وفانتازيا', url: tvRequests.fetchSciFiFantasyTV },
    { title: 'مسلسلات كرتون', url: tvRequests.fetchAnimationTV },
    { title: 'مسلسلات وثائقية', url: tvRequests.fetchDocumentaryTV },
    { title: 'مسلسلات عربية', url: tvRequests.fetchArabicTV },
  ];

  const results = {};
  for (const section of sections) {
    try {
      const response = await tmdbApi.get(section.url);
      results[section.title] = response.data.results || [];
    } catch (sectionError) {
      console.error(`Error fetching section "${section.title}":`, sectionError.message);
      results[section.title] = [];
    }
  }
  return results;
};

export const fetchRandomTvShow = async () => {
  try {
    const response = await tmdbApi.get('/tv/popular');
    const shows = response.data.results;
    if (shows?.length > 0) {
      return shows[Math.floor(Math.random() * shows.length)];
    }
    return null;
  } catch (error) {
    console.error('Error fetching random TV show:', error);
    return null;
  }
};

export const fetchTvSeasons = async (tvId) => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}`);
    return response.data.seasons?.filter(
      season => season.season_number > 0 && season.episode_count > 0
    ) || [];
  } catch (error) {
    console.error(`Error fetching seasons for TV ${tvId}:`, error);
    return [];
  }
};

export const fetchTvEpisodes = async (tvId, seasonNumber) => {
  if (!tvId || !seasonNumber || seasonNumber <= 0) return [];
  try {
    const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
    return (response.data.episodes || []).map(episode => ({
      id: episode.id,
      name: episode.name || `الحلقة ${episode.episode_number}`,
      episode_number: episode.episode_number,
      season_number: episode.season_number,
      overview: episode.overview || 'لا يوجد وصف لهذه الحلقة',
      still_path: episode.still_path,
      runtime: episode.runtime,
      air_date: episode.air_date,
      vote_average: episode.vote_average,
    }));
  } catch (error) {
    console.error(`Error fetching episodes for TV ${tvId} season ${seasonNumber}:`, error);
    return [];
  }
};

// ========== MOVIE FUNCTIONS ==========
export const fetchLatestMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/now_playing', { params: { page } });
    return response.data.results || [];
  } catch (error) {
    console.error('Error fetching latest movies:', error);
    return [];
  }
};

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ${movieId}:`, error);
    return null;
  }
};

export const fetchRandomMovie = async () => {
  try {
    const response = await tmdbApi.get('/movie/popular');
    const movies = response.data.results;
    if (movies?.length > 0) {
      return movies[Math.floor(Math.random() * movies.length)];
    }
    return null;
  } catch (error) {
    console.error('Error fetching random movie:', error);
    return null;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await tmdbApi.get('/search/movie', { params: { query } });
    return response.data.results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

// ========== REQUESTS OBJECT ==========
export const requests = {
  fetchTrending: `/trending/all/week`,
  fetchNetflixOriginals: `/discover/tv?with_networks=213`,
  fetchTopRated: `/movie/top_rated`,
  fetchActionMovies: `/discover/movie?with_genres=28`,
  fetchComedyMovies: `/discover/movie?with_genres=35`,
  fetchHorrorMovies: `/discover/movie?with_genres=27`,
  fetchRomanceMovies: `/discover/movie?with_genres=10749`,
  fetchDocumentaries: `/discover/movie?with_genres=99`,
  fetchPopular: `/movie/popular`,
  fetchNowPlaying: `/movie/now_playing`,
  fetchUpcoming: `/movie/upcoming`,
  fetchAnimation: `/discover/movie?with_genres=16`,
  fetchArabicMovies: `/discover/movie?with_original_language=ar`,
  fetchLatestArabicMovies: `/discover/movie?with_original_language=ar&sort_by=release_date.desc`,
  fetchTopRatedArabic: `/discover/movie?with_original_language=ar&sort_by=vote_average.desc&vote_count.gte=50`,
  fetchCartoonMovies: `/discover/movie?with_genres=16&sort_by=popularity.desc`,
  fetchFamilyCartoons: `/discover/movie?with_genres=16,10751&sort_by=popularity.desc`,
  fetchDisneyMovies: `/discover/movie?with_companies=2&with_genres=16&sort_by=popularity.desc`,
  fetchDreamworksMovies: `/discover/movie?with_companies=521&with_genres=16&sort_by=popularity.desc`,
  fetchTopRatedCartoons: `/discover/movie?with_genres=16&vote_average.gte=7&sort_by=vote_average.desc`,
  fetchAnimeMovies: `/discover/movie?with_genres=16&with_original_language=ja&sort_by=popularity.desc`,
  fetchAnimeSeries: `/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc`,
  fetchScienceFiction: `/discover/movie?with_genres=878`,
  fetchDrama: `/discover/movie?with_genres=18`,
  ...tvRequests,
};

export default tmdbApi;