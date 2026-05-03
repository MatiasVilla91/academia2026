import { useState, useEffect } from 'react';
import { fetchCategories } from '../lib/api';

export default function useCategories(params = {}) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchCategories(params)
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setIsLoading(false));
  }, []);

  return { categories, isLoading };
}
