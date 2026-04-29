import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRAPING_MD = join(__dirname, '..', '..', 'scraping.md');

const SECTION_MAP = {
  'Tarot y Oráculos': 'tarot',
  'Baralho Cigano / Cartas Gitanas': 'baralho_cigano',
  'Chakras, Energía y Terapias Alternativas': 'chakras_energia',
  'Reiki y Sanación Energética': 'reiki',
  'Ángeles y Arcángeles': 'angeles',
  'Numerología y Astrología': 'numerologia_astrologia',
  'Meditación y Mindfulness': 'meditacion',
  'Magia, Plantas y Otras Temáticas': 'magia_plantas',
};

function toSlug(text) {
  return (text || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseNumber(raw) {
  if (!raw) return null;
  const clean = raw.replace(/\./g, '').replace(',', '.').trim();
  const value = Number(clean);
  return Number.isFinite(value) ? value : null;
}

function parseRating(raw) {
  if (!raw) return null;
  const value = Number(raw.replace(',', '.').trim());
  return Number.isFinite(value) ? value : null;
}

function parseInlineValue(line, label) {
  const match = line.match(new RegExp(label + ':\\s*(.+)$'));
  return match ? match[1].trim() : '';
}

function parseCourseBlock(lines, category) {
  const titleLine = lines[0] || '';
  const titleMatch = titleLine.match(/^\d+\.\s+\*\*(.+?)\*\*(?:\s+`🇪🇸`)?\s*$/u);
  if (!titleMatch) return null;

  const title = titleMatch[1].trim();
  const isSpanishMarked = /`🇪🇸`/.test(titleLine);
  const metaLine = lines.find((line) => line.trim().startsWith('Autor:')) || '';
  const linkLine = lines.find((line) => line.trim().startsWith('Link:')) || '';

  // Rating es opcional (productos nuevos sin reseñas aún)
  const metaMatch = metaLine.match(
    /^Autor:\s*(.+?)(?:\s+\|\s+⭐\s*([\d.]+))?\s+\|\s+Reseñas:\s*(\d+)\s+\|\s+Precio:\s+ARS\s+([\d.,]+)\s*$/u
  );
  if (!metaMatch || !linkLine) return null;

  const sourceUrl = parseInlineValue(linkLine, 'Link');
  const hotmartIdMatch = sourceUrl.match(/\/([A-Z]\d+[A-Z])$/);
  const language = sourceUrl.includes('/pt-br/') ? 'pt' : sourceUrl.includes('/es/') ? 'es' : isSpanishMarked ? 'es' : null;
  const hotmartId = hotmartIdMatch?.[1] || null;
  const slug = toSlug(title) || toSlug(hotmartId) || ('curso-' + Date.now());

  return {
    title,
    instructor: metaMatch[1].trim(),
    slug,
    rating: parseRating(metaMatch[2]),
    reviewsCount: parseNumber(metaMatch[3]),
    priceARS: parseNumber(metaMatch[4]),
    language,
    category,
    sourceUrl,
    hotmartId,
  };
}

export function parseScrapingMd() {
  const content = readFileSync(SCRAPING_MD, 'utf8');
  const lines = content.split(/\r?\n/);
  const allCourses = [];

  let currentCategory = null;
  let currentBlock = [];

  const flushBlock = () => {
    if (!currentCategory || currentBlock.length === 0) return;
    const course = parseCourseBlock(currentBlock, currentCategory);
    if (course) allCourses.push(course);
    currentBlock = [];
  };

  for (const line of lines) {
    const sectionMatch = line.match(/^##\s+(.+?)\s+\(\d+\s+productos\)\s*$/u);
    if (sectionMatch) {
      flushBlock();
      currentCategory = SECTION_MAP[sectionMatch[1].trim()] || null;
      continue;
    }

    if (!currentCategory) continue;

    if (/^\d+\.\s+\*\*/.test(line)) {
      flushBlock();
      currentBlock = [line.trim()];
      continue;
    }

    if (currentBlock.length > 0) {
      if (line.trim() === '') {
        flushBlock();
      } else {
        currentBlock.push(line.trim());
      }
    }
  }

  flushBlock();
  return allCourses;
}
