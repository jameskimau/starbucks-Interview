import { Schema, model, type InferSchemaType } from 'mongoose';

export type ConditionField = 'subject' | 'from';
export type ConditionOperator = 'contains' | 'equals';

export type ActionType = 'addTag' | 'autoReply';

const ConditionSchema = new Schema(
  {
    field: { type: String, enum: ['subject', 'from'], required: true },
    operator: { type: String, enum: ['contains', 'equals'], required: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const ActionSchema = new Schema(
  {
    type: { type: String, enum: ['addTag', 'autoReply'], required: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const RuleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    enabled: { type: Boolean, default: true },
    condition: { type: ConditionSchema, required: true },
    action: { type: ActionSchema, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

export type RuleDocument = InferSchemaType<typeof RuleSchema>;

export const RuleModel = model<RuleDocument>('Rule', RuleSchema);

