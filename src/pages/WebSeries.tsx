import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import {
  getDiscoverTV,
  getDiscoverTVPage,
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

const ROWS: Array<{
  title: string;
  genreId?: number | string;
  language?: string;
  sort: string;
}> = [
  { title: 'Popular Web Series', sort: 'popularity.desc' },
  { title: 'Top Rated Web Series', sort: 'vote_average.desc' },
  { title: 'New & Upcoming Web Series', sort: 'first_air_date.desc' },
  { title: 'Crime & Thriller Web Series', genreId: '80,9648', sort: 'popularity.desc' },
  { title: 'Drama Web Series', genreId: 18, sort: 'popularity.desc' },
  { title: 'Hindi Web Series', language: 'hi', sort: 'popularity.desc' },
  { title: 'Tamil Web Series', language: 'ta', sort: 'popularity.desc' },
  { title: 'Telugu Web Series', language: 'te', sort: 'popularity.desc' },
];

export default function WebSeries() {
  const [addonRoot, setAddonRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setAddonRoot(document.getElementById('navbar-addon'));
  }, []);

  const fetchHero = useCallback(() => getDiscoverTV(undefined, undefined), []);
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
      {/* Navbar Addon: BOOZO TV > Web Series */}
      {addonRoot && createPortal(
        <div className="flex items-center gap-1 sm:gap-2 ml-1.5 sm:ml-4">
          <ChevronRight size={14} className="text-white/50 shrink-0 sm:w-4 sm:h-4" />
          <span className="font-display font-bold text-xs sm:text-lg text-white truncate">Web Series</span>
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
          <WebSeriesRow
            key={`${row.genreId ?? 'all'}-${row.language ?? 'all'}-${row.sort}`}
            title={row.title}
            genreId={row.genreId}
            language={row.language}
            sort={row.sort}
          />
        ))}
      </div>

      <Footer />
    </motion.div>
  );
}

// ─── Sub-component for each Web Series row ────────────────────────────────────
function WebSeriesRow({
  title,
  genreId,
  language,
  sort,
}: {
  title: string;
  genreId?: number | string;
  language?: string;
  sort: string;
}) {
  const fetchPage = useCallback(
    async (page: number): Promise<Movie[]> => {
      const result = await getDiscoverTVPage(genreId, page, sort, language);
      return result.movies;
    },
    [genreId, sort, language]
  );

  const { data, loading } = useTMDB(() => fetchPage(1), [genreId, sort, language]);

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
