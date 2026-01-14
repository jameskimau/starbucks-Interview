"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// TYPES
type ConditionField = "subject" | "from";
type Operator = "contains" | "equals";
type ActionType = "addTag" | "autoReply";
// INTERFACE
interface Rule {
  id: string;
  name: string;
  enabled: boolean;
  conditionField: ConditionField;
  operator: Operator;
  conditionValue: string;
  actionType: ActionType;
  actionValue: string;
}
// BUILD COMPONENT
export default function InboxRulesBuilder() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [ruleName, setRuleName] = useState("");
  const [conditionField, setConditionField] =
    useState<ConditionField>("subject");
  const [operator, setOperator] = useState<Operator>("contains");
  const [conditionValue, setConditionValue] = useState("");
  const [actionType, setActionType] = useState<ActionType>("addTag");
  const [actionValue, setActionValue] = useState("");

  // Simulation state
  const [simFrom, setSimFrom] = useState("");
  const [simSubject, setSimSubject] = useState("");
  const [simBody, setSimBody] = useState("");
  const [simResult, setSimResult] = useState<{
    matched: boolean;
    rule?: Rule;
  } | null>(null);

  const getOperatorForField = (field: ConditionField): Operator => {
    return field === "subject" ? "contains" : "equals";
  };

  const handleConditionFieldChange = (value: ConditionField) => {
    setConditionField(value);
    setOperator(getOperatorForField(value));
  };
  // VALIDATOR
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!ruleName.trim()) newErrors.ruleName = "Rule name is required";
    if (!conditionValue.trim())
      newErrors.conditionValue = "Condition value is required";
    if (!actionValue.trim()) newErrors.actionValue = "Action value is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // HANDLE CREATE RULE
  const handleCreateRule = () => {
    if (!validateForm()) return;

    const newRule: Rule = {
      id: Date.now().toString(),
      name: ruleName,
      enabled: true,
      conditionField,
      operator,
      conditionValue,
      actionType,
      actionValue,
    };

    setRules([...rules, newRule]);

    // Reset form
    setRuleName("");
    setConditionValue("");
    setActionValue("");
    setErrors({});
  };
  // TOGGLE URLE
  const toggleRule = (id: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };
  // TESTING SIMULATOR
  const handleSimulate = () => {
    const matchedRule = rules.find((rule) => {
      if (!rule.enabled) return false;

      if (rule.conditionField === "subject" && rule.operator === "contains") {
        return simSubject
          .toLowerCase()
          .includes(rule.conditionValue.toLowerCase());
      }

      if (rule.conditionField === "from" && rule.operator === "equals") {
        return simFrom.toLowerCase() === rule.conditionValue.toLowerCase();
      }

      return false;
    });

    setSimResult(
      matchedRule ? { matched: true, rule: matchedRule } : { matched: false }
    );
  };
  // BUILD COMPONENT
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">
          Inbox Rules Mini-Automation Builder
        </h1>

        {/* SECTION A: Create Rule Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Rule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input
                id="ruleName"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="Enter rule name"
              />
              {errors.ruleName && (
                <p className="text-sm text-destructive">{errors.ruleName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="conditionField">Condition Field</Label>
              <Select
                value={conditionField}
                onValueChange={handleConditionFieldChange}
              >
                <SelectTrigger id="conditionField">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subject">subject</SelectItem>
                  <SelectItem value="from">from</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="operator">Operator</Label>
              <Select
                value={operator}
                onValueChange={(value) => setOperator(value as Operator)}
                disabled
              >
                <SelectTrigger id="operator">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditionField === "subject" ? (
                    <SelectItem value="contains">contains</SelectItem>
                  ) : (
                    <SelectItem value="equals">equals</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conditionValue">Condition Value</Label>
              <Input
                id="conditionValue"
                value={conditionValue}
                onChange={(e) => setConditionValue(e.target.value)}
                placeholder="Enter condition value"
              />
              {errors.conditionValue && (
                <p className="text-sm text-destructive">
                  {errors.conditionValue}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionType">Action Type</Label>
              <Select
                value={actionType}
                onValueChange={(value) => setActionType(value as ActionType)}
              >
                <SelectTrigger id="actionType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="addTag">addTag</SelectItem>
                  <SelectItem value="autoReply">autoReply</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="actionValue">Action Value</Label>
              <Input
                id="actionValue"
                value={actionValue}
                onChange={(e) => setActionValue(e.target.value)}
                placeholder="Enter action value"
              />
              {errors.actionValue && (
                <p className="text-sm text-destructive">{errors.actionValue}</p>
              )}
            </div>

            <Button onClick={handleCreateRule} className="w-full">
              Create Rule
            </Button>
          </CardContent>
        </Card>

        {/* SECTION B: Rules List */}
        <Card>
          <CardHeader>
            <CardTitle>Rules List</CardTitle>
          </CardHeader>
          <CardContent>
            {rules.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No rules created yet
              </p>
            ) : (
              <div className="space-y-3">
                {rules.map((rule) => (
                  <Card key={rule.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <h3 className="font-semibold text-lg">{rule.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Condition:</span>{" "}
                            {rule.conditionField} {rule.operator} &apos;
                            {rule.conditionValue}&apos;
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">Action:</span>{" "}
                            {rule.actionType}: {rule.actionValue}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Label
                            htmlFor={`toggle-${rule.id}`}
                            className="text-sm"
                          >
                            {rule.enabled ? "Enabled" : "Disabled"}
                          </Label>
                          <Switch
                            id={`toggle-${rule.id}`}
                            checked={rule.enabled}
                            onCheckedChange={() => toggleRule(rule.id)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* SECTION C: Simulate Email */}
        <Card>
          <CardHeader>
            <CardTitle>Simulate Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="simFrom">From</Label>
              <Input
                id="simFrom"
                value={simFrom}
                onChange={(e) => setSimFrom(e.target.value)}
                placeholder="sender@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="simSubject">Subject</Label>
              <Input
                id="simSubject"
                value={simSubject}
                onChange={(e) => setSimSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="simBody">Body (optional)</Label>
              <Textarea
                id="simBody"
                value={simBody}
                onChange={(e) => setSimBody(e.target.value)}
                placeholder="Email body content"
                rows={4}
              />
            </div>

            <Button onClick={handleSimulate} className="w-full">
              Simulate
            </Button>

            {simResult && (
              <Card
                className={
                  simResult.matched
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : "border-orange-500 bg-orange-50 dark:bg-orange-950"
                }
              >
                <CardContent className="pt-6">
                  {simResult.matched && simResult.rule ? (
                    <div className="space-y-1">
                      <p className="font-semibold">
                        Matched Rule: {simResult.rule.name}
                      </p>
                      <p className="text-sm">
                        Action: {simResult.rule.actionType}
                      </p>
                      <p className="text-sm">
                        Value: {simResult.rule.actionValue}
                      </p>
                    </div>
                  ) : (
                    <p className="font-semibold">No rule matched</p>
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
