import { useState, useEffect } from 'react';
import { fetchCourse } from '../lib/api';

export default function useCourse(slug) {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    setCourse(null);
    fetchCourse(slug)
      .then(setCourse)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [slug]);

  return { course, isLoading, error };
}
