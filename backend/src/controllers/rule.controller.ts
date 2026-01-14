import type { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { RuleModel } from '../models/Rule.model';
import { createRuleSchema } from '../schemas/rule.schema';
// 
export async function createRule(req: Request, res: Response) {
  const parsed = createRuleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.flatten(),
    });
  }

  const created = await RuleModel.create(parsed.data);
  return res.status(201).json(created);
}

export async function listRules(_req: Request, res: Response) {
  const rules = await RuleModel.find().sort({ createdAt: -1 }).lean();
  return res.json(rules);
}

export async function toggleRule(req: Request, res: Response) {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid rule id' });
  }

  const rule = await RuleModel.findById(id);
  if (!rule) {
    return res.status(404).json({ error: 'Rule not found' });
  }

  rule.enabled = !rule.enabled;
  await rule.save();

  return res.json(rule);
}

