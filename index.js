import express from 'express';
import getAll from './routes/mundiales/getAll.js';
import getByCampeon from './routes/mundiales/getByCampeon.js';
import getBySlug from './routes/mundiales/getBySlug.js';
import getRandom from './routes/mundiales/random.js';
import search from './routes/mundiales/search.js';

const app = express();
const PORT = process.env.PORT ?? 4321;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.json({
    nombre: 'API de Mundiales FIFA',
    descripcion: 'Informacion de varias ediciones de la Copa Mundial de la FIFA.',
    rutas: [
      '/',
      '/mundiales',
      '/mundiales?include=full',
      '/mundial/:slug',
      '/campeon/:pais',
      '/random',
      '/search/:text',
      '/imagenes/:archivo'
    ]
  });
});

app.get('/mundiales', getAll);
app.get('/mundial/:slug', getBySlug);
app.get('/campeon/:pais', getByCampeon);
app.get('/random', getRandom);
app.get('/search/:text', search);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', mensaje: 'La ruta solicitada no existe.' });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
