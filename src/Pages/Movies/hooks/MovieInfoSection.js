// src/Pages/Movie/components/MovieInfoSection.jsx
import React, { useState } from 'react';

export const MovieInfoSection = ({ movie }) => {
  const [showFullInfo, setShowFullInfo] = useState(false);

  if (!movie) return null;

  const year = movie.release_date?.split('-')[0] || 'قريباً';
  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const mins = movie.runtime ? movie.runtime % 60 : 0;
  const runtimeText = movie.runtime
    ? `${hours > 0 ? `${hours} ساعة ` : ''}${mins > 0 ? `${mins} دقيقة` : ''}`
    : null;
  const matchScore = movie.vote_average
    ? Math.round((movie.vote_average / 10) * 100)
    : null;

  return (
    <div className="px-4 md:px-8 lg:px-12 py-6">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
            {matchScore && (
              <span className="text-[#46d369] font-bold text-sm">
                {matchScore}% تطابق
              </span>
            )}
            <span>•</span>
            <span>{year}</span>
            {runtimeText && (
              <>
                <span>•</span>
                <span>{runtimeText}</span>
              </>
            )}
            <span>•</span>
            <span className="border border-gray-500 text-gray-400 text-[10px] font-bold px-1.5 py-0.5 rounded">HD</span>
            {movie.vote_average > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-yellow-500">
                  ⭐ {movie.vote_average.toFixed(1)} / 10
                </span>
              </>
            )}
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="bg-white/10 px-3 py-1 rounded-full text-xs">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <p className={`text-gray-300 text-sm md:text-base leading-relaxed mb-4 max-w-2xl transition-all duration-300 ${
            !showFullInfo && 'line-clamp-3'
          }`}>
            {movie.overview || 'لا يوجد وصف متاح لهذا الفيلم'}
          </p>

          {movie.overview && movie.overview.length > 200 && (
            <button
              onClick={() => setShowFullInfo(!showFullInfo)}
              className="text-[#e50914] text-sm hover:underline mb-4"
            >
              {showFullInfo ? 'إظهار أقل' : 'عرض المزيد'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};