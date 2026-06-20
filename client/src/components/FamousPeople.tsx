import { motion } from "framer-motion";
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
    <section className="mb-12">
      <h2 className="mb-5 border-b border-border pb-2.5 text-2xl">Figures of This Era</h2>
      <motion.div
        className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
      >
        {people.map((p, i) => (
          <motion.div
            key={i}
            className="flex gap-4 rounded-lg border border-border bg-panel p-4.5"
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0 },
            }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-dim font-mono font-bold text-paper">
              {initials(p.name)}
            </div>
            <div>
              <h3 className="m-0 mb-0.5 text-[1.05rem]">{p.name}</h3>
              <p className="m-0 mb-2 font-mono text-xs text-accent uppercase">{p.role}</p>
              <p className="m-0 text-[0.88rem] leading-normal text-text-dim">{p.bio}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
