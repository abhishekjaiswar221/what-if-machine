import { motion } from "framer-motion";
import Timeline from "./Timeline";
import Headlines from "./Headlines";
import Economy from "./Economy";
import FamousPeople from "./FamousPeople";
import WorldMap from "./WorldMap";
import type {
  PartialScenario,
  TimelineEvent,
  Headline,
  TopEconomy,
  FamousPerson,
  MapRegion,
} from "../types";

interface LiveDocumentaryProps {
  partial: PartialScenario | null;
  question: string;
}

function hasAll<T>(item: Partial<T> | undefined, keys: (keyof T)[]): boolean {
  if (!item) return false;
  return keys.every((k) => item[k] !== undefined && item[k] !== "");
}

export default function LiveDocumentary({ partial, question }: LiveDocumentaryProps) {
  const timeline = (partial?.timeline ?? []).filter(
    (e): e is TimelineEvent => hasAll(e, ["year", "event"])
  );
  const headlines = (partial?.headlines ?? []).filter(
    (h): h is Headline => hasAll(h, ["year", "outlet", "headline", "summary"])
  );
  const topEconomies = (partial?.economy?.topEconomies ?? []).filter(
    (e): e is TopEconomy => hasAll(e, ["country", "gdpTrillions", "note"])
  );
  const economyReady =
    partial?.economy?.summary !== undefined && partial?.economy?.globalGdpTrillions !== undefined;
  const famousPeople = (partial?.famousPeople ?? []).filter(
    (p): p is FamousPerson => hasAll(p, ["name", "role", "bio"])
  );
  const regions = (partial?.map?.regions ?? []).filter(
    (r): r is MapRegion => hasAll(r, ["name", "status", "description", "color"])
  );
  const mapReady = partial?.map?.summary !== undefined;

  return (
    <article>
      <header className="mb-10 border-b border-border pb-8">
        <div className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-accent">
          <span className="h-2 w-2 animate-pulse-rec rounded-full bg-[#e64545]" /> ASSEMBLING
          ALTERNATE TIMELINE…
        </div>
        {partial?.title && (
          <h1 className="m-0 mb-3 text-[2.8rem] leading-[1.1]">{partial.title}</h1>
        )}
        <p className="m-0 mb-4 text-[1.1rem] italic text-text-dim">“What if {question}?”</p>
        {partial?.premise && (
          <p className="max-w-180 text-[1.15rem] leading-[1.6]">{partial.premise}</p>
        )}
        {partial?.divergencePoint && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 inline-block rounded-full border border-accent-dim bg-accent/12 px-3.5 py-1.5 font-mono text-sm text-accent"
          >
            Point of Divergence: <strong>{partial.divergencePoint}</strong>
          </motion.div>
        )}
      </header>

      {timeline.length > 0 && <Timeline events={timeline} />}
      {headlines.length > 0 && <Headlines headlines={headlines} />}
      {economyReady && (
        <Economy
          economy={{
            globalGdpTrillions: partial!.economy!.globalGdpTrillions!,
            summary: partial!.economy!.summary!,
            topEconomies,
          }}
        />
      )}
      {famousPeople.length > 0 && <FamousPeople people={famousPeople} />}
      {mapReady && <WorldMap map={{ summary: partial!.map!.summary!, regions }} />}
    </article>
  );
}
