import React, { useState } from 'react';
import { useNavigate } from '../next-router-dom';
import { useUserLists } from './UserListsContext';
import { FaPlay, FaTimes, FaClock, FaHeart, FaPlayCircle, FaTrash, FaSearch, FaFilm, FaTv } from 'react-icons/fa';
import { IoMdStar } from 'react-icons/io';

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK   = 'https://via.placeholder.com/200x300?text=No+Image';

const EmptyState = ({ icon, title, subtitle, action }) => (
  <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
    <div className="text-7xl mb-6 opacity-30">{icon}</div>
    <h2 className="text-white text-2xl font-bold mb-2">{title}</h2>
    <p className="text-gray-400 text-base mb-8 max-w-xs">{subtitle}</p>
    {action}
  </div>
);

const MediaCard = ({ item, onPlay, onRemove, showProgress = false }) => {
  const [hovered, setHovered] = useState(false);

  const year = item.release_date
    ? new Date(item.release_date).getFullYear()
    : '';

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Poster */}
      <div className="relative rounded-lg overflow-hidden shadow-lg aspect-[2/3]">
        <img
          src={item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : FALLBACK}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => { e.target.src = FALLBACK; }}
        />

        {/* Overlay */}
        <div className={`absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => onPlay(item)}
            className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center text-xl hover:bg-gray-200 transition"
          >
            <FaPlay />
          </button>
          <button
            onClick={() => onRemove(item)}
            className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition"
          >
            <FaTimes size={12} /> إزالة
          </button>
        </div>

        {/* Badge */}
        <div className="absolute top-2 right-2">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.media_type === 'tv' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
            {item.media_type === 'tv' ? 'مسلسل' : 'فيلم'}
          </span>
        </div>

        {/* Progress bar للمسلسلات */}
        {showProgress && item.progress && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div
              className="h-full bg-red-500"
              style={{ width: `${((item.progress.episode || 1) / 10) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-2 px-1">
        <p className="text-white text-sm font-semibold truncate">{item.title}</p>
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-gray-400 text-xs">{year}</span>
          {item.vote_average > 0 && (
            <span className="text-yellow-400 text-xs flex items-center gap-0.5">
              <IoMdStar size={12} /> {item.vote_average.toFixed(1)}
            </span>
          )}
        </div>
        {showProgress && item.progress && (
          <p className="text-gray-500 text-xs mt-1">
            الموسم {item.progress.season} • الحلقة {item.progress.episode}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Watch Later Page ─────────────────────────────────────────────────────────
export const WatchLaterPage = () => {
  const navigate = useNavigate();
  const { watchLater, toggleWatchLater, clearWatchLater } = useUserLists();
  const [filter, setFilter] = useState('all'); // all | movie | tv
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = watchLater.filter((i) =>
    filter === 'all' ? true : i.media_type === filter
  );

  const handlePlay = (item) => {
    navigate(item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-[#141414] pt-24 pb-16 px-4 md:px-10 lg:px-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-3xl md:text-4xl font-bold flex items-center gap-3">
            <FaClock className="text-2xl" /> مشاهدة لاحقاً
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {watchLater.length} {watchLater.length === 1 ? 'عنصر' : 'عناصر'} في قائمتك
          </p>
        </div>

        {watchLater.length > 0 && (
          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
              {[['all', 'الكل'], ['movie', 'أفلام'], ['tv', 'مسلسلات']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilter(val)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-1 ${
                    filter === val
                      ? 'bg-red-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {val === 'movie' && <FaFilm size={12} />}
                  {val === 'tv' && <FaTv size={12} />}
                  {label}
                </button>
              ))}
            </div>

            {/* Clear */}
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm">هتمسح الكل؟</span>
                <button onClick={() => { clearWatchLater(); setConfirmClear(false); }} className="text-red-500 hover:text-red-400 text-sm font-bold">نعم</button>
                <button onClick={() => setConfirmClear(false)} className="text-gray-400 hover:text-white text-sm">لا</button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-gray-400 hover:text-red-400 text-sm transition flex items-center gap-1"
              >
                <FaTrash size={14} /> مسح الكل
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {watchLater.length === 0 ? (
        <EmptyState
          icon={<FaClock />}
          title="قائمتك فاضية"
          subtitle="أضف أفلام ومسلسلات عشان تتفرج عليها بعدين"
          action={
            <button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition">
              استكشف المحتوى
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<FaSearch />} title="مفيش نتائج" subtitle={`مفيش ${filter === 'movie' ? 'أفلام' : 'مسلسلات'} في قائمتك`} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filtered.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onPlay={handlePlay}
              onRemove={toggleWatchLater}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Favorites Page ───────────────────────────────────────────────────────────
export const FavoritesPage = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, clearFavorites } = useUserLists();
  const [filter, setFilter] = useState('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = favorites.filter((i) =>
    filter === 'all' ? true : i.media_type === filter
  );

  const handlePlay = (item) => {
    navigate(item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-[#141414] pt-24 pb-16 px-4 md:px-10 lg:px-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-3xl md:text-4xl font-bold flex items-center gap-3">
            <FaHeart className="text-2xl text-red-500" /> المفضلة
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {favorites.length} {favorites.length === 1 ? 'عنصر' : 'عناصر'} في مفضلتك
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
              {[['all', 'الكل'], ['movie', 'أفلام'], ['tv', 'مسلسلات']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilter(val)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-1 ${
                    filter === val ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {val === 'movie' && <FaFilm size={12} />}
                  {val === 'tv' && <FaTv size={12} />}
                  {label}
                </button>
              ))}
            </div>
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm">هتمسح الكل؟</span>
                <button onClick={() => { clearFavorites(); setConfirmClear(false); }} className="text-red-500 hover:text-red-400 text-sm font-bold">نعم</button>
                <button onClick={() => setConfirmClear(false)} className="text-gray-400 hover:text-white text-sm">لا</button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)} className="text-gray-400 hover:text-red-400 text-sm transition flex items-center gap-1">
                <FaTrash size={14} /> مسح الكل
              </button>
            )}
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<FaHeart />}
          title="مفضلتك فاضية"
          subtitle="أضف أفلام ومسلسلات اللي بتحبها عشان تلاقيها بسرعة"
          action={
            <button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition">
              استكشف المحتوى
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<FaSearch />} title="مفيش نتائج" subtitle={`مفيش ${filter === 'movie' ? 'أفلام' : 'مسلسلات'} في مفضلتك`} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filtered.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onPlay={handlePlay}
              onRemove={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Currently Watching Page ──────────────────────────────────────────────────
export const CurrentlyWatchingPage = () => {
  const navigate = useNavigate();
  const { currentlyWatching, toggleWatching, clearCurrentlyWatching } = useUserLists();
  const [filter, setFilter] = useState('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = currentlyWatching.filter((i) =>
    filter === 'all' ? true : i.media_type === filter
  );

  const handlePlay = (item) => {
    navigate(item.media_type === 'tv' ? `/tv/${item.id}` : `/movie/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-[#141414] pt-24 pb-16 px-4 md:px-10 lg:px-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-3xl md:text-4xl font-bold flex items-center gap-3">
            <FaPlayCircle className="text-2xl" /> أتابع الآن
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            {currentlyWatching.length} {currentlyWatching.length === 1 ? 'عنصر' : 'عناصر'} تتابعهم حالياً
          </p>
        </div>

        {currentlyWatching.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-800 rounded-lg p-1 gap-1">
              {[['all', 'الكل'], ['movie', 'أفلام'], ['tv', 'مسلسلات']].map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setFilter(val)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-1 ${
                    filter === val ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {val === 'movie' && <FaFilm size={12} />}
                  {val === 'tv' && <FaTv size={12} />}
                  {label}
                </button>
              ))}
            </div>
            {confirmClear ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-300 text-sm">هتمسح الكل؟</span>
                <button onClick={() => { clearCurrentlyWatching(); setConfirmClear(false); }} className="text-red-500 hover:text-red-400 text-sm font-bold">نعم</button>
                <button onClick={() => setConfirmClear(false)} className="text-gray-400 hover:text-white text-sm">لا</button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)} className="text-gray-400 hover:text-red-400 text-sm transition flex items-center gap-1">
                <FaTrash size={14} /> مسح الكل
              </button>
            )}
          </div>
        )}
      </div>

      {currentlyWatching.length === 0 ? (
        <EmptyState
          icon={<FaPlayCircle />}
          title="مش بتتابع حاجة دلوقتي"
          subtitle="أضف المسلسلات والأفلام اللي بتتابعهم عشان ترجعلهم بسرعة"
          action={
            <button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold transition">
              استكشف المحتوى
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState icon={<FaSearch />} title="مفيش نتائج" subtitle={`مفيش ${filter === 'movie' ? 'أفلام' : 'مسلسلات'} في قائمتك`} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filtered.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onPlay={handlePlay}
              onRemove={toggleWatching}
              showProgress
            />
          ))}
        </div>
      )}
    </div>
  );
};