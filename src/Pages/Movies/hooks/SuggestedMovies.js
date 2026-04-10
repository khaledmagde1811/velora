// src/Pages/Movie/components/SuggestedMovies.jsx
import React from 'react';

export const SuggestedMovies = ({ suggested, navigate }) => {
  if (!suggested || suggested.length === 0) return null;

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8">
      <h3 className="text-white font-semibold mb-6 flex items-center gap-3 text-xl">
        <div className="w-10 h-10 bg-gradient-to-br from-[#e50914] to-[#b20710] rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
        </div>
        <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          أفلام قد تعجبك أيضاً
        </span>
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {suggested.map((suggestedMovie, idx) => (
          <div
            key={suggestedMovie.id}
            onClick={() => navigate(`/movie/${suggestedMovie.id}`)}
            className="group cursor-pointer transition-all duration-300 hover:scale-105 animate-fadeInUp"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src={suggestedMovie.poster_path
                  ? `https://image.tmdb.org/t/p/w300${suggestedMovie.poster_path}`
                  : 'https://share.google/WtIWVQuaLAgqUiBRx'
                }
                alt={suggestedMovie.title}
                className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-white text-sm font-bold truncate mb-2">{suggestedMovie.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 text-xs flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.033a1 1 0 00-1.175 0l-2.8 2.033c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {suggestedMovie.vote_average?.toFixed(1) || '?'}
                    </span>
                    <span className="text-gray-300 text-xs">{suggestedMovie.release_date?.split('-')[0] || '?'}</span>
                  </div>
                  <button className="w-full mt-3 bg-[#e50914] hover:bg-[#b20710] text-white text-xs py-1.5 rounded-lg transition-all transform hover:scale-105">
                    مشاهدة
                  </button>
                </div>
              </div>
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                فيلم
              </div>
            </div>
            <h4 className="text-gray-300 text-sm text-center mt-3 truncate group-hover:text-white transition-colors font-medium">
              {suggestedMovie.title}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
};