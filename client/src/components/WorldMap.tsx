import { motion } from "framer-motion";
import type { MapData } from "../types";

interface WorldMapProps {
  map: MapData;
}

export default function WorldMap({ map }: WorldMapProps) {
  return (
    <section className="mb-12">
      <h2 className="mb-5 border-b border-border pb-2.5 text-2xl">Geopolitical Map</h2>
      <p className="mb-5.5 max-w-180 leading-[1.6]">{map.summary}</p>
      <motion.div
        className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {map.regions.map((r, i) => (
          <motion.div
            key={i}
            className="rounded-lg border bg-panel p-4"
            style={{ borderColor: r.color }}
            variants={{
              hidden: { opacity: 0, scale: 0.96 },
              visible: { opacity: 1, scale: 1 },
            }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ background: r.color }}
              />
              <span className="font-semibold">{r.name}</span>
            </div>
            <span
              className="mb-2 block font-mono text-[0.72rem] uppercase"
              style={{ color: r.color }}
            >
              {r.status}
            </span>
            <p className="m-0 text-[0.85rem] leading-normal text-text-dim">{r.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
