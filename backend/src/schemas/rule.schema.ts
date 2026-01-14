import { z } from 'zod';

export const conditionSchema = z.object({
  field: z.enum(['subject', 'from']),
  operator: z.enum(['contains', 'equals']),
  value: z.string().min(1, 'condition.value is required'),
});

export const actionSchema = z.object({
  type: z.enum(['addTag', 'autoReply']),
  value: z.string().min(1, 'action.value is required'),
});

export const createRuleSchema = z.object({
  name: z.string().min(1, 'name is required'),
  condition: conditionSchema,
  action: actionSchema,
});

export type CreateRuleInput = z.infer<typeof createRuleSchema>;

