import Head from 'next/head';
import SearchPage from '../src/Pages/SearchPage';

const Search = () => {
  const title = 'بحث - ابحث عن أفلامك المفضلة | VELORA';
  const description = 'ابحث عن أفلامك ومسلسلاتك المفضلة على VELORA. اكتشف أفلام جديدة وشاهدها أون لاين مجاناً.';
  const canonical = 'https://www.veloravelora.online/search';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="بحث عن أفلام, البحث في المسلسلات, أفلام جديدة, مسلسلات, VELORA" />
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
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        
        {/* Schema.org */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SearchAction',
            'target': 'https://www.veloravelora.online/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          })
        }} />
      </Head>
      <SearchPage />
    </>
  );
};

export default Search;
