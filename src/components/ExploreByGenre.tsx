import { useNavigate } from 'react-router-dom';
import { Film, List, Sparkles, Tv2, Tv, Users, PlayCircle } from 'lucide-react';

const CARDS = [
  { label: 'Movies', path: '/movies', icon: Film, from: 'from-pink-600', to: 'to-fuchsia-900' },
  { label: 'Web Series', path: '/web-series', icon: List, from: 'from-violet-600', to: 'to-purple-900' },
  { label: 'Anime', path: '/anime', icon: Sparkles, from: 'from-rose-700', to: 'to-red-900' },
  { label: 'K-Drama', path: '/korean-drama', icon: Tv2, from: 'from-teal-500', to: 'to-cyan-900' },
  { label: 'TV Shows', path: '/tv-shows', icon: Tv, from: 'from-amber-500', to: 'to-orange-800' },
  { label: 'Kids', path: '/kids', icon: Users, from: 'from-emerald-500', to: 'to-green-900' },
  { label: 'Movie Party', path: '/movie-party', icon: PlayCircle, from: 'from-sky-500', to: 'to-blue-900' },
];

interface ExploreByGenreProps {
  className?: string;
  /** Limit how many cards render — omit to show all */
  limit?: number;
  title?: string;
}

export default function ExploreByGenre({ className = '', limit, title = 'Explore by Genre' }: ExploreByGenreProps) {
  const navigate = useNavigate();
  const cards = typeof limit === 'number' ? CARDS.slice(0, limit) : CARDS;

  return (
    <div className={`px-4 sm:px-8 lg:px-12 ${className}`}>
      {title && (
        <h2 className="text-lg sm:text-xl font-display font-bold text-white mb-4">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className={`relative flex flex-col items-center justify-center gap-2 aspect-square sm:aspect-[4/3] rounded-2xl bg-gradient-to-br ${card.from} ${card.to} p-4 shadow-lg hover:scale-[1.03] active:scale-95 transition-transform duration-200 overflow-hidden border border-white/10`}
            >
              <Icon size={28} className="text-white/90 drop-shadow" />
              <span className="text-white font-bold text-sm sm:text-base drop-shadow text-center">{card.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
