/**
 * Genera frontend/src/lib/localCatalog.js desde scraping.md + enrichment.ndjson.
 * Puede usarse como script standalone o importar rebuildLocalCatalog().
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { buildCourseCatalog } from './buildCourseCatalog.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, '..', '..', 'frontend', 'src', 'lib', 'localCatalog.js');

export function rebuildLocalCatalog() {
  const courses = buildCourseCatalog().map((course, i) => ({
    ...course,
    _id: course.hotmartId || course.slug || `local-${i + 1}`,
    clickCount: 0,
    createdAt: '2026-04-28T00:00:00.000Z',
    updatedAt: '2026-04-28T00:00:00.000Z',
  }));
  writeFileSync(OUTPUT, `const localCatalog = ${JSON.stringify(courses, null, 2)};\n\nexport default localCatalog;\n`, 'utf8');
  return courses.length;
}

// Modo script standalone
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const total = rebuildLocalCatalog();
  console.log(`Exported ${total} courses to ${OUTPUT}`);
}
