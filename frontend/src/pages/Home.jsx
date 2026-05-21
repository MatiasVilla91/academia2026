import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useCourses from '../hooks/useCourses';
import useCategories from '../hooks/useCategories';
import CourseGrid from '../components/CourseGrid';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { getCategoryName, getCategoryEmoji, getCategoryDescription } from '../lib/categories';
import { SITE_NAME, SITE_URL } from '../lib/site';

const INITIAL_FILTERS = {
  search: '',
  category: '',
  minRating: '',
  minPrice: '',
  maxPrice: '',
  sort: 'newest',
  page: 1,
};

const META_TITLE = `${SITE_NAME} — Cursos Esotéricos en Español`;
const META_DESC = 'Encontrá tu próximo camino espiritual. Tarot, Reiki, Ángeles, Numerología y más — cursos seleccionados de Hotmart, todos en español, con acceso inmediato y garantía de devolución.';

export default function Home() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const { categories } = useCategories();

  const update = (partial) => setFilters((f) => ({ ...f, ...partial }));
  const clearAll = () => setFilters(INITIAL_FILTERS);

  const { items, total, totalPages, isLoading } = useCourses({
    ...filters,
    limit: 20,
  });

  return (
    <>
      <Helmet>
        <title>{META_TITLE}</title>
        <meta name="description" content={META_DESC} />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:title" content={META_TITLE} />
        <meta property="og:description" content={META_DESC} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
      </Helmet>

      <div className="bg-gradient-to-b from-[#251850] to-[#0F0A1E] pt-14 pb-10 text-center border-b border-[#7C3AED]/20">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-[#D4AF37] mb-4 tracking-wide">
            Academia Astral
          </h1>
          <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Encontrá tu próximo camino espiritual. Tarot, Reiki, Ángeles, Numerología y más — cursos seleccionados, todos en español.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="text-[#7C3AED]">✓</span>
              Acceso inmediato al comprar
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#7C3AED]">✓</span>
              Garantía de 7 días Hotmart
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#7C3AED]">✓</span>
              Todos los cursos en español
            </span>
          </div>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="bg-[#0D091A] border-b border-[#7C3AED]/15 py-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-display text-xl text-white">¿Qué querés aprender?</h2>
              <span className="text-xs text-gray-600 hidden sm:block">Hacé clic en un área para explorar sus cursos</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {categories.map(({ category, count }) => (
                <Link
                  key={category}
                  to={`/categoria/${category}`}
                  className="group bg-[#140D28] border border-[#7C3AED]/20 rounded-xl p-4 hover:border-[#7C3AED]/60 hover:bg-[#1A1030] transition-all text-left"
                >
                  <div className="text-2xl mb-2">{getCategoryEmoji(category)}</div>
                  <h3 className="text-white text-sm font-semibold mb-1 group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {getCategoryName(category)}
                  </h3>
                  <p className="text-gray-500 text-xs leading-snug line-clamp-2 mb-2">
                    {getCategoryDescription(category)}
                  </p>
                  <span className="text-xs text-[#7C3AED]/60">
                    {count} {count === 1 ? 'curso' : 'cursos'}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#7C3AED]/40 hover:border-[#7C3AED] text-gray-300 rounded-lg text-sm transition-colors"
          >
            <span>⚙</span>
            {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
            <span>{showFilters ? '▲' : '▼'}</span>
          </button>
          {showFilters && (
            <div className="mt-4">
              <FilterSidebar filters={filters} onChange={update} />
            </div>
          )}
        </div>

        <div className="flex gap-8">
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="sticky top-20">
              <FilterSidebar filters={filters} onChange={update} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
              <div>
                <p className="text-gray-500 text-sm">
                  {isLoading ? '…' : `${total} ${total === 1 ? 'curso' : 'cursos'}`}
                </p>
              </div>

              {filters.category && (
                <Link
                  to={`/categoria/${filters.category}`}
                  className="text-sm text-[#D4AF37] hover:text-white transition-colors"
                >
                  Ver categoría seleccionada
                </Link>
              )}
            </div>

            {isLoading ? (
              <Loading count={8} />
            ) : items.length === 0 ? (
              <EmptyState onClear={clearAll} />
            ) : (
              <>
                <CourseGrid courses={items} />
                {totalPages > 1 && (
                  <Pagination
                    page={filters.page}
                    totalPages={totalPages}
                    onChange={(p) => {
                      update({ page: p });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
