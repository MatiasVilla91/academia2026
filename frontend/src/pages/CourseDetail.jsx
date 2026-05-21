import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useCourse from '../hooks/useCourse';
import useCourses from '../hooks/useCourses';
import CourseCard from '../components/CourseCard';
import { trackClick } from '../lib/api';
import { getCategoryName } from '../lib/categories';
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

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  const bodyRef = useRef(null);
  return (
    <div className="border-b border-[#7C3AED]/15 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left py-4 flex items-center justify-between gap-4 group"
        aria-expanded={open}
      >
        <span className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors">{question}</span>
        <span
          className={`text-[#7C3AED] flex-shrink-0 text-lg leading-none transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          ▾
        </span>
      </button>
      <div
        ref={bodyRef}
        className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-48 pb-4' : 'max-h-0'}`}
      >
        <p className="text-gray-400 text-sm leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

const FAQS = [
  {
    question: '¿Necesito experiencia previa?',
    answer:
      'No. El contenido está pensado para que puedas comenzar desde cero. No necesitás conocimientos previos para aprovechar al máximo el curso.',
  },
  {
    question: '¿Cuándo puedo empezar?',
    answer:
      'Al instante. Una vez que completás el pago, Hotmart te envía un email con los datos de acceso. En minutos ya podés estar viendo el contenido.',
  },
  {
    question: '¿El pago es seguro?',
    answer:
      'Sí. El pago se procesa a través de Hotmart, la plataforma líder de educación online en América Latina, con encriptación SSL y múltiples medios de pago disponibles.',
  },
  {
    question: '¿Qué pasa si no me gusta el curso?',
    answer:
      'Tenés 7 días de garantía sin preguntas. Si dentro de los primeros 7 días no estás satisfecho/a, Hotmart te reintegra el dinero completo, sin burocracia.',
  },
  {
    question: '¿Por cuánto tiempo tengo acceso?',
    answer:
      'Podés ver el contenido a tu ritmo, cuando quieras, desde cualquier dispositivo. El acceso es prolongado y no vence en el corto plazo.',
  },
];

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
    limit: 5,
    sort: 'rating',
    enabled: !!course?.category,
  });

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
          ← Volver al catálogo
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
            ← Volver al catálogo
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
                  {getCategoryName(course.category)}
                </Link>
              </div>

              <h1 className="font-display text-3xl md:text-4xl text-white leading-tight mb-3">
                {course.title}
              </h1>

              {course.tagline && (
                <p className="text-[#B48FE8] text-sm md:text-base leading-relaxed mb-4 font-medium">
                  {course.tagline}
                </p>
              )}

              {course.instructor && (
                <p className="text-gray-400 text-sm mb-5">
                  por <span className="text-gray-200 font-medium">{course.instructor}</span>
                </p>
              )}

              <div className="flex items-center gap-3 mb-4 flex-wrap">
                {course.rating != null && (
                  <>
                    <Stars rating={course.rating} size="text-xl" />
                    <span className="text-[#D4AF37] font-bold text-lg">{course.rating.toFixed(1)}</span>
                    {course.reviewsCount > 0 && (
                      <span className="text-gray-500 text-sm">
                        ({course.reviewsCount} reseñas)
                      </span>
                    )}
                  </>
                )}
              </div>

              {course.reviewsCount >= 10 && (
                <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-2.5 mb-5 w-fit">
                  <span className="text-amber-400 text-sm">⭐</span>
                  <span className="text-amber-300 text-xs font-medium">
                    {course.reviewsCount} estudiantes lo valoraron con {course.rating?.toFixed(1)} estrellas
                  </span>
                </div>
              )}

              {course.priceARS != null ? (
                <p className="text-3xl text-[#D4AF37] font-bold mb-6">
                  ARS {course.priceARS.toLocaleString('es-AR')}
                </p>
              ) : (
                <p className="text-gray-500 text-base mb-6">Precio a consultar</p>
              )}

              <button
                onClick={handleBuy}
                disabled={!buyUrl}
                className="w-full py-4 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] text-lg mb-3"
              >
                Quiero este curso
              </button>

              <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mt-1">
                <span className="text-emerald-400 text-xs font-medium">🔒 Pago seguro</span>
                <span className="text-[#9D6FFC] text-xs font-medium">⚡ Acceso inmediato</span>
                <span className="text-[#D4AF37] text-xs font-medium">↩ Garantía 7 días</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">

        {/* ── QUÉ VAS A APRENDER ───────────────────────────────── */}
        {hasHighlights && (
          <section className="py-14 border-b border-[#7C3AED]/10">
            <h2 className="font-display text-2xl text-[#D4AF37] mb-8">Qué vas a aprender</h2>
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

        {/* ── PARA QUIÉN ES ────────────────────────────────────── */}
        {Array.isArray(course.targetAudience) && course.targetAudience.length > 0 && (
          <section className="py-14 border-b border-[#7C3AED]/10">
            <h2 className="font-display text-2xl text-[#D4AF37] mb-2">¿Para quién es este curso?</h2>
            <p className="text-gray-500 text-sm mb-7">Este curso es para vos si...</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {course.targetAudience.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-[#0F0A1E] border border-[#7C3AED]/15 rounded-xl p-4"
                >
                  <span className="text-[#D4AF37] font-bold text-sm mt-0.5 flex-shrink-0">→</span>
                  <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── LO QUE INCLUYE ───────────────────────────────────── */}
        {Array.isArray(course.includes) && course.includes.length > 0 && (
          <section className="py-14 border-b border-[#7C3AED]/10">
            <h2 className="font-display text-2xl text-[#D4AF37] mb-7">Lo que recibís</h2>
            <div className="bg-[#140D28] border border-[#7C3AED]/20 rounded-2xl p-6">
              <ul className="space-y-4">
                {course.includes.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-200 text-sm">
                    <span className="w-6 h-6 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center flex-shrink-0 text-[#9D6FFC] text-xs font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ── DESCRIPCIÓN ──────────────────────────────────────── */}
        {course.description && (
          <section className="py-14 border-b border-[#7C3AED]/10">
            <h2 className="font-display text-2xl text-[#D4AF37] mb-5">Descripción</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-base">
              {course.description}
            </p>
          </section>
        )}

        {/* ── INSTRUCTOR ───────────────────────────────────────── */}
        {hasInstructorBio && (
          <section className="py-14 border-b border-[#7C3AED]/10">
            <h2 className="font-display text-2xl text-[#D4AF37] mb-6">Sobre el instructor</h2>
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

        {/* ── TESTIMONIOS ──────────────────────────────────────── */}
        {Array.isArray(course.testimonials) && course.testimonials.length > 0 && (
          <section className="py-14 border-b border-[#7C3AED]/10">
            <h2 className="font-display text-2xl text-[#D4AF37] mb-2">Lo que dicen los estudiantes</h2>
            <p className="text-gray-500 text-sm mb-8">Opiniones de personas que ya hicieron el curso.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {course.testimonials.map((t, i) => (
                <div key={i} className="bg-[#140D28] border border-[#7C3AED]/20 rounded-2xl p-6 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Stars rating={t.rating} size="text-base" />
                    <span className="text-amber-400 text-sm font-semibold">{t.rating}.0</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed italic">"{t.text}"</p>
                  <p className="text-gray-500 text-xs font-medium">— {t.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── GARANTÍA ─────────────────────────────────────────── */}
        <section className="py-14 border-b border-[#7C3AED]/10">
          <div className="bg-gradient-to-r from-[#140D28] to-[#1a0f3a] border border-[#D4AF37]/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-center">
            <div className="text-5xl flex-shrink-0">🛡️</div>
            <div>
              <h3 className="font-display text-xl text-[#D4AF37] mb-2">Garantía de 7 días</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Comprás con total confianza. Si dentro de los primeros 7 días no estás satisfecho/a con el curso, Hotmart te reintegra el dinero sin preguntas.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────── */}
        <section className="py-14 border-b border-[#7C3AED]/10">
          <h2 className="font-display text-2xl text-[#D4AF37] mb-2">Preguntas frecuentes</h2>
          <p className="text-gray-500 text-sm mb-8">Todo lo que necesitás saber antes de inscribirte.</p>
          <div className="bg-[#140D28] border border-[#7C3AED]/20 rounded-2xl px-6">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        {/* ── CTA FINAL ────────────────────────────────────────── */}
        <section className="py-14 border-b border-[#7C3AED]/10">
          <div className="text-center">
            <h2 className="font-display text-2xl md:text-3xl text-white mb-2">
              ¿Listo/a para comenzar?
            </h2>
            <p className="text-gray-500 text-sm mb-6">Accedés al instante. Aprendé a tu ritmo, cuando quieras.</p>
            {course.priceARS != null && (
              <p className="text-[#D4AF37] text-4xl font-bold mb-6">
                ARS {course.priceARS.toLocaleString('es-AR')}
              </p>
            )}
            <button
              onClick={handleBuy}
              disabled={!buyUrl}
              className="px-10 py-4 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:shadow-[0_0_60px_rgba(124,58,237,0.6)] text-lg"
            >
              Quiero este curso →
            </button>
            <p className="text-gray-500 text-xs mt-3">
              Sin riesgo — si en 7 días no es lo que esperabas, Hotmart te devuelve el dinero completo.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-3">
              <span className="text-emerald-400 text-xs font-medium">🔒 Pago seguro</span>
              <span className="text-[#9D6FFC] text-xs font-medium">⚡ Acceso inmediato</span>
              <span className="text-[#D4AF37] text-xs font-medium">↩ Garantía de 7 días</span>
            </div>
          </div>
        </section>

        {/* ── CURSOS RELACIONADOS ───────────────────────────────── */}
        {relatedCourses.length > 0 && (
          <section className="py-14">
            <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
              <h2 className="font-display text-2xl text-[#D4AF37]">Cursos relacionados</h2>
              <Link
                to={`/categoria/${course.category}`}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Explorar categoría
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
            Quiero este curso
          </button>
        </div>
      )}
    </>
  );
}
