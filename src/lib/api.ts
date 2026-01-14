const API_BASE = "http://localhost:4000/api";

export interface CreateRulePayload {
  name: string;
  condition: {
    field: "subject" | "from";
    operator: "contains" | "equals";
    value: string;
  };
  action: {
    type: "addTag" | "autoReply";
    value: string;
  };
}

export const fetchRules = async () => {
  const res = await fetch(`${API_BASE}/rules`);
  if (!res.ok) throw new Error("Failed to fetch rules");
  return res.json();
};

export const createRule = async (payload: CreateRulePayload) => {
  const res = await fetch(`${API_BASE}/rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create rule");
  return res.json();
};

export const simulateEmail = async (payload: {
  from: string;
  subject: string;
  body?: string;
}) => {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to simulate email");
  return res.json();
};

export const toggleRule = async (id: string) => {
  const res = await fetch(`${API_BASE}/rules/${id}/toggle`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to toggle rule");
  return res.json();
};
