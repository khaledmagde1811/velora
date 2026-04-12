// src/Pages/Movie/components/SuggestedMovies.jsx
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

export const SuggestedMovies = ({ suggested, navigate }) => {
  const [showAll, setShowAll] = useState(false);

  if (!suggested || suggested.length === 0) return null;

  const visibleMovies = showAll ? suggested : suggested.slice(0, 20);

  return (
    <div className="px-4 md:px-8 lg:px-12 py-8">
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white font-semibold flex items-center gap-3 text-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-[#e50914] to-[#b20710] rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            أفلام قد تعجبك أيضاً
          </span>
        </h3>
        <span className="text-gray-500 text-sm hidden sm:block">
          {suggested.length} فيلم
        </span>
      </div>

      {/* Swiper */}
      <div className="relative">
        <Swiper
          modules={[Navigation, FreeMode]}
          freeMode={true}
          navigation={{
            nextEl: '.swiper-next',
            prevEl: '.swiper-prev',
          }}
          spaceBetween={16}
          slidesPerView={2.3}
          breakpoints={{
            480:  { slidesPerView: 3.3, spaceBetween: 16 },
            768:  { slidesPerView: 4.3, spaceBetween: 20 },
            1024: { slidesPerView: 5.3, spaceBetween: 20 },
            1280: { slidesPerView: 6.3, spaceBetween: 24 },
          }}
          className="!overflow-visible"
        >
          {visibleMovies.map((movie, idx) => (
            <SwiperSlide key={movie.id}>
              <div
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="group cursor-pointer"
              >
                {/* البوستر */}
                <div className="relative rounded-xl overflow-hidden shadow-lg aspect-[2/3]">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                        : 'https://share.google/WtIWVQuaLAgqUiBRx'
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Overlay عند الهوفر */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-300 text-xs">
                          {movie.release_date?.split('-')[0] || '?'}
                        </span>
                        <span className="text-yellow-400 text-xs flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.033a1 1 0 00-1.175 0l-2.8 2.033c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {movie.vote_average?.toFixed(1) || '?'}
                        </span>
                      </div>
                      <button className="w-full bg-[#e50914] hover:bg-[#b20710] text-white text-xs py-1.5 rounded-lg transition-all">
                        مشاهدة الآن
                      </button>
                    </div>
                  </div>

                  {/* Badge تقييم */}
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-lg px-1.5 py-0.5 flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.033a1 1 0 00-1.175 0l-2.8 2.033c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white text-[10px] font-bold">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* الاسم */}
                <h4 className="text-gray-300 text-xs sm:text-sm text-center mt-2 truncate group-hover:text-white transition-colors font-medium px-1">
                  {movie.title}
                </h4>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* أزرار التنقل */}
        <button className="swiper-prev absolute right-0 top-1/3 -translate-y-1/2 -translate-x-2 z-10 w-9 h-9 bg-black/80 hover:bg-[#e50914] backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="swiper-next absolute left-0 top-1/3 -translate-y-1/2 translate-x-2 z-10 w-9 h-9 bg-black/80 hover:bg-[#e50914] backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* زر عرض المزيد */}
      {suggested.length > 20 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group flex items-center gap-3 px-8 py-3 bg-white/5 hover:bg-[#e50914]/20 border border-white/10 hover:border-[#e50914]/50 rounded-2xl text-gray-300 hover:text-white transition-all duration-300"
          >
            <span className="font-medium">
              {showAll ? 'عرض أقل' : `عرض المزيد (${suggested.length - 20} فيلم)`}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};