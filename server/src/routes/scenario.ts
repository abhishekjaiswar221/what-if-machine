import express, { Request, Response } from "express";
import Scenario from "../models/Scenario.js";
import { isDBConnected } from "../config/db.js";
import { generateScenario } from "../services/geminiService.js";

const router = express.Router();

interface GenerateRequestBody {
  question?: string;
}

// POST /api/scenarios/generate — SSE stream of raw text progress, then a
// final "result" event with the parsed structured scenario.
router.post("/generate", async (req: Request<{}, unknown, GenerateRequestBody>, res: Response) => {
  const { question } = req.body;

  if (!question || typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "question is required" });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const scenario = await generateScenario(question.trim(), (delta) => {
      send("delta", { text: delta });
    });

    if (isDBConnected()) {
      try {
        const saved = await Scenario.create({ question: question.trim(), ...scenario });
        send("result", { ...scenario, _id: saved._id });
      } catch (dbErr) {
        const message = dbErr instanceof Error ? dbErr.message : String(dbErr);
        console.error("[scenario] failed to save:", message);
        send("result", scenario);
      }
    } else {
      send("result", scenario);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[scenario] generation failed:", message);
    send("error", { message });
  } finally {
    res.end();
  }
});

// GET /api/scenarios — recent history (most recent first)
router.get("/", async (req: Request, res: Response) => {
  if (!isDBConnected()) {
    return res.json([]);
  }
  try {
    const scenarios = await Scenario.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .select("question title premise divergencePoint createdAt")
      .lean();
    res.json(scenarios);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[scenario] failed to fetch history:", message);
    res.status(500).json([]);
  }
});

// GET /api/scenarios/:id — full saved scenario
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  if (!isDBConnected()) {
    return res.status(404).json({ error: "history is disabled (no database connection)" });
  }
  try {
    const scenario = await Scenario.findById(req.params.id).lean();
    if (!scenario) {
      return res.status(404).json({ error: "not found" });
    }
    res.json(scenario);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[scenario] failed to fetch scenario:", message);
    res.status(500).json({ error: "failed to fetch scenario" });
  }
});

export default router;
