import type { TimelineEvent } from "../types";

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <section className="panel">
      <h2 className="panel-title">Timeline of Divergence</h2>
      <ol className="timeline">
        {events.map((e, i) => (
          <li key={i} className="timeline-item">
            <span className="timeline-year">{e.year}</span>
            <span className="timeline-event">{e.event}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
