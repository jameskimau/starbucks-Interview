import type { Request, Response } from "express";
import type { ConditionField, ConditionOperator } from "../models/Rule.model";
import { RuleModel, type RuleDocument } from "../models/Rule.model";
import { simulateSchema } from "../schemas/simulate.schema";

type RuleLean = RuleDocument & { _id: unknown };

function normalize(input: string): string {
  return input.trim().toLowerCase();
}

/**
 * Matching rules:
 * - subject + contains: case-insensitive substring match
 * - from + equals: case-insensitive exact match
 */
export function ruleMatchesEmail(
  rule: Pick<RuleDocument, "condition">,
  email: { from: string; subject: string }
): boolean {
  const field: ConditionField = rule.condition.field;
  const operator: ConditionOperator = rule.condition.operator;
  const expected = normalize(rule.condition.value);

  if (field === "subject" && operator === "contains") {
    return normalize(email.subject).includes(expected);
  }

  if (field === "from" && operator === "equals") {
    return normalize(email.from) === expected;
  }

  // Defensive default (should never happen if validation is correct)
  return false;
}

export async function simulate(req: Request, res: Response) {
  const parsed = simulateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten(),
    });
  }

  const { from, subject } = parsed.data;

  // Fetch enabled rules oldest-first so the earliest rule wins.
  const rules = await RuleModel.find({ enabled: true })
    .sort({ createdAt: 1 })
    .lean<RuleLean[]>();

  // Find *all* matching rules, not just the first
  const matchedRules = rules.filter((rule) =>
    ruleMatchesEmail(rule, { from, subject })
  );
  console.log(matchedRules);
  if (matchedRules.length === 0) {
    return res.json({ matched: false, rules: [], actions: [] });
  }

  console.log(matchedRules);
  
  // Optionally, return all matched rules and their actions
  return res.json({
    matched: true,
    rules: matchedRules,
    actions: matchedRules.map((rule) => rule.action),
  });
}
