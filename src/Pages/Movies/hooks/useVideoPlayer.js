// src/Pages/Movie/hooks/useVideoPlayer.js
import { useState, useCallback, useMemo, useEffect } from 'react';

export const useVideoPlayer = (movieId) => {
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [failedServers, setFailedServers] = useState([]);
  const [iframeKey, setIframeKey] = useState(0);

  const videoSources = useMemo(() => [
    
    { label: 'VidSrc Me',  url: `https://vidsrc.me/embed/movie?tmdb=${movieId}`,     priority: 1 },
    { label: 'VidLink',    url: `https://vidlink.pro/movie/${movieId}`,               priority: 2 },
    { label: '2Embed',     url: `https://2embed.cc/embed/${movieId}`,                 priority: 3 },
    { label: 'Embed.su',   url: `https://embed.su/embed/movie/${movieId}`,            priority: 4 },
    { label: 'VidSrc Net', url: `https://vidsrc.net/embed/movie/${movieId}`,          priority: 5 },
    { label: 'AutoEmbed',  url: `https://autoembed.co/movie/tmdb/${movieId}`,         priority: 6 },
  ], [movieId]);

  // Filter working servers
  const workingUrls = useMemo(() => {
    return videoSources.filter((_, index) => !failedServers.includes(index));
  }, [videoSources, failedServers]);

  // Current source
  const currentVideoUrl = useMemo(() => {
    if (workingUrls.length === 0) return null;
    return workingUrls[currentServerIndex] || workingUrls[0];
  }, [workingUrls, currentServerIndex]);

  const handleIframeLoad = useCallback(() => {
    setIsVideoLoading(false);
    setVideoError(false);
  }, []);

  const handleIframeError = useCallback(() => {
    const currentIndex = currentServerIndex;

    setFailedServers(prev => [...prev, currentIndex]);

    if (currentServerIndex + 1 < workingUrls.length) {
      setCurrentServerIndex(prev => prev + 1);
      setIsVideoLoading(true);
    } else {
      setVideoError(true);
      setIsVideoLoading(false);
    }
  }, [currentServerIndex, workingUrls.length]);

  const switchServer = useCallback(() => {
    if (currentServerIndex + 1 < workingUrls.length) {
      setCurrentServerIndex(prev => prev + 1);
      setIsVideoLoading(true);
      setVideoError(false);
    } else if (workingUrls.length > 0) {
      setCurrentServerIndex(0);
      setIsVideoLoading(true);
      setVideoError(false);
    }
  }, [currentServerIndex, workingUrls.length]);

  const resetPlayer = useCallback(() => {
    setIsVideoLoading(true);
    setVideoError(false);
    setCurrentServerIndex(0);
    setFailedServers([]);
    setIframeKey(prev => prev + 1);
  }, []);

  // Reset when movie changes
  useEffect(() => {
    resetPlayer();
  }, [movieId, resetPlayer]);

  return {
    videoError,
    isVideoLoading,
    currentVideoUrl,
    iframeKey,
    workingUrls,
    currentServerIndex,
    handleIframeLoad,
    handleIframeError,
    switchServer,
    resetPlayer,
  };
};