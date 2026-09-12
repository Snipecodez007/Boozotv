import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import {
  getDiscoverTV,
  getDiscoverTVPage,
  getDiscoverMoviesPage,
} from '@/services/tmdb';
import { useTMDB } from '@/hooks/useTMDB';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import Footer from '@/components/Footer';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import type { Movie } from '@/types/movie';

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0 },
};

// TMDB genre 16 = Animation. Combined with original_language=ja this reliably
// surfaces anime (movies + series) rather than Western/other animation.
const ANIME_LANGUAGE = 'ja';
const ANIME_GENRE = 16;

const ROWS: Array<{
  title: string;
  mediaType: 'movie' | 'tv';
  genreId: number | string;
  sort: string;
}> = [
  { title: 'Popular Anime Series', mediaType: 'tv', genreId: ANIME_GENRE, sort: 'popularity.desc' },
  { title: 'Top Rated Anime Series', mediaType: 'tv', genreId: ANIME_GENRE, sort: 'vote_average.desc' },
  { title: 'New & Upcoming Anime', mediaType: 'tv', genreId: ANIME_GENRE, sort: 'first_air_date.desc' },
  { title: 'Action Anime', mediaType: 'tv', genreId: `${ANIME_GENRE},10759`, sort: 'popularity.desc' },
  { title: 'Fantasy & Sci-Fi Anime', mediaType: 'tv', genreId: `${ANIME_GENRE},10765`, sort: 'popularity.desc' },
  { title: 'Popular Anime Movies', mediaType: 'movie', genreId: ANIME_GENRE, sort: 'popularity.desc' },
  { title: 'Top Rated Anime Movies', mediaType: 'movie', genreId: ANIME_GENRE, sort: 'vote_average.desc' },
  { title: 'Adventure Anime Movies', mediaType: 'movie', genreId: `${ANIME_GENRE},12`, sort: 'popularity.desc' },
];

export default function Anime() {
  const [addonRoot, setAddonRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setAddonRoot(document.getElementById('navbar-addon'));
  }, []);

  const fetchHero = useCallback(() => getDiscoverTV(ANIME_GENRE, ANIME_LANGUAGE), []);
  const { data: heroShows, loading: heroLoading } = useTMDB(fetchHero, []);
  const visibleHero = heroShows?.slice(0, 10) ?? [];

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-xf-bg"
    >
      {/* Navbar Addon: BOOZO TV > Anime */}
      {addonRoot && createPortal(
        <div className="flex items-center gap-1 sm:gap-2 ml-1.5 sm:ml-4">
          <ChevronRight size={14} className="text-white/50 shrink-0 sm:w-4 sm:h-4" />
          <span className="font-display font-bold text-xs sm:text-lg text-white truncate">Anime</span>
        </div>,
        addonRoot
      )}

      {/* Hero Section */}
      <div className="relative">
        {heroLoading ? (
          <LoadingSkeleton variant="hero" />
        ) : (
          <Hero movies={visibleHero} />
        )}
      </div>

      {/* Rows */}
      <div className="max-md:mt-4 md:mt-[-40px] relative z-10 flex flex-col gap-10 pb-16">
        {ROWS.map((row) => (
          <AnimeRow
            key={`${row.mediaType}-${row.genreId}-${row.sort}`}
            title={row.title}
            mediaType={row.mediaType}
            genreId={row.genreId}
            sort={row.sort}
          />
        ))}
      </div>

      <Footer />
    </motion.div>
  );
}

// ─── Sub-component for each Anime row ─────────────────────────────────────────
function AnimeRow({
  title,
  mediaType,
  genreId,
  sort,
}: {
  title: string;
  mediaType: 'movie' | 'tv';
  genreId: number | string;
  sort: string;
}) {
  const fetchPage = useCallback(
    async (page: number): Promise<Movie[]> => {
      const result =
        mediaType === 'movie'
          ? await getDiscoverMoviesPage(genreId, page, sort, ANIME_LANGUAGE)
          : await getDiscoverTVPage(genreId, page, sort, ANIME_LANGUAGE);
      return result.movies;
    },
    [mediaType, genreId, sort]
  );

  const { data, loading } = useTMDB(() => fetchPage(1), [mediaType, genreId, sort]);

  if (loading) {
    return (
      <div className="px-4 sm:px-8 lg:px-12">
        <div className="h-4 w-48 bg-xf-card skeleton rounded mb-4" />
        <LoadingSkeleton variant="row" count={1} />
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return <MovieRow title={title} movies={data} fetchMore={fetchPage} />;
}
