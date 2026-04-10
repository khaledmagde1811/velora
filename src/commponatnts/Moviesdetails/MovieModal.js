// components/MovieModal.jsx
import React, { useEffect, useState } from 'react';

const S = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: '#181818',
    borderRadius: '6px',
    width: '100%',
    maxWidth: '850px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 8px 60px rgba(0,0,0,0.8)',
  },
  closeBtn: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 10,
    background: '#181818',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
  },
  videoWrap: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16/9',
    background: '#000',
    overflow: 'hidden',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
  },
  loader: {
    position: 'absolute',
    inset: 0,
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  error: {
    position: 'absolute',
    inset: 0,
    background: '#000',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    color: '#fff',
    textAlign: 'center',
    padding: '20px',
  },
  errorIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '4px',
  },
  info: {
    padding: '20px 24px 24px',
    color: '#fff',
    direction: 'rtl',
  },
  topRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: 'clamp(16px, 3vw, 22px)',
    fontWeight: 700,
    color: '#fff',
    flex: 1,
    lineHeight: 1.25,
    margin: 0,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
    marginTop: '4px',
    flexWrap: 'wrap',
  },
  playBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    background: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    padding: '7px 18px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  iconBtn: (active) => ({
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: `2px solid ${active ? '#fff' : 'rgba(255,255,255,0.4)'}`,
    background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  }),
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  match:   { color: '#46d369', fontWeight: 700, fontSize: '14px' },
  badge:   { color: '#bcbcbc', fontSize: '12px', border: '1px solid rgba(255,255,255,0.3)', padding: '1px 6px', borderRadius: '2px' },
  runtime: { color: '#bcbcbc', fontSize: '13px' },
  hd:      { border: '1px solid rgba(255,255,255,0.4)', color: '#bcbcbc', fontSize: '10px', fontWeight: 700, padding: '1px 4px', borderRadius: '2px', letterSpacing: '0.6px' },
  rating:  { display: 'flex', alignItems: 'center', gap: '4px', color: '#f5c518', fontSize: '13px', fontWeight: 600 },
  overview: {
    fontSize: '14px',
    color: '#d2d2d2',
    lineHeight: 1.65,
    marginBottom: '16px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  sourceBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    borderTop: '1px solid #2a2a2a',
    paddingTop: '14px',
  },
  sourceLabel: { fontSize: '12px', color: '#777' },
  sourceBtn: (active) => ({
    background: active ? 'rgba(229,9,20,0.18)' : 'rgba(255,255,255,0.07)',
    border: `1px solid ${active ? '#e50914' : 'rgba(255,255,255,0.12)'}`,
    color: active ? '#fff' : '#aaa',
    fontSize: '12px',
    padding: '4px 12px',
    borderRadius: '3px',
    cursor: 'pointer',
  }),
};

// ── أيقونات SVG مدمجة ─────────────────────────────────────────────
const CloseIcon = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>;
const PlayIcon  = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="#000"><path d="M8 5v14l11-7z"/></svg>;
const PlusIcon  = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>;
const CheckIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>;
const ThumbIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>;
const StarIcon  = () => <svg viewBox="0 0 24 24" width="13" height="13" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
const ErrorIcon = () => <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>;

// spinner مدمج بـ <style> صغيرة لأن animation مش ممكنة بـ inline style
const SpinnerCSS = () => (
  <style>{`
    @keyframes nf-spin { to { transform: rotate(360deg); } }
    .nf-spinner {
      width: 44px; height: 44px;
      border: 3px solid rgba(255,255,255,0.12);
      border-top-color: #e50914;
      border-radius: 50%;
      animation: nf-spin 0.8s linear infinite;
    }
  `}</style>
);

// ── Component ──────────────────────────────────────────────────────
function MovieModal({ movie, onClose }) {
  const [videoError, setVideoError]     = useState(false);
  const [isLoading, setIsLoading]       = useState(true);
  const [liked, setLiked]               = useState(false);
  const [inList, setInList]             = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const videoSources = [
    { label: 'VidSrc 1', url: `https://vidsrc.xyz/embed/movie?tmdb=${movie.id}` },
    { label: 'VidSrc 2', url: `https://vidsrc.to/embed/movie?tmdb=${movie.id}` },
    { label: 'Embed.su', url: `https://embed.su/embed/movie/${movie.id}` },
    { label: '2Embed',   url: `https://2embed.cc/embed/${movie.id}` },
  ];

  useEffect(() => {
    const onEsc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const handleIframeError = () => {
    if (currentIndex < videoSources.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsLoading(true);
    } else {
      setVideoError(true);
    }
  };

  const switchSource = (i) => {
    setCurrentIndex(i);
    setIsLoading(true);
    setVideoError(false);
  };

  const matchScore = movie.vote_average
    ? Math.round((movie.vote_average / 10) * 100)
    : null;

  const year =
    movie.release_date?.split('-')[0] ||
    movie.first_air_date?.split('-')[0] ||
    'قريباً';

  const hours   = movie.runtime ? Math.floor(movie.runtime / 60) : 0;
  const minutes = movie.runtime ? movie.runtime % 60 : 0;
  const runtimeText = movie.runtime
    ? `${hours > 0 ? `${hours} ساعة ` : ''}${minutes > 0 ? `${minutes} دقيقة` : ''}`
    : null;

  return (
    <>
      <SpinnerCSS />

      <div style={S.overlay} onClick={onClose}>
        <div style={S.modal} onClick={(e) => e.stopPropagation()}>

          {/* زر الإغلاق */}
          <button style={S.closeBtn} onClick={onClose} aria-label="إغلاق">
            <CloseIcon />
          </button>

          {/* منطقة الفيديو */}
          <div style={S.videoWrap}>
            {isLoading && (
              <div style={S.loader}>
                <div className="nf-spinner" />
              </div>
            )}
            {!videoError ? (
              <iframe
                key={videoSources[currentIndex].url}
                style={S.iframe}
                src={videoSources[currentIndex].url}
                title={movie.title || movie.name}
                allowFullScreen
                onLoad={() => setIsLoading(false)}
                onError={handleIframeError}
              />
            ) : (
              <div style={S.error}>
                <div style={S.errorIcon}><ErrorIcon /></div>
                <p style={{ fontSize: '16px', fontWeight: 600 }}>عذراً، لا يمكن تشغيل هذا الفيلم حالياً</p>
                <p style={{ fontSize: '13px', color: '#999' }}>جرّب مصدراً آخر أو ابحث عنه في منصة مختلفة</p>
              </div>
            )}
          </div>

          {/* معلومات الفيلم */}
          <div style={S.info}>

            <div style={S.topRow}>
              <h2 style={S.title}>{movie.title || movie.name}</h2>
              <div style={S.actions}>
                <button style={S.playBtn}>
                  <PlayIcon /> تشغيل
                </button>
                <button
                  style={S.iconBtn(inList)}
                  title={inList ? 'إزالة من القائمة' : 'أضف للقائمة'}
                  onClick={() => setInList(!inList)}
                >
                  {inList ? <CheckIcon /> : <PlusIcon />}
                </button>
                <button
                  style={S.iconBtn(liked)}
                  title="أعجبني"
                  onClick={() => setLiked(!liked)}
                >
                  <ThumbIcon />
                </button>
              </div>
            </div>

            <div style={S.meta}>
              {matchScore && <span style={S.match}>{matchScore}% تطابق</span>}
              <span style={S.badge}>{year}</span>
              {runtimeText && <span style={S.runtime}>{runtimeText}</span>}
              <span style={S.hd}>HD</span>
              {movie.vote_average > 0 && (
                <span style={S.rating}>
                  <StarIcon />
                  {movie.vote_average.toFixed(1)} / 10
                </span>
              )}
            </div>

            <p style={S.overview}>
              {movie.overview || 'لا يوجد وصف متاح لهذا الفيلم'}
            </p>

            {/* اختيار المصدر */}
            <div style={S.sourceBar}>
              <span style={S.sourceLabel}>مصدر:</span>
              {videoSources.map((src, i) => (
                <button
                  key={src.url}
                  style={S.sourceBtn(i === currentIndex)}
                  onClick={() => switchSource(i)}
                >
                  {src.label}
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default MovieModal;
