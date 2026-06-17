# The What If? Machine

Ask an impossible question — "What if cats paid taxes?", "What if India was on Mars?", "What if Java never existed?" — and get back a documentary-style alternate history: a divergence timeline, fictional news headlines, an economic snapshot, notable figures, and a stylized geopolitical map.

MERN stack (TypeScript throughout): MongoDB, Express, React (Vite), Node — with Gemini (Google Generative AI API) generating the alternate history as schema-constrained JSON, streamed live to the browser.

## How it works

1. The frontend posts the question to `POST /api/scenarios/generate`.
2. The backend calls Gemini (`gemini-2.5-flash`) with `generationConfig.responseSchema` set to a strict schema covering title, premise, timeline, headlines, economy, famous people, and map regions — guaranteeing parseable structured output (see `server/src/services/geminiService.ts`).
3. The request is streamed; raw text deltas are relayed to the browser over Server-Sent Events so the UI can show a "compiling the archives" live effect instead of a blank spinner.
4. Once complete, the full parsed JSON is sent as a final `result` SSE event, saved to MongoDB, and rendered as the documentary.

## Project structure

```
server/   Express API (TypeScript) + Gemini integration + MongoDB models
client/   React + Vite frontend (TypeScript)
```

Both packages share the same scenario shape as hand-written TypeScript interfaces — `server/src/types.ts` and `client/src/types.ts` — kept in sync manually since they're separate npm packages, not a workspace.

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# edit .env and set GEMINI_API_KEY=...
npm run dev
```

The API runs on `http://localhost:5000`. If MongoDB isn't running, the server still starts — history/persistence is just disabled (generation still works).

To use MongoDB, run a local instance (`mongod`) or point `MONGODB_URI` in `.env` at Atlas. If your local instance has auth enabled, include credentials: `mongodb://user:pass@localhost:27017/what-if-machine?authSource=admin`.

Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Opens on `http://localhost:5173` and proxies `/api/*` to the backend.

### 3. Try it

Open the app, type a "what if" question, hit **Run the Machine**, and watch the documentary assemble.

## TypeScript notes

- **Server**: runs directly on TypeScript source via [`tsx`](https://github.com/privatenumber/tsx) in dev (`npm run dev` → `tsx watch src/index.ts`). `npm run build` compiles to `dist/` via `tsc`, then `npm start` runs the compiled output. `npm run typecheck` runs `tsc --noEmit` without emitting files.
- **Client**: standard Vite + TypeScript setup. `npm run dev` for the dev server, `npm run build` runs `tsc -b` (project-wide typecheck) followed by the Vite production build.
- Relative imports use a `.js` extension even though the source files are `.ts` (e.g. `import { connectDB } from "./config/db.js"`) — this is the standard TypeScript-with-ESM convention under `NodeNext` module resolution: the extension refers to what will exist after compilation, and `tsx`/`tsc` both resolve it to the sibling `.ts` file.

## Notes on model choice

- Defaults to `gemini-2.5-flash` for a good speed/quality/cost balance. For richer, more internally-consistent timelines, swap the `MODEL` constant in `server/src/services/geminiService.ts` to `gemini-2.5-pro` (slower, pricier). If the model ID ever 404s, check [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) for the current naming and update the constant.
- Structured output is enforced via `generationConfig.responseSchema` (Gemini's OpenAPI-3.0-style schema subset — uppercase `SchemaType` enums, no `additionalProperties`) rather than prompting "respond in JSON" — this guarantees the response parses cleanly every time.
- `maxOutputTokens` is set to 8000 with streaming enabled, since the full payload (timeline + headlines + economy + people + map) can be sizeable.

## Possible extensions

- Real map rendering (SVG world map with region highlighting) instead of the stylized region-card grid.
- Image generation for headline thumbnails or "archival photos" of famous figures.
- Sharable permalinks per scenario (`/scenario/:id` route on the frontend).
- Rate limiting / caching identical questions to avoid redundant API calls.
