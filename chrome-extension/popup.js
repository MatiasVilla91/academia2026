const BACKEND = 'http://localhost:5000';

// ── Scraper injected into the Hotmart tab ────────────────────────────────────
function scrapeHotmartPage() {
  const url = location.href;

  // hotmartId: single capital letter + digits + capital letter at end of path segment
  const idMatch = url.match(/\/([A-Z]\d+[A-Z])(?:[?#]|$)/);
  const hotmartId = idMatch?.[1] ?? null;

  // ref / affiliate
  const refMatch = url.match(/[?&]ref=([A-Za-z0-9]+)/);
  const ref = refMatch?.[1] ?? null;

  // language
  const language = /\/pt-br\//.test(url) ? 'pt' : 'es';

  const sourceUrl = url.split('?')[0];
  const affiliateUrl = ref ? `${sourceUrl}?ref=${ref}` : null;

  // ── helpers ────────────────────────────────────────────────────────────────
  const firstText = (...sels) => {
    for (const s of sels) {
      try {
        const t = (document.querySelector(s)?.innerText || '').trim();
        if (t) return t;
      } catch {}
    }
    return '';
  };

  const firstSrc = (...sels) => {
    for (const s of sels) {
      try {
        const src = document.querySelector(s)?.src?.trim();
        if (src) return src;
      } catch {}
    }
    return '';
  };

  // ── Strategy 1: Next.js server data (__NEXT_DATA__) ───────────────────────
  let nd = null;
  try {
    const raw = document.getElementById('__NEXT_DATA__')?.textContent;
    if (raw) nd = JSON.parse(raw)?.props?.pageProps;
  } catch {}

  const ndProduct = nd?.product || nd?.course || nd?.productDetails || null;

  const ndTitle      = ndProduct?.name || ndProduct?.productName || ndProduct?.title || '';
  const ndInstructor = ndProduct?.producer?.name || ndProduct?.producer?.tradeName
    || ndProduct?.author?.name || '';
  const ndDesc       = ndProduct?.description || ndProduct?.details || '';
  const ndImage      = ndProduct?.coverImageUrl || ndProduct?.imageUrl
    || ndProduct?.coverImage || '';
  const ndRating     = ndProduct?.rating ?? null;
  const ndReviews    = ndProduct?.reviewsCount ?? null;

  // ── Strategy 2: JSON-LD structured data ───────────────────────────────────
  let ldTitle = '', ldInstructor = '', ldDesc = '', ldImage = '';
  let ldRating = null, ldReviews = null;

  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const raw = JSON.parse(s.textContent);
      const d = Array.isArray(raw) ? raw[0] : raw;
      if (!d?.['@type']) continue;
      ldTitle      = ldTitle      || d.name                                        || '';
      ldInstructor = ldInstructor || d.author?.name || d.creator?.name             || '';
      ldDesc       = ldDesc       || d.description                                 || '';
      ldImage      = ldImage      || (Array.isArray(d.image) ? d.image[0] : d.image) || '';
      if (d.aggregateRating) {
        ldRating  = d.aggregateRating.ratingValue  ?? ldRating;
        ldReviews = d.aggregateRating.reviewCount  ?? ldReviews;
      }
    } catch {}
  }

  // ── Strategy 3: DOM selectors ─────────────────────────────────────────────
  const domTitle = firstText(
    'h1[data-qa="product-name"]',
    'h1[class*="product-name"]',
    '[class*="ProductName"] h1',
    '[class*="product-page__title"]',
    'h1'
  ) || document.title.split(' - ')[0].split(' | ')[0].trim();

  const domInstructor = firstText(
    '[data-qa="producer-name"]',
    '[class*="ProducerName"]',
    '[class*="producer-name"]',
    '[class*="producer__name"]',
    '[class*="creator-name"]',
    '[class*="author-name"]'
  );

  const domDesc = firstText(
    '[data-qa="product-description"]',
    '[class*="ProductDescription"]',
    '[class*="product-description"]',
    '[class*="description__text"]',
    '[class*="producer-description"]'
  );

  const domImage = firstSrc(
    '[class*="ProductCover"] img',
    '[class*="product-cover"] img',
    '[class*="HeroBanner"] img',
    '[class*="hero-banner"] img',
    'img[class*="product-image"]',
    'img[src*="hotmart.s3"]'
  );

  // Rating DOM
  const ratingText = firstText(
    '[data-qa="rating-value"]',
    '[class*="RatingValue"]',
    '[class*="rating-value"]',
    '[class*="rating__value"]'
  );
  const domRating = ratingText ? +ratingText.replace(',', '.') || null : null;

  // Reviews DOM
  const reviewsText = firstText(
    '[data-qa="reviews-count"]',
    '[class*="ReviewsCount"]',
    '[class*="reviews-count"]',
    '[class*="rating__count"]',
    '[class*="ratingCount"]'
  );
  const domReviews = reviewsText?.match(/\d+/) ? +reviewsText.match(/\d+/)[0] : null;

  // Price ARS DOM — scan all price-like elements
  let domPriceARS = null;
  for (const el of document.querySelectorAll('[class*="price" i], [class*="Price"]')) {
    const t = el.innerText || '';
    const m = t.match(/ARS[^\d]*([0-9.,]+)/i) || t.match(/\$\s*([0-9.,]+)/);
    if (m) {
      const val = parseFloat(m[1].replace(/\./g, '').replace(',', '.'));
      if (isFinite(val) && val > 500) { domPriceARS = val; break; }
    }
  }

  // ── Merge: __NEXT_DATA__ > JSON-LD > DOM ──────────────────────────────────
  return {
    hotmartId,
    title:         ndTitle      || ldTitle      || domTitle,
    instructor:    ndInstructor || ldInstructor || domInstructor,
    description:   ndDesc       || ldDesc       || domDesc,
    imageUrl:      ndImage      || ldImage      || domImage,
    rating:        ndRating     ?? ldRating     ?? domRating,
    reviewsCount:  ndReviews    ?? ldReviews    ?? domReviews ?? 0,
    priceARS:      domPriceARS,
    workloadHours: null,
    language,
    sourceUrl,
    affiliateUrl,
  };
}

// ── UI helpers ───────────────────────────────────────────────────────────────
function setStatus(type, msg) {
  const bar = document.getElementById('statusBar');
  const txt = document.getElementById('statusMsg');
  const sp  = document.getElementById('spinner');
  bar.className = type;
  txt.textContent = msg;
  sp.style.display = type === 'loading' ? 'block' : 'none';
}

function fillForm(data) {
  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el && val != null && val !== '') el.value = val;
  };
  set('hotmartId',     data.hotmartId);
  set('title',         data.title);
  set('instructor',    data.instructor);
  set('rating',        data.rating);
  set('reviewsCount',  data.reviewsCount);
  set('priceARS',      data.priceARS);
  set('description',   data.description);
  set('imageUrl',      data.imageUrl);
  set('workloadHours', data.workloadHours);
  set('affiliateUrl',  data.affiliateUrl);
  set('sourceUrl',     data.sourceUrl);
  set('language',      data.language);
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.url?.includes('hotmart.com')) {
    document.getElementById('courseForm').style.display = 'none';
    document.getElementById('notHotmart').style.display = 'block';
    return;
  }

  setStatus('loading', 'Extrayendo datos del producto...');

  try {
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: scrapeHotmartPage,
    });

    document.getElementById('statusBar').className = '';  // hide
    fillForm(result);
  } catch (e) {
    setStatus('error', 'No se pudo extraer datos. Completá el formulario manualmente.');
  }
});

// ── Submit ────────────────────────────────────────────────────────────────────
document.getElementById('courseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;

  const payload = {
    hotmartId:     document.getElementById('hotmartId').value.trim(),
    title:         document.getElementById('title').value.trim(),
    instructor:    document.getElementById('instructor').value.trim(),
    rating:        document.getElementById('rating').value || null,
    reviewsCount:  document.getElementById('reviewsCount').value || 0,
    priceARS:      document.getElementById('priceARS').value || null,
    description:   document.getElementById('description').value.trim(),
    imageUrl:      document.getElementById('imageUrl').value.trim(),
    workloadHours: document.getElementById('workloadHours').value || null,
    category:      document.getElementById('category').value,
    affiliateUrl:  document.getElementById('affiliateUrl').value.trim() || null,
    sourceUrl:     document.getElementById('sourceUrl').value.trim(),
    language:      document.getElementById('language').value || 'es',
  };

  setStatus('loading', 'Agregando al catálogo...');

  try {
    const res = await fetch(`${BACKEND}/api/admin/import-course`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      setStatus('error', json.error || 'Error del servidor');
      btn.disabled = false;
      return;
    }

    setStatus('success', `Listo. ${json.message}`);
    btn.textContent = 'Agregado';
  } catch (err) {
    setStatus('error', 'No se pudo conectar al backend. ¿Está corriendo en localhost:5000?');
    btn.disabled = false;
  }
});
