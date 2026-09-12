import { Home, Film, List, Tv, Sparkles, Tv2, Users, Bookmark, User, SlidersHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
  isActive: (pathname: string) => boolean;
}

// Content categories — shown as the desktop top navbar tabs and as the
// quick-filter pill bar under the mobile hero. Single source of truth so
// both stay in sync.
export const CATEGORY_NAV_ITEMS: NavItem[] = [
  { id: 'home', icon: Home, label: 'Home', path: '/', isActive: (p) => p === '/' },
  { id: 'movies', icon: Film, label: 'Movies', path: '/movies', isActive: (p) => p.startsWith('/movies') },
  { id: 'web-series', icon: List, label: 'Web Series', path: '/web-series', isActive: (p) => p.startsWith('/web-series') },
  { id: 'tv-shows', icon: Tv, label: 'TV Shows', path: '/tv-shows', isActive: (p) => p.startsWith('/tv-shows') },
  { id: 'anime', icon: Sparkles, label: 'Anime', path: '/anime', isActive: (p) => p.startsWith('/anime') },
  { id: 'korean-drama', icon: Tv2, label: 'K-Drama', path: '/korean-drama', isActive: (p) => p.startsWith('/korean-drama') },
  { id: 'kids', icon: Users, label: 'Kids', path: '/kids', isActive: (p) => p.startsWith('/kids') },
];

// Mobile bottom tab bar — general app sections (not content categories).
export const MOBILE_BOTTOM_ITEMS: NavItem[] = [
  { id: 'home', icon: Home, label: 'Home', path: '/', isActive: (p) => p === '/' },
  { id: 'explore', icon: SlidersHorizontal, label: 'Explore', path: '/explore', isActive: (p) => p.startsWith('/explore') },
  { id: 'my-list', icon: Bookmark, label: 'My List', path: '/my-list', isActive: (p) => p.startsWith('/my-list') },
  { id: 'profile', icon: User, label: 'Profile', path: '/profile', isActive: (p) => p.startsWith('/profile') },
];
