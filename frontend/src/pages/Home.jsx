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
import { getCategoryName } from '../lib/categories';
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
const META_DESC = 'Cursos esotéricos en español para expandir tu conciencia, explorar nuevas prácticas y encontrar tu próxima línea de estudio.';

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

      <div className="bg-gradient-to-b from-[#251850] to-[#0F0A1E] py-14 text-center border-b border-[#7C3AED]/20">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="font-display text-5xl md:text-6xl text-[#D4AF37] mb-3 tracking-wide">
            Academia Astral
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Cursos esotéricos en español para expandir tu conciencia, explorar nuevas prácticas y encontrar tu próxima línea de estudio.
          </p>

          {categories.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {categories.slice(0, 8).map((item) => (
                <Link
                  key={item.category}
                  to={`/categoria/${item.category}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/30 bg-[#140D28] px-3 py-1.5 text-sm text-gray-300 hover:border-[#7C3AED] hover:text-white transition-colors"
                >
                  <span>{getCategoryName(item.category)}</span>
                  <span className="text-xs text-gray-500">{item.count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

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
