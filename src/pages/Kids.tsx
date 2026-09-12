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

// TMDB genre 10751 = Family. This is used as the anchor for kid-friendly content.
const KIDS_GENRE = 10751;

const ROWS: Array<{
  title: string;
  mediaType: 'movie' | 'tv';
  genreId: number | string;
  sort: string;
}> = [
  { title: 'Popular Kids Movies', mediaType: 'movie', genreId: KIDS_GENRE, sort: 'popularity.desc' },
  { title: 'Popular Kids Shows', mediaType: 'tv', genreId: KIDS_GENRE, sort: 'popularity.desc' },
  { title: 'Top Rated Kids Movies', mediaType: 'movie', genreId: KIDS_GENRE, sort: 'vote_average.desc' },
  { title: 'Top Rated Kids Shows', mediaType: 'tv', genreId: KIDS_GENRE, sort: 'vote_average.desc' },
  { title: 'Animated Family Movies', mediaType: 'movie', genreId: `${KIDS_GENRE},16`, sort: 'popularity.desc' },
  { title: 'Animated Family Shows', mediaType: 'tv', genreId: `${KIDS_GENRE},16`, sort: 'popularity.desc' },
  { title: 'Family Adventure Movies', mediaType: 'movie', genreId: `${KIDS_GENRE},12`, sort: 'popularity.desc' },
  { title: 'Family Comedy Shows', mediaType: 'tv', genreId: `${KIDS_GENRE},35`, sort: 'popularity.desc' },
];

export default function Kids() {
  const [addonRoot, setAddonRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setAddonRoot(document.getElementById('navbar-addon'));
  }, []);

  const fetchHero = useCallback(() => getDiscoverTV(KIDS_GENRE, undefined), []);
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
      {/* Navbar Addon: BOOZO TV > Kids */}
      {addonRoot && createPortal(
        <div className="flex items-center gap-1 sm:gap-2 ml-1.5 sm:ml-4">
          <ChevronRight size={14} className="text-white/50 shrink-0 sm:w-4 sm:h-4" />
          <span className="font-display font-bold text-xs sm:text-lg text-white truncate">Kids</span>
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
          <KidsRow
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

// ─── Sub-component for each Kids row ──────────────────────────────────────────
function KidsRow({
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
          ? await getDiscoverMoviesPage(genreId, page, sort, undefined)
          : await getDiscoverTVPage(genreId, page, sort, undefined);
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
