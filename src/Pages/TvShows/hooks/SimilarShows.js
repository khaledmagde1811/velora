// components/SimilarShows.jsx
import React from 'react';

export const SimilarShows = ({ similarShows, similarShowsLoading, onShowClick }) => {
  if (similarShowsLoading) {
    return (
      <div className="flex justify-center py-12 md:py-16">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 md:w-16 md:h-16 border-4 border-gray-700 border-t-[#e50914] rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-transparent border-b-[#e50914] rounded-full animate-spin-slow"></div>
            </div>
          </div>
          <p className="text-gray-400 text-xs md:text-sm mt-4">جاري البحث عن اقتراحات...</p>
        </div>
      </div>
    );
  }

  if (similarShows.length === 0) {
    return (
      <div className="text-center py-12 md:py-16 bg-gray-800/30 rounded-xl md:rounded-2xl">
        <span className="text-4xl md:text-6xl mb-3 md:mb-4 block animate-bounce">🎬</span>
        <p className="text-gray-400 text-sm md:text-base">لا توجد مسلسلات مشابهة حالياً</p>
        <p className="text-gray-500 text-xs md:text-sm mt-1 md:mt-2">سوف نضيف المزيد قريباً</p>
      </div>
    );
  }

  return (
    <>
      <h3 className="text-white font-semibold mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-lg md:text-xl">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#e50914] to-[#b20710] rounded-xl flex items-center justify-center">
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          مسلسلات قد تعجبك أيضاً
        </span>
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {similarShows.map((show, idx) => (
          <div
            key={show.id}
            onClick={() => onShowClick(show.id)}
            className="group cursor-pointer transition-all duration-300 hover:scale-105 animate-fadeInUp"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="relative rounded-lg md:rounded-xl overflow-hidden shadow-lg">
              <img
                src={show.poster_path
                  ? `https://image.tmdb.org/t/p/w300${show.poster_path}`
                  : 'https://share.google/WtIWVQuaLAgqUiBRx'
                }
                alt={show.name}
                className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-white text-xs md:text-sm font-bold truncate mb-1 md:mb-2">{show.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 text-[10px] md:text-xs flex items-center gap-1">
                      <svg className="w-2 h-2 md:w-3 md:h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {show.vote_average?.toFixed(1)}
                    </span>
                    <span className="text-gray-300 text-[10px] md:text-xs">{show.first_air_date?.split('-')[0]}</span>
                  </div>
                  <button className="w-full mt-2 md:mt-3 bg-[#e50914] hover:bg-[#b20710] text-white text-[10px] md:text-xs py-1 md:py-1.5 rounded-lg transition-all transform hover:scale-105">
                    مشاهدة
                  </button>
                </div>
              </div>
              <div className="absolute top-1 right-1 md:top-2 md:right-2 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5 md:px-2 md:py-1 text-[9px] md:text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                {show.number_of_seasons} مواسم
              </div>
            </div>
            <h4 className="text-gray-300 text-xs md:text-sm text-center mt-2 md:mt-3 truncate group-hover:text-white transition-colors font-medium">
              {show.name}
            </h4>
          </div>
        ))}
      </div>
    </>
  );
};