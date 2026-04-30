/**
 * Scraper de Hotmart con Puppeteer.
 * Extrae imagen, descripción, precio, rating y reseñas de una página de producto.
 */

import puppeteer from 'puppeteer';

// Busca recursivamente campos de precio/rating/reseñas en cualquier JSON de la API
function extractFromJson(obj, result, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 8) return;
  for (const [key, val] of Object.entries(obj)) {
    const k = key.toLowerCase();
    if (typeof val === 'number' && isFinite(val)) {
      if (val > 100 && val < 10_000_000 && (k.includes('price') || k === 'value' || k.includes('amount'))) {
        result.priceARS ??= val;
      }
      if (val > 0 && val <= 5 && (k.includes('rating') || k.includes('score') || k.includes('average') || k.includes('stars'))) {
        result.rating ??= val;
      }
      if (Number.isInteger(val) && val >= 0 && val < 1_000_000 &&
          (k.includes('review') || k.includes('totalrat') || k === 'count' || k.includes('votes'))) {
        result.reviewsCount ??= val;
      }
    }
    if (typeof val === 'object') extractFromJson(val, result, depth + 1);
  }
}

function parseArsPrice(text) {
  // "ARS 39.979" o "$ 39.979" o "39979"
  const m = text.match(/(?:ARS|R\$|\$)\s*([\d.,]+)/);
  if (!m) return null;
  const cleaned = m[1].replace(/\./g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return isFinite(n) && n > 0 ? n : null;
}

function parseRating(text) {
  // "4.8 de 5" o "4,8 (293)" o "4.8"
  const m = text.match(/\b([1-5][.,]\d)\b/);
  if (!m) return null;
  const n = parseFloat(m[1].replace(',', '.'));
  return isFinite(n) && n >= 1 && n <= 5 ? n : null;
}

function parseReviews(text) {
  // "293 reseñas" o "(293)" o "293 avaliações"
  const m = text.match(/\b(\d{1,6})\s*(?:reseñas?|avalia[çc]ões?|reviews?|calificaciones?|avaliações)/i)
          || text.match(/\((\d{1,6})\s*(?:avalia|reseñ|review)/i);
  if (!m) return null;
  const n = parseInt(m[1]);
  return isFinite(n) && n >= 0 ? n : null;
}

export async function scrapeProduct(sourceUrl) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'es-AR,es;q=0.9' });
    await page.setViewport({ width: 1280, height: 800 });

    // Interceptar respuestas JSON de la API de Hotmart
    const apiResult = {};
    page.on('response', async (response) => {
      try {
        const ct = response.headers()['content-type'] || '';
        if (!ct.includes('json')) return;
        const json = await response.json();
        extractFromJson(json, apiResult);
      } catch { /* ignorar errores de parse */ }
    });

    await page.goto(sourceUrl, { waitUntil: 'networkidle2', timeout: 40000 });

    // Extraer datos del DOM renderizado
    const domResult = await page.evaluate(() => {
      const og = (p) => document.querySelector(`meta[property="og:${p}"]`)?.content?.trim() || '';
      const bodyText = document.body.innerText;
      const pageTitle = document.title?.trim() || '';
      return {
        imageUrl:    og('image'),
        description: og('description'),
        ogTitle:     og('title'),
        pageTitle,
        bodyText:    bodyText.slice(0, 8000),
      };
    });

    // Intentar extraer precio/rating del texto de la página si la API no los dio
    const priceARS    = apiResult.priceARS    ?? parseArsPrice(domResult.bodyText);
    const rating      = apiResult.rating      ?? parseRating(domResult.bodyText);
    const reviewsCount = apiResult.reviewsCount ?? parseReviews(domResult.bodyText);

    // Extraer título e instructor del <title> "Nombre del Curso - Instructor | Hotmart"
    const rawTitle = domResult.pageTitle.replace(/\s*\|\s*Hotmart\s*$/i, '').trim();
    const lastDash = rawTitle.lastIndexOf(' - ');
    const instructor = lastDash > 0 ? rawTitle.slice(lastDash + 3).trim() : '';
    const title = lastDash > 0 ? rawTitle.slice(0, lastDash).trim() : rawTitle;

    return {
      title,
      instructor,
      imageUrl:     domResult.imageUrl    || '',
      description:  domResult.description || '',
      priceARS:     priceARS     ?? null,
      rating:       rating       ?? null,
      reviewsCount: reviewsCount ?? null,
    };
  } finally {
    await browser.close();
  }
}
