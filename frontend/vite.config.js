import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function extractMatches(text, pattern) {
  return Array.from(text.matchAll(pattern), (match) => match[1]);
}

function buildSeoFiles(mode) {
  const env = loadEnv(mode, process.cwd(), '');
  const lang = env.VITE_SITE_LANG === 'pt' ? 'pt' : 'es';
  const defaultSiteUrl =
    lang === 'pt' ? 'https://pt.academia-astral.com' : 'https://academia-astral.com';
  const siteUrl = (env.VITE_SITE_URL || defaultSiteUrl).replace(/\/+$/, '');
  const today = new Date().toISOString().slice(0, 10);
  const repoRoot = process.cwd();
  const publicDir = path.join(repoRoot, 'public');
  const blogPostsPath = path.join(repoRoot, 'src', 'lib', 'blogPosts.js');
  const blogPostsSource = fs.readFileSync(blogPostsPath, 'utf8');
  const slugs = extractMatches(blogPostsSource, /["']?slug["']?\s*:\s*["']([^"']+)["']/g);
  const dates = extractMatches(blogPostsSource, /["']?date["']?\s*:\s*["']([^"']+)["']/g);
  const latestDate = dates[0] || today;
  const categorySlugs = [
    'tarot',
    'chakras_energia',
    'reiki',
    'angeles',
    'numerologia_astrologia',
    'meditacion',
    'magia_plantas',
    'otros',
  ];
  const routes = [
    { path: '/', lastmod: latestDate },
    { path: '/blog', lastmod: latestDate },
    ...categorySlugs.map((slug) => ({ path: `/categoria/${slug}`, lastmod: latestDate })),
    ...slugs.map((slug, index) => ({
      path: `/blog/${slug}`,
      lastmod: dates[index] || latestDate,
    })),
  ];
  const sitemapEntries = routes
    .map(
      (route) => `  <url>
    <loc>${siteUrl}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
  </url>`
    )
    .join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`;
  const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8');
}

export default defineConfig(({ mode }) => {
  buildSeoFiles(mode);

  const outDir = mode === 'es' ? 'dist-es' : mode === 'pt' ? 'dist-pt' : 'dist';

  return {
    plugins: [react()],
    build: {
      outDir,
    },
    server: {
      proxy: {
        '/api': 'http://localhost:5000',
      },
    },
  };
});
