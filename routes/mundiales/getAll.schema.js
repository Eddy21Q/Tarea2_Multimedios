import { z } from 'zod';

export const getAllSchema = z.object({
  include: z.enum(['full']).optional()
});
