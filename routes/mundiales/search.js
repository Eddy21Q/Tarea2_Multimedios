import { search as searchMundiales } from '../../data/mundiales.js';
import { validate } from './validate.js';
import { searchSchema } from './search.schema.js';

export default function search(req, res) {
  const validation = validate(searchSchema, req.params);

  if (!validation.ok) {
    return res.status(400).json({ error: 'Bad Request', detalles: validation.error });
  }

  res.json(searchMundiales(validation.data.text));
}
