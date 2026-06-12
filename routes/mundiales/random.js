import { getRandom } from '../../data/mundiales.js';

export default function random(req, res) {
  res.json(getRandom());
}
