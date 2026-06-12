import { z } from 'zod';

export const getByCampeonSchema = z.object({
  pais: z.string().min(3).max(40)
});
