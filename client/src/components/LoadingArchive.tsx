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
    <div className="loading-archive">
      <div className="loading-archive-header">
        <span className="rec-dot" /> ASSEMBLING ALTERNATE TIMELINE…
      </div>
      <pre className="loading-archive-text" ref={scrollRef}>
        {rawText || "Initializing divergence engine..."}
      </pre>
    </div>
  );
}
