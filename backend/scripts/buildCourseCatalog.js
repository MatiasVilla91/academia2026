import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENRICHMENT_NDJSON = join(__dirname, '..', 'data', 'enrichment.ndjson');

export function buildCourseCatalog() {
  return readFileSync(ENRICHMENT_NDJSON, 'utf8')
    .trim().split('\n').filter(Boolean)
    .map(line => JSON.parse(line))
    .filter(e => e.affiliateUrl && e.language !== 'pt')
    .map(e => ({
      hotmartId:         e.hotmartId,
      title:             e.title             || '',
      instructor:        e.instructor        || '',
      slug:              e.slug              || '',
      category:          e.category          || '',
      sourceUrl:         e.sourceUrl         || '',
      language:          e.language          || 'es',
      description:       e.description       || '',
      imageUrl:          e.imageUrl          || '',
      rating:            e.rating            ?? null,
      reviewsCount:      e.reviewsCount      ?? 0,
      priceARS:          e.priceARS          ?? null,
      workloadHours:     e.workloadHours     ?? null,
      affiliateUrl:      e.affiliateUrl,
      affiliationStatus: 'pending',
      active:            true,
      scrapedAt:         new Date(),
      ...(e.highlights      ? { highlights:      e.highlights      } : {}),
      ...(e.instructorBio   ? { instructorBio:   e.instructorBio   } : {}),
      ...(e.tagline         ? { tagline:         e.tagline         } : {}),
      ...(e.targetAudience  ? { targetAudience:  e.targetAudience  } : {}),
      ...(e.includes        ? { includes:        e.includes        } : {}),
    }));
}
