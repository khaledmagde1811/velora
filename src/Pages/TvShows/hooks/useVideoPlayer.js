// hooks/useVideoPlayer.js
import { useState, useMemo, useCallback, useEffect } from 'react';
import { getEpisodeEmbedUrls } from '../../../services/tmdb';

export const useVideoPlayer = (tvId, selectedSeason, selectedEpisode) => {
  const [videoError, setVideoError] = useState(false);
  const [currentServerIndex, setCurrentServerIndex] = useState(0);
  const [failedServers, setFailedServers] = useState([]);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const availableUrls = useMemo(() => {
    if (!selectedSeason || !selectedEpisode || !tvId) return [];
    return getEpisodeEmbedUrls(tvId, selectedSeason.season_number, selectedEpisode.episode_number);
  }, [tvId, selectedSeason, selectedEpisode]);

  const workingUrls = useMemo(() => {
    return availableUrls.filter((_, index) => !failedServers.includes(index));
  }, [availableUrls, failedServers]);

  const currentVideoUrl = useMemo(() => {
    if (workingUrls.length === 0) return null;
    return workingUrls[currentServerIndex] || workingUrls[0];
  }, [workingUrls, currentServerIndex]);

  const iframeKey = useMemo(() => {
    if (!selectedEpisode) return null;
    return `${selectedEpisode.id}`;
  }, [selectedEpisode]);

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
    setVideoError(false);
    setCurrentServerIndex(0);
    setFailedServers([]);
    setIsVideoLoading(true);
  }, []);

  useEffect(() => {
    setIsVideoLoading(true);
    setVideoError(false);
  }, [selectedEpisode, currentServerIndex]);

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