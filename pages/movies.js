import Head from 'next/head';
import MoviesPage from '../src/Pages/Movies/MoviesPage';

const Movies = () => {
  const title = 'أفلام أون لاين - مشاهدة أفلام مجاناً | VELORA';
  const description = 'شاهد أفضل الأفلام أون لاين مجاناً بجودة عالية على VELORA. أفلام جديدة، أكشن، دراما، كوميديا وأكثر.';
  const canonical = 'https://www.veloravelora.online/movies';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="أفلام أون لاين, مشاهدة أفلام, أفلام مجاناً, أفلام عربية, HD, VELORA" />
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
            'name': 'أفلام VELORA',
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
      <MoviesPage />
    </>
  );
};

export default Movies;