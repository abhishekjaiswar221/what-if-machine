import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { parse } from "partial-json";
import QuestionForm from "./components/QuestionForm";
import LiveDocumentary from "./components/LiveDocumentary";
import Documentary from "./components/Documentary";
import HistorySidebar from "./components/HistorySidebar";
import { streamScenario, fetchHistory, fetchScenario } from "./api/scenarios";
import type { Scenario, HistoryItem, PartialScenario } from "./types";

export default function App() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [partial, setPartial] = useState<PartialScenario | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const rawTextRef = useRef("");

  useEffect(() => {
    fetchHistory().then(setHistory).catch(() => {});
  }, []);

  async function handleSubmit(q: string) {
    setQuestion(q);
    setScenario(null);
    setError(null);
    setPartial(null);
    rawTextRef.current = "";
    setLoading(true);

    await streamScenario(q, {
      onDelta: (text) => {
        rawTextRef.current += text;
        try {
          setPartial(parse(rawTextRef.current) as PartialScenario);
        } catch {
          // not enough valid JSON yet — keep showing the last good partial
        }
      },
      onResult: (result) => {
        setScenario(result);
        setPartial(null);
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
    <div className="mx-auto grid max-w-[1200px] grid-cols-[1fr_280px] gap-8 px-6 pt-12 pb-24 max-[900px]:grid-cols-1">
      <div>
        <header className="mb-8">
          <h1 className="m-0 text-[2.6rem] font-semibold tracking-[-0.01em]">
            The What If? Machine
          </h1>
          <p className="mx-0 mt-[0.4rem] mb-0 italic text-text-dim">
            Ask an impossible question. Get a documentary back.
          </p>
        </header>

        <QuestionForm onSubmit={handleSubmit} disabled={loading} />

        {error && (
          <div className="mb-6 rounded-lg border border-[#e64545] bg-[#e64545]/12 px-4 py-3 font-mono text-sm text-[#ff9d9d]">
            ⚠ {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LiveDocumentary partial={partial} question={question} />
            </motion.div>
          )}

          {!loading && scenario && (
            <motion.div
              key={scenario._id ?? "scenario"}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <Documentary scenario={scenario} question={question} />
            </motion.div>
          )}

          {!loading && !scenario && !error && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-8 italic text-text-dim"
            >
              Try: <em>“What if cats paid taxes?”</em> or <em>“What if India was on Mars?”</em>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <HistorySidebar history={history} onSelect={handleSelectHistory} currentId={scenario?._id} />
    </div>
  );
}
