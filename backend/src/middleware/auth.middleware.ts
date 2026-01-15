import type { Request, Response, NextFunction } from "express";
import jwt, { type Secret } from "jsonwebtoken";

const { JWT_SECRET: JWT_SECRET_RAW } = process.env;

if (!JWT_SECRET_RAW) {
  throw new Error("Missing required env var: JWT_SECRET");
}

const JWT_SECRET: Secret = JWT_SECRET_RAW;

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Authorization header" });
    return;
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    jwt.verify(token, JWT_SECRET);
    // We don't currently attach the decoded user to the request, since
    // endpoints only need to know that the request is authorized.
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

