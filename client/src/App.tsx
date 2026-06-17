import { useEffect, useState } from "react";
import QuestionForm from "./components/QuestionForm";
import LoadingArchive from "./components/LoadingArchive";
import Documentary from "./components/Documentary";
import HistorySidebar from "./components/HistorySidebar";
import { streamScenario, fetchHistory, fetchScenario } from "./api/scenarios";
import type { Scenario, HistoryItem } from "./types";

export default function App() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawText, setRawText] = useState("");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetchHistory().then(setHistory).catch(() => {});
  }, []);

  async function handleSubmit(q: string) {
    setQuestion(q);
    setScenario(null);
    setError(null);
    setRawText("");
    setLoading(true);

    await streamScenario(q, {
      onDelta: (text) => setRawText((prev) => prev + text),
      onResult: (result) => {
        setScenario(result);
        setLoading(false);
        fetchHistory().then(setHistory).catch(() => {});
      },
      onError: (message) => {
        setError(message);
        setLoading(false);
      },
    });
  }

  async function handleSelectHistory(id: string) {
    try {
      const full = await fetchScenario(id);
      setQuestion(full.question ?? "");
      setScenario(full);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="app">
      <div className="app-main">
        <header className="app-header">
          <h1 className="app-logo">The What If? Machine</h1>
          <p className="app-tagline">Ask an impossible question. Get a documentary back.</p>
        </header>

        <QuestionForm onSubmit={handleSubmit} disabled={loading} />

        {error && <div className="error-banner">⚠ {error}</div>}

        {loading && <LoadingArchive rawText={rawText} />}

        {!loading && scenario && <Documentary scenario={scenario} question={question} />}

        {!loading && !scenario && !error && (
          <div className="empty-state">
            Try: <em>“What if cats paid taxes?”</em> or <em>“What if India was on Mars?”</em>
          </div>
        )}
      </div>

      <HistorySidebar history={history} onSelect={handleSelectHistory} currentId={scenario?._id} />
    </div>
  );
}
