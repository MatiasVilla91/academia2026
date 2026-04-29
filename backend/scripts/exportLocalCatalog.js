import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { buildCourseCatalog } from './buildCourseCatalog.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, '..', '..', 'frontend', 'src', 'lib', 'localCatalog.js');

const courses = buildCourseCatalog().map((course, index) => ({
  ...course,
  _id: course.hotmartId || course.slug || `local-${index + 1}`,
  clickCount: 0,
  createdAt: '2026-04-28T00:00:00.000Z',
  updatedAt: '2026-04-28T00:00:00.000Z',
}));

const content = `const localCatalog = ${JSON.stringify(courses, null, 2)};\n\nexport default localCatalog;\n`;
writeFileSync(OUTPUT, content, 'utf8');
console.log(`Exported ${courses.length} courses to ${OUTPUT}`);
