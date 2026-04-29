import { useT } from '../i18n';

function getRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '...', current - 1, current, current + 1, '...', total];
}

export default function Pagination({ page, totalPages, onChange }) {
  const t = useT();
  const pages = getRange(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="px-4 py-2 rounded-lg text-sm text-gray-300 border border-[#7C3AED]/30 hover:border-[#7C3AED] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {t('pagination.prev')}
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="text-gray-600 px-1">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-9 h-9 rounded-lg text-sm transition-colors ${
              p === page
                ? 'bg-[#7C3AED] text-white'
                : 'text-gray-400 border border-[#7C3AED]/30 hover:border-[#7C3AED]'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="px-4 py-2 rounded-lg text-sm text-gray-300 border border-[#7C3AED]/30 hover:border-[#7C3AED] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        {t('pagination.next')}
      </button>
    </div>
  );
}
