"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { useRules } from "@/hooks/useRules";
import { useCreateRule } from "@/hooks/useCreateRule";
import { useSimulate } from "./hooks/useSimulateRule";

// TYPES
type ConditionField = "subject" | "from";
type Operator = "contains" | "equals";
type ActionType = "addTag" | "autoReply";

export default function InboxRulesBuilder() {
  // SERVER STATE
  const { data: rules = [], isLoading } = useRules();
  const createRuleMutation = useCreateRule();
  const simulateMutation = useSimulate();

  // FORM STATE (client-only)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ruleName, setRuleName] = useState("");
  const [conditionField, setConditionField] =
    useState<ConditionField>("subject");
  const [operator, setOperator] = useState<Operator>("contains");
  const [conditionValue, setConditionValue] = useState("");
  const [actionType, setActionType] = useState<ActionType>("addTag");
  const [actionValue, setActionValue] = useState("");

  // SIMULATION INPUT STATE
  const [simFrom, setSimFrom] = useState("");
  const [simSubject, setSimSubject] = useState("");
  const [simBody, setSimBody] = useState("");

  const getOperatorForField = (field: ConditionField): Operator =>
    field === "subject" ? "contains" : "equals";

  const handleConditionFieldChange = (value: ConditionField) => {
    setConditionField(value);
    setOperator(getOperatorForField(value));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!ruleName.trim()) newErrors.ruleName = "Rule name is required";
    if (!conditionValue.trim())
      newErrors.conditionValue = "Condition value is required";
    if (!actionValue.trim()) newErrors.actionValue = "Action value is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRule = () => {
    if (!validateForm()) return;

    createRuleMutation.mutate({
      name: ruleName,
      condition: {
        field: conditionField,
        operator,
        value: conditionValue,
      },
      action: {
        type: actionType,
        value: actionValue,
      },
    });

    setRuleName("");
    setConditionValue("");
    setActionValue("");
    setErrors({});
  };

  const handleSimulate = () => {
    simulateMutation.mutate({
      from: simFrom,
      subject: simSubject,
      body: simBody,
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">
          Inbox Rules Mini-Automation Builder
        </h1>

        {/* CREATE RULE */}
        <Card>
          <CardHeader>
            <CardTitle>Create Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="Rule name"
            />
            <Select
              value={conditionField}
              onValueChange={handleConditionFieldChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subject">subject</SelectItem>
                <SelectItem value="from">from</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={conditionValue}
              onChange={(e) => setConditionValue(e.target.value)}
              placeholder="Condition value"
            />

            <Select
              value={actionType}
              onValueChange={(v) => setActionType(v as ActionType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="addTag">addTag</SelectItem>
                <SelectItem value="autoReply">autoReply</SelectItem>
              </SelectContent>
            </Select>

            <Input
              value={actionValue}
              onChange={(e) => setActionValue(e.target.value)}
              placeholder="Action value"
            />

            <Button
              onClick={handleCreateRule}
              disabled={createRuleMutation.isPending}
            >
              Create Rule
            </Button>
          </CardContent>
        </Card>

        {/* RULE LIST */}
        <Card>
          <CardHeader>
            <CardTitle>Rules List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading rules...</p>
            ) : (
              rules.map((rule: any) => (
                <p key={rule._id}>
                  {rule.name} — {rule.condition.field} {rule.condition.operator}
                </p>
              ))
            )}
          </CardContent>
        </Card>

        {/* SIMULATE */}
        <Card>
          <CardHeader>
            <CardTitle>Simulate Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={simFrom}
              onChange={(e) => setSimFrom(e.target.value)}
              placeholder="from"
            />
            <Input
              value={simSubject}
              onChange={(e) => setSimSubject(e.target.value)}
              placeholder="subject"
            />
            <Textarea
              value={simBody}
              onChange={(e) => setSimBody(e.target.value)}
              placeholder="body"
            />
            <Button onClick={handleSimulate}>Simulate</Button>

            {simulateMutation.data && (
              <pre className="text-sm bg-muted p-3 rounded">
                {JSON.stringify(simulateMutation.data, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
