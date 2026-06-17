import type { Economy as EconomyData } from "../types";

interface EconomyProps {
  economy: EconomyData;
}

export default function Economy({ economy }: EconomyProps) {
  const max = Math.max(...economy.topEconomies.map((e) => e.gdpTrillions), 1);

  return (
    <section className="panel">
      <h2 className="panel-title">Economic Outlook</h2>
      <p className="economy-summary">{economy.summary}</p>
      <div className="economy-global">
        <span className="economy-global-figure">
          ${economy.globalGdpTrillions.toLocaleString()}T
        </span>
        <span className="economy-global-label">Estimated Global GDP</span>
      </div>
      <div className="economy-bars">
        {economy.topEconomies.map((e, i) => (
          <div key={i} className="economy-bar-row">
            <span className="economy-bar-label">{e.country}</span>
            <div className="economy-bar-track">
              <div
                className="economy-bar-fill"
                style={{ width: `${(e.gdpTrillions / max) * 100}%` }}
              />
            </div>
            <span className="economy-bar-value">${e.gdpTrillions.toLocaleString()}T</span>
            <span className="economy-bar-note">{e.note}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
