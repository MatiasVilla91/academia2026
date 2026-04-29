import Course from '../models/Course.js';
import { hasMongoConnection, incrementLocalClick } from '../lib/catalogStore.js';

const VALID_CATEGORIES = [
  'tarot', 'baralho_cigano', 'chakras_energia', 'reiki', 'angeles',
  'numerologia_astrologia', 'meditacion', 'magia_plantas', 'otros',
];
const VALID_LANGUAGES = ['es', 'pt', 'en'];
const VALID_AFFILIATION_STATUSES = ['pending', 'open', 'approved', 'rejected', 'closed'];

const EDITABLE_FIELDS = [
  'title', 'instructor', 'description', 'priceARS', 'priceUSD',
  'reviewsCount', 'imageUrl', 'affiliateUrl', 'affiliationStatus',
  'language', 'category', 'active',
];

export const clickCourse = async (req, res) => {
  try {
    if (!hasMongoConnection()) {
      const course = incrementLocalClick(req.params.hotmartId);
      if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
      return res.status(204).end();
    }

    const course = await Course.findOneAndUpdate(
      { hotmartId: req.params.hotmartId },
      { $inc: { clickCount: 1 } },
    );
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const update = {};
    const errors = [];

    for (const field of EDITABLE_FIELDS) {
      if (!(field in req.body)) continue;
      const val = req.body[field];

      if (field === 'category' && !VALID_CATEGORIES.includes(val)) {
        errors.push(`category inválida: "${val}". Permitidos: ${VALID_CATEGORIES.join(', ')}`);
        continue;
      }
      if (field === 'language' && !VALID_LANGUAGES.includes(val)) {
        errors.push(`language inválido: "${val}". Permitidos: ${VALID_LANGUAGES.join(', ')}`);
        continue;
      }
      if (field === 'affiliationStatus' && !VALID_AFFILIATION_STATUSES.includes(val)) {
        errors.push(`affiliationStatus inválido: "${val}". Permitidos: ${VALID_AFFILIATION_STATUSES.join(', ')}`);
        continue;
      }

      update[field] = val;
    }

    if (errors.length) return res.status(400).json({ errors });
    if (!Object.keys(update).length) {
      return res.status(400).json({ error: 'Sin campos válidos para actualizar' });
    }

    const course = await Course.findOneAndUpdate(
      { hotmartId: req.params.hotmartId },
      { $set: update },
      { new: true, runValidators: true },
    );

    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const scrapeCourses = async (req, res) => {
  res.json({ message: 'Scraper no implementado aún — ver Fase 2' });
};
