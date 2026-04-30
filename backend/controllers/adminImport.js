import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { spawn } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const SCRAPING_MD = join(ROOT, 'scraping.md');
const ENRICHMENT_NDJSON = join(__dirname, '..', 'data', 'enrichment.ndjson');

const SECTION_HEADERS = {
  tarot: 'Tarot y Oráculos',
  baralho_cigano: 'Baralho Cigano / Cartas Gitanas',
  chakras_energia: 'Chakras, Energía y Terapias Alternativas',
  reiki: 'Reiki y Sanación Energética',
  angeles: 'Ángeles y Arcángeles',
  numerologia_astrologia: 'Numerología y Astrología',
  meditacion: 'Meditación y Mindfulness',
  magia_plantas: 'Magia, Plantas y Otras Temáticas',
};

function formatPriceARS(n) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function appendToScrapingMd(course) {
  let content = readFileSync(SCRAPING_MD, 'utf8');

  if (course.hotmartId && content.includes(course.hotmartId)) {
    throw new Error(`El curso ${course.hotmartId} ya existe en scraping.md`);
  }

  const sectionTitle = SECTION_HEADERS[course.category];
  if (!sectionTitle) throw new Error(`Sin sección para la categoría: ${course.category}`);

  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const headerRe = new RegExp(
    `(##\\s+${esc(sectionTitle)}\\s+\\()(\\d+)(\\s+productos\\))`, 'u'
  );
  if (!headerRe.test(content)) throw new Error(`Sección "${sectionTitle}" no encontrada`);
  content = content.replace(headerRe, (_, a, n, b) => `${a}${+n + 1}${b}`);

  // Find insert position: just before the next ## section (or EOF)
  const sectionPos = content.search(new RegExp(`##\\s+${esc(sectionTitle)}`, 'u'));
  const afterHeader = content.slice(sectionPos + 1);
  const nextSecRel = afterHeader.search(/\n##\s/);
  const insertAt = nextSecRel < 0 ? content.length : sectionPos + 1 + nextSecRel;

  // Next item number: global max + 1
  const allNums = [...content.matchAll(/^(\d+)\.\s+\*\*/gm)].map((m) => +m[1]);
  const num = allNums.length ? Math.max(...allNums) + 1 : 1;

  // Build markdown block
  const flag = course.language === 'es' ? ' `🇪🇸`' : '';
  let meta = `    Autor: ${course.instructor}`;
  if (course.rating != null && course.rating !== '') meta += ` | ⭐ ${course.rating}`;
  meta += ` | Reseñas: ${course.reviewsCount ?? 0}`;
  if (course.priceARS != null && course.priceARS !== '') {
    meta += ` | Precio: ARS ${formatPriceARS(course.priceARS)}`;
  }

  const block = `\n${num}. **${course.title}**${flag}  \n${meta}  \n    Link: ${course.sourceUrl}\n`;

  const before = content.slice(0, insertAt).trimEnd();
  const after = content.slice(insertAt);
  content = `${before}\n${block}${after}`;

  writeFileSync(SCRAPING_MD, content, 'utf8');
}

function upsertEnrichment(course) {
  let lines = [];
  try {
    lines = readFileSync(ENRICHMENT_NDJSON, 'utf8')
      .split('\n')
      .filter((l) => l.trim());
  } catch {}

  const entry = {
    hotmartId: course.hotmartId,
    title: course.title,
    instructor: course.instructor,
    description: course.description || '',
    imageUrl: course.imageUrl || '',
    language: course.language,
    rating: course.rating != null && course.rating !== '' ? +course.rating : null,
    reviewsCount: course.reviewsCount != null ? +course.reviewsCount : 0,
    priceARS: course.priceARS != null && course.priceARS !== '' ? +course.priceARS : null,
    workloadHours: course.workloadHours != null && course.workloadHours !== '' ? +course.workloadHours : null,
    ...(course.affiliateUrl ? { affiliateUrl: course.affiliateUrl } : {}),
  };

  const idx = lines.findIndex((l) => {
    try { return JSON.parse(l).hotmartId === course.hotmartId; } catch { return false; }
  });

  if (idx >= 0) lines[idx] = JSON.stringify(entry);
  else lines.push(JSON.stringify(entry));

  writeFileSync(ENRICHMENT_NDJSON, lines.join('\n') + '\n', 'utf8');
}

function runExportCatalog() {
  return new Promise((resolve, reject) => {
    const backendDir = join(__dirname, '..');
    const proc = spawn(process.execPath, ['scripts/exportLocalCatalog.js'], {
      cwd: backendDir,
      env: process.env,
    });
    let out = '';
    let err = '';
    proc.stdout.on('data', (d) => { out += d; });
    proc.stderr.on('data', (d) => { err += d; });
    proc.on('close', (code) => {
      if (code === 0) resolve(out.trim());
      else reject(new Error(err.trim() || `Export falló con código ${code}`));
    });
  });
}

export const importCourse = async (req, res) => {
  const { hotmartId, title, instructor, category, sourceUrl } = req.body;

  if (!hotmartId || !title || !instructor || !category || !sourceUrl) {
    return res.status(400).json({
      error: 'Campos requeridos: hotmartId, title, instructor, category, sourceUrl',
    });
  }

  if (!SECTION_HEADERS[category]) {
    return res.status(400).json({
      error: `Categoría inválida. Opciones: ${Object.keys(SECTION_HEADERS).join(', ')}`,
    });
  }

  try {
    appendToScrapingMd(req.body);
    upsertEnrichment(req.body);
    const output = await runExportCatalog();
    res.json({ success: true, message: output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
