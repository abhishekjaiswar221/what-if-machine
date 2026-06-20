import { useEffect, useRef } from "react";

interface LoadingArchiveProps {
  rawText: string;
}

/**
 * Shows a console-style scroll of the raw streamed text while the model
 * is generating — gives the "compiling the archives" documentary feel
 * instead of a blank spinner.
 */
export default function LoadingArchive({ rawText }: LoadingArchiveProps) {
  const scrollRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [rawText]);

  return (
    <div className="overflow-hidden rounded-[10px] border border-border bg-[#050505]">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 font-mono text-xs tracking-[0.08em] text-accent">
        <span className="h-2 w-2 animate-pulse-rec rounded-full bg-[#e64545]" /> ASSEMBLING
        ALTERNATE TIMELINE…
      </div>
      <pre
        className="m-0 h-70 overflow-y-auto p-4 font-mono text-[0.78rem] leading-[1.6] wrap-break-word whitespace-pre-wrap text-[#7ed99a]"
        ref={scrollRef}
      >
        {rawText || "Initializing divergence engine..."}
      </pre>
    </div>
  );
}
