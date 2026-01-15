import { Router } from "express";
import { login } from "../controllers/auth.controller";

const router = Router();

// Public login endpoint – returns a JWT on valid credentials.
router.post("/auth/login", login);

export default router;

