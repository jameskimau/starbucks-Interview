import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import ruleRoutes from "./routes/rule.routes";
import simulateRoutes from "./routes/simulate.routes";
import path from "path";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  // Fail fast: local dev should have a clear error if env isn't configured.
  throw new Error("Missing required env var: MONGO_URI");
}

const mongoUri: string = MONGO_URI;

async function start() {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB");

  const app = express();
  // allow any domain
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ ok: true });
  });

  app.use("/api", ruleRoutes);
  app.use("/api", simulateRoutes);

  // Basic error handler to keep responses consistent.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  app.use(express.static(path.join(__dirname, "../../frontend/dist")));
  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
