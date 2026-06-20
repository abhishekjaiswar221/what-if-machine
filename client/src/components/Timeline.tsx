import { motion } from "framer-motion";
import type { TimelineEvent } from "../types";

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <section className="mb-12">
      <h2 className="mb-5 border-b border-border pb-2.5 text-2xl">Timeline of Divergence</h2>
      <motion.ol
        className="m-0 list-none border-l-2 border-border p-0"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        {events.map((e, i) => (
          <motion.li
            key={i}
            className="relative py-0 pr-0 pb-5.5 pl-6 before:absolute before:top-1 before:-left-1.25 before:h-2 before:w-2 before:rounded-full before:bg-accent before:content-['']"
            variants={{
              hidden: { opacity: 0, x: -10 },
              visible: { opacity: 1, x: 0 },
            }}
          >
            <span className="mb-0.5 block font-mono text-[0.85rem] text-accent">{e.year}</span>
            <span className="leading-[1.55]">{e.event}</span>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
