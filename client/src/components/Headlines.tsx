import { motion } from "framer-motion";
import type { Headline } from "../types";

interface HeadlinesProps {
  headlines: Headline[];
}

export default function Headlines({ headlines }: HeadlinesProps) {
  return (
    <section className="mb-12">
      <h2 className="mb-5 border-b border-border pb-2.5 text-2xl">From the Archives</h2>
      <motion.div
        className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {headlines.map((h, i) => (
          <motion.article
            key={i}
            className="rounded-lg border border-border bg-panel p-4.5"
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-2 flex justify-between font-mono text-[0.7rem] tracking-[0.04em] text-text-dim uppercase">
              <span>{h.outlet}</span>
              <span>{h.year}</span>
            </div>
            <h3 className="m-0 mb-2 text-[1.1rem] leading-[1.3]">{h.headline}</h3>
            <p className="m-0 text-[0.9rem] leading-normal text-text-dim">{h.summary}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
