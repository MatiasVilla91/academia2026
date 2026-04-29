import { useState, useEffect } from 'react';
import { fetchCourses } from '../lib/api';

export default function useCourses({
  search = '',
  category = '',
  language = '',
  minRating = '',
  minPrice = '',
  maxPrice = '',
  sort = 'newest',
  page = 1,
  limit = 20,
  enabled = true,
} = {}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    fetchCourses({ search, category, language, minRating, minPrice, maxPrice, sort, page, limit })
      .then((data) => {
        setItems(data.items || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [enabled, search, category, language, minRating, minPrice, maxPrice, sort, page, limit]);

  return { items, total, totalPages, isLoading, error };
}
