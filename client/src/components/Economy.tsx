import { motion } from "framer-motion";
import type { Economy as EconomyData } from "../types";

interface EconomyProps {
  economy: EconomyData;
}

export default function Economy({ economy }: EconomyProps) {
  const max = Math.max(...economy.topEconomies.map((e) => e.gdpTrillions), 1);

  return (
    <section className="mb-12">
      <h2 className="mb-5 border-b border-border pb-2.5 text-2xl">Economic Outlook</h2>
      <p className="max-w-180 leading-[1.6]">{economy.summary}</p>
      <div className="my-5 mb-6.5 flex items-baseline gap-3">
        <span className="text-[2.4rem] font-semibold text-accent">
          ${economy.globalGdpTrillions.toLocaleString()}T
        </span>
        <span className="font-mono text-sm text-text-dim uppercase">Estimated Global GDP</span>
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {economy.topEconomies.map((e, i) => (
          <motion.div
            key={i}
            className="mb-3.5 grid grid-cols-[140px_1fr_70px] items-center gap-3"
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <span className="text-[0.95rem] font-semibold">{e.country}</span>
            <div className="h-2.5 overflow-hidden rounded-sm bg-border">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(e.gdpTrillions / max) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <span className="text-right font-mono text-sm text-accent">
              ${e.gdpTrillions.toLocaleString()}T
            </span>
            <span className="col-span-full -mt-1 text-[0.82rem] text-text-dim">{e.note}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
