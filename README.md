## 1. Project Overview

Inbox Rules Mini-Automation Builder is a small full-stack app for defining simple **rule-based inbox automations** and **simulating** how incoming emails would be handled.  
Users can create rules on fields like `subject` and `from`, choose actions such as tagging or auto-replying, and then test these rules against sample emails without touching a real mailbox.

## 2. Core Idea

- **Problem it solves**: Safely design and reason about inbox automation logic before wiring it into a real email system.
- **What the user can do**:
  - Create, list, and toggle rules that describe how emails should be processed.
  - Simulate an incoming email and see which rule (if any) would match and what action would be taken.
- **What is stored in the database**:
  - Rule metadata: name, enabled flag, timestamps.
  - Rule logic: condition (field/operator/value) and action (type/value).

## 3. System Diagram

```text
+-------------+      HTTP (JSON)       +--------------------+      +-------------+
|  Frontend   |  <------------------>  |   Backend API      |      |   MongoDB   |
| (React/Vite)|   /api/rules,          | (Node/Express/TS)  | <--> |   (Rules)   |
|             |   /api/simulate        |                    |      |             |
+-------------+                        +--------------------+      +-------------+

   User creates rules & runs simulations      Rules stored & queried
```

## 4. Rule Model Explanation

A **Rule** describes:

- **Condition**: when this rule should apply (e.g. which emails it matches).
- **Action**: what to do when it matches.

Example:

- Condition: `subject` **contains** `"invoice"`
- Action: `addTag` \*\*"finance"`
- Interpretation: “If an email’s subject contains the word ‘invoice’, tag it as ‘finance’.”

## 5. Functional Features

- **Create Rule**: Define name, condition (`subject`/`from`, `contains`/`equals`, value) and action (`addTag` / `autoReply`, value).
- **Rules List**: View all rules, see enabled status, condition/action summaries, and creation time.
- **Toggle Rule**: Enable/disable rules via a single toggle endpoint.
- **Simulate Email**: Submit `from`, `subject`, and optional `body` to see which rule would match and what action would fire.
- **Deterministic Matching**: Simulation always picks the **earliest created enabled rule** that matches.

## 6. Non-Functional Considerations

- **Usability**: Single-page UI with clear sections (Create Rule, Rules List, Simulate Email) and simple, form-based interactions.
- **Maintainability**: Strong TypeScript typing, Zod validation, and separation into models, controllers, routes, and schemas.
- **Scalability (logical)**: Rule evaluation logic is explicit and easily extensible to more fields/operators/actions or additional data sources.
- **Reliability**: Input validation on all write/simulate endpoints and consistent JSON responses reduce edge-case failures.

## 7. Tech Stack

- **Frontend**: React + TypeScript (Vite), Axios, simple CSS.
- **Backend**: Node.js, Express, TypeScript, Zod for validation.
- **Database**: MongoDB with Mongoose models.
- **Tooling**: `ts-node-dev` for backend dev, `tsc` for builds, ESLint/TypeScript configs for type safety and linting.

## 8. How Simulation Works (short)

- The backend loads all **enabled** rules from MongoDB, sorted by `createdAt` ascending.
- For each rule, it checks the condition against the simulated email:
  - `subject + contains`: case-insensitive substring check on the subject.
  - `from + equals`: case-insensitive exact match on the from address.
- The **first rule that matches** stops the search; the API returns `{ matched: true, rule, action }`.
- If no rules match, the API returns `{ matched: false, rule: null, action: null }`.
