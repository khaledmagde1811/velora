import React, { useState } from 'react';

export const EpisodeSidebar = ({
  showSidebar,
  setShowSidebar,
  seasons,
  selectedSeason,
  episodes,
  selectedEpisode,
  tvShow,
  onSeasonChange,
  onEpisodeChange,
}) => {
  const [activeTab, setActiveTab] = useState('episodes');

  return (
    <div className={`border-t border-gray-800 transition-all duration-500 ${
      showSidebar ? 'block' : 'hidden lg:block'
    }`}>
      <div className="px-4 md:px-8 lg:px-12 py-8">
        <div className="lg:hidden flex gap-3 mb-8">
          {[
            { id: 'episodes', label: 'الحلقات' },
            { id: 'details', label: 'التفاصيل' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3.5 text-center font-medium rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-lg transform scale-105'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Seasons */}
        <div className="mb-8">
          <h3 className="text-[#e50914] font-semibold mb-4 flex items-center gap-2 text-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            المواسم
          </h3>
          <div className="flex flex-wrap gap-3">
            {seasons.map((season) => (
              <button
                key={season.season_number}
                onClick={() => onSeasonChange(season)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedSeason?.season_number === season.season_number
                    ? 'bg-gradient-to-r from-[#e50914] to-[#b20710] text-white shadow-lg'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                الموسم {season.season_number}
                <span className="hidden sm:inline ml-2 text-xs opacity-80">
                  ({season.episode_count} حلقة)
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Episodes */}
        <div className={`${activeTab === 'episodes' ? 'block' : 'hidden lg:block'}`}>
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2 text-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            حلقات الموسم {selectedSeason?.season_number}
            <span className="text-sm text-gray-400">({episodes.length} حلقة)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {episodes.map((episode, idx) => (
              <div
                key={episode.id}
                onClick={() => onEpisodeChange(episode)}
                className={`group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 animate-fadeInUp ${
                  selectedEpisode?.id === episode.id
                    ? 'bg-gradient-to-r from-[#e50914]/20 to-transparent border-r-4 border-[#e50914] shadow-lg'
                    : 'hover:bg-gray-800/50 hover:scale-[1.02]'
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0 transition-all duration-300 ${
                  selectedEpisode?.id === episode.id
                    ? 'bg-gradient-to-br from-[#e50914] to-[#b20710] text-white shadow-lg'
                    : 'bg-gray-700 text-gray-300 group-hover:bg-gray-600'
                }`}>
                  {episode.episode_number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm md:text-base truncate group-hover:text-[#e50914] transition-colors">
                      {episode.name}
                    </h4>
                    {episode.runtime && (
                      <span className="text-xs text-gray-400 whitespace-nowrap bg-gray-800/50 px-2 py-1 rounded-md">
                        {episode.runtime} دقيقة
                      </span>
                    )}
                  </div>
                  {episode.overview && (
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {episode.overview}
                    </p>
                  )}
                  {episode.air_date && (
                    <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {episode.air_date}
                    </p>
                  )}
                </div>
                {selectedEpisode?.id === episode.id && (
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-[#e50914] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Details Tab */}
        <div className={`${activeTab === 'details' ? 'block' : 'hidden lg:hidden'}`}>
          <div className="space-y-8">
            {tvShow.poster_path && (
              <div className="lg:hidden w-40 mx-auto rounded-2xl overflow-hidden shadow-2xl">
                <img src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`} alt={tvShow.name} className="w-full h-auto" />
              </div>
            )}
            {tvShow.overview && (
              <div className="bg-gray-800/30 rounded-2xl p-6">
                <h4 className="text-[#e50914] font-semibold mb-3 flex items-center gap-2 text-lg">القصة</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{tvShow.overview}</p>
              </div>
            )}
            {tvShow.genres && tvShow.genres.length > 0 && (
              <div className="bg-gray-800/30 rounded-2xl p-6">
                <h4 className="text-[#e50914] font-semibold mb-3 text-lg">التصنيفات</h4>
                <div className="flex flex-wrap gap-2">
                  {tvShow.genres.map((genre) => (
                    <span key={genre.id} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full text-sm transition-all duration-300">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-gray-800/30 rounded-2xl p-6">
              <h4 className="text-[#e50914] font-semibold mb-4 text-lg">معلومات إضافية</h4>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'تاريخ العرض', value: tvShow.first_air_date || 'غير معروف', icon: '📅' },
                  { label: 'التقييم', value: `⭐ ${tvShow.vote_average?.toFixed(1)}/10`, icon: '🎯' },
                  { label: 'عدد المواسم', value: tvShow.number_of_seasons, icon: '📚' },
                  { label: 'عدد الحلقات', value: tvShow.number_of_episodes, icon: '🎬' },
                  { label: 'الحالة', value: tvShow.status || 'غير معروف', icon: '📺' },
                ].map(info => (
                  <div key={info.label} className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0 px-3 rounded-lg">
                    <span className="text-gray-400">{info.icon} {info.label}</span>
                    <span className="text-white font-medium">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};