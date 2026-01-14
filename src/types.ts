export interface Condition {
  field: "subject" | "from";
  operator: "contains" | "equals";
  value: string;
}

export interface Action {
  type: "addTag" | "autoReply";
  value: string;
}

export interface Rule {
  _id: string;
  name: string;
  enabled: boolean;
  condition: Condition;
  action: Action;
  createdAt: string;
}

export interface CreateRulePayload {
  name: string;
  condition: Condition;
  action: Action;
}

export interface SimulatePayload {
  from: string;
  subject: string;
  body?: string;
}

export interface SimulateResponse {
  matched: boolean;
  rule: Rule | null;
  action: Action | null;
}
