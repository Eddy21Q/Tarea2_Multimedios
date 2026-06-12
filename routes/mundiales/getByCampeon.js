import { getByCampeon as findByCampeon } from '../../data/mundiales.js';
import { validate } from './validate.js';
import { getByCampeonSchema } from './getByCampeon.schema.js';

export default function getByCampeon(req, res) {
  const validation = validate(getByCampeonSchema, req.params);

  if (!validation.ok) {
    return res.status(400).json({ error: 'Bad Request', detalles: validation.error });
  }

  const slugs = findByCampeon(validation.data.pais);

  if (slugs.length === 0) {
    return res.status(404).json({ error: 'Not Found', mensaje: 'No hay ediciones ganadas por ese pais.' });
  }

  res.json({ pais: validation.data.pais, slugs });
}
