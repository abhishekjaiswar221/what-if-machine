import type { HistoryItem } from "../types";

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (id: string) => void;
  currentId?: string;
}

export default function HistorySidebar({ history, onSelect, currentId }: HistorySidebarProps) {
  if (!history.length) return null;

  return (
    <aside className="history-sidebar">
      <h2 className="history-title">Past Broadcasts</h2>
      <ul className="history-list">
        {history.map((h) => (
          <li key={h._id}>
            <button
              className={`history-item ${h._id === currentId ? "active" : ""}`}
              onClick={() => onSelect(h._id)}
            >
              <span className="history-item-title">{h.title}</span>
              <span className="history-item-question">{h.question}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
