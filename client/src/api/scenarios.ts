import type { Scenario, HistoryItem } from "../types";

interface StreamHandlers {
  onDelta?: (text: string) => void;
  onResult?: (scenario: Scenario) => void;
  onError?: (message: string) => void;
}

/**
 * Streams a generated scenario from the backend via SSE-over-fetch
 * (EventSource can't send a POST body, so we parse the stream manually).
 */
export async function streamScenario(question: string, { onDelta, onResult, onError }: StreamHandlers): Promise<void> {
  const response = await fetch("/api/scenarios/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok || !response.body) {
    const message = await response.text().catch(() => "Request failed");
    onError?.(message);
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // SSE messages are separated by a blank line
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      const eventMatch = chunk.match(/^event: (.+)$/m);
      const dataMatch = chunk.match(/^data: (.+)$/m);
      if (!eventMatch || !dataMatch) continue;

      const event = eventMatch[1];
      const data = JSON.parse(dataMatch[1]);

      if (event === "delta") onDelta?.(data.text);
      else if (event === "result") onResult?.(data as Scenario);
      else if (event === "error") onError?.(data.message);
    }
  }
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch("/api/scenarios");
  if (!res.ok) return [];
  return res.json();
}

export async function fetchScenario(id: string): Promise<Scenario> {
  const res = await fetch(`/api/scenarios/${id}`);
  if (!res.ok) throw new Error("Scenario not found");
  return res.json();
}
