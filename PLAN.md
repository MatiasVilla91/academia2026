# PLAN.md - Academia Astral 2.0

## Estado actual

El proyecto ya no está planteado como una sola web bilingüe. Ahora quedó preparado como dos sitios independientes sobre la misma base de código:

- un sitio en español
- un sitio en portugués

Cada sitio muestra únicamente cursos en su idioma correspondiente y ya no ofrece switch manual dentro de la UI.

## Decisión de producto actual

### Estrategia

Se decidió separar la captación en dos propiedades distintas:

- Sitio ES para tráfico, contenido y ads en español
- Sitio PT para tráfico, contenido y ads en portugués

### Implicancias

- el idioma ya no es una preferencia del usuario dentro de la web
- el idioma lo define el build y el deploy
- cada sitio se comporta como una propiedad independiente
- esto simplifica la experiencia y evita mezclar públicos

## Avances implementados

### Backend

- `backend/server.js` expone:
  - `GET /api/courses`
  - `GET /api/courses/:slug`
  - `POST /api/courses/:hotmartId/click`
  - `GET /api/categories`
- El servidor puede iniciar aunque MongoDB no conecte.
- Existe un modo catálogo local en `backend/lib/catalogStore.js`.
- `backend/controllers/courseQueries.js` soporta:
  - búsqueda por texto
  - filtro por categoría
  - filtro por idioma
  - filtro por rating mínimo
  - filtro por precio mínimo y máximo
  - orden por `newest`, `rating`, `clicks`
  - paginación
- `GET /api/categories` también soporta filtro por idioma.
- `backend/models/Course.js` ya contempla:
  - `title`
  - `description`
  - `priceARS`
  - `language`
  - `slug`
  - `instructor`
  - `rating`
  - `reviewsCount`
  - `workloadHours`
  - `category`
  - `imageUrl`
  - `hotmartId`
  - `affiliateUrl`
  - `sourceUrl`
  - `clickCount`
  - `scrapedAt`
  - `active`

### Ingesta y catálogo

- `scraping.md` fue reformateado y normalizado.
- `backend/scripts/parseScrapingMd.js` parsea el catálogo base.
- `backend/data/enrichment.ndjson` contiene enriquecimiento real:
  - descripciones
  - imágenes
  - `priceARS` ajustado
  - rating y reseñas
  - workload
- `backend/scripts/buildCourseCatalog.js` unifica:
  - scraping base
  - enriquecimiento
  - construcción de `affiliateUrl` si existe `AFFILIATE_ID`
- `backend/scripts/seed.js` hace upsert por `hotmartId`.
- `backend/scripts/ingestFromScraping.js` quedó como entrypoint equivalente para esa fase.
- `backend/scripts/exportLocalCatalog.js` exporta el catálogo enriquecido al frontend.
- `backend/package.json` ya incluye:
  - `npm run seed`
  - `npm run ingest`
  - `npm run export:catalog`

### Frontend general

- El frontend ya tiene:
  - catálogo
  - detalle
  - categorías
  - filtros
  - paginación
  - loading y empty states
  - `404` visualmente integrado
- En desarrollo funciona sin backend mediante `frontend/src/lib/localCatalog.js`.
- `frontend/src/lib/api.js` usa catálogo local en dev y fallback local si `/api` falla.
- `CourseCard` es completamente clickeable, no solo el botón.
- `CourseCard`, `CourseDetail`, `CategoryPage`, `Home`, `EmptyState` y `NotFound` ya tienen un nivel visual consistente.

### Frontend por idioma

- El idioma del sitio ya no depende de un switcher.
- `frontend/src/i18n/LangProvider.jsx` toma el idioma desde `VITE_SITE_LANG`.
- `frontend/src/components/NavBar.jsx` ya no muestra selector de idioma.
- El switcher fue eliminado de la navegación efectiva.
- El catálogo visible se filtra automáticamente según el idioma del sitio:
  - `ES` muestra cursos `language: es`
  - `PT` muestra cursos `language: pt`
- Las categorías y sus contadores también respetan el idioma del sitio.
- `CourseDetail` redirige al inicio si el curso no coincide con el idioma del sitio.

### Imágenes del catálogo

- Se detectó que el problema de imágenes no cargadas no era solo visual.
- Parte del catálogo ya venía con `imageUrl` faltante en los datos exportados.
- Además, las imágenes válidas dependen de `hotmart.s3.amazonaws.com`, así que una falla remota podía dejar la UI sin salida visual consistente.
- Estado medido del catálogo local:
  - total de cursos: `40`
  - cursos sin `imageUrl`: `8`
  - faltantes en ES: `7`
  - faltantes en PT: `1`
- Se agregó `frontend/src/lib/courseImage.js`.
- Ahora:
  - si falta `imageUrl`, se genera una portada SVG local por curso
  - si una imagen remota falla, `CourseCard` y `CourseDetail` usan ese fallback automáticamente
  - la carga remota usa `referrerPolicy="no-referrer"`, `loading` y `decoding="async"`
- Resultado actual:
  - ninguna card ni detalle debería quedar visualmente rota por falta de imagen
  - sigue pendiente completar las portadas faltantes en origen, sobre todo del catálogo ES

## Separación de sitios

### Configuración

Se agregaron:

- `frontend/.env.es`
- `frontend/.env.pt`

Con:

```env
VITE_SITE_LANG=es
VITE_SITE_LANG=pt
```

### Builds separados

`frontend/vite.config.js` ahora genera salidas independientes:

- `dist-es`
- `dist-pt`

### Scripts disponibles

En `frontend/package.json`:

```bash
npm run dev
npm run dev:es
npm run dev:pt
npm run build
npm run build:es
npm run build:pt
```

### Comportamiento actual

- `npm run dev` levanta por defecto el sitio español
- `npm run dev:pt` levanta el sitio portugués
- `npm run build:es` genera `dist-es`
- `npm run build:pt` genera `dist-pt`

## Estado por fase

### Fase 1 - Cimientos

Estado: mayormente completada

Hecho:

- `.env` y `.env.example` existen
- hay modelo Mongoose real
- hay conexión a Mongo implementada
- hay controladores reales de lectura
- hay `.gitignore`

Pendiente:

- validar escritura real a Mongo en este entorno
- resolver conectividad al cluster Atlas

### Fase 1.5 - Ingesta inicial desde scraping.md

Estado: completada a nivel código, pendiente de validación real en Mongo

Hecho:

- `scraping.md` estructurado
- parseo estable
- enriquecimiento integrado
- script de ingesta idempotente
- exportación al frontend local

Pendiente:

- `AFFILIATE_ID` sigue vacío en `backend/.env`
- no se pudo ejecutar seed real por falta de conectividad a Mongo

### Fase 2 - Ingesta Chrome-asistida y actualización

Estado: parcial

Hecho:

- existe enriquecimiento real en `enrichment.ndjson`
- el pipeline local ya lo consume

Pendiente:

- scraper Hotmart automático
- `node-cron`
- `POST /api/courses/scrape` real

### Fase 3 - API: búsqueda y filtros

Estado: parcial avanzada

Hecho:

- búsqueda por texto
- filtro por categoría
- filtro por idioma
- filtro por rating mínimo
- filtro por precio mínimo y máximo
- paginación
- ordenamiento
- detalle por slug
- categorías filtradas por idioma
- respuesta JSON de error básica

Pendiente:

- contrato `q` explícito si se quiere mantener separado de `search`
- endpoint `GET /api/redirect/:id`
- redirect 302 al link de afiliado

### Fase 4 - Frontend: catálogo real

Estado: muy avanzada

Hecho:

- catálogo navegable
- detalle de curso
- filtros de búsqueda, rating y precio
- cards completamente clickeables
- home con chips de exploración
- category pages más editoriales
- empty state y `404` pulidos
- build funcional
- fallback local con datos enriquecidos
- fallback visual de imágenes para cursos sin portada o con error remoto
- separación real en dos sitios:
  - sitio ES
  - sitio PT

Pendiente:

- CTA vía redirect backend
- integración contra Mongo y API estable
- completar `imageUrl` faltantes del catálogo enriquecido, sobre todo en ES
- pulido final de microcopys embebidos en componentes

### Fase 5 - Hardening mínimo

Estado: no iniciado

Pendiente:

- API key para endpoints sensibles
- rate limiting
- validación de inputs
- servir `dist` desde backend
- documentación completa de variables de entorno

## Bloqueos actuales

### 1. MongoDB no accesible desde este entorno

Eso impide validar:

- seed real
- lectura persistente desde Atlas
- update real del catálogo en DB

### 2. `AFFILIATE_ID` sin configurar

Sin ese valor no se generan links de afiliado finales.

## Próximos pasos recomendados

### Opción A - Cerrar backend real

1. Resolver conectividad a MongoDB.
2. Configurar `AFFILIATE_ID`.
3. Ejecutar `npm run seed`.
4. Implementar `GET /api/redirect/:id`.
5. Cambiar CTA del frontend a ese endpoint.

### Opción B - Preparar despliegue de los dos sitios

1. Definir dominio o subdominio para `ES` y `PT`.
2. Desplegar `dist-es` en la propiedad española.
3. Desplegar `dist-pt` en la propiedad portuguesa.
4. Ajustar branding final de cada sitio si hace falta.
5. Configurar campañas separadas por idioma.

### Opción C - Automatizar ingesta

1. Crear `backend/services/scraper.js`.
2. Definir `POST /api/courses/scrape`.
3. Evaluar scraping HTML vs navegador real.
4. Agregar cron y logging mínimo.

### Opción D - Mejorar calidad del catálogo visual

1. Completar las `imageUrl` faltantes del catálogo ES.
2. Revisar si conviene almacenar portadas localmente para no depender tanto de Hotmart.
3. Mejorar `og:image` para cursos que hoy solo usan fallback visual en runtime.

## Comandos útiles

### Backend

```bash
npm run start
npm run seed
npm run ingest
npm run export:catalog
```

### Frontend

```bash
npm run dev
npm run dev:es
npm run dev:pt
npm run build
npm run build:es
npm run build:pt
```

## Resumen corto

Lo más importante ya resuelto:

- catálogo funcional
- detalle funcional
- filtros útiles
- datos enriquecidos
- fallback local sin depender de Mongo
- cards completamente clickeables
- navegación y estados visuales pulidos
- fallback visual robusto para imágenes faltantes o caídas
- separación real en dos sitios independientes por idioma
- builds listos para `dist-es` y `dist-pt`

Lo más importante pendiente:

- Mongo real
- afiliación real
- redirect backend
- completar `imageUrl` faltantes en el catálogo enriquecido
- despliegue final de ambos sitios
- hardening mínimo
