import { motion } from "framer-motion";
import type { HistoryItem } from "../types";

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (id: string) => void;
  currentId?: string;
}

export default function HistorySidebar({ history, onSelect, currentId }: HistorySidebarProps) {
  if (!history.length) return null;

  return (
    <aside className="h-fit border-l border-border pl-6">
      <h2 className="mt-0 font-mono text-[1.05rem] tracking-[0.06em] text-text-dim uppercase">
        Past Broadcasts
      </h2>
      <motion.ul
        className="m-0 flex list-none flex-col gap-2 p-0"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.04 } },
        }}
      >
        {history.map((h) => {
          const active = h._id === currentId;
          return (
            <motion.li
              key={h._id}
              variants={{
                hidden: { opacity: 0, x: 8 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <button
                onClick={() => onSelect(h._id)}
                className={`flex w-full flex-col gap-0.5 rounded-md border px-3 py-2.5 text-left font-[inherit] text-paper transition-colors duration-150 hover:bg-panel ${
                  active ? "border-accent-dim bg-panel" : "border-transparent"
                }`}
              >
                <span className="text-[0.85rem] font-semibold">{h.title}</span>
                <span className="text-xs italic text-text-dim">{h.question}</span>
              </button>
            </motion.li>
          );
        })}
      </motion.ul>
    </aside>
  );
}
