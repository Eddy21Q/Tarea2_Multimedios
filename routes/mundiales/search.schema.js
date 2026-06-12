import { z } from 'zod';

export const searchSchema = z.object({
  text: z.string().min(3, 'La busqueda debe tener minimo 3 caracteres.')
});
