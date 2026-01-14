import { z } from 'zod';

export const simulateSchema = z.object({
  from: z.string().min(1, 'from is required'),
  subject: z.string().min(1, 'subject is required'),
  body: z.string().optional(),
});

export type SimulateInput = z.infer<typeof simulateSchema>;

