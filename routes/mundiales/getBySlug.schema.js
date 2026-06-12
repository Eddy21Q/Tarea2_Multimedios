import { z } from 'zod';

export const getBySlugSchema = z.object({
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/)
});
