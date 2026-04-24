import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Storage Keys ─────────────────────────────────────────────────────────────
const STORAGE_KEYS = {
  watchLater:        'cinematic_watch_later',
  favorites:         'cinematic_favorites',
  currentlyWatching: 'cinematic_currently_watching',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const loadFromStorage = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage error:', e);
  }
};

// ─── Normalize item (نحفظ بس اللي محتاجينه) ──────────────────────────────────
const normalizeItem = (item) => ({
  id:           item.id,
  title:        item.title        || item.name        || '',
  poster_path:  item.poster_path  || item.backdrop_path || null,
  vote_average: item.vote_average || 0,
  release_date: item.release_date || item.first_air_date || '',
  media_type:   item.media_type   || (item.title ? 'movie' : 'tv'),
  overview:     item.overview     || '',
  addedAt:      new Date().toISOString(),
});

// ─── Context ──────────────────────────────────────────────────────────────────
const UserListsContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function UserListsProvider({ children }) {
  const [watchLater, setWatchLater] = useState(() =>
    loadFromStorage(STORAGE_KEYS.watchLater)
  );
  const [favorites, setFavorites] = useState(() =>
    loadFromStorage(STORAGE_KEYS.favorites)
  );
  const [currentlyWatching, setCurrentlyWatching] = useState(() =>
    loadFromStorage(STORAGE_KEYS.currentlyWatching)
  );

  // ─── Sync to localStorage ─────────────────────────────────────────────────
  useEffect(() => saveToStorage(STORAGE_KEYS.watchLater,        watchLater),        [watchLater]);
  useEffect(() => saveToStorage(STORAGE_KEYS.favorites,         favorites),         [favorites]);
  useEffect(() => saveToStorage(STORAGE_KEYS.currentlyWatching, currentlyWatching), [currentlyWatching]);

  // ─── Generic toggle helper ────────────────────────────────────────────────
  const isInList = useCallback(
    (list, item) => list.some((i) => i.id === item.id),
    []
  );

  const toggle = useCallback((setter, list, item) => {
    setter(
      isInList(list, item)
        ? list.filter((i) => i.id !== item.id)   // إزالة
        : [normalizeItem(item), ...list]          // إضافة في الأول
    );
  }, [isInList]);

  // ─── Watch Later (مشاهدة لاحقاً) ─────────────────────────────────────────
  const toggleWatchLater = useCallback(
    (item) => toggle(setWatchLater, watchLater, item),
    [toggle, watchLater]
  );
  const isInWatchLater = useCallback(
    (item) => isInList(watchLater, item),
    [isInList, watchLater]
  );
  const clearWatchLater = useCallback(() => setWatchLater([]), []);

  // ─── Favorites (المفضلة) ──────────────────────────────────────────────────
  const toggleFavorite = useCallback(
    (item) => toggle(setFavorites, favorites, item),
    [toggle, favorites]
  );
  const isInFavorites = useCallback(
    (item) => isInList(favorites, item),
    [isInList, favorites]
  );
  const clearFavorites = useCallback(() => setFavorites([]), []);

  // ─── Currently Watching (أتابع الآن) ─────────────────────────────────────
  const toggleWatching = useCallback(
    (item) => toggle(setCurrentlyWatching, currentlyWatching, item),
    [toggle, currentlyWatching]
  );
  const isWatching = useCallback(
    (item) => isInList(currentlyWatching, item),
    [isInList, currentlyWatching]
  );
  const clearCurrentlyWatching = useCallback(() => setCurrentlyWatching([]), []);

  // ─── Update progress للمسلسلات (season/episode) ───────────────────────────
  // استخدام: updateWatchProgress(tvId, { season: 2, episode: 5 })
  const updateWatchProgress = useCallback((itemId, progress) => {
    setCurrentlyWatching((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              progress:  { ...i.progress, ...progress },
              updatedAt: new Date().toISOString(),
            }
          : i
      )
    );
  }, []);

  // ─── Clear All ────────────────────────────────────────────────────────────
  const clearAll = useCallback(() => {
    setWatchLater([]);
    setFavorites([]);
    setCurrentlyWatching([]);
  }, []);

  // ─── Counts ───────────────────────────────────────────────────────────────
  const counts = {
    watchLater:        watchLater.length,
    favorites:         favorites.length,
    currentlyWatching: currentlyWatching.length,
  };

  // ─── Value ────────────────────────────────────────────────────────────────
  const value = {
    // ── Lists (raw arrays)
    watchLater,
    favorites,
    currentlyWatching,

    // ── Watch Later
    toggleWatchLater,
    isInWatchLater,
    clearWatchLater,

    // ── Favorites
    toggleFavorite,
    isInFavorites,
    clearFavorites,

    // ── Currently Watching
    toggleWatching,
    isWatching,
    updateWatchProgress,
    clearCurrentlyWatching,

    // ── Utilities
    clearAll,
    counts,
  };

  return (
    <UserListsContext.Provider value={value}>
      {children}
    </UserListsContext.Provider>
  );
}

// ─── Custom Hook ──────────────────────────────────────────────────────────────
export function useUserLists() {
  const ctx = useContext(UserListsContext);
  if (!ctx) {
    throw new Error('useUserLists must be used inside <UserListsProvider>');
  }
  return ctx;
}

export default UserListsContext;