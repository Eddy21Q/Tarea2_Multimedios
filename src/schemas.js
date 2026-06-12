import { z } from 'zod';

export const includeSchema = z.object({
  include: z.enum(['full']).optional()
});

export const slugSchema = z.object({
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/)
});

export const campeonSchema = z.object({
  pais: z.string().min(3).max(40)
});

export const searchSchema = z.object({
  text: z.string().min(3, 'La busqueda debe tener minimo 3 caracteres.')
});
