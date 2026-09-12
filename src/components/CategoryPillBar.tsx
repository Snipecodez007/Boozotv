import { useLocation, useNavigate } from 'react-router-dom';
import { CATEGORY_NAV_ITEMS } from '@/data/navItems';

/**
 * Mobile-only quick category filter bar shown just above the swipeable hero.
 * "All" maps to Home; the rest mirror the desktop top navbar categories.
 */
export default function CategoryPillBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const pills = [
    { id: 'all', label: 'All', path: '/', isActive: (p: string) => p === '/' },
    ...CATEGORY_NAV_ITEMS.filter((item) => item.id !== 'home'),
  ];

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto hide-scrollbar px-[7.5vw] pb-3"
      aria-label="Quick category filters"
    >
      {pills.map((pill) => {
        const active = pill.isActive(location.pathname);
        return (
          <button
            key={pill.id}
            onClick={() => navigate(pill.path)}
            aria-current={active ? 'page' : undefined}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors duration-200 ${
              active
                ? 'bg-xf-gold text-black border-xf-gold'
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            {pill.label}
          </button>
        );
      })}
    </div>
  );
}
