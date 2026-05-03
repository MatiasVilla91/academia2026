const CATEGORY_NAMES = {
  tarot: 'Tarot',
  baralho_cigano: 'Baralho Cigano',
  chakras_energia: 'Chakras y Energía',
  reiki: 'Reiki',
  angeles: 'Ángeles',
  numerologia_astrologia: 'Numerología y Astrología',
  meditacion: 'Meditación',
  magia_plantas: 'Magia y Plantas',
  otros: 'Otros',
};

export function getCategoryName(cat) {
  return CATEGORY_NAMES[cat] || cat;
}
