import Head from 'next/head';
import Homepage from '../src/Pages/Homepage';

const Home = () => {
  const title = 'VELORA - موقع أفلام ومسلسلات أون لاين';
  const description = 'شاهد أفضل الأفلام والمسلسلات أون لاين مجاناً بجودة عالية HD. أفلام عربية وأجنبية، مسلسلات درامية وكوميدية على VELORA.';
  const canonical = 'https://www.veloravelora.online/';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="أفلام أون لاين, مسلسلات أون لاين, مشاهدة أفلام مجاناً, HD, VELORA" />
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
        
        {/* Schema.org - Organization and WebSite */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'VELORA',
            'url': canonical,
            'potentialAction': {
              '@type': 'SearchAction',
              'target': 'https://www.veloravelora.online/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            },
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
      <Homepage />
    </>
  );
};

export default Home;
