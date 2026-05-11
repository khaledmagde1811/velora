import tmdbApi from '../src/services/tmdb';

const Sitemap = () => {};

export async function getServerSideProps({ res }) {
  try {
    // جلب أشهر الأفلام من TMDB
    const moviesResponse = await tmdbApi.get('/movie/popular', {
      params: {
        language: 'ar-SA',
        page: 1,
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.REACT_APP_TMDB_API_KEY
      }
    });

    // جلب أشهر المسلسلات من TMDB
    const tvShowsResponse = await tmdbApi.get('/tv/popular', {
      params: {
        language: 'ar-SA',
        page: 1,
        api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY || process.env.REACT_APP_TMDB_API_KEY
      }
    });

    const currentDate = new Date().toISOString().split('T')[0];

    // الصفحات الثابتة
    const staticPages = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/movies', changefreq: 'daily', priority: 0.9 },
      { url: '/tvshows', changefreq: 'daily', priority: 0.9 },
      { url: '/search', changefreq: 'weekly', priority: 0.7 },
    ];

    // بناء XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // إضافة الصفحات الثابتة
    staticPages.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>https://www.veloravelora.online${page.url}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // إضافة الأفلام الشائعة
    moviesResponse.data.results.forEach(movie => {
      xml += `  <url>\n`;
      xml += `    <loc>https://www.veloravelora.online/movie/${movie.id}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    // إضافة المسلسلات الشائعة
    tvShowsResponse.data.results.forEach(show => {
      xml += `  <url>\n`;
      xml += `    <loc>https://www.veloravelora.online/tv/${show.id}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += '</urlset>';

    // إرجاع XML
    res.setHeader('Content-Type', 'text/xml');
    res.write(xml);
    res.end();

    return { props: {} };
  } catch (error) {
    console.error('Error generating sitemap:', error);

    // في حالة الخطأ، أرجع sitemap بسيط
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://www.veloravelora.online/</loc>\n    <lastmod>' + new Date().toISOString().split('T')[0] + '</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>';

    res.setHeader('Content-Type', 'text/xml');
    res.write(xml);
    res.end();

    return { props: {} };
  }
}

export default Sitemap;