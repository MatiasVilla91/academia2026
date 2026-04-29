import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import coursesRoutes from './routes/courses.js';
import { getCategories } from './controllers/courseQueries.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CORS_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (CORS_ORIGINS.length === 0 || CORS_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/courses', coursesRoutes);
app.get('/api/categories', getCategories);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
  if (CORS_ORIGINS.length > 0) {
    console.log(`CORS permitido para: ${CORS_ORIGINS.join(', ')}`);
  } else {
    console.log('CORS sin restricciones explícitas (modo abierto).');
  }
});

if (!MONGO_URI) {
  console.warn('MONGO_URI no definida. Backend iniciado en modo catálogo local.');
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch((err) => {
      console.warn(`MongoDB no disponible. Backend iniciado en modo catálogo local: ${err.message}`);
    });
}
