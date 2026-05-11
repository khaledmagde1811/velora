import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async';
import NetflixHero from '../commponatnts/HomeCommponants/NetflixHero'
import Loader from '../Utility/Loader'

const Homepage = () => {
  const [loaderDone, setLoaderDone] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  const handleDone = () => {
    setContentVisible(true);                          // المحتوى يبدأ يظهر
    setTimeout(() => setLoaderDone(true), 1200);      // اللودر يتشال بعد انتهاء الـ transition
  };

  useEffect(() => {
    // اللودر يشتغل عند دخول الصفحة
    const timer = setTimeout(() => {
      handleDone();
    }, 3000); // اللودر يظهر لمدة 3 ثواني

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <Helmet>
        <title>Velora - أكبر منصة لمشاهدة الأفلام والمسلسلات أونلاين بجودة 4K</title>
        <meta name="description" content="شاهد الأفلام والمسلسلات الأصلية والعالمية مجاناً بجودة 4K على Velora. منصة مشاهدة اون لاين شاملة للعرب." />
        <meta name="keywords" content="أفلام, مسلسلات, مشاهدة اون لاين, 4K, عربي, Netflix, HBO, أفلام عربية, مسلسلات تركية, أنمي" />
        <meta name="author" content="Velora" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Velora - أكبر منصة لمشاهدة الأفلام والمسلسلات أونلاين" />
        <meta property="og:description" content="شاهد الأفلام والمسلسلات الأصلية والعالمية مجاناً بجودة 4K على Velora." />
        <meta property="og:image" content="https://www.veloravelora.online/og-image.jpg" />
        <meta property="og:url" content="https://www.veloravelora.online/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Velora" />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Velora - أكبر منصة لمشاهدة الأفلام والمسلسلات أونلاين" />
        <meta name="twitter:description" content="شاهد الأفلام والمسلسلات الأصلية والعالمية مجاناً بجودة 4K على Velora." />
        <meta name="twitter:image" content="https://www.veloravelora.online/og-image.jpg" />
        <link rel="canonical" href="https://www.veloravelora.online/" />
      </Helmet>

      {/* الخلفية */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        zIndex: -1,
      }}></div>

      {/* المحمل */}
      {!loaderDone && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          opacity: contentVisible ? 0 : 1,
          transition: 'opacity 1.2s ease',
          pointerEvents: contentVisible ? 'none' : 'auto',
        }}>
          <Loader />
        </div>
      )}

      {/* المحتوى */}
      <div style={{
        opacity: contentVisible ? 1 : 0,
        transition: 'opacity 1.2s ease',
        position: 'relative',
        zIndex: 1,
      }}>
        <Netflix  Hero/>
      </div>
    </div>
  )
}

export default Homepage