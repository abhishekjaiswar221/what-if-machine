import type { FamousPerson } from "../types";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface FamousPeopleProps {
  people: FamousPerson[];
}

export default function FamousPeople({ people }: FamousPeopleProps) {
  return (
    <section className="panel">
      <h2 className="panel-title">Figures of This Era</h2>
      <div className="people-grid">
        {people.map((p, i) => (
          <div key={i} className="person-card">
            <div className="person-avatar">{initials(p.name)}</div>
            <div className="person-info">
              <h3 className="person-name">{p.name}</h3>
              <p className="person-role">{p.role}</p>
              <p className="person-bio">{p.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
