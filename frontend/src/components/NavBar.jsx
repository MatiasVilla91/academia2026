import { Link, NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="bg-[#140D28] border-b border-[#7C3AED]/30 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-[#D4AF37] text-xl group-hover:scale-110 transition-transform">✦</span>
          <span className="font-display text-xl text-[#D4AF37] tracking-wide">Academia Astral</span>
        </Link>
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-white'}`
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `text-sm transition-colors ${isActive ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-white'}`
            }
          >
            Blog
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
