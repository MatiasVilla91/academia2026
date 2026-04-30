#!/usr/bin/env node
/**
 * Agrega un curso a enrichment.ndjson y regenera localCatalog.js.
 * Con solo la URL detecta automáticamente título, instructor, sección,
 * imagen, descripción, precio y rating.
 *
 * Uso mínimo:
 *   node backend/scripts/addCourse.js --url "https://hotmart.com/es/.../ID?ref=XXX"
 *
 * Overrides opcionales:
 *   --title "..." --instructor "..." --section <slug>
 *   --rating N  --reviews N  --price N  --description "..."  --imageUrl "..."
 *
 * Secciones: tarot | baralho | chakras | reiki | angeles | numerologia | meditacion | magia | abundancia
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { scrapeProduct } from './scrapeHotmart.js';
import { rebuildLocalCatalog } from './exportLocalCatalog.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENRICHMENT_NDJSON = join(__dirname, '..', 'data', 'enrichment.ndjson');

const SECTION_NAMES = {
  tarot:       'Tarot y Oráculos',
  chakras:     'Chakras, Energía y Terapias Alternativas',
  reiki:       'Reiki y Sanación Energética',
  angeles:     'Ángeles y Arcángeles',
  numerologia: 'Numerología y Astrología',
  meditacion:  'Meditación y Mindfulness',
  magia:       'Magia, Plantas y Otras Temáticas',
  abundancia:  'Abundancia y Manifestación',
};

const SECTION_KEYWORDS = {
  tarot:       ['tarot', 'oráculo', 'oraculo', 'arcano', 'baraja'],
  reiki:       ['reiki'],
  angeles:     ['ángel', 'angel', 'arcángel', 'arcangel'],
  numerologia: ['numerolog', 'astrolog', 'carta natal', 'horóscopo', 'horoscopo', 'zodiac'],
  chakras:     ['chakra', 'cristal', 'cromoterapia', 'constelaci', 'radiestesia', 'bioenerget', 'aura', 'terapia'],
  meditacion:  ['meditaci', 'mindfulness', 'yoga', 'respiraci', 'calma', 'serenidad', 'consciencia'],
  abundancia:  ['abundanci', 'manifestaci', 'prosperidad', 'éxito', 'exito', 'atracción', 'atraccion', 'riqueza', 'financi', 'dinero'],
  magia:       ['magia', 'velas', 'grimorio', 'herbal', 'hechizo', 'brujería', 'brujeria', 'wicca', 'plantas'],
};

function classifySection(title, description) {
  const text = (title + ' ' + description).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const scores = {};
  for (const [slug, keywords] of Object.entries(SECTION_KEYWORDS)) {
    scores[slug] = keywords.filter(kw => text.includes(kw.normalize('NFD').replace(/[̀-ͯ]/g, ''))).length;
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best[1] > 0 ? best[0] : null;
}

function toSlug(text) {
  return (text || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, ' ').trim().toLowerCase()
    .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) { args[argv[i].slice(2)] = argv[i + 1] ?? ''; i++; }
  }
  return args;
}

function extractHotmartId(url) {
  const m = url.match(/\/([A-Z]\d+[A-Z])(?:[?#]|$)/);
  return m ? m[1] : null;
}

function detectLanguage(url) {
  if (url.includes('/pt-br/')) return 'pt';
  if (url.includes('/es/'))    return 'es';
  return null;
}

function isDuplicate(hotmartId) {
  return readFileSync(ENRICHMENT_NDJSON, 'utf8').split('\n').some(line => {
    try { return JSON.parse(line).hotmartId === hotmartId; } catch { return false; }
  });
}

function appendToEnrichment(entry) {
  const existing = readFileSync(ENRICHMENT_NDJSON, 'utf8');
  writeFileSync(ENRICHMENT_NDJSON, existing.trimEnd() + '\n' + JSON.stringify(entry) + '\n', 'utf8');
}

// --- main -------------------------------------------------------------------

const args = parseArgs(process.argv.slice(2));

if (!args.url) {
  console.error('Uso: node backend/scripts/addCourse.js --url "<hotmart url con ?ref=...>"');
  process.exit(1);
}

const hotmartId = extractHotmartId(args.url);
if (!hotmartId) { console.error('No se pudo extraer el hotmartId de la URL:', args.url); process.exit(1); }
if (isDuplicate(hotmartId)) { console.error(`El curso ${hotmartId} ya existe.`); process.exit(1); }

const language    = detectLanguage(args.url) ?? 'es';
const sourceUrl   = args.url.replace(/\?.*$/, '');
const affiliateUrl = args.url;

console.log('\nScrapeando Hotmart...');
const scraped = await scrapeProduct(sourceUrl).catch(err => {
  console.warn('  Scraping falló:', err.message);
  return {};
});

const numOr = (cli, fb) => cli != null && cli !== '' ? Number(cli) : (fb ?? null);

const title       = args.title       || scraped.title       || '';
const instructor  = args.instructor  || scraped.instructor  || '';
const description = args.description || scraped.description || '';

if (!title)      { console.error('No se detectó el título. Agregá --title "..."');           process.exit(1); }
if (!instructor) { console.error('No se detectó el instructor. Agregá --instructor "..."');  process.exit(1); }

const category = args.section || classifySection(title, description);
if (!category) {
  console.error('No se pudo determinar la sección. Agregá --section:', Object.keys(SECTION_NAMES).join(' | '));
  process.exit(1);
}

const entry = {
  hotmartId,
  slug:         toSlug(title),
  category,
  sourceUrl,
  title,
  instructor,
  description,
  imageUrl:      args.imageUrl || scraped.imageUrl || '',
  language,
  rating:        numOr(args.rating,   scraped.rating),
  reviewsCount:  numOr(args.reviews,  scraped.reviewsCount) ?? 0,
  priceARS:      numOr(args.price,    scraped.priceARS),
  workloadHours: null,
  affiliateUrl,
};

appendToEnrichment(entry);
const total = rebuildLocalCatalog();

console.log(`\n✓ Curso agregado`);
console.log(`  Título:      ${entry.title}`);
console.log(`  Instructor:  ${entry.instructor}`);
console.log(`  Sección:     ${SECTION_NAMES[category] || category} ${args.section ? '' : '← auto'}`);
console.log(`  Imagen:      ${entry.imageUrl    ? '✓' : '✗'}`);
console.log(`  Precio:      ${entry.priceARS   != null ? `ARS ${entry.priceARS}` : '—'}`);
console.log(`  Rating:      ${entry.rating      != null ? entry.rating : '—'}`);
console.log(`  Catálogo:    ${total} cursos activos\n`);
