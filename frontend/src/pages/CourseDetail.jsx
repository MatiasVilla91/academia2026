import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useCourse from '../hooks/useCourse';
import useCourses from '../hooks/useCourses';
import CourseCard from '../components/CourseCard';
import { trackClick } from '../lib/api';
import { useLang, useT } from '../i18n';
import { getCourseImageSrc } from '../lib/courseImage';

const LANG_FLAGS = { es: 'ES', pt: 'PT', en: 'EN' };

function Stars({ rating, size = 'text-lg' }) {
  const filled = Math.round(rating || 0);
  return (
    <span className={size}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= filled ? 'text-amber-400' : 'text-gray-700'}>
          *
        </span>
      ))}
    </span>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 animate-pulse space-y-6">
      <div className="h-8 bg-[#251850] rounded w-2/3" />
      <div className="h-5 bg-[#251850] rounded w-1/3" />
      <div className="h-64 bg-[#251850] rounded" />
      <div className="h-5 bg-[#251850] rounded" />
      <div className="h-5 bg-[#251850] rounded w-4/5" />
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-[#7C3AED]/20 bg-[#140D28] p-4">
      <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">{label}</p>
      <p className="text-sm text-gray-200">{value}</p>
    </div>
  );
}

export default function CourseDetail() {
  const { slug } = useParams();
  const t = useT();
  const { lang } = useLang();
  const { course, isLoading, error } = useCourse(slug);
  const [imgError, setImgError] = useState(false);

  const { items: related } = useCourses({
    category: course?.category || '',
    language: lang,
    limit: 5,
    sort: 'rating',
    enabled: !!course?.category,
  });

  if (!isLoading && course && course.language !== lang) {
    return <Navigate to="/" replace />;
  }

  const relatedCourses = related.filter((c) => c._id !== course?._id).slice(0, 4);

  const handleBuy = () => {
    if (course.hotmartId) trackClick(course.hotmartId);
    const url = course.affiliateUrl || course.sourceUrl;
    if (url) window.open(url, '_blank');
  };

  if (isLoading) return <DetailSkeleton />;

  if (error || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500">Curso no encontrado.</p>
        <Link to="/" className="mt-4 inline-block text-[#7C3AED] hover:text-[#9D6FFC] text-sm">
          {'<-'} {lang === 'es' ? 'Volver al catalogo' : 'Voltar ao catalogo'}
        </Link>
      </div>
    );
  }

  const metaDesc = course.description?.slice(0, 160) || course.title;
  const buyUrl = course.affiliateUrl || course.sourceUrl;

  return (
    <>
      <Helmet>
        <title>{course.title} - Academia Astral</title>
        <meta name="description" content={metaDesc} />
        {course.imageUrl && <meta property="og:image" content={course.imageUrl} />}
        <meta property="og:title" content={course.title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-gradient-to-b from-[#251850] to-[#0F0A1E] border-b border-[#7C3AED]/20">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Link
            to="/"
            className="text-gray-600 hover:text-[#D4AF37] text-sm transition-colors mb-8 inline-block"
          >
            {'<-'} {lang === 'es' ? 'Volver al catalogo' : 'Voltar ao catalogo'}
          </Link>

          <div className="flex flex-col md:flex-row gap-10 mt-2">
            <div className="w-full md:w-80 flex-shrink-0">
              <img
                src={getCourseImageSrc(course, imgError)}
                alt={course.title}
                onError={() => setImgError(true)}
                className="w-full rounded-xl border border-[#7C3AED]/30 object-cover aspect-square"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {course.language && (
                  <span className="inline-flex items-center gap-1 self-start bg-[#251850] border border-[#7C3AED]/30 rounded-full px-3 py-1 text-xs text-gray-400">
                    {LANG_FLAGS[course.language] || course.language.toUpperCase()}
                  </span>
                )}
                <Link
                  to={`/categoria/${course.category}`}
                  className="inline-flex items-center rounded-full border border-[#7C3AED]/30 bg-[#251850] px-3 py-1 text-xs text-gray-300 hover:border-[#7C3AED] hover:text-white transition-colors"
                >
                  {t(`categories.${course.category}`)}
                </Link>
                {course.workloadHours > 0 && (
                  <span className="inline-flex items-center rounded-full border border-[#7C3AED]/30 bg-[#251850] px-3 py-1 text-xs text-gray-300">
                    {course.workloadHours} {t('course.hours')}
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-4xl text-[#D4AF37] leading-tight mb-3">
                {course.title}
              </h1>

              {course.instructor && (
                <p className="text-gray-400 text-sm mb-4">
                  {t('course.by')} <span className="text-gray-200">{course.instructor}</span>
                </p>
              )}

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {course.rating != null ? (
                  <>
                    <Stars rating={course.rating} size="text-xl" />
                    <span className="text-[#D4AF37] font-medium">{course.rating.toFixed(1)}</span>
                  </>
                ) : (
                  <span className="text-gray-600 text-sm">{t('course.noRating')}</span>
                )}
                {course.reviewsCount > 0 ? (
                  <span className="text-gray-600 text-sm">
                    {course.reviewsCount} {t('course.reviews')}
                  </span>
                ) : (
                  <span className="text-gray-600 text-sm">{t('course.noReviews')}</span>
                )}
              </div>

              {course.priceARS != null ? (
                <p className="text-2xl text-[#D4AF37] font-medium mb-6">
                  ARS {course.priceARS.toLocaleString('es-AR')}
                </p>
              ) : (
                <p className="text-gray-500 text-base mb-6">{t('course.consultPrice')}</p>
              )}

              <div className="mt-auto">
                <button
                  onClick={handleBuy}
                  disabled={!buyUrl}
                  className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all shadow-[0_0_30px_rgba(124,58,237,0.35)] hover:shadow-[0_0_45px_rgba(124,58,237,0.55)] text-lg"
                >
                  {t('course.buy')}
                </button>
                {!buyUrl && (
                  <p className="text-gray-600 text-xs text-center mt-2">{t('course.noUrl')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <section className="mb-14">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <h2 className="font-display text-2xl text-[#D4AF37]">{t('course.dataTitle')}</h2>
            <Link
              to={`/categoria/${course.category}`}
              className="text-sm text-[#D4AF37] hover:text-white transition-colors"
            >
              {t('course.moreFromCategory')}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <DetailItem label={t('course.dataCategory')} value={t(`categories.${course.category}`)} />
            <DetailItem
              label={t('course.dataLanguage')}
              value={
                course.language
                  ? `${LANG_FLAGS[course.language] || course.language.toUpperCase()}`
                  : t('course.notAvailable')
              }
            />
            <DetailItem
              label={t('course.dataWorkload')}
              value={
                course.workloadHours > 0
                  ? `${course.workloadHours} ${t('course.hours')}`
                  : t('course.noWorkload')
              }
            />
            <DetailItem
              label={t('course.dataSource')}
              value={course.hotmartId || t('course.notAvailable')}
            />
          </div>
        </section>

        {course.description && (
          <section className="mb-14">
            <h2 className="font-display text-2xl text-[#D4AF37] mb-5">{t('course.description')}</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{course.description}</p>
          </section>
        )}

        {relatedCourses.length > 0 && (
          <section>
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <h2 className="font-display text-2xl text-[#D4AF37]">{t('course.relatedCourses')}</h2>
              <Link
                to={`/categoria/${course.category}`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {t('course.seeCategory')}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCourses.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
