import express from 'express';
import { getCampeonSlugs, getMundial, getMundiales, getRandomMundial, searchMundiales } from './database.js';
import { campeonSchema, includeSchema, searchSchema, slugSchema } from './schemas.js';

const app = express();
const PORT = process.env.PORT ?? 4321;

app.use(express.json());
app.use('/imagenes', express.static('public/imagenes'));

function validar(schema, data) {
  const resultado = schema.safeParse(data);

  if (!resultado.success) {
    return {
      ok: false,
      error: resultado.error.issues.map((issue) => ({
        campo: issue.path.join('.') || 'valor',
        mensaje: issue.message
      }))
    };
  }

  return { ok: true, data: resultado.data };
}

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

app.get('/mundiales', (req, res) => {
  const validacion = validar(includeSchema, req.query);

  if (!validacion.ok) {
    return res.status(400).json({ error: 'Bad Request', detalles: validacion.error });
  }

  res.json(getMundiales(validacion.data.include === 'full'));
});

app.get('/mundial/:slug', (req, res) => {
  const validacion = validar(slugSchema, req.params);

  if (!validacion.ok) {
    return res.status(400).json({ error: 'Bad Request', detalles: validacion.error });
  }

  const mundial = getMundial(validacion.data.slug);

  if (!mundial) {
    return res.status(404).json({ error: 'Not Found', mensaje: 'No existe el mundial solicitado.' });
  }

  res.json(mundial);
});

app.get('/campeon/:pais', (req, res) => {
  const validacion = validar(campeonSchema, req.params);

  if (!validacion.ok) {
    return res.status(400).json({ error: 'Bad Request', detalles: validacion.error });
  }

  const slugs = getCampeonSlugs(validacion.data.pais);

  if (slugs.length === 0) {
    return res.status(404).json({ error: 'Not Found', mensaje: 'No hay ediciones ganadas por ese pais.' });
  }

  res.json({ pais: validacion.data.pais, slugs });
});

app.get('/random', (req, res) => {
  res.json(getRandomMundial());
});

app.get('/search/:text', (req, res) => {
  const validacion = validar(searchSchema, req.params);

  if (!validacion.ok) {
    return res.status(400).json({ error: 'Bad Request', detalles: validacion.error });
  }

  res.json(searchMundiales(validacion.data.text));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', mensaje: 'La ruta solicitada no existe.' });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
