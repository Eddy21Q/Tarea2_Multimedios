import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import mundiales from './mundiales.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(join(__dirname, 'mundiales.db'));
const createSQL = readFileSync(join(__dirname, 'CREATE.SQL'), 'utf-8');

db.exec(createSQL);

const insert = db.prepare(`
  INSERT INTO mundiales (
    slug, nombre, anio, sede, campeon, subcampeon, goleador,
    equipos, imagen, resumen, descripcion
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const mundial of mundiales) {
  insert.run(
    mundial.slug,
    mundial.nombre,
    mundial.anio,
    mundial.sede,
    mundial.campeon,
    mundial.subcampeon,
    mundial.goleador,
    mundial.equipos,
    mundial.imagen,
    mundial.resumen,
    mundial.descripcion
  );
}

console.log(`Base de datos creada con ${mundiales.length} mundiales.`);
