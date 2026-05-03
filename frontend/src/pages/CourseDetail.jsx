import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useCourse from '../hooks/useCourse';
import useCourses from '../hooks/useCourses';
import CourseCard from '../components/CourseCard';
import { trackClick } from '../lib/api';
import { useLang, useT } from '../i18n';
import { getCourseImageSrc } from '../lib/courseImage';
import { SITE_URL } from '../lib/site';

const LANG_FLAGS = { es: 'ES', pt: 'PT', en: 'EN' };

function Stars({ rating, size = 'text-lg' }) {
  const filled = Math.round(rating || 0);
  return (
    <span className={`${size} inline-flex gap-0.5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= filled ? 'text-amber-400' : 'text-gray-700'}>★</span>
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
    </div>
  );
}

export default function CourseDetail() {
  const { slug } = useParams();
  const t = useT();
  const { lang } = useLang();
  const { course, isLoading, error } = useCourse(slug);
  const [imgError, setImgError] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
          ← {lang === 'es' ? 'Volver al catálogo' : 'Voltar ao catálogo'}
        </Link>
      </div>
    );
  }

  const metaDesc = course.description?.slice(0, 160) || course.title;
  const buyUrl = course.affiliateUrl || course.sourceUrl;
  const hasHighlights = Array.isArray(course.highlights) && course.highlights.length > 0;
  const hasInstructorBio = !!course.instructorBio;

  return (
    <>
      <Helmet>
        <title>{course.title} - Academia Astral</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`${SITE_URL}/curso/${slug}`} />
        {course.imageUrl && <meta property="og:image" content={course.imageUrl} />}
        <meta property="og:title" content={course.title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/curso/${slug}`} />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-[#1a0f3a] to-[#0F0A1E] border-b border-[#7C3AED]/20">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <Link
            to="/"
            className="text-gray-600 hover:text-[#D4AF37] text-sm transition-colors mb-8 inline-block"
          >
            ← {lang === 'es' ? 'Volver al catálogo' : 'Voltar ao catálogo'}
          </Link>

          <div className="flex flex-col md:flex-row gap-10 mt-2">
            {/* Imagen */}
            <div className="w-full md:w-80 flex-shrink-0">
              <img
                src={getCourseImageSrc(course, imgError)}
                alt={course.title}
                onError={() => setImgError(true)}
                className="w-full rounded-2xl border border-[#7C3AED]/30 object-cover aspect-square shadow-[0_0_60px_rgba(124,58,237,0.2)]"
                loading="eager"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {course.language && (
                  <span className="bg-[#251850] border border-[#7C3AED]/30 rounded-full px-3 py-1 text-xs text-gray-400">
                    {LANG_FLAGS[course.language] || course.language.toUpperCase()}
                  </span>
                )}
                <Link
                  to={`/categoria/${course.category}`}
                  className="rounded-full border border-[#7C3AED]/40 bg-[#7C3AED]/10 px-3 py-1 text-xs text-[#9D6FFC] hover:bg-[#7C3AED]/20 transition-colors"
                >
                  {t(`categories.${course.category}`)}
                </Link>
              </div>

              <h1 className="font-display text-3xl md:text-4xl text-white leading-tight mb-3">
                {course.title}
              </h1>

              {course.instructor && (
                <p className="text-gray-400 text-sm mb-5">
                  {t('course.by')} <span className="text-gray-200 font-medium">{course.instructor}</span>
                </p>
              )}

              <div className="flex items-center gap-3 mb-6 flex-wrap">
                {course.rating != null ? (
                  <>
                    <Stars rating={course.rating} size="text-xl" />
                    <span className="text-[#D4AF37] font-bold text-lg">{course.rating.toFixed(1)}</span>
                    {course.reviewsCount > 0 && (
                      <span className="text-gray-500 text-sm">
                        ({course.reviewsCount} {t('course.reviews')})
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-600 text-sm">{t('course.noRating')}</span>
                )}
              </div>

              {course.priceARS != null ? (
                <p className="text-3xl text-[#D4AF37] font-bold mb-6">
                  ARS {course.priceARS.toLocaleString('es-AR')}
                </p>
              ) : (
                <p className="text-gray-500 text-base mb-6">{t('course.consultPrice')}</p>
              )}

              <button
                onClick={handleBuy}
                disabled={!buyUrl}
                className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] text-lg mb-3"
              >
                {t('course.buyNow')}
              </button>

              <p className="text-center text-gray-600 text-xs flex items-center justify-center gap-1.5">
                🔒 {t('course.guaranteeBadge')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">

        {/* ── QUÉ VAS A APRENDER ───────────────────────────────── */}
        {hasHighlights && (
          <section className="py-14 border-b border-[#7C3AED]/10">
            <h2 className="font-display text-2xl text-[#D4AF37] mb-8">{t('course.whatYouLearn')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-[#140D28] border border-[#7C3AED]/20 rounded-xl p-4"
                >
                  <span className="text-[#7C3AED] font-bold text-base mt-0.5 flex-shrink-0">✓</span>
                  <p className="text-gray-200 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── DESCRIPCIÓN ──────────────────────────────────────── */}
        {course.description && (
          <section className="py-14 border-b border-[#7C3AED]/10">
            <h2 className="font-display text-2xl text-[#D4AF37] mb-5">{t('course.description')}</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-base">
              {course.description}
            </p>
          </section>
        )}

        {/* ── INSTRUCTOR ───────────────────────────────────────── */}
        {hasInstructorBio && (
          <section className="py-14 border-b border-[#7C3AED]/10">
            <h2 className="font-display text-2xl text-[#D4AF37] mb-6">{t('course.aboutInstructor')}</h2>
            <div className="bg-[#140D28] border border-[#7C3AED]/20 rounded-2xl p-6 flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-16 h-16 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center flex-shrink-0 text-2xl">
                ✨
              </div>
              <div>
                <p className="text-white font-semibold text-lg mb-2">{course.instructor}</p>
                <p className="text-gray-400 leading-relaxed text-sm">{course.instructorBio}</p>
              </div>
            </div>
          </section>
        )}

        {/* ── GARANTÍA ─────────────────────────────────────────── */}
        <section className="py-14 border-b border-[#7C3AED]/10">
          <div className="bg-gradient-to-r from-[#140D28] to-[#1a0f3a] border border-[#D4AF37]/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center">
            <div className="text-5xl flex-shrink-0">🛡️</div>
            <div>
              <h3 className="font-display text-xl text-[#D4AF37] mb-2">{t('course.guaranteeTitle')}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t('course.guaranteeText')}</p>
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────────── */}
        <section className="py-14 border-b border-[#7C3AED]/10">
          <div className="text-center">
            <h2 className="font-display text-2xl md:text-3xl text-white mb-3">
              {t('course.readyToStart')}
            </h2>
            {course.priceARS != null && (
              <p className="text-[#D4AF37] text-3xl font-bold mb-6">
                ARS {course.priceARS.toLocaleString('es-AR')}
              </p>
            )}
            <button
              onClick={handleBuy}
              disabled={!buyUrl}
              className="px-10 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] text-lg"
            >
              {t('course.buyNow')}
            </button>
            <p className="text-gray-600 text-xs mt-3 flex items-center justify-center gap-1.5">
              🔒 {t('course.guaranteeBadge')}
            </p>
          </div>
        </section>

        {/* ── CURSOS RELACIONADOS ───────────────────────────────── */}
        {relatedCourses.length > 0 && (
          <section className="py-14">
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

      {/* ── STICKY CTA MOBILE ────────────────────────────────── */}
      {showSticky && buyUrl && (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0F0A1E]/95 backdrop-blur-sm border-t border-[#7C3AED]/30 px-4 py-3 flex items-center gap-3">
          {course.priceARS != null && (
            <span className="text-[#D4AF37] font-bold text-base flex-shrink-0">
              ARS {course.priceARS.toLocaleString('es-AR')}
            </span>
          )}
          <button
            onClick={handleBuy}
            className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold rounded-xl transition-all text-sm"
          >
            {t('course.buyNow')}
          </button>
        </div>
      )}
    </>
  );
}
