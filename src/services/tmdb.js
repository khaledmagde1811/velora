// services/tmdb.js
import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const ACCESS_TOKEN = process.env.REACT_APP_TMDB_READ_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ REACT_APP_TMDB_READ_ACCESS_TOKEN is not defined in .env');
}

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Fixed Interceptor: Properly handle params without encoding Arabic in headers
tmdbApi.interceptors.request.use((config) => {
  // Initialize params if not present
  if (!config.params) {
    config.params = {};
  }
  
  // Add language parameter - use simple ASCII string
  config.params.language = 'ar-SA';
  
  // Custom params serializer to properly handle URL encoding
  // This ensures all params are properly URL-encoded
  config.paramsSerializer = (params) => {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        searchParams.append(key, String(params[key]));
      }
    });
    return searchParams.toString();
  };
  
  console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only log the status and URL, not the full error object
    const status = error.response?.status || 'unknown';
    const url = error.response?.config?.url || 'unknown';
    console.error(`❌ API Error: ${status} - ${url}`);
    return Promise.reject(error);
  }
);

// ========== روابط المسلسلات (TV Shows) ==========
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

// باقي الكود كما هو بدون تغيير...
export const getTvEmbedUrl = (tmdbId, ds_lang = 'ar') => {
  if (!tmdbId) return null;
  return `https://vidsrc-embed.ru/embed/tv?tmdb=${tmdbId}&ds_lang=${ds_lang}&autoplay=1`;
};

export const getEpisodeEmbedUrl = (tmdbId, season, episode, ds_lang = 'ar') => {
  if (!tmdbId || !season || !episode) return null;
  return `https://vidsrc-embed.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}&ds_lang=${ds_lang}&autoplay=1`;
};

export const getEpisodeEmbedUrls = (tmdbId, season, episode) => {
  const sources = [
    `https://vidsrc-embed.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}&ds_lang=ar&autoplay=1`,
    `https://vidsrc-embed.ru/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}&ds_lang=en&autoplay=1`,
    `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`,
    `https://vidsrc.to/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`,
    `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`,
  ];
  return sources;
};

export const fetchLatestTvShows = async (page = 1) => {
  try {
    const response = await fetch(`https://vidsrc-embed.ru/tvshows/latest/page-${page}.json`);
    const data = await response.json();
    return data.result || [];
  } catch (error) {
    console.error('Error fetching latest TV shows:', error);
    return [];
  }
};

export const fetchLatestEpisodes = async (page = 1) => {
  try {
    const response = await fetch(`https://vidsrc-embed.ru/episodes/latest/page-${page}.json`);
    const data = await response.json();
    return data.result || [];
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
    { title: 'مسلسلات عربية', url: tvRequests.fetchArabicTV },
  ];

  try {
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
  } catch (error) {
    console.error('Error fetching TV sections:', error);
    return {};
  }
};

export const fetchRandomTvShow = async () => {
  try {
    const response = await tmdbApi.get('/tv/popular');
    const shows = response.data.results;
    if (shows && shows.length > 0) {
      const randomIndex = Math.floor(Math.random() * shows.length);
      return shows[randomIndex];
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
    const validSeasons = response.data.seasons?.filter(
      season => season.season_number > 0 && season.episode_count > 0
    ) || [];
    return validSeasons;
  } catch (error) {
    console.error(`Error fetching seasons for TV ${tvId}:`, error);
    return [];
  }
};

export const fetchTvEpisodes = async (tvId, seasonNumber) => {
  if (!tvId || !seasonNumber || seasonNumber <= 0) {
    return [];
  }
  
  try {
    const response = await tmdbApi.get(`/tv/${tvId}/season/${seasonNumber}`);
    const episodes = response.data.episodes || [];
    
    return episodes.map(episode => ({
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

export const getMovieEmbedUrl = (tmdbId, ds_lang = 'ar') => {
  if (!tmdbId) return null;
  return `https://vidsrc-embed.ru/embed/movie?tmdb=${tmdbId}&ds_lang=${ds_lang}&autoplay=1`;
};

export const getMovieEmbedUrls = (tmdbId) => {
  const sources = [
    `https://vidsrc-embed.ru/embed/movie?tmdb=${tmdbId}&ds_lang=ar&autoplay=1`,
    `https://vidsrc-embed.ru/embed/movie?tmdb=${tmdbId}&ds_lang=en&autoplay=1`,
    `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`,
    `https://vidsrc.to/embed/movie?tmdb=${tmdbId}`,
    `https://embed.su/embed/movie/${tmdbId}`,
  ];
  return sources;
};

export const fetchLatestMovies = async (page = 1) => {
  try {
    const response = await fetch(`https://vidsrc-embed.ru/movies/latest/page-${page}.json`);
    const data = await response.json();
    return data.result || [];
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
    if (movies && movies.length > 0) {
      const randomIndex = Math.floor(Math.random() * movies.length);
      return movies[randomIndex];
    }
    return null;
  } catch (error) {
    console.error('Error fetching random movie:', error);
    return null;
  }
};

export const searchMovies = async (query) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: { query }
    });
    return response.data.results;
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

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
  ...tvRequests,
};

export default tmdbApi;