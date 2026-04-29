import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { parseScrapingMd } from './parseScrapingMd.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const ENRICHMENT_NDJSON = join(__dirname, '..', 'data', 'enrichment.ndjson');

function readEnrichmentMap() {
  const content = readFileSync(ENRICHMENT_NDJSON, 'utf8');
  const map = new Map();

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const item = JSON.parse(trimmed);
    if (item.hotmartId) map.set(item.hotmartId, item);
  }

  return map;
}

function buildAffiliateUrl(hotmartId, affiliateId = process.env.AFFILIATE_ID) {
  if (!hotmartId || !affiliateId) return null;
  return `https://go.hotmart.com/${hotmartId}?ap=${affiliateId}`;
}

export function buildCourseCatalog() {
  const baseCourses = parseScrapingMd();
  const enrichmentById = readEnrichmentMap();

  return baseCourses.map((course) => {
    const enriched = enrichmentById.get(course.hotmartId) || {};
    return {
      ...course,
      title: enriched.title || course.title,
      instructor: enriched.instructor || course.instructor,
      description: enriched.description || '',
      imageUrl: enriched.imageUrl || '',
      language: enriched.language || course.language,
      rating: enriched.rating ?? course.rating ?? null,
      reviewsCount: enriched.reviewsCount ?? course.reviewsCount ?? null,
      priceARS: enriched.priceARS ?? course.priceARS ?? null,
      workloadHours: enriched.workloadHours ?? null,
      affiliateUrl: buildAffiliateUrl(course.hotmartId),
      affiliationStatus: 'pending',
      scrapedAt: new Date(),
      active: true,
    };
  });
}

export { buildAffiliateUrl };
