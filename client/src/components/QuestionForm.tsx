import { useState, FormEvent } from "react";

const EXAMPLES = [
  "What if cats paid taxes?",
  "What if India was on Mars?",
  "What if Java never existed?",
  "What if the printing press was never invented?",
];

interface QuestionFormProps {
  onSubmit: (question: string) => void;
  disabled: boolean;
}

export default function QuestionForm({ onSubmit, disabled }: QuestionFormProps) {
  const [question, setQuestion] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!question.trim() || disabled) return;
    onSubmit(question.trim());
  }

  return (
    <form
      className="mb-10 rounded-[10px] border border-border bg-panel p-6"
      onSubmit={handleSubmit}
    >
      <label
        htmlFor="question"
        className="mb-2.5 block font-mono text-xs tracking-[0.08em] text-accent uppercase"
      >
        Pose an impossible question
      </label>
      <div className="flex gap-2.5">
        <input
          id="question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What if..."
          disabled={disabled}
          autoComplete="off"
          className="flex-1 rounded-md border border-border bg-[#0c0b09] px-4 py-3.5 font-[inherit] text-[1.05rem] text-paper outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={disabled || !question.trim()}
          className="cursor-pointer rounded-md border-none bg-accent px-5 font-mono text-sm font-semibold tracking-[0.03em] text-[#1a0f06] transition-opacity duration-150 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {disabled ? "Compiling…" : "Run the Machine"}
        </button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            type="button"
            key={ex}
            disabled={disabled}
            onClick={() => setQuestion(ex.replace(/^What if /, "").replace(/\?$/, ""))}
            className="cursor-pointer rounded-full border border-border bg-transparent px-3.5 py-1.5 font-mono text-sm text-text-dim hover:border-accent hover:text-accent"
          >
            {ex}
          </button>
        ))}
      </div>
    </form>
  );
}
