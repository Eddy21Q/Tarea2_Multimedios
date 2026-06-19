import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { resetAlbumes } from '../data/albumes.js';
import app from '../index.js';

const albumValido = {
  slug: 'back-in-black',
  titulo: 'Back in Black',
  artista: 'AC/DC',
  anio: 1980
};

describe('API de albumes', () => {
  beforeEach(() => {
    resetAlbumes();
  });

  it('GET /albumes lista slugs con 200 y contiene un slug sembrado', async () => {
    const response = await request(app).get('/albumes');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(['thriller']));
  });

  it('GET /album/:slug con slug existente responde 200 y el objeto del album', async () => {
    const response = await request(app).get('/album/thriller');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      slug: 'thriller',
      titulo: 'Thriller',
      artista: 'Michael Jackson',
      anio: 1982
    });
  });

  it('GET /album/:slug con slug inexistente responde 404 en JSON', async () => {
    const response = await request(app).get('/album/no-existe');

    expect(response.status).toBe(404);
    expect(response.type).toMatch(/json/);
    expect(response.body).toHaveProperty('error');
  });

  it('GET /search/:text con texto menor a 3 caracteres responde 400 en JSON', async () => {
    const response = await request(app).get('/search/th');

    expect(response.status).toBe(400);
    expect(response.type).toMatch(/json/);
    expect(response.body).toHaveProperty('error');
  });

  it('POST /albumes con cuerpo valido responde 201, Location y objeto creado', async () => {
    const response = await request(app).post('/albumes').send(albumValido);

    expect(response.status).toBe(201);
    expect(response.headers.location).toBe('/album/back-in-black');
    expect(response.body).toMatchObject(albumValido);
  });

  it('POST /albumes con cuerpo invalido responde 400 en JSON', async () => {
    const response = await request(app).post('/albumes').send({ titulo: 'Incompleto' });

    expect(response.status).toBe(400);
    expect(response.type).toMatch(/json/);
    expect(response.body).toHaveProperty('error');
  });

  it('POST /albumes con slug duplicado responde 409 en JSON', async () => {
    const response = await request(app)
      .post('/albumes')
      .send({ ...albumValido, slug: 'thriller' });

    expect(response.status).toBe(409);
    expect(response.type).toMatch(/json/);
    expect(response.body).toHaveProperty('error');
  });

  it('PUT /album/:slug existente y valido responde 200 y objeto actualizado', async () => {
    const cambios = {
      titulo: 'Thriller 25',
      artista: 'Michael Jackson',
      anio: 2008
    };

    const response = await request(app).put('/album/thriller').send(cambios);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      slug: 'thriller',
      ...cambios
    });
  });

  it('PUT /album/:slug inexistente responde 404 en JSON', async () => {
    const response = await request(app).put('/album/no-existe').send({
      titulo: 'Album nuevo',
      artista: 'Artista',
      anio: 2024
    });

    expect(response.status).toBe(404);
    expect(response.type).toMatch(/json/);
    expect(response.body).toHaveProperty('error');
  });

  it('DELETE /album/:slug existente responde 204 sin cuerpo', async () => {
    const response = await request(app).delete('/album/thriller');

    expect(response.status).toBe(204);
    expect(response.text).toBe('');
  });

  it('DELETE /album/:slug inexistente responde 404 en JSON', async () => {
    const response = await request(app).delete('/album/no-existe');

    expect(response.status).toBe(404);
    expect(response.type).toMatch(/json/);
    expect(response.body).toHaveProperty('error');
  });
});
