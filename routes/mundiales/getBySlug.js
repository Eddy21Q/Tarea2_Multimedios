import { getBySlug as findBySlug } from '../../data/mundiales.js';
import { validate } from './validate.js';
import { getBySlugSchema } from './getBySlug.schema.js';

export default function getBySlug(req, res) {
  const validation = validate(getBySlugSchema, req.params);

  if (!validation.ok) {
    return res.status(400).json({ error: 'Bad Request', detalles: validation.error });
  }

  const mundial = findBySlug(validation.data.slug);

  if (!mundial) {
    return res.status(404).json({ error: 'Not Found', mensaje: 'No existe el mundial solicitado.' });
  }

  res.json(mundial);
}
