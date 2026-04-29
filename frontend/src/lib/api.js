import localCatalog from './localCatalog';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');
const USE_LOCAL_CATALOG = import.meta.env.DEV || import.meta.env.VITE_USE_LOCAL_CATALOG === '1';

function sortCourses(items, sort) {
  const sorted = [...items];
  if (sort === 'rating') return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sort === 'clicks') return sorted.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
  return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getFallbackCourses(params = {}) {
  const {
    search = '',
    category = '',
    language = '',
    minRating = '',
    minPrice = '',
    maxPrice = '',
    sort = 'newest',
    page = 1,
    limit = 20,
  } = params;

  const query = search.trim().toLowerCase();
  const minRatingValue = minRating === '' ? null : Number(minRating);
  const minPriceValue = minPrice === '' ? null : Number(minPrice);
  const maxPriceValue = maxPrice === '' ? null : Number(maxPrice);

  const filtered = localCatalog
    .filter(
      (course) =>
        !query ||
        course.title.toLowerCase().includes(query) ||
        (course.instructor || '').toLowerCase().includes(query)
    )
    .filter((course) => !category || course.category === category)
    .filter((course) => !language || course.language === language)
    .filter((course) => minRatingValue == null || (course.rating || 0) >= minRatingValue)
    .filter((course) => minPriceValue == null || (course.priceARS != null && course.priceARS >= minPriceValue))
    .filter((course) => maxPriceValue == null || (course.priceARS != null && course.priceARS <= maxPriceValue));

  const sorted = sortCourses(filtered, sort);
  const total = sorted.length;
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = Math.max(1, Number(limit) || 20);
  const start = (currentPage - 1) * pageSize;

  return {
    items: sorted.slice(start, start + pageSize),
    page: currentPage,
    limit: pageSize,
    total,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
}

function getFallbackCategories(params = {}) {
  const { language = '' } = params;
  const counts = new Map();

  for (const course of localCatalog) {
    if (language && course.language !== language) continue;
    counts.set(course.category, (counts.get(course.category) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export async function fetchCourses(params = {}) {
  if (USE_LOCAL_CATALOG) {
    return getFallbackCourses(params);
  }

  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) qs.set(k, String(v));
  });

  try {
    const res = await fetch(`${API_BASE}/courses?${qs}`);
    if (!res.ok) throw new Error('Error fetching courses');
    return res.json();
  } catch {
    return getFallbackCourses(params);
  }
}

export async function fetchCourse(slug) {
  if (USE_LOCAL_CATALOG) {
    const course = localCatalog.find((item) => item.slug === slug);
    if (!course) throw new Error('Curso no encontrado');
    return course;
  }

  try {
    const res = await fetch(`${API_BASE}/courses/${slug}`);
    if (!res.ok) throw new Error('Curso no encontrado');
    return res.json();
  } catch {
    const course = localCatalog.find((item) => item.slug === slug);
    if (!course) throw new Error('Curso no encontrado');
    return course;
  }
}

export async function fetchCategories(params = {}) {
  if (USE_LOCAL_CATALOG) {
    return getFallbackCategories(params);
  }

  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) qs.set(k, String(v));
  });

  try {
    const res = await fetch(`${API_BASE}/categories?${qs}`);
    if (!res.ok) throw new Error('Error fetching categories');
    return res.json();
  } catch {
    return getFallbackCategories(params);
  }
}

export function trackClick(hotmartId) {
  if (USE_LOCAL_CATALOG) return;
  fetch(`${API_BASE}/courses/${hotmartId}/click`, { method: 'POST' }).catch(() => {});
}
