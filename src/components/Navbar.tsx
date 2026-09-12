import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
import { CATEGORY_NAV_ITEMS } from '@/data/navItems';
import ProfileMenu from './ProfileMenu';
import NotificationPanel from './NotificationPanel';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { setSearchOpen, profile, unreadCount } = useAppStore();
  const { user } = useAuthStore();
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Transparent → opaque on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearchClick = () => {
    setSearchOpen(true);
    setNotifOpen(false);
  };

  const unread = unreadCount();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-xf-bg/95 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16 gap-3 lg:gap-6">
          {/* Logo & Addon */}
          <div className="flex items-center min-w-0 shrink-0">
            <Link
              to="/"
              className="flex-shrink-0 focus-visible:outline-xf-gold flex items-center gap-2"
              aria-label="BOOZO TV Home"
            >
              <img src="/logo.png" alt="BOOZO TV" className="h-7 sm:h-8 lg:h-9 w-auto" />
              <span className="flex flex-col leading-none">
                <span className="font-display font-black text-xl sm:text-2xl lg:text-3xl tracking-tighter">
                  <span className="text-white">BOOZO</span>
                  <span className="text-xf-gold"> TV</span>
                </span>
                <span className="hidden lg:block text-[9px] tracking-[0.2em] text-xf-subtle font-medium uppercase mt-0.5">
                  Stories Beyond Screens
                </span>
              </span>
            </Link>

            <div id="navbar-addon" className="flex items-center min-w-0" />
          </div>

          {/* Desktop nav — flat underline tabs (gold active indicator) */}
          <nav
            className="hidden lg:flex items-center min-w-0 overflow-x-auto scrollbar-hide"
            aria-label="Primary navigation"
          >
            <div className="flex items-center gap-1 xl:gap-2 shrink-0">
              {CATEGORY_NAV_ITEMS.map((item) => {
                const active = item.isActive(location.pathname);
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    aria-current={active ? 'page' : undefined}
                    className={`relative px-2.5 xl:px-3 py-2 text-sm xl:text-[15px] font-semibold whitespace-nowrap transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-xf-gold/60 rounded ${
                      active ? 'text-xf-gold' : 'text-white/75 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {active && (
                      <motion.span
                        layoutId="desktopNavActiveUnderline"
                        className="absolute left-2.5 right-2.5 xl:left-3 xl:right-3 -bottom-[3px] h-[2.5px] rounded-full bg-xf-gold"
                        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.8 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Inline search field (desktop) */}
          <button
            onClick={handleSearchClick}
            className="hidden lg:flex items-center gap-2 flex-1 max-w-[280px] xl:max-w-xs px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50 hover:border-white/20 hover:bg-white/10 transition-colors duration-200 text-left"
            aria-label="Open search"
            id="navbar-search-btn"
          >
            <Search size={16} className="shrink-0" />
            <span className="text-sm truncate">Search for movies, shows, anime...</span>
          </button>

          {/* Right section */}
          <div className="flex items-center gap-1.5 lg:ml-1">
            {/* Search (mobile/tablet icon-only) */}
            <button
              onClick={handleSearchClick}
              className="lg:hidden p-2 text-xf-muted hover:text-white transition-colors duration-200 rounded-full hover:bg-white/10"
              aria-label="Open search"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <div className="hidden sm:block relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className="relative p-2 text-xf-muted hover:text-white transition-colors duration-200 rounded-full hover:bg-white/10"
                aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
                aria-expanded={notifOpen}
              >
                <Bell size={20} />
                {/* Unread badge */}
                {unread > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-xf-red rounded-full flex items-center justify-center text-white text-[9px] font-bold leading-none">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <NotificationPanel onClose={() => setNotifOpen(false)} />
                )}
              </AnimatePresence>
            </div>

            {/* Profile / Auth */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 backdrop-blur-md border border-white/15 transition-all duration-200 group"
                  aria-label="Profile menu"
                  aria-expanded={profileOpen}
                  id="profile-menu-btn"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-sm border border-xf-gold/60"
                    style={{ backgroundColor: profile.avatarColor || '#F2B90B' }}
                  >
                    {(user.user_metadata?.display_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-xs font-semibold text-white max-w-[100px] truncate">
                    {user.user_metadata?.display_name || user.email?.split('@')[0]}
                  </span>
                  <motion.div
                    animate={{ rotate: profileOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={14} className="text-xf-muted group-hover:text-white" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <ProfileMenu
                      onClose={() => setProfileOpen(false)}
                      onNavigate={(path) => { navigate(path); setProfileOpen(false); }}
                    />
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-xf-gold hover:bg-xf-gold-hover active:scale-95 text-xs sm:text-sm font-bold text-black transition-all duration-200 shadow-sm"
              >
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {authModalOpen && <AuthModal onClose={() => setAuthModalOpen(false)} />}
      </AnimatePresence>
    </motion.nav>
  );
}

