const CATEGORY_STYLES = {
  tarot: {
    start: '#3B1E77',
    end: '#D4AF37',
    badge: 'TAROT',
  },
  meditacion: {
    start: '#0F766E',
    end: '#99F6E4',
    badge: 'MEDITACION',
  },
  reiki: {
    start: '#1D4ED8',
    end: '#BFDBFE',
    badge: 'REIKI',
  },
  magia_plantas: {
    start: '#166534',
    end: '#BBF7D0',
    badge: 'MAGIA',
  },
};

function escapeXml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapTitle(title, maxLineLength = 22) {
  const words = String(title ?? '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxLineLength) {
      current = candidate;
      continue;
    }

    if (current) lines.push(current);
    current = word;

    if (lines.length === 2) break;
  }

  if (current && lines.length < 2) lines.push(current);

  return lines.length ? lines : ['Academia Astral'];
}

export function getCourseImageFallback(course) {
  const style = CATEGORY_STYLES[course?.category] || {
    start: '#251850',
    end: '#D4AF37',
    badge: 'CURSO',
  };
  const lines = wrapTitle(course?.title);
  const language = String(course?.language || '').toUpperCase() || 'CURSO';
  const titleSvg = lines
    .map(
      (line, index) =>
        `<text x="44" y="${170 + index * 38}" font-family="Georgia, serif" font-size="28" fill="#F8F4E8">${escapeXml(line)}</text>`,
    )
    .join('');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${style.start}" />
          <stop offset="100%" stop-color="${style.end}" />
        </linearGradient>
      </defs>
      <rect width="800" height="800" fill="url(#bg)" />
      <rect x="40" y="40" width="720" height="720" rx="36" fill="rgba(15,10,30,0.26)" stroke="rgba(255,255,255,0.12)" />
      <text x="44" y="96" font-family="Arial, sans-serif" font-size="24" letter-spacing="4" fill="#F8F4E8">${escapeXml(language)}</text>
      <text x="44" y="132" font-family="Arial, sans-serif" font-size="18" letter-spacing="3" fill="rgba(248,244,232,0.78)">${escapeXml(style.badge)}</text>
      ${titleSvg}
      <circle cx="640" cy="168" r="78" fill="rgba(255,255,255,0.10)" />
      <circle cx="680" cy="128" r="20" fill="rgba(255,255,255,0.16)" />
      <circle cx="612" cy="228" r="14" fill="rgba(255,255,255,0.16)" />
      <text x="44" y="708" font-family="Arial, sans-serif" font-size="22" fill="rgba(248,244,232,0.78)">academia astral</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function getCourseImageSrc(course, hasImageError = false) {
  if (!hasImageError && course?.imageUrl) return course.imageUrl;
  return getCourseImageFallback(course);
}
