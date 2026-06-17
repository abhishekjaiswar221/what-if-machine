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
    <form className="question-form" onSubmit={handleSubmit}>
      <label htmlFor="question" className="question-label">
        Pose an impossible question
      </label>
      <div className="question-row">
        <input
          id="question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What if..."
          disabled={disabled}
          autoComplete="off"
        />
        <button type="submit" disabled={disabled || !question.trim()}>
          {disabled ? "Compiling…" : "Run the Machine"}
        </button>
      </div>
      <div className="examples">
        {EXAMPLES.map((ex) => (
          <button
            type="button"
            key={ex}
            className="example-chip"
            disabled={disabled}
            onClick={() => setQuestion(ex.replace(/^What if /, "").replace(/\?$/, ""))}
          >
            {ex}
          </button>
        ))}
      </div>
    </form>
  );
}
