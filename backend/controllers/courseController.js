import Course from '../models/Course.js';

export const getCourses = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const courses = await Course.find({ active: true })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json(courses);
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
