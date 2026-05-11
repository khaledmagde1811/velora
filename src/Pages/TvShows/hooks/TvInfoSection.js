// components/TvInfoSection.jsx
import React from 'react';

export const TvInfoSection = ({ tvShow }) => (
  <div className="px-4 md:px-8 lg:px-12 py-8 md:py-10">
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
      {tvShow.poster_path && (
        <div className="hidden lg:block w-56 xl:w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
          <img 
            src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
            alt={`بوستر مسلسل ${tvShow.name}`}
            className="w-full h-auto"
          />
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              {tvShow.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-5">
              <span className="flex items-center gap-1.5 bg-yellow-500/15 px-3 py-1.5 rounded-full">
                <span className="text-yellow-500 text-lg">⭐</span>
                <span className="text-white font-semibold">{tvShow.vote_average?.toFixed(1)}</span>
                <span className="text-gray-500 text-xs">/10</span>
              </span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span className="px-2 py-1 bg-gray-800 rounded-md">{tvShow.first_air_date?.split('-')[0] || '?'}</span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span className="bg-[#e50914]/20 px-3 py-1.5 rounded-full text-xs font-semibold">
                {tvShow.number_of_seasons} مواسم
              </span>
              <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
              <span className="bg-blue-500/20 px-3 py-1.5 rounded-full text-xs font-semibold">
                {tvShow.number_of_episodes} حلقة
              </span>
            </div>
          </div>
        </div>
        
        {tvShow.overview && (
          <div className="mb-6">
            <h3 className="text-[#e50914] text-base font-semibold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              القصة
            </h3>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-4xl">
              {tvShow.overview}
            </p>
          </div>
        )}
        
        {tvShow.genres && tvShow.genres.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tvShow.genres.map((genre) => (
              <span key={genre.id} className="bg-white/5 hover:bg-white/10 px-4 py-1.5 rounded-full text-sm transition-all duration-300 cursor-pointer hover:scale-105">
                {genre.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);