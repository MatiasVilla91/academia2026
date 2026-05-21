const CATEGORIES = {
  tarot: {
    name: 'Tarot',
    emoji: '🃏',
    description: 'Aprendé a leer las cartas del Tarot, desde los Arcanos Mayores hasta tiradas avanzadas.',
  },
  baralho_cigano: {
    name: 'Oráculo Gitano',
    emoji: '🔮',
    description: 'El Baralho Cigano y los oráculos gitanos como herramienta de guía y autoconocimiento.',
  },
  chakras_energia: {
    name: 'Chakras y Energía',
    emoji: '💜',
    description: 'Trabajá con tus centros energéticos para equilibrar el cuerpo, la mente y el espíritu.',
  },
  reiki: {
    name: 'Reiki',
    emoji: '🙏',
    description: 'Técnicas de sanación energética japonesa. Desde el Nivel 1 hasta el Reiki Angelical.',
  },
  angeles: {
    name: 'Ángeles y Arcángeles',
    emoji: '✨',
    description: 'Conectá con tus ángeles guardianes y arcángeles para recibir guía y protección.',
  },
  numerologia_astrologia: {
    name: 'Numerología y Astrología',
    emoji: '⭐',
    description: 'Leé tu carta natal, descubrí el significado de tus números y entendé tu camino de vida.',
  },
  meditacion: {
    name: 'Meditación',
    emoji: '🧘',
    description: 'Prácticas de meditación y mindfulness para reducir el estrés y expandir la conciencia.',
  },
  magia_plantas: {
    name: 'Magia y Plantas',
    emoji: '🌿',
    description: 'Hechizos, rituales, herbología y magia práctica para transformar tu realidad.',
  },
  abundancia: {
    name: 'Abundancia y Manifestación',
    emoji: '🌟',
    description: 'Ley de atracción, manifestación y trabajo energético para atraer prosperidad.',
  },
  otros: {
    name: 'Otras Temáticas',
    emoji: '✦',
    description: 'Constelaciones familiares, registros akáshicos y otras prácticas espirituales.',
  },
};

export function getCategoryName(cat) {
  return CATEGORIES[cat]?.name || cat;
}

export function getCategoryEmoji(cat) {
  return CATEGORIES[cat]?.emoji || '✦';
}

export function getCategoryDescription(cat) {
  return CATEGORIES[cat]?.description || '';
}
