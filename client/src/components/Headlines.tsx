import type { Headline } from "../types";

interface HeadlinesProps {
  headlines: Headline[];
}

export default function Headlines({ headlines }: HeadlinesProps) {
  return (
    <section className="panel">
      <h2 className="panel-title">From the Archives</h2>
      <div className="headlines">
        {headlines.map((h, i) => (
          <article key={i} className="headline-card">
            <div className="headline-meta">
              <span className="headline-outlet">{h.outlet}</span>
              <span className="headline-year">{h.year}</span>
            </div>
            <h3 className="headline-text">{h.headline}</h3>
            <p className="headline-summary">{h.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
