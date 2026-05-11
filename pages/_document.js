import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="ar" dir="rtl">
      <Head>
        {/* Favicon and Icons */}
        <link rel="icon" type="image/svg+xml" href="/velora.svg" />
        <link rel="apple-touch-icon" href="/velora.svg" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta Tags for Search Engines */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#e50914" />
        <meta name="msapplication-TileColor" content="#e50914" />
        
        {/* Web App Config */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
