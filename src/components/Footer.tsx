import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/8 bg-xf-bg">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" aria-label="BOOZO TV Home" className="flex items-center gap-2">
            <img src="/logo.png" alt="BOOZO TV" className="h-6 w-auto" />
            <span className="font-display font-black text-xl tracking-tighter">
              <span className="text-white">BOOZO</span>
              <span className="text-xf-gold"> TV</span>
            </span>
          </Link>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Link to="/legal" className="text-xf-subtle text-sm hover:text-white transition-colors">
              Legal & Privacy
            </Link>
            <p className="text-xf-subtle text-sm hidden sm:block">•</p>
            <p className="text-xf-subtle text-sm">
              © 2026 BOOZO TV. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
