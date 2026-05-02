const SITE_LANG = import.meta.env.VITE_SITE_LANG === 'pt' ? 'pt' : 'es';
const DEFAULT_SITE_URL =
  SITE_LANG === 'pt' ? 'https://pt.academia-astral.com' : 'https://academia-astral.com';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
export const SITE_NAME = 'Academia Astral';
