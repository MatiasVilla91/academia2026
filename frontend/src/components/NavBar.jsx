import { Link, NavLink } from 'react-router-dom';
import { useLang, useT } from '../i18n';

export default function NavBar() {
  const t = useT();
  const { lang } = useLang();

  return (
    <nav className="bg-[#140D28] border-b border-[#7C3AED]/30 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-[#D4AF37] text-xl group-hover:scale-110 transition-transform">✦</span>
          <span className="font-display text-xl text-[#D4AF37] tracking-wide">
            {lang === 'es' ? 'Academia Astral ES' : 'Academia Astral PT'}
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm transition-colors ${
                isActive ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            {t('nav.home')}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
