import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(join(__dirname, 'mundiales.db'));

const camposCortos = 'nombre, anio, sede, campeon, subcampeon, goleador, equipos, imagen, slug';
const camposFull = `${camposCortos}, resumen, descripcion`;

export function getAllMundiales(includeFull = false) {
  const campos = includeFull ? camposFull : camposCortos;
  return db.prepare(`SELECT ${campos} FROM mundiales ORDER BY anio DESC`).all();
}

export function getBySlug(slug) {
  return db.prepare(`SELECT ${camposFull} FROM mundiales WHERE slug = ?`).get(slug);
}

export function getByCampeon(pais) {
  return db
    .prepare('SELECT slug FROM mundiales WHERE lower(campeon) = lower(?) ORDER BY anio DESC')
    .all(pais)
    .map((mundial) => mundial.slug);
}

export function getRandom() {
  return db.prepare(`SELECT ${camposFull} FROM mundiales ORDER BY random() LIMIT 1`).get();
}

export function search(text) {
  const term = `%${text.toLowerCase()}%`;

  return db
    .prepare(`
      SELECT ${camposFull}
      FROM mundiales
      WHERE lower(nombre) LIKE ?
        OR lower(sede) LIKE ?
        OR lower(campeon) LIKE ?
        OR lower(subcampeon) LIKE ?
        OR lower(goleador) LIKE ?
        OR lower(resumen) LIKE ?
        OR lower(descripcion) LIKE ?
      ORDER BY anio DESC
    `)
    .all(term, term, term, term, term, term, term);
}
