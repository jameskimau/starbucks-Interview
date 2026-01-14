"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToggleRule } from "@/hooks/useToggleRule";

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
import { Switch } from "@/components/ui/switch";

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
  const toggleRuleMutation = useToggleRule();

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

  // 서버에서 받아온 응답값(console.log로 보여주기)
  useEffect(() => {
    if (simulateMutation.data) {
      console.log("Simulate response:", simulateMutation.data);
    }
  }, [simulateMutation.data]);

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

            {createRuleMutation.isError && (
              <p className="text-sm text-destructive">
                Failed to create rule. Please try again.
              </p>
            )}
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
                <Card key={rule._id} className="border my-4">
                  <div className="flex items-center justify-between pt-4 pl-4">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() =>
                        toggleRuleMutation.mutate(rule._id)
                      }
                    />
                  </div>
                  <CardContent className="space-y-2 pt-4">
                    {/* Rule name */}
                    <p className="font-semibold text-base">{rule.name}</p>

                    {/* Divider */}
                    <div className="border-t" />

                    {/* Condition */}
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Condition:
                      </span>{" "}
                      {rule.condition.field} {rule.condition.operator} "
                      {rule.condition.value}"
                    </p>

                    {/* Action */}
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Action:
                      </span>{" "}
                      {rule.action.type} → "{rule.action.value}"
                    </p>
                  </CardContent>
                </Card>
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
              <Card
                className={
                  simulateMutation.data.matched
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : "border-orange-500 bg-orange-50 dark:bg-orange-950"
                }
              >
                <CardContent className="pt-6 space-y-4">
                  {simulateMutation.data.matched ? (
                    <>
                      <p className="font-semibold text-green-700 dark:text-green-400">
                        ✅ {simulateMutation.data.rules.length} rule(s) matched
                      </p>

                      {simulateMutation.data.rules.map((rule: any) => (
                        <div key={rule._id} className="border-t pt-3 space-y-1">
                          <p className="font-medium">{rule.name}</p>

                          <p className="text-sm">
                            <span className="font-medium">Condition:</span>{" "}
                            {rule.condition.field} {rule.condition.operator} “
                            {rule.condition.value}”
                          </p>

                          <p className="text-sm">
                            <span className="font-medium">Action:</span>{" "}
                            {rule.action.type} →{" "}
                            <span className="font-semibold">
                              {rule.action.value}
                            </span>
                          </p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="font-semibold text-orange-700 dark:text-orange-400">
                      ⚠️ No rule matched this email
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
