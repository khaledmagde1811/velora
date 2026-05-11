import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import tmdbApi from '../../src/services/tmdb';
import MoviePage from '../../src/Pages/Movies/MoviePage';

const MoviePageWrapper = () => {
  const router = useRouter();
  const { id } = router.query;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchMovie = async () => {
      try {
        const response = await tmdbApi.get(`/movie/${id}`, {
          params: { language: 'ar-SA' }
        });
        setMovie(response.data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading || !movie) {
    return (
      <>
        <Head>
          <title>VELORA - مشاهدة أفلام أون لاين</title>
        </Head>
        <div>Loading...</div>
      </>
    );
  }

  const title = `${movie.title} - مشاهدة فيلم أون لاين | VELORA`;
  const description = movie.overview?.slice(0, 155) || 'مشاهدة الفيلم أون لاين مجاناً على VELORA';
  const poster = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  const canonical = `https://www.veloravelora.online/movie/${movie.id}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={`${movie.title}, فيلم, مشاهدة أون لاين, ${movie.genres?.map(g => g.name).join(', ')}, VELORA`} />
        <meta name="author" content="VELORA" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={poster} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="video.movie" />
        <meta property="og:site_name" content="VELORA" />
        <meta property="og:locale" content="ar_EG" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={poster} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Movie',
            name: movie.title,
            description: movie.overview,
            image: poster,
            dateCreated: movie.release_date,
            genre: movie.genres?.map(g => g.name),
            aggregateRating: movie.vote_average ? {
              '@type': 'AggregateRating',
              ratingValue: movie.vote_average,
              ratingCount: movie.vote_count
            } : undefined
          })
        }} />
      </Head>
      <MoviePage />
    </>
  );
};

export default MoviePageWrapper;
