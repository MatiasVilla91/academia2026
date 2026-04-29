import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import Course from '../models/Course.js';
import { buildCourseCatalog } from './buildCourseCatalog.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI no está definida en .env');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB conectado');

  const courses = buildCourseCatalog();
  console.log(`Parseados y enriquecidos: ${courses.length} cursos`);

  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const item of courses) {
    try {
      const existing = await Course.findOne({ hotmartId: item.hotmartId }).lean();
      await Course.updateOne(
        { hotmartId: item.hotmartId },
        { $set: item },
        { upsert: true, runValidators: true }
      );

      if (existing) updated++;
      else inserted++;
    } catch (err) {
      console.error(`ERROR [${item.hotmartId}] ${item.title}: ${err.message}`);
      errors++;
    }
  }

  const total = await Course.countDocuments();
  console.log('\n--- Resumen ---');
  console.log(`Procesados   : ${courses.length}`);
  console.log(`Insertados   : ${inserted}`);
  console.log(`Actualizados : ${updated}`);
  console.log(`Errores      : ${errors}`);
  console.log(`Total en Mongo: ${total}`);

  await mongoose.disconnect();
  process.exit(errors > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});
