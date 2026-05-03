import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useCourses from '../hooks/useCourses';
import useCategories from '../hooks/useCategories';
import CourseGrid from '../components/CourseGrid';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { useLang, useT } from '../i18n';
import { SITE_NAME, SITE_URL } from '../lib/site';

export default function CategoryPage() {
  const { category } = useParams();
  const t = useT();
  const { lang } = useLang();
  const [page, setPage] = useState(1);
  const { categories } = useCategories({ language: lang });

  const { items, total, totalPages, isLoading } = useCourses({
    category,
    language: lang,
    page,
    limit: 20,
    sort: 'rating',
  });

  const siblingCategories = categories.filter((item) => item.category !== category).slice(0, 6);

  const categoryName = t(`categories.${category}`);
  const canonicalUrl = `${SITE_URL}/categoria/${category}`;
  const metaTitle = `${categoryName} — Cursos en Español | ${SITE_NAME}`;
  const metaDesc = `Explorá los mejores cursos de ${categoryName} en español. Encontrá tu próximo curso en ${SITE_NAME}.`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>
      <div className="mb-10 rounded-2xl border border-[#7C3AED]/20 bg-gradient-to-br from-[#1A1030] to-[#0F0A1E] p-6 md:p-8">
        <Link to="/" className="text-gray-600 hover:text-[#D4AF37] text-sm transition-colors">
          ← {lang === 'es' ? 'Inicio' : 'Início'}
        </Link>

        <div className="mt-4 flex items-start justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <p className="text-gray-500 text-xs uppercase tracking-[0.18em] mb-3">
              {lang === 'es' ? 'Categoría' : 'Categoria'}
            </p>
            <h1 className="font-display text-3xl md:text-5xl text-[#D4AF37]">
              {t(`categories.${category}`)}
            </h1>
            {!isLoading && (
              <p className="text-gray-400 text-sm mt-3">
                {lang === 'es'
                  ? `${total} ${total === 1 ? 'curso disponible' : 'cursos disponibles'} en español dentro de esta línea de estudio.`
                  : `${total} ${total === 1 ? 'curso disponível' : 'cursos disponíveis'} em português dentro desta linha de estudo.`}
              </p>
            )}
          </div>

          <div className="min-w-[220px] rounded-xl border border-[#7C3AED]/20 bg-[#140D28] p-4">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">
              {lang === 'es' ? 'Explorar también' : 'Explorar também'}
            </p>
            <div className="flex flex-wrap gap-2">
              {siblingCategories.map((item) => (
                <Link
                  key={item.category}
                  to={`/categoria/${item.category}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/20 px-3 py-1.5 text-xs text-gray-300 hover:border-[#7C3AED] hover:text-white transition-colors"
                >
                  <span>{t(`categories.${item.category}`)}</span>
                  <span className="text-gray-500">{item.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Loading count={8} />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <CourseGrid courses={items} />
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
