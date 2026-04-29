import express from 'express';
import { getCourses, getCourseBySlug } from '../controllers/courseQueries.js';
import { clickCourse, updateCourse, addCourse, scrapeCourses } from '../controllers/courseCommands.js';

const router = express.Router();

router.get('/',                    getCourses);
router.post('/scrape',             scrapeCourses);
router.post('/',                   addCourse);
router.post('/:hotmartId/click',   clickCourse);
router.patch('/:hotmartId',        updateCourse);
router.get('/:slug',               getCourseBySlug);

export default router;
