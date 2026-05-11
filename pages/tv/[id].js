import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import tmdbApi from '../../src/services/tmdb';
import TvPage from '../../src/Pages/TvShows/TvPage';

const TvPageWrapper = () => {
  const router = useRouter();
  const { id } = router.query;
  const [tvShow, setTvShow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTvShow = async () => {
      try {
        const response = await tmdbApi.get(`/tv/${id}`, {
          params: { language: 'ar-SA' }
        });
        setTvShow(response.data);
      } catch (error) {
        console.error('Error fetching TV show:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTvShow();
  }, [id]);

  if (loading || !tvShow) {
    return (
      <>
        <Head>
          <title>VELORA - مشاهدة مسلسلات أون لاين</title>
        </Head>
        <div>Loading...</div>
      </>
    );
  }

  const title = `${tvShow.name} - مشاهدة اون لاين مجاناً | VELORA`;
  const description = tvShow.overview?.slice(0, 155) || 'مشاهدة المسلسل أون لاين مجاناً على VELORA';
  const poster = `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`;
  const canonical = `https://www.veloravelora.online/tv/${tvShow.id}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${tvShow.name}, مسلسل, مشاهدة اون لاين, ${tvShow.genres?.map(g => g.name).join(', ')}, عربي, HD, VELORA`} />
        <meta name="author" content="VELORA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={poster} />
        <meta property="og:image:width" content="500" />
        <meta property="og:image:height" content="750" />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="video.tv_show" />
        <meta property="og:site_name" content="VELORA" />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={poster} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TVSeries',
            name: tvShow.name,
            description: tvShow.overview,
            image: poster,
            dateCreated: tvShow.first_air_date,
            numberOfSeasons: tvShow.number_of_seasons,
            genre: tvShow.genres?.map(g => g.name),
            aggregateRating: tvShow.vote_average ? {
              '@type': 'AggregateRating',
              ratingValue: tvShow.vote_average,
              ratingCount: tvShow.vote_count
            } : undefined
          })
        }} />
      </Head>
      <TvPage />
    </>
  );
};

export default TvPageWrapper;
