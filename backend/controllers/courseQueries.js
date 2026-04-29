import Course from '../models/Course.js';
import {
  getLocalCategories,
  getLocalCourseBySlug,
  getLocalCourses,
  hasMongoConnection,
} from '../lib/catalogStore.js';

const VALID_CATEGORIES = [
  'tarot',
  'baralho_cigano',
  'chakras_energia',
  'reiki',
  'angeles',
  'numerologia_astrologia',
  'meditacion',
  'magia_plantas',
  'otros',
];
const VALID_LANGUAGES = ['es', 'pt', 'en'];

function parsePriceFilters(minPrice, maxPrice) {
  const priceFilter = {};

  if (minPrice !== undefined && minPrice !== '') {
    const min = parseFloat(minPrice);
    if (Number.isNaN(min) || min < 0) {
      return { error: 'minPrice debe ser un número mayor o igual a 0' };
    }
    priceFilter.$gte = min;
  }

  if (maxPrice !== undefined && maxPrice !== '') {
    const max = parseFloat(maxPrice);
    if (Number.isNaN(max) || max < 0) {
      return { error: 'maxPrice debe ser un número mayor o igual a 0' };
    }
    priceFilter.$lte = max;
  }

  if (priceFilter.$gte != null && priceFilter.$lte != null && priceFilter.$gte > priceFilter.$lte) {
    return { error: 'minPrice no puede ser mayor que maxPrice' };
  }

  return { priceFilter };
}

function validateLanguage(language) {
  if (language !== undefined && language !== '' && !VALID_LANGUAGES.includes(language)) {
    return `Idioma inválido. Valores permitidos: ${VALID_LANGUAGES.join(', ')}`;
  }
  return null;
}

export const getCourses = async (req, res) => {
  try {
    const {
      search,
      category,
      language,
      minRating,
      minPrice,
      maxPrice,
      sort,
      page: pageQ,
      limit: limitQ,
    } = req.query;

    const page = Math.max(1, parseInt(pageQ) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(limitQ) || 20));
    const skip = (page - 1) * limit;

    const filter = { active: true };

    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: regex }, { instructor: regex }];
    }

    if (category !== undefined && category !== '') {
      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({
          error: `Categoría inválida. Valores permitidos: ${VALID_CATEGORIES.join(', ')}`,
        });
      }
      filter.category = category;
    }

    const languageError = validateLanguage(language);
    if (languageError) {
      return res.status(400).json({ error: languageError });
    }
    if (language) {
      filter.language = language;
    }

    if (minRating !== undefined && minRating !== '') {
      const rating = parseFloat(minRating);
      if (Number.isNaN(rating) || rating < 0 || rating > 5) {
        return res.status(400).json({ error: 'minRating debe ser un número entre 0 y 5' });
      }
      filter.rating = { $gte: rating };
    }

    const { priceFilter, error: priceError } = parsePriceFilters(minPrice, maxPrice);
    if (priceError) {
      return res.status(400).json({ error: priceError });
    }
    if (priceFilter && Object.keys(priceFilter).length > 0) {
      filter.priceARS = priceFilter;
    }

    if (!hasMongoConnection()) {
      const regex = search ? new RegExp(search.trim(), 'i') : null;
      const sorters = {
        rating: (a, b) => (b.rating || 0) - (a.rating || 0),
        newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        clicks: (a, b) => (b.clickCount || 0) - (a.clickCount || 0),
      };

      const filtered = getLocalCourses()
        .filter((course) => course.active)
        .filter((course) => !regex || regex.test(course.title) || regex.test(course.instructor || ''))
        .filter((course) => !category || course.category === category)
        .filter((course) => !language || course.language === language)
        .filter((course) => minRating === undefined || minRating === '' || (course.rating || 0) >= parseFloat(minRating))
        .filter((course) => minPrice === undefined || minPrice === '' || (course.priceARS != null && course.priceARS >= parseFloat(minPrice)))
        .filter((course) => maxPrice === undefined || maxPrice === '' || (course.priceARS != null && course.priceARS <= parseFloat(maxPrice)))
        .sort(sorters[sort] || sorters.newest);

      const total = filtered.length;
      const items = filtered.slice(skip, skip + limit);
      return res.json({
        items,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      });
    }

    const sortMap = {
      rating: { rating: -1 },
      newest: { createdAt: -1 },
      clicks: { clickCount: -1 },
    };
    const sortObj = sortMap[sort] || sortMap.newest;

    const [items, total] = await Promise.all([
      Course.find(filter).sort(sortObj).skip(skip).limit(limit),
      Course.countDocuments(filter),
    ]);

    res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCourseBySlug = async (req, res) => {
  try {
    if (!hasMongoConnection()) {
      const course = getLocalCourseBySlug(req.params.slug);
      if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
      return res.json(course);
    }

    const course = await Course.findOne({ slug: req.params.slug, active: true });
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const { language } = req.query;

    const languageError = validateLanguage(language);
    if (languageError) {
      return res.status(400).json({ error: languageError });
    }

    if (!hasMongoConnection()) {
      return res.json(getLocalCategories().filter((item) => {
        if (!language) return true;
        const totalForLanguage = getLocalCourses().filter(
          (course) => course.active && course.category === item.category && course.language === language
        ).length;
        item.count = totalForLanguage;
        return totalForLanguage > 0;
      }));
    }

    const match = { active: true };
    if (language) match.language = language;

    const result = await Course.aggregate([
      { $match: match },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, category: '$_id', count: 1 } },
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
