# Blog SEO Context

## Fecha

`2026-05-02`

## Objetivo

Dejar una base SEO técnica mínima para que el blog de Academia Astral pueda:

- exponer URLs indexables con metadata consistente
- generar `sitemap.xml` y `robots.txt`
- mejorar interlinking entre artículos
- tener un registro persistente del trabajo ya hecho y de lo pendiente

## Estado del blog

El blog vive en el frontend y usa contenido hardcodeado en:

- `frontend/src/lib/blogPosts.js`

Páginas clave:

- `frontend/src/pages/Blog.jsx`
- `frontend/src/pages/BlogPost.jsx`

Cluster ya cargado:

- `que-es-el-tarot`
- `como-aprender-tarot-desde-cero`
- `arcanos-mayores-significado`
- `tirada-de-tarot-de-3-cartas`
- `que-es-reiki`
- `reiki-nivel-1`
- `beneficios-del-reiki`
- `como-hacer-auto-reiki`
- `como-es-una-sesion-de-reiki`

## Trabajo realizado

### 1. Metadata SEO

Se agregó soporte para:

- canonical en `/blog`
- canonical en cada post
- Open Graph en listado y detalle
- `twitter:card` en posts
- JSON-LD de tipo `Article` en posts

Archivos:

- `frontend/src/pages/Blog.jsx`
- `frontend/src/pages/BlogPost.jsx`
- `frontend/src/lib/site.js`

### 2. Interlinking

Se agregó `getRelatedPosts()` para mostrar artículos relacionados de la misma categoría al final de cada post.

Archivo:

- `frontend/src/lib/blogPosts.js`

Además, el bloque de relacionados y el CTA final del post ahora son dinámicos por categoría, para no quedar fijos en tarot al abrir clusters como reiki.

Archivo:

- `frontend/src/pages/BlogPost.jsx`

### 3. URLs absolutas

Se agregó:

- `VITE_SITE_URL`

al ejemplo de entorno:

- `frontend/.env.example`

Fallback actual:

- `https://academia-astral.com` para ES
- `https://pt.academia-astral.com` para PT

## Sitemap y robots

Se implementó generación automática en build desde:

- `frontend/vite.config.js`

La generación crea:

- `frontend/public/sitemap.xml`
- `frontend/public/robots.txt`

Qué incluye hoy el sitemap:

- `/`
- `/blog`
- `/categoria/<slug>`
- `/blog/<slug>`

Las URLs de posts se extraen de:

- `frontend/src/lib/blogPosts.js`

## Pendientes prioritarios

1. Correr build y verificar que `public/sitemap.xml` y `public/robots.txt` salgan correctos.
2. Subir el sitio y darlo de alta en Google Search Console.
3. Enviar sitemap.
4. Pedir indexación de las primeras URLs del blog.
5. Medir qué URLs indexan y cuáles no.
6. Evaluar prerender o SSR si el blog no indexa bien como SPA.

## Riesgos abiertos

- El sitio sigue siendo SPA con `BrowserRouter`.
- No hay prerender ni SSR.
- El sitemap aún no cubre cursos individuales del catálogo.
- Falta autoría/editorial visible para reforzar confianza.

## Próximos clusters sugeridos

1. `como abrir los chakras`
2. `chakras significado`
3. `como calcular mi numero de vida`
4. `numeros maestros numerologia`
5. `como meditar en casa`

## Protocolo para futuros artículos

Cada vez que se agregue un post nuevo:

1. cargarlo en `frontend/src/lib/blogPosts.js`
2. rebuild del frontend
3. validar `sitemap.xml`
4. enlazarlo desde otros posts del mismo cluster
5. pedir indexación en Search Console
