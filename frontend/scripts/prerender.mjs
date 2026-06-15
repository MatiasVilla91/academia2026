/**
 * Prerender sin navegador (SSG-lite).
 *
 * Corre DESPUÉS de `vite build`. Toma el index.html ya compilado (con sus assets
 * hasheados) como plantilla y, para cada ruta conocida, genera un index.html
 * propio con:
 *   - <title>, meta description, canonical y Open Graph correctos en el <head>
 *   - JSON-LD (Course / Article / FAQ / Breadcrumb / Organization)
 *   - un cuerpo HTML mínimo y rastreable dentro de #root (h1, textos, enlaces
 *     internos). React lo reemplaza al hidratar — es solo el fallback que ven
 *     los crawlers antes de ejecutar JS.
 *
 * No depende de Chromium. Los datos salen de src/lib (catálogo y blog estáticos).
 *
 * Uso: node scripts/prerender.mjs [es|pt]
 */
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const mode = process.argv[2] === 'pt' ? 'pt' : 'es';
const outDir = path.join(root, mode === 'pt' ? 'dist-pt' : 'dist-es');

const SITE_URL = (
  process.env.VITE_SITE_URL ||
  (mode === 'pt' ? 'https://pt.academia-astral.com' : 'https://www.academia-astral.com')
).replace(/\/+$/, '');
const SITE_NAME = 'Academia Astral';
const OG_IMAGE = `${SITE_URL}/og-image.jpg`;

// ── Helpers ────────────────────────────────────────────────────────────────
const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const trunc = (s = '', n = 160) => {
  const t = String(s).replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : t.slice(0, n - 1).trimEnd() + '…';
};

async function importData() {
  // Los archivos de datos son .js con sintaxis ESM. Según la versión de Node y
  // que package.json no tenga "type":"module", import() puede tratarlos como
  // CommonJS y fallar en "export". Para ser robustos, los copiamos a archivos
  // .mjs temporales (siempre ESM) y los importamos desde ahí.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'aa-prerender-'));
  const importAsMjs = async (f) => {
    const src = fs.readFileSync(path.join(root, 'src', 'lib', f), 'utf8');
    const dest = path.join(tmp, f.replace(/\.js$/, '.mjs'));
    fs.writeFileSync(dest, src, 'utf8');
    return import(pathToFileURL(dest).href);
  };
  const { default: localCatalog } = await importAsMjs('localCatalog.js');
  const { blogPosts } = await importAsMjs('blogPosts.js');
  const cat = await importAsMjs('categories.js');
  return { localCatalog, blogPosts, getCategoryName: cat.getCategoryName, getCategoryDescription: cat.getCategoryDescription };
}

// ── FAQ compartida con CourseDetail.jsx (mantener en sync) ──────────────────
const FAQS = [
  ['¿Necesito experiencia previa?', 'No. El contenido está pensado para que puedas comenzar desde cero. No necesitás conocimientos previos para aprovechar al máximo el curso.'],
  ['¿Cuándo puedo empezar?', 'Al instante. Una vez que completás el pago, Hotmart te envía un email con los datos de acceso. En minutos ya podés estar viendo el contenido.'],
  ['¿El pago es seguro?', 'Sí. El pago se procesa a través de Hotmart, la plataforma líder de educación online en América Latina, con encriptación SSL y múltiples medios de pago disponibles.'],
  ['¿Qué pasa si no me gusta el curso?', 'Tenés 7 días de garantía sin preguntas. Si dentro de los primeros 7 días no estás satisfecho/a, Hotmart te reintegra el dinero completo, sin burocracia.'],
  ['¿Por cuánto tiempo tengo acceso?', 'Podés ver el contenido a tu ritmo, cuando quieras, desde cualquier dispositivo. El acceso es prolongado y no vence en el corto plazo.'],
];

// ── Construcción del <head> ─────────────────────────────────────────────────
function headTags({ title, description, canonical, ogType = 'website', image = OG_IMAGE, jsonLd }) {
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
  ];
  if (jsonLd) {
    const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    for (const obj of arr) {
      tags.push(`<script type="application/ld+json">${JSON.stringify(obj)}</script>`);
    }
  }
  return '    ' + tags.join('\n    ') + '\n';
}

// ── Inyección en la plantilla ───────────────────────────────────────────────
function buildHtml(template, { head, body }) {
  let html = template;
  // 1) sacar el <title> placeholder del shell
  html = html.replace(/<title>[\s\S]*?<\/title>\s*/i, '');
  // 2) insertar nuestras meta justo antes de </head>
  html = html.replace(/<\/head>/i, `${head}  </head>`);
  // 3) inyectar cuerpo rastreable dentro de #root (React lo reemplaza al cargar)
  html = html.replace(
    /(<div id="root">)(<\/div>)/i,
    `$1<div data-prerender>${body}</div>$2`
  );
  return html;
}

function writePage(routePath, html) {
  const clean = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
  const dir = clean === '' ? outDir : path.join(outDir, clean);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  return path.relative(outDir, path.join(dir, 'index.html'));
}

// ── Render de cuerpos rastreables ───────────────────────────────────────────
const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;

function homeBody({ localCatalog, getCategoryName }) {
  const cats = [...new Set(localCatalog.map((c) => c.category))];
  const catLinks = cats
    .map((c) => `<li>${link(`/categoria/${c}`, getCategoryName(c))}</li>`)
    .join('');
  const courseLinks = localCatalog
    .map((c) => `<li>${link(`/curso/${c.slug}`, c.title)}${c.tagline ? ` — ${esc(c.tagline)}` : ''}</li>`)
    .join('');
  return (
    `<h1>${esc(SITE_NAME)} — Cursos Esotéricos en Español</h1>` +
    `<p>Tarot, Reiki, Ángeles, Numerología, Meditación y más. Cursos seleccionados de Hotmart, todos en español, con acceso inmediato y garantía de 7 días.</p>` +
    `<h2>Categorías</h2><ul>${catLinks}</ul>` +
    `<h2>Todos los cursos</h2><ul>${courseLinks}</ul>` +
    `<p>${link('/blog', 'Leé el blog')} con guías de tarot, reiki, ángeles y más.</p>`
  );
}

function courseBody(c, { getCategoryName }) {
  const parts = [
    `<nav>${link('/', 'Inicio')} › ${link(`/categoria/${c.category}`, getCategoryName(c.category))} › ${esc(c.title)}</nav>`,
    `<h1>${esc(c.title)}</h1>`,
  ];
  if (c.instructor) parts.push(`<p>por ${esc(c.instructor)}</p>`);
  if (c.tagline) parts.push(`<p>${esc(c.tagline)}</p>`);
  if (c.rating != null && c.reviewsCount > 0)
    parts.push(`<p>${c.rating.toFixed(1)} ★ (${c.reviewsCount} reseñas)</p>`);
  if (c.priceARS != null) parts.push(`<p>Precio: ARS ${c.priceARS.toLocaleString('es-AR')}</p>`);
  if (Array.isArray(c.highlights) && c.highlights.length)
    parts.push(`<h2>Qué vas a aprender</h2><ul>${c.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>`);
  if (c.description) parts.push(`<h2>Descripción</h2><p>${esc(c.description)}</p>`);
  if (c.instructorBio) parts.push(`<h2>Sobre el instructor</h2><p>${esc(c.instructorBio)}</p>`);
  parts.push(`<h2>Preguntas frecuentes</h2>${FAQS.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}`);
  return parts.join('');
}

function courseJsonLd(c, { getCategoryName }) {
  const url = `${SITE_URL}/curso/${c.slug}`;
  const course = {
    '@type': 'Course',
    '@id': `${url}#course`,
    name: c.title,
    description: c.description || c.tagline || c.title,
    url,
    inLanguage: c.language || 'es',
    ...(c.imageUrl && { image: c.imageUrl }),
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    ...(c.instructor && { author: { '@type': 'Person', name: c.instructor } }),
    hasCourseInstance: { '@type': 'CourseInstance', courseMode: 'online', inLanguage: c.language || 'es' },
    ...(c.rating != null && c.reviewsCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: c.rating.toFixed(1),
        reviewCount: c.reviewsCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    ...(c.priceARS != null && {
      offers: {
        '@type': 'Offer',
        price: c.priceARS,
        priceCurrency: 'ARS',
        availability: 'https://schema.org/InStock',
        category: 'Paid',
        url,
      },
    }),
  };
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: getCategoryName(c.category), item: `${SITE_URL}/categoria/${c.category}` },
      { '@type': 'ListItem', position: 3, name: c.title, item: url },
    ],
  };
  const faq = {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: FAQS.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  };
  return { '@context': 'https://schema.org', '@graph': [course, breadcrumb, faq] };
}

function categoryBody(catSlug, courses, { getCategoryName, getCategoryDescription }) {
  const links = courses.map((c) => `<li>${link(`/curso/${c.slug}`, c.title)}</li>`).join('');
  return (
    `<nav>${link('/', 'Inicio')} › ${esc(getCategoryName(catSlug))}</nav>` +
    `<h1>${esc(getCategoryName(catSlug))}</h1>` +
    `<p>${esc(getCategoryDescription(catSlug))}</p>` +
    `<ul>${links}</ul>`
  );
}

function postBody(p) {
  const blocks = (p.content || [])
    .map((b) => {
      if (b.type === 'h2') return `<h2>${esc(b.text)}</h2>`;
      if (b.type === 'p') return `<p>${esc(b.text)}</p>`;
      if (b.type === 'ul') return `<ul>${(b.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
      if (b.type === 'ol') return `<ol>${(b.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ol>`;
      return '';
    })
    .join('');
  return `<nav>${link('/', 'Inicio')} › ${link('/blog', 'Blog')}</nav><h1>${esc(p.title)}</h1>${blocks}`;
}

function postJsonLd(p) {
  const url = `${SITE_URL}/blog/${p.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.date,
    articleSection: p.category,
    inLanguage: 'es',
    mainEntityOfPage: url,
    url,
    image: p.imageUrl || OG_IMAGE,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: OG_IMAGE } },
  };
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  const templatePath = path.join(outDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    console.error(`✗ No existe ${templatePath}. Corré "vite build" primero.`);
    process.exit(1);
  }
  const template = fs.readFileSync(templatePath, 'utf8');
  const { localCatalog, blogPosts, getCategoryName, getCategoryDescription } = await importData();

  const homepageJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: OG_IMAGE },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: 'es',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  };

  const pages = [];

  // Home
  pages.push(['/', buildHtml(template, {
    head: headTags({
      title: `${SITE_NAME} — Cursos Esotéricos en Español`,
      description: 'Encontrá tu próximo camino espiritual. Tarot, Reiki, Ángeles, Numerología y más — cursos seleccionados de Hotmart, todos en español, con acceso inmediato y garantía de devolución.',
      canonical: SITE_URL,
      jsonLd: homepageJsonLd,
    }),
    body: homeBody({ localCatalog, getCategoryName }),
  })]);

  // Cursos
  for (const c of localCatalog) {
    pages.push([`/curso/${c.slug}`, buildHtml(template, {
      head: headTags({
        title: `${c.title} - ${SITE_NAME}`,
        description: trunc(c.description || c.tagline || c.title),
        canonical: `${SITE_URL}/curso/${c.slug}`,
        ogType: 'product',
        image: c.imageUrl || OG_IMAGE,
        jsonLd: courseJsonLd(c, { getCategoryName }),
      }),
      body: courseBody(c, { getCategoryName }),
    })]);
  }

  // Categorías (solo las presentes en el catálogo)
  const byCat = new Map();
  for (const c of localCatalog) {
    if (!byCat.has(c.category)) byCat.set(c.category, []);
    byCat.get(c.category).push(c);
  }
  for (const [slug, courses] of byCat) {
    pages.push([`/categoria/${slug}`, buildHtml(template, {
      head: headTags({
        title: `${getCategoryName(slug)} — Cursos en español | ${SITE_NAME}`,
        description: trunc(getCategoryDescription(slug) || `Cursos de ${getCategoryName(slug)} en español.`),
        canonical: `${SITE_URL}/categoria/${slug}`,
      }),
      body: categoryBody(slug, courses, { getCategoryName, getCategoryDescription }),
    })]);
  }

  // Blog index
  const blogLinks = blogPosts.map((p) => `<li>${link(`/blog/${p.slug}`, p.title)} — ${esc(p.description)}</li>`).join('');
  pages.push(['/blog', buildHtml(template, {
    head: headTags({
      title: `Blog — Guías de Tarot, Reiki y Espiritualidad | ${SITE_NAME}`,
      description: 'Guías prácticas sobre tarot, reiki, ángeles, numerología y meditación para empezar tu camino espiritual.',
      canonical: `${SITE_URL}/blog`,
    }),
    body: `<h1>Blog</h1><ul>${blogLinks}</ul>`,
  })]);

  // Posts
  for (const p of blogPosts) {
    pages.push([`/blog/${p.slug}`, buildHtml(template, {
      head: headTags({
        title: `${p.title} | ${SITE_NAME}`,
        description: trunc(p.description),
        canonical: `${SITE_URL}/blog/${p.slug}`,
        ogType: 'article',
        image: p.imageUrl || OG_IMAGE,
        jsonLd: postJsonLd(p),
      }),
      body: postBody(p),
    })]);
  }

  let count = 0;
  for (const [route, html] of pages) {
    const rel = writePage(route, html);
    count++;
    console.log(`  ✓ ${route}  →  ${rel}`);
  }
  console.log(`\n✓ Prerender completo (${mode}): ${count} páginas en ${path.relative(root, outDir)}`);
}

main().catch((e) => {
  console.error('✗ Prerender falló:', e);
  process.exit(1);
});
