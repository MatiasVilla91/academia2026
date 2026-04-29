# Deploy

## Arquitectura recomendada

Un solo backend y dos frontends separados:

- `https://es.tudominio.com` -> sitio español
- `https://pt.tudominio.com` -> sitio portugués
- `https://api.tudominio.com` -> backend único

## Backend

Variables sugeridas:

```env
PORT=5000
MONGO_URI=...
AFFILIATE_ID=...
CORS_ORIGINS=https://es.tudominio.com,https://pt.tudominio.com
```

El backend expone:

- `GET /api/courses`
- `GET /api/courses/:slug`
- `POST /api/courses/:hotmartId/click`
- `GET /api/categories`

## Frontend ES

Usar:

```env
VITE_SITE_LANG=es
VITE_API_BASE_URL=https://api.tudominio.com/api
```

Build:

```bash
npm run build:es
```

Salida:

- `dist-es`

## Frontend PT

Usar:

```env
VITE_SITE_LANG=pt
VITE_API_BASE_URL=https://api.tudominio.com/api
```

Build:

```bash
npm run build:pt
```

Salida:

- `dist-pt`

## Desarrollo local

Español:

```bash
npm run dev
```

o

```bash
npm run dev:es
```

Portugués:

```bash
npm run dev:pt
```

## Notas

- Cada sitio queda fijo a su idioma.
- No hay switcher de idioma en la UI.
- Ambos sitios usan el mismo backend.
- Si el backend falla en local, el frontend sigue funcionando con catálogo local enriquecido.
