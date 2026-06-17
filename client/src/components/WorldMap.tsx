import type { MapData } from "../types";

interface WorldMapProps {
  map: MapData;
}

export default function WorldMap({ map }: WorldMapProps) {
  return (
    <section className="panel">
      <h2 className="panel-title">Geopolitical Map</h2>
      <p className="map-summary">{map.summary}</p>
      <div className="map-grid">
        {map.regions.map((r, i) => (
          <div key={i} className="map-region" style={{ borderColor: r.color }}>
            <div className="map-region-header">
              <span className="map-region-swatch" style={{ background: r.color }} />
              <span className="map-region-name">{r.name}</span>
            </div>
            <span className="map-region-status" style={{ color: r.color }}>
              {r.status}
            </span>
            <p className="map-region-desc">{r.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
