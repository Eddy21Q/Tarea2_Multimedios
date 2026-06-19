import { Router } from 'express';
import { z } from 'zod';
import {
  createAlbum,
  deleteAlbum,
  getAlbumBySlug,
  getAlbumSlugs,
  searchAlbumes,
  updateAlbum
} from '../data/albumes.js';

const router = Router();

const slugSchema = z.object({
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/)
});

const searchSchema = z.object({
  text: z.string().min(3, 'La busqueda debe tener minimo 3 caracteres.')
});

const albumSchema = z.object({
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(1),
  artista: z.string().min(1),
  anio: z.number().int().min(1900)
});

const updateAlbumSchema = albumSchema.omit({ slug: true });

function validationDetails(error) {
  return error.issues.map((issue) => ({
    campo: issue.path.join('.') || 'valor',
    mensaje: issue.message
  }));
}

router.get('/albumes', (req, res) => {
  res.json(getAlbumSlugs());
});

router.get('/album/:slug', (req, res) => {
  const validation = slugSchema.safeParse(req.params);

  if (!validation.success) {
    return res.status(400).json({ error: 'Bad Request', detalles: validationDetails(validation.error) });
  }

  const album = getAlbumBySlug(validation.data.slug);

  if (!album) {
    return res.status(404).json({ error: 'Not Found', mensaje: 'No existe el album solicitado.' });
  }

  res.json(album);
});

router.get('/search/:text', (req, res) => {
  const validation = searchSchema.safeParse(req.params);

  if (!validation.success) {
    return res.status(400).json({ error: 'Bad Request', detalles: validationDetails(validation.error) });
  }

  res.json(searchAlbumes(validation.data.text));
});

router.post('/albumes', (req, res) => {
  const validation = albumSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: 'Bad Request', detalles: validationDetails(validation.error) });
  }

  if (getAlbumBySlug(validation.data.slug)) {
    return res.status(409).json({ error: 'Conflict', mensaje: 'Ya existe un album con ese slug.' });
  }

  const album = createAlbum(validation.data);

  res.location(`/album/${album.slug}`).status(201).json(album);
});

router.put('/album/:slug', (req, res) => {
  const paramsValidation = slugSchema.safeParse(req.params);

  if (!paramsValidation.success) {
    return res.status(400).json({ error: 'Bad Request', detalles: validationDetails(paramsValidation.error) });
  }

  const bodyValidation = updateAlbumSchema.safeParse(req.body);

  if (!bodyValidation.success) {
    return res.status(400).json({ error: 'Bad Request', detalles: validationDetails(bodyValidation.error) });
  }

  const album = updateAlbum(paramsValidation.data.slug, bodyValidation.data);

  if (!album) {
    return res.status(404).json({ error: 'Not Found', mensaje: 'No existe el album solicitado.' });
  }

  res.json(album);
});

router.delete('/album/:slug', (req, res) => {
  const validation = slugSchema.safeParse(req.params);

  if (!validation.success) {
    return res.status(400).json({ error: 'Bad Request', detalles: validationDetails(validation.error) });
  }

  const deleted = deleteAlbum(validation.data.slug);

  if (!deleted) {
    return res.status(404).json({ error: 'Not Found', mensaje: 'No existe el album solicitado.' });
  }

  res.status(204).send();
});

export default router;
