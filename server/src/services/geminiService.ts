import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { ScenarioData } from "../types.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

// If this model ID 404s, check https://ai.google.dev/gemini-api/docs/models
// for the current Gemini model names and swap it in.
const MODEL = "gemini-2.5-flash";

// Gemini's responseSchema uses an OpenAPI-3.0-style subset (uppercase SchemaType
// enums, no additionalProperties) rather than standard JSON Schema.
const SCENARIO_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING, description: "A punchy documentary-style title for this alternate timeline" },
    premise: { type: SchemaType.STRING, description: "2-3 sentence framing of the alternate history premise, written like a documentary narrator" },
    divergencePoint: { type: SchemaType.STRING, description: "The specific moment/year where this timeline split from real history" },
    timeline: {
      type: SchemaType.ARRAY,
      description: "8-14 chronological events of this alternate history, earliest first",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          year: { type: SchemaType.STRING },
          event: { type: SchemaType.STRING, description: "1-3 sentences describing what happened" },
        },
        required: ["year", "event"],
      },
    },
    headlines: {
      type: SchemaType.ARRAY,
      description: "5-8 fictional news headlines from various points in this timeline",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          year: { type: SchemaType.STRING },
          outlet: { type: SchemaType.STRING, description: "A fictional or real-sounding news outlet name fitting the timeline" },
          headline: { type: SchemaType.STRING, description: "The headline text itself, punchy and period-appropriate" },
          summary: { type: SchemaType.STRING, description: "1-2 sentence article summary" },
        },
        required: ["year", "outlet", "headline", "summary"],
      },
    },
    economy: {
      type: SchemaType.OBJECT,
      description: "Economic snapshot of this alternate world at its present day",
      properties: {
        globalGdpTrillions: { type: SchemaType.NUMBER, description: "Estimated global GDP in trillions of USD" },
        summary: { type: SchemaType.STRING, description: "2-3 sentence narration of the economic state of this world" },
        topEconomies: {
          type: SchemaType.ARRAY,
          description: "4-6 leading economies/powers in this timeline",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              country: { type: SchemaType.STRING },
              gdpTrillions: { type: SchemaType.NUMBER },
              note: { type: SchemaType.STRING, description: "Short note on why this entity is significant economically here" },
            },
            required: ["country", "gdpTrillions", "note"],
          },
        },
      },
      required: ["globalGdpTrillions", "summary", "topEconomies"],
    },
    famousPeople: {
      type: SchemaType.ARRAY,
      description: "4-6 notable figures unique to or transformed by this timeline",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING },
          role: { type: SchemaType.STRING, description: "Their title/role in this alternate world" },
          bio: { type: SchemaType.STRING, description: "2-3 sentence biography explaining their significance in this timeline" },
        },
        required: ["name", "role", "bio"],
      },
    },
    map: {
      type: SchemaType.OBJECT,
      description: "A stylized geopolitical snapshot of this world",
      properties: {
        summary: { type: SchemaType.STRING, description: "1-2 sentence overview of the geopolitical map" },
        regions: {
          type: SchemaType.ARRAY,
          description: "5-9 regions/countries/territories and their status in this timeline",
          items: {
            type: SchemaType.OBJECT,
            properties: {
              name: { type: SchemaType.STRING },
              status: { type: SchemaType.STRING, description: "Short label, e.g. 'Superpower', 'Annexed', 'Independent Republic', 'Uninhabited'" },
              description: { type: SchemaType.STRING, description: "1 sentence on this region's situation" },
              color: { type: SchemaType.STRING, description: "A hex color code suggestive of this region's allegiance/status, e.g. #3b82f6" },
            },
            required: ["name", "status", "description", "color"],
          },
        },
      },
      required: ["summary", "regions"],
    },
  },
  required: ["title", "premise", "divergencePoint", "timeline", "headlines", "economy", "famousPeople", "map"],
};

const SYSTEM_PROMPT = `You are the research engine behind "The What If? Machine" — a documentary generator that builds plausible, internally consistent alternate histories from a single hypothetical question.

Given a "what if" premise, invent a coherent alternate timeline with real causal logic (one change leads to plausible downstream consequences). Mix gravitas with wit where appropriate, but keep it grounded enough to feel like a real documentary, not a joke list. Be specific: use real-sounding names, dates, places, and numbers rather than vague generalities. Maintain internal consistency across the timeline, headlines, economy, famous people, and map — they should all describe the same coherent world.`;

export type OnDelta = (textDelta: string) => void;

/**
 * Streams a structured alternate-history scenario from Gemini.
 */
export async function generateScenario(question: string, onDelta?: OnDelta): Promise<ScenarioData> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: SCENARIO_SCHEMA,
      maxOutputTokens: 8000,
    },
  });

  const result = await model.generateContentStream(`What if: ${question}`);

  let fullText = "";
  for await (const chunk of result.stream) {
    const delta = chunk.text();
    if (delta) {
      fullText += delta;
      onDelta?.(delta);
    }
  }

  const response = await result.response;

  if (!response.candidates || response.candidates.length === 0) {
    const blockReason = response.promptFeedback?.blockReason;
    throw new Error(
      blockReason
        ? `The model declined to generate this scenario (${blockReason}). Try rephrasing your question.`
        : "The model returned no content. Try rephrasing your question."
    );
  }

  const finishReason = response.candidates[0].finishReason;
  if (finishReason === "SAFETY" || finishReason === "RECITATION") {
    throw new Error("The model declined to generate this scenario. Try rephrasing your question.");
  }

  const text = response.text() || fullText;
  return JSON.parse(text) as ScenarioData;
}
