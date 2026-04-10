// components/VideoPlayerWithSubtitles.jsx
import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayerWithSubtitles = ({ videoUrl, movieTitle }) => {
  const [playing, setPlaying] = useState(false);
  const [selectedSubtitle, setSelectedSubtitle] = useState('ar');
  const playerRef = useRef(null);

  // قائمة الترجمات المتاحة
  const subtitles = [
    {
      kind: 'subtitles',
      src: '/subtitles/arabic.vtt',  // ضع ملف الترجمة هنا
      srcLang: 'ar',
      label: 'العربية',
      default: true,
    },
    {
      kind: 'subtitles',
      src: '/subtitles/english.vtt',
      srcLang: 'en',
      label: 'English',
      default: false,
    },
    {
      kind: 'subtitles',
      src: '/subtitles/french.vtt',
      srcLang: 'fr',
      label: 'Français',
      default: false,
    },
  ];

  return (
    <div className="relative w-full bg-black">
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        playing={playing}
        controls
        width="100%"
        height="70vh"
        config={{
          file: {
            tracks: subtitles.map(sub => ({
              ...sub,
              default: sub.srcLang === selectedSubtitle,
            })),
            attributes: {
              crossOrigin: "anonymous",
            },
          },
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      
      {/* زر اختيار الترجمة - ستايل نتفلكس */}
      <div className="absolute bottom-24 right-4 z-20">
        <div className="relative group">
          <button className="bg-black/70 hover:bg-black/90 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 transition-all">
            <span>📝</span>
            <span>الترجمة</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {/* القائمة المنسدلة للترجمات */}
          <div className="absolute bottom-full right-0 mb-2 w-48 bg-black/90 backdrop-blur-md rounded-md overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
            {subtitles.map((sub) => (
              <button
                key={sub.srcLang}
                onClick={() => setSelectedSubtitle(sub.srcLang)}
                className={`w-full text-right px-4 py-2 text-sm transition-colors ${
                  selectedSubtitle === sub.srcLang
                    ? 'bg-netflix-red text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                {sub.label}
                {selectedSubtitle === sub.srcLang && (
                  <span className="float-left">✓</span>
                )}
              </button>
            ))}
            <button
              onClick={() => setSelectedSubtitle(null)}
              className="w-full text-right px-4 py-2 text-sm text-gray-300 hover:bg-white/10 border-t border-gray-700"
            >
              🚫 إخفاء الترجمة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerWithSubtitles;