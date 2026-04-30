import express from 'express';
import { importCourse } from '../controllers/adminImport.js';

const router = express.Router();

router.post('/import-course', importCourse);

export default router;
