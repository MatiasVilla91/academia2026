#!/usr/bin/env node
/**
 * Actualiza los cursos en enrichment.ndjson que tienen datos faltantes
 * (imagen, descripción, precio, rating, reseñas) usando Puppeteer.
 *
 * Uso: node backend/scripts/backfillCourses.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { scrapeProduct } from './scrapeHotmart.js';
import { rebuildLocalCatalog } from './exportLocalCatalog.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENRICHMENT_NDJSON = join(__dirname, '..', 'data', 'enrichment.ndjson');

function needsUpdate(entry) {
  return !entry.imageUrl || !entry.description || entry.priceARS == null || entry.rating == null;
}

function readEnrichment() {
  return readFileSync(ENRICHMENT_NDJSON, 'utf8')
    .trim().split('\n')
    .filter(Boolean)
    .map(l => JSON.parse(l));
}

function writeEnrichment(entries) {
  writeFileSync(ENRICHMENT_NDJSON, entries.map(e => JSON.stringify(e)).join('\n') + '\n', 'utf8');
}

const entries = readEnrichment();
const toUpdate = entries.filter(needsUpdate);

if (toUpdate.length === 0) {
  console.log('✓ Todos los cursos ya tienen datos completos.');
  process.exit(0);
}

console.log(`\nCursos para actualizar: ${toUpdate.length}\n`);

let updated = 0;
let failed  = 0;

for (const entry of toUpdate) {
  const sourceUrl = entry.sourceUrl || entry.affiliateUrl?.replace(/\?.*$/, '');

  if (!sourceUrl) {
    console.log(`  ✗ [${entry.hotmartId}] Sin URL fuente, saltando.`);
    failed++;
    continue;
  }

  process.stdout.write(`  → ${entry.title.slice(0, 50)}... `);

  try {
    const scraped = await scrapeProduct(sourceUrl);

    // Solo sobreescribir los campos que estaban vacíos
    if (!entry.imageUrl     && scraped.imageUrl)     entry.imageUrl     = scraped.imageUrl;
    if (!entry.description  && scraped.description)  entry.description  = scraped.description;
    if (entry.priceARS == null && scraped.priceARS != null) entry.priceARS = scraped.priceARS;
    if (entry.rating   == null && scraped.rating   != null) entry.rating   = scraped.rating;
    if ((entry.reviewsCount == null || entry.reviewsCount === 0) && scraped.reviewsCount != null)
      entry.reviewsCount = scraped.reviewsCount;

    const got = [
      scraped.imageUrl     ? 'img'    : null,
      scraped.description  ? 'desc'   : null,
      scraped.priceARS    != null ? `ARS ${scraped.priceARS}` : null,
      scraped.rating      != null ? `⭐${scraped.rating}`      : null,
      scraped.reviewsCount != null ? `${scraped.reviewsCount} reseñas` : null,
    ].filter(Boolean);

    console.log(`✓  [${got.join(' | ') || 'sin datos nuevos'}]`);
    updated++;
  } catch (err) {
    console.log(`✗  Error: ${err.message}`);
    failed++;
  }
}

writeEnrichment(entries);
const total = rebuildLocalCatalog();

console.log(`\n--- Resumen ---`);
console.log(`Actualizados: ${updated}`);
console.log(`Con errores:  ${failed}`);
console.log(`Catálogo:     ${total} cursos activos en localCatalog.js\n`);
