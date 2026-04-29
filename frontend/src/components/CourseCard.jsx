import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useT } from '../i18n';
import { getCourseImageSrc } from '../lib/courseImage';

const LANG_FLAGS = { es: 'ES', pt: 'PT', en: 'EN' };

function Stars({ rating }) {
  const filled = Math.round(rating || 0);
  return (
    <span>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= filled ? 'text-amber-400' : 'text-gray-700'}>
          *
        </span>
      ))}
    </span>
  );
}

function MetaBadge({ children, tone = 'default' }) {
  const toneMap = {
    default: 'border-[#7C3AED]/30 bg-[#251850] text-gray-300',
    warn: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    muted: 'border-white/10 bg-white/5 text-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] leading-none ${toneMap[tone]}`}
    >
      {children}
    </span>
  );
}

export default function CourseCard({ course }) {
  const t = useT();
  const [imgError, setImgError] = useState(false);

  const hasRating = course.rating != null;
  const hasReviews = course.reviewsCount > 0;
  const hasPrice = course.priceARS != null;

  return (
    <Link
      to={`/curso/${course.slug}`}
      className="group bg-[#1A1030] rounded-xl overflow-hidden border border-[#7C3AED]/30 hover:border-[#7C3AED] transition-all hover:shadow-[0_0_24px_rgba(124,58,237,0.25)] flex flex-col focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/60"
    >
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <img
          src={getCourseImageSrc(course, imgError)}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          onError={() => setImgError(true)}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2">
          <MetaBadge>{t(`categories.${course.category}`)}</MetaBadge>
          {course.language && (
            <MetaBadge tone="muted">
              {LANG_FLAGS[course.language] || course.language.toUpperCase()}
            </MetaBadge>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3 mb-2">
          {course.workloadHours > 0 ? (
            <p className="text-xs text-gray-500">
              {course.workloadHours} {t('course.hours')}
            </p>
          ) : (
            <p className="text-xs text-gray-600">{t('course.noWorkload')}</p>
          )}

          {!hasPrice && <MetaBadge tone="warn">{t('course.noPrice')}</MetaBadge>}
        </div>

        <h3 className="font-display text-[#D4AF37] text-lg leading-snug mb-1 line-clamp-2 min-h-[3.5rem] group-hover:text-[#E6C86A] transition-colors">
          {course.title}
        </h3>

        {course.instructor && (
          <p className="text-gray-500 text-xs mb-3 line-clamp-1">
            {t('course.by')} {course.instructor}
          </p>
        )}

        <div className="flex items-center gap-2 mb-3 flex-wrap min-h-[1.5rem]">
          {hasRating ? (
            <>
              <Stars rating={course.rating} />
              <span className="text-gray-500 text-xs">({course.rating.toFixed(1)})</span>
              {hasReviews ? (
                <span className="text-gray-600 text-xs">
                  {course.reviewsCount} {t('course.reviews')}
                </span>
              ) : (
                <MetaBadge tone="muted">{t('course.noReviews')}</MetaBadge>
              )}
            </>
          ) : (
            <MetaBadge tone="warn">{t('course.noRating')}</MetaBadge>
          )}
        </div>

        {course.description && (
          <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4 min-h-[4rem]">
            {course.description}
          </p>
        )}

        <div className="mt-auto pt-2 border-t border-white/5">
          {hasPrice ? (
            <p className="text-[#D4AF37] text-sm font-medium mb-4">
              ARS {course.priceARS.toLocaleString('es-AR')}
            </p>
          ) : (
            <p className="text-gray-500 text-sm mb-4">{t('course.consultPrice')}</p>
          )}

          <div className="block w-full text-center py-2 bg-[#7C3AED] group-hover:bg-[#6D28D9] text-white rounded-lg transition-colors text-sm font-medium">
            {t('course.viewCourse')}
          </div>
        </div>
      </div>
    </Link>
  );
}
