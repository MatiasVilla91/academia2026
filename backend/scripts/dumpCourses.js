// Dumps every course as JSON to stdout (one object per line, NDJSON).
// Used as input to the Chrome-driven enrichment workflow.
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import Course from '../models/Course.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI no está definida en .env');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGO_URI);
  const courses = await Course.find({}, {
    _id: 0,
    hotmartId: 1,
    sourceUrl: 1,
    title: 1,
    instructor: 1,
    rating: 1,
    reviewsCount: 1,
    priceARS: 1,
    imageUrl: 1,
    language: 1,
    category: 1,
  }).lean();
  for (const c of courses) {
    process.stdout.write(JSON.stringify(c) + '\n');
  }
  console.error(`Dumped ${courses.length} courses`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
