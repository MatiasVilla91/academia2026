# Academia Astral 2.0 — Contexto para Claude

## Qué es este proyecto
Catálogo web de cursos esotéricos de Hotmart. Frontend React (Vite + Tailwind) que muestra y filtra cursos con links de afiliado. No hay backend corriendo en producción; todo se sirve como estático desde `localCatalog.js`.

## Flujo de datos
```
enrichment.ndjson  →  exportLocalCatalog.js  →  frontend/src/lib/localCatalog.js
```
- `enrichment.ndjson`: fuente de verdad, una línea JSON por curso
- `localCatalog.js`: generado automáticamente, nunca editar a mano

## Agregar un curso — comando único

```bash
node backend/scripts/addCourse.js --url "https://hotmart.com/es/marketplace/productos/SLUG/ID?ref=REFCODE"
```

El script usa Puppeteer para scrapear Hotmart y extrae automáticamente:
- título e instructor (del `<title>` de la página: `"Título - Instructor | Hotmart"`)
- imagen (og:image → URL S3 de Hotmart)
- descripción (og:description — puede quedar truncada si Hotmart la corta en el meta tag)
- precio ARS (interceptando las respuestas JSON de la API de Hotmart)
- rating y reseñas (idem API + regex sobre el body)
- categoría (auto-clasificación por keywords del título/descripción)

Al terminar regenera `localCatalog.js` solo.

### Overrides opcionales (solo si el scraper falla en algún campo)
```bash
node backend/scripts/addCourse.js --url "..." \
  --title "..." --instructor "..." --section angeles \
  --rating 5 --reviews 10 --price 99000 \
  --description "..." --imageUrl "..."
```

### Categorías disponibles
| slug | nombre |
|------|--------|
| tarot | Tarot y Oráculos |
| chakras | Chakras, Energía y Terapias Alternativas |
| reiki | Reiki y Sanación Energética |
| angeles | Ángeles y Arcángeles |
| numerologia | Numerología y Astrología |
| meditacion | Meditación y Mindfulness |
| magia | Magia, Plantas y Otras Temáticas |
| abundancia | Abundancia y Manifestación |

## Eliminar un curso
1. Borrar la línea con el `hotmartId` correspondiente en `enrichment.ndjson`
2. Ejecutar: `node backend/scripts/exportLocalCatalog.js`

## Limitaciones conocidas del scraper
- **Descripción truncada**: Hotmart pone solo un extracto en `og:description`. Si el usuario pega la descripción completa, usar `--description "..."`.
- **Precio no capturado**: pasa cuando la API de precios carga después del evento `networkidle2`. Usar `--price NNNN`.
- **Instructor mal parseado**: el scraper parte el `<title>` por el último ` - `. Si el título del producto contiene ` - ` el instructor puede quedar mal. Usar `--instructor "..."`.

## Landing pages de venta (embudo de conversión)

Cada `/cursos/:slug` es una landing page de ventas. El template está en `frontend/src/pages/CourseDetail.jsx` y tiene secciones condicionales:

| Sección | Campo requerido | Notas |
|---------|----------------|-------|
| Hero (imagen, título, precio, CTA) | siempre visible | |
| Qué vas a aprender | `highlights` (array de strings) | se omite si no existe |
| Descripción | `description` | se omite si vacía |
| Sobre el instructor | `instructorBio` (string) | se omite si no existe |
| Garantía Hotmart | siempre visible | texto en i18n |
| CTA final | siempre visible | repite precio + botón |
| Cursos relacionados | siempre visible | se omite si no hay |
| Sticky CTA mobile | aparece al scrollear 500px | solo en mobile |

### Agregar highlights e instructorBio a un curso
Editar directamente `backend/data/enrichment.ndjson` (la línea del curso) y agregar los campos:
```json
"highlights": ["Punto 1", "Punto 2", "..."],
"instructorBio": "Bio del instructor..."
```
Luego ejecutar: `node backend/scripts/exportLocalCatalog.js`

O con un script node inline (más seguro para no romper el JSON):
```bash
node -e "
const fs = require('fs');
const path = 'backend/data/enrichment.ndjson';
let lines = fs.readFileSync(path, 'utf8').trim().split('\n');
lines = lines.map(line => {
  const e = JSON.parse(line);
  if (e.hotmartId === 'IDAQUI') {
    e.highlights = ['...', '...'];
    e.instructorBio = '...';
  }
  return JSON.stringify(e);
});
fs.writeFileSync(path, lines.join('\n') + '\n', 'utf8');
"
node backend/scripts/exportLocalCatalog.js
```

### Cursos con landing page completa (highlights + bio)
| hotmartId | Curso |
|-----------|-------|
| G76406759L | Curso de Reiki Angelical — Daniela y sus Angeles |

### Cursos pendientes de enriquecer
Todos los demás (sin highlights ni instructorBio todavía).

## Lo que NO hay que hacer
- No editar `localCatalog.js` a mano — siempre se regenera con el script.
- No pedirle al usuario datos que el scraper puede obtener solo.
- No usar WebFetch/WebSearch para scrapear Hotmart — no funciona (JS dinámico). Usar el script con Puppeteer.

## Scripts disponibles
| script | función |
|--------|---------|
| `backend/scripts/addCourse.js` | Agrega curso + regenera catálogo |
| `backend/scripts/exportLocalCatalog.js` | Solo regenera `localCatalog.js` |
| `backend/scripts/scrapeHotmart.js` | Módulo de scraping (Puppeteer) |
| `backend/scripts/backfillCourses.js` | Rellena campos faltantes en cursos existentes |
| `backend/scripts/seed.js` | Siembra MongoDB (si hay backend activo) |

## Frontend
- Entry: `frontend/src/main.jsx`
- Dev server: `npm run dev` desde `frontend/`
- Catálogo local activo cuando `import.meta.env.DEV === true` o `VITE_USE_LOCAL_CATALOG=1`
- Categorías se derivan dinámicamente del catálogo (no hay lista fija en el frontend)
- i18n: `frontend/src/i18n/es.js` y `pt.js` — las categorías tienen nombre en ambos idiomas
