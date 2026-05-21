const SITE_LANG = import.meta.env.VITE_SITE_LANG === 'pt' ? 'pt' : 'es';
const DEFAULT_SITE_URL =
  SITE_LANG === 'pt' ? 'https://pt.academia-astral.com' : 'https://academia-astral.com';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
export const SITE_NAME = 'Academia Astral';
// Imagen por defecto para og:image cuando un artículo no tiene imagen propia.
// Reemplazar con una imagen 1200×630px subida al servidor.
export const SITE_OG_IMAGE = 'https://academia-astral.com/og-image.jpg';
