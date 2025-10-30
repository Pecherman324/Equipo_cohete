import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { generateGreeting } from "./lib/greet.js";

export function createApp() {
  const app = express();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const publicDir = path.resolve(__dirname, "../public");

  app.use(express.static(publicDir));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/greeting", (_req, res) => {
    res.json({ message: generateGreeting("Mundo") });
  });

  return app;
}


