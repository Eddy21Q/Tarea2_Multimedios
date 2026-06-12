import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const DB_PATH = join(__dirname, '..', 'db', 'mundiales.db');

mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new DatabaseSync(DB_PATH);

export function createTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS mundiales (
      slug TEXT PRIMARY KEY,
      nombre TEXT NOT NULL,
      anio INTEGER NOT NULL,
      sede TEXT NOT NULL,
      campeon TEXT NOT NULL,
      subcampeon TEXT NOT NULL,
      goleador TEXT NOT NULL,
      equipos INTEGER NOT NULL,
      imagen TEXT NOT NULL,
      resumen TEXT NOT NULL,
      descripcion TEXT NOT NULL
    )
  `);
}

createTables();

const camposCortos = 'nombre, anio, sede, campeon, subcampeon, goleador, equipos, imagen, slug';
const camposFull = `${camposCortos}, resumen, descripcion`;

export function getMundiales(includeFull = false) {
  const campos = includeFull ? camposFull : camposCortos;
  return db.prepare(`SELECT ${campos} FROM mundiales ORDER BY anio DESC`).all();
}

export function getMundial(slug) {
  return db.prepare(`SELECT ${camposFull} FROM mundiales WHERE slug = ?`).get(slug);
}

export function getCampeonSlugs(pais) {
  return db
    .prepare('SELECT slug FROM mundiales WHERE LOWER(campeon) = LOWER(?) ORDER BY anio DESC')
    .all(pais)
    .map((mundial) => mundial.slug);
}

export function getRandomMundial() {
  return db.prepare(`SELECT ${camposFull} FROM mundiales ORDER BY RANDOM() LIMIT 1`).get();
}

export function searchMundiales(text) {
  const term = `%${text.toLowerCase()}%`;

  return db
    .prepare(`
      SELECT ${camposFull}
      FROM mundiales
      WHERE LOWER(nombre) LIKE ?
        OR LOWER(sede) LIKE ?
        OR LOWER(campeon) LIKE ?
        OR LOWER(subcampeon) LIKE ?
        OR LOWER(goleador) LIKE ?
        OR LOWER(resumen) LIKE ?
        OR LOWER(descripcion) LIKE ?
      ORDER BY anio DESC
    `)
    .all(term, term, term, term, term, term, term);
}
