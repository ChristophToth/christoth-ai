"use client";

import { motion } from "framer-motion";
import { RevealText } from "@/components/ui/RevealText";
import { STATS, TOOLS } from "@/data/expertise";

export function Expertise() {
  return (
    <section
      id="expertise"
      aria-label="Expertise"
      className="relative py-32 md:py-44"
    >
      <div className="container-page">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.3em] text-accent"
            >
              ◆ Expertise
            </motion.span>
            <RevealText
              as="h2"
              className="font-display text-display-lg font-semibold tracking-normal text-balance"
            >
              The stack behind the work.
            </RevealText>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mt-6 max-w-md text-pretty text-zinc-400"
            >
              The toolset is just the surface. What actually matters is knowing
              which tool fits which problem — and which behavior change has to
              happen for it to land.
            </motion.p>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8">
              {STATS.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.6 }}
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-display text-4xl font-semibold tracking-normal text-white md:text-5xl">
                    {stat.value}
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/5 bg-white/5 sm:grid-cols-3 md:grid-cols-4">
              {TOOLS.map((tool, i) => (
                <motion.li
                  key={tool.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: i * 0.05, duration: 0.6 }}
                  className="group relative flex aspect-square flex-col items-start justify-end overflow-hidden bg-ink-900 p-5 transition-colors duration-500 hover:bg-ink-800"
                >
                  <ToolGlyph name={tool.name} />
                  <div className="relative z-10 mt-auto">
                    <div className="font-display text-lg font-semibold text-white">
                      {tool.name}
                    </div>
                    <div className="text-xs text-zinc-500">{tool.description}</div>
                  </div>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/0 via-accent/0 to-accent/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolGlyph({ name }: { name: string }) {
  const initial = name.slice(0, 1);
  return (
    <div
      aria-hidden
      className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 font-display text-lg text-zinc-200 transition-all duration-500 group-hover:rotate-[-8deg] group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:text-accent-glow"
    >
      {initial}
    </div>
  );
}
