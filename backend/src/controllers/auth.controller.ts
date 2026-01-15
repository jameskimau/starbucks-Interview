import type { Request, Response } from "express";
import jwt, { type Secret } from "jsonwebtoken";

const { JWT_SECRET: JWT_SECRET_RAW, AUTH_EMAIL, AUTH_PASSWORD } = process.env;

if (!JWT_SECRET_RAW) {
  throw new Error("Missing required env var: JWT_SECRET");
}

const JWT_SECRET: Secret = JWT_SECRET_RAW;

// Simple demo login: checks credentials from env, then issues a JWT.
export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required" });
  }

  if (!AUTH_EMAIL || !AUTH_PASSWORD) {
    return res
      .status(500)
      .json({ error: "Auth credentials are not configured on the server" });
  }

  if (email !== AUTH_EMAIL || password !== AUTH_PASSWORD) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Minimal payload – can be extended later if needed.
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

  return res.json({ token });
}

