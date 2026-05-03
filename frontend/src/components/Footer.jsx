import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#140D28] border-t border-[#7C3AED]/30 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <span className="text-[#D4AF37] text-2xl">✦</span>
        <p className="font-display text-[#D4AF37] text-xl mt-2 mb-1">Academia Astral</p>
        <p className="text-gray-600 text-sm mb-4">© {new Date().getFullYear()} Todos los derechos reservados.</p>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-gray-500">
          <Link to="/politica-privacidad" className="hover:text-[#D4AF37] transition-colors">
            Política de Privacidad
          </Link>
          <Link to="/politica-cookies" className="hover:text-[#D4AF37] transition-colors">
            Política de Cookies
          </Link>
          <Link to="/terminos" className="hover:text-[#D4AF37] transition-colors">
            Términos y Condiciones
          </Link>
        </nav>
        <p className="text-gray-700 text-xs mt-4">
          Sitio de afiliados — los enlaces a cursos son links de afiliado de Hotmart.
        </p>
      </div>
    </footer>
  );
}
