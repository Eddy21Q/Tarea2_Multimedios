import { getAllMundiales } from '../../data/mundiales.js';
import { validate } from './validate.js';
import { getAllSchema } from './getAll.schema.js';

export default function getAll(req, res) {
  const validation = validate(getAllSchema, req.query);

  if (!validation.ok) {
    return res.status(400).json({ error: 'Bad Request', detalles: validation.error });
  }

  res.json(getAllMundiales(validation.data.include === 'full'));
}
