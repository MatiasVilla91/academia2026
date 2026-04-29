import { Link } from 'react-router-dom';
import { useT } from '../i18n';

export default function EmptyState({ onClear }) {
  const t = useT();

  return (
    <div className="rounded-2xl border border-[#7C3AED]/20 bg-gradient-to-br from-[#1A1030] to-[#0F0A1E] px-6 py-16 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#7C3AED]/20 bg-[#140D28] text-4xl text-[#D4AF37]/70">
        ◌
      </div>
      <h3 className="font-display text-3xl text-[#D4AF37] mb-3">{t('empty.title')}</h3>
      <p className="text-gray-400 mb-8 max-w-xl mx-auto leading-relaxed">{t('empty.description')}</p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {onClear && (
          <button
            onClick={onClear}
            className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full transition-colors text-sm font-medium"
          >
            {t('empty.clearFilters')}
          </button>
        )}
        <Link
          to="/"
          className="px-6 py-2.5 border border-[#7C3AED]/30 hover:border-[#7C3AED] text-gray-300 hover:text-white rounded-full transition-colors text-sm"
        >
          {t('empty.backHome')}
        </Link>
      </div>
    </div>
  );
}
