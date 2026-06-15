# Plan de SEO y Contenido — Academia Astral

_Última actualización: 15 de junio de 2026_

Este documento acompaña los cambios técnicos de SEO ya aplicados al sitio y define la estrategia de contenido para subir el ranking en Google. Está pensado para ejecutarse en orden.

---

## 1. Qué se cambió en el código (ya hecho)

Tres arreglos técnicos que atacan las causas directas de baja visibilidad:

1. **Datos estructurados (JSON-LD) en las páginas de curso.** Cada `/curso/:slug` ahora declara a Google su esquema `Course` con `Offer` (precio en ARS), `AggregateRating` (rating + reseñas), `FAQPage` (las 5 preguntas frecuentes) y `BreadcrumbList`. Esto habilita resultados enriquecidos: estrellas, precio y preguntas desplegables directamente en la búsqueda, lo que sube el CTR sin cambiar la posición. El Home suma esquema `Organization` + `WebSite`.

2. **Prerendering del build.** Se agregó `frontend/scripts/prerender.mjs`, que corre después de `vite build` y genera un `index.html` propio por cada ruta (47 páginas: home, 15 cursos, categorías, blog y 21 posts) con el `<title>`, meta description, canonical, Open Graph y JSON-LD ya escritos en el HTML, más un cuerpo rastreable con los textos y enlaces internos. Antes, todo eso se inyectaba con JavaScript y Google lo veía tarde o no lo veía; ahora está en el HTML inicial.

3. **`og-image.jpg`.** Se creó la imagen 1200×630 que faltaba en `frontend/public/`, así las previews al compartir en WhatsApp, Facebook e Instagram dejan de salir rotas.

> **Acción tuya:** corré `npm run build` desde `frontend/` en tu máquina para regenerar el `dist-es` con todos estos cambios, y volvé a desplegar. El build ahora hace `vite build` + prerender automáticamente.

---

## 2. El problema de fondo: contenido delgado de afiliado

Un catálogo de links de afiliado es exactamente el tipo de sitio que Google clasifica como _thin affiliate_ y rankea bajo por defecto: no aporta nada que no esté ya en Hotmart. La única forma de escapar de esa categoría es **contenido original y útil que responda a lo que la gente busca**. Tu blog (21 posts) es la jugada correcta; el plan de abajo lo convierte en un motor de tráfico.

La estrategia es de **topic clusters**: por cada categoría de curso, un conjunto de artículos que cubren las búsquedas informativas alrededor del tema y enlazan hacia el curso correspondiente. Google premia la cobertura temática profunda, y el lector que llega buscando "qué es el reiki" termina en tu curso de reiki.

---

## 3. Huecos prioritarios detectados

Cruzando los cursos del catálogo con los posts existentes:

| Categoría | Cursos | Posts hoy | Estado |
|-----------|:-----:|:---------:|--------|
| Reiki | varios | 5 | Bien cubierto |
| Tarot | 1 | 4 | Bien cubierto |
| Ángeles | 1 | 3 | Cubierto |
| Numerología / Astrología | 2 | 3 | Cubierto |
| Abundancia / Manifestación | 3 | 3 | Cubierto |
| Chakras / Energía | varios | 3 | Cubierto |
| **Meditación** | 1 | **0** | **Hueco — curso sin contenido de apoyo** |
| **Magia / Plantas** | 1 | **0** | **Hueco — curso sin contenido de apoyo** |
| Péndulo / Constelaciones | 2 | 2 | Cubierto |

Además: **9 de los 21 posts no tienen `relatedCourseSlug`**, así que no empujan tráfico hacia ningún curso. Cada post debería enlazar al curso más afín (ver sección 6).

---

## 4. Keywords objetivo por cluster

La prioridad son las _long-tail_ informativas: menos volumen pero mucho menos competidas y con intención clara, ideales para un sitio que recién gana autoridad. Apuntá a estas como título/H1 de cada artículo nuevo.

**Meditación (hueco — empezar acá)**
- "cómo meditar para principiantes paso a paso"
- "meditación guiada para dormir"
- "meditación para la ansiedad"
- "cuánto tiempo hay que meditar por día"
- "tipos de meditación y cuál elegir"

**Magia y plantas (hueco)**
- "hierbas para limpieza energética del hogar"
- "cómo hacer un baño de hierbas para la abundancia"
- "velas según su color y significado"
- "rituales de luna llena para principiantes"
- "qué es la magia blanca y cómo empezar"

**Tarot (ampliar el cluster fuerte)**
- "significado de la carta [X] del tarot" (una por arcano = 22 artículos potenciales)
- "tirada de tarot del amor"
- "tirada de tarot sí o no"
- "cómo limpiar y cargar las cartas del tarot"

**Reiki (ampliar)**
- "símbolos del reiki y su significado"
- "reiki a distancia cómo funciona"
- "diferencia entre reiki nivel 1, 2 y 3"

**Numerología / Astrología**
- "cómo calcular tu carta natal gratis"
- "qué significa mi signo lunar"
- "número del ángel 1111 significado" (los "números de ángeles" tienen muchísimo volumen)

**Abundancia**
- "afirmaciones de la mañana para la abundancia"
- "método 369 para manifestar"
- "cómo hacer un tablero de visualización"

---

## 5. Calendario de publicación sugerido

Ritmo sostenible y efectivo: **2 posts por semana**. Constancia > volumen. Primeras 8 semanas, tapando huecos y reforzando clusters:

| Semana | Artículo | Keyword objetivo | Curso a enlazar |
|:---:|----------|------------------|-----------------|
| 1 | Cómo meditar para principiantes | cómo meditar paso a paso | curso de meditación |
| 1 | Meditación para la ansiedad | meditación para la ansiedad | curso de meditación |
| 2 | Hierbas para limpieza energética | limpieza energética del hogar | curso de magia/plantas |
| 2 | Velas y su significado por color | significado de las velas | curso de magia/plantas |
| 3 | Tirada de tarot del amor | tirada de tarot del amor | Tarot para Principiantes |
| 3 | Cómo limpiar tus cartas de tarot | limpiar cartas de tarot | Tarot para Principiantes |
| 4 | Símbolos del reiki y su significado | símbolos del reiki | Reiki Usui Nivel 1 |
| 4 | Reiki a distancia: cómo funciona | reiki a distancia | Reiki Usui Nivel 1 |
| 5 | Significado del 1111 y números de ángeles | 1111 significado | Numerología Energética |
| 5 | Cómo calcular tu carta natal | calcular carta natal | Numerología Energética |
| 6 | Método 369 para manifestar | método 369 | Manual de Manifestación 2.0 |
| 6 | Cómo hacer un tablero de visualización | tablero de visualización | Manual de Manifestación 2.0 |
| 7 | Rituales de luna llena para principiantes | rituales luna llena | curso de magia/plantas |
| 7 | Meditación guiada para dormir | meditación para dormir | curso de meditación |
| 8 | Significado de los arcanos menores | arcanos menores tarot | Tarot para Principiantes |
| 8 | Diferencia entre reiki nivel 1, 2 y 3 | niveles de reiki | Reiki Usui Nivel 1 |

A partir de la semana 9, atacar la serie "significado de cada carta del tarot" (22 artículos) y "significado de cada número de ángel", que son minas de tráfico long-tail.

---

## 6. Enlazado interno (alto impacto, esfuerzo bajo)

El enlazado interno reparte autoridad y guía al lector hacia la conversión. Tres reglas:

1. **Todo post enlaza a su curso.** Agregar `relatedCourseSlug` a los 9 posts que no lo tienen. Es un campo en `blogPosts.js` y el template ya lo usa para el CTA "Ver el curso →".
2. **Posts del mismo cluster se enlazan entre sí.** Ej.: "Qué es el Reiki" enlaza a "Reiki Nivel 1" y "Beneficios del Reiki" dentro del texto. Esto crea el cluster que Google reconoce.
3. **Las páginas de curso enlazan a 1-2 posts relevantes.** Da contenido de apoyo a una landing que, sola, es delgada.

---

## 7. Checklist técnico y off-page

Cosas a hacer fuera del código, en orden de prioridad:

1. **Google Search Console.** Verificá el dominio (si no está) y subí el sitemap (`https://academia-astral.com/sitemap.xml`). Es la herramienta para ver por qué keywords aparecés, qué páginas están indexadas y pedir reindexación tras cada cambio. Sin esto, estás a ciegas.
2. **Pedí indexación** de las páginas de curso y los posts nuevos desde Search Console ("Inspección de URL → Solicitar indexación").
3. **Validá los datos estructurados** en [search.google.com/test/rich-results](https://search.google.com/test/rich-results) con la URL de un curso, para confirmar que las estrellas y FAQ aparecen.
4. **Velocidad.** Corré PageSpeed Insights; las imágenes de Hotmart (S3) son el cuello de botella probable. Considerá `loading="lazy"` en las del catálogo y un tamaño servido más chico.
5. **Backlinks.** La autoridad de dominio sube con enlaces entrantes. Tácticas realistas: publicá los posts en redes y grupos de la temática, conseguí menciones de blogs espirituales afines, respondé en foros/Quora enlazando a tu guía cuando aporte.
6. **Consistencia NAP / marca.** Si tenés redes (Instagram, etc.), que el nombre y el link al sitio sean idénticos en todas; ayuda a las búsquedas de marca.

---

## 8. Cómo medir si funciona

Mirá en Search Console cada 2-3 semanas: **impresiones** (cuántas veces aparecés) deberían subir primero, luego **clics** y **posición media**. Google Analytics (ya instalado, `G-PY33QTFHHH`) te muestra el tráfico orgánico real. El efecto del contenido tarda entre 4 y 12 semanas en notarse: es una inversión sostenida, no un interruptor.
