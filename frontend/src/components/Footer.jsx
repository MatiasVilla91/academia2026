import { useLang } from '../i18n';

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="bg-[#140D28] border-t border-[#7C3AED]/30 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <span className="text-[#D4AF37] text-2xl">✦</span>
        <p className="font-display text-[#D4AF37] text-xl mt-2 mb-1">
          {lang === 'es' ? 'Academia Astral Español' : 'Academia Astral Português'}
        </p>
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()}{' '}
          {lang === 'es' ? 'Todos los derechos reservados.' : 'Todos os direitos reservados.'}
        </p>
      </div>
    </footer>
  );
}
