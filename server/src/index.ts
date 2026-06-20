import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import scenarioRoutes from "./routes/scenario.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.join(__dirname, "../../client/dist");

const app = express();
const PORT = process.env.PORT || 5000;

if (process.env.CLIENT_ORIGIN) {
  app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
}
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));
app.use("/api/scenarios", scenarioRoutes);

app.use(express.static(clientDist));
app.get(/^(?!\/api).*/, (req, res) => res.sendFile(path.join(clientDist, "index.html")));

async function start(): Promise<void> {
  if (!process.env.GEMINI_API_KEY) {
    console.error("[startup] GEMINI_API_KEY is not set — generation requests will fail.");
    console.error("[startup] Copy server/.env.example to server/.env and add your key.");
  }
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] The What If? Machine API listening on http://localhost:${PORT}`);
  });
}

start();
