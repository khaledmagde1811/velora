import Head from 'next/head';
import TvShowsPage from '../src/Pages/TvShows/TvShowsPage';

const TvShows = () => {
  const title = 'مسلسلات أون لاين - مشاهدة مسلسلات مجاناً | VELORA';
  const description = 'شاهد أفضل المسلسلات أون لاين مجاناً بجودة عالية على VELORA. مسلسلات درامية، كوميديا، أكشن وأكثر.';
  const canonical = 'https://www.veloravelora.online/tvshows';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="مسلسلات أون لاين, مشاهدة مسلسلات, مسلسلات مجاناً, مسلسلات عربية, HD, VELORA" />
        <meta name="author" content="VELORA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        
        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="VELORA" />
        <meta property="og:locale" content="ar_EG" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        
        {/* Schema.org - CollectionPage */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': 'مسلسلات VELORA',
            'description': description,
            'url': canonical,
            'publisher': {
              '@type': 'Organization',
              'name': 'VELORA',
              'logo': {
                '@type': 'ImageObject',
                'url': 'https://www.veloravelora.online/velora.svg'
              }
            }
          })
        }} />
      </Head>
      <TvShowsPage />
    </>
  );
};

export default TvShows;