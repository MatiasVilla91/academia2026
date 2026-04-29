import { Link } from 'react-router-dom';
import { useT } from '../i18n';

export default function NotFound() {
  const t = useT();

  return (
    <div className="min-h-[70vh] px-4 py-16 flex items-center justify-center">
      <div className="w-full max-w-3xl rounded-3xl border border-[#7C3AED]/20 bg-gradient-to-br from-[#1A1030] to-[#0F0A1E] p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.35),_transparent_45%)]" />
        <div className="relative">
          <div className="text-7xl md:text-8xl mb-4 font-display text-[#D4AF37]/80">✦</div>
          <p className="text-xs uppercase tracking-[0.22em] text-gray-500 mb-3">{t('notFound.kicker')}</p>
          <h1 className="font-display text-5xl md:text-6xl text-[#D4AF37] mb-4">{t('notFound.title')}</h1>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed">{t('notFound.message')}</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/"
              className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl transition-colors font-medium"
            >
              {t('notFound.back')}
            </Link>
            <Link
              to="/categoria/tarot"
              className="px-6 py-3 border border-[#7C3AED]/30 hover:border-[#7C3AED] text-gray-300 hover:text-white rounded-xl transition-colors"
            >
              {t('notFound.explore')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
