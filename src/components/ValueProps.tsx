"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Activity, Compass, GraduationCap } from "lucide-react";
import { useRef } from "react";
import { RevealText } from "@/components/ui/RevealText";

const VALUES = [
  {
    icon: Activity,
    title: "Living it in real time.",
    description:
      "Not theoretical. Right now I’m working on AI adoption inside AT&T, where the challenge is not access to tools but making new ways of working stick.",
  },
  {
    icon: Compass,
    title: "Research to adoption.",
    description:
      "Fourteen years in market research and consumer insights gives me a rare muscle: designing AI use cases around how people actually behave.",
  },
  {
    icon: GraduationCap,
    title: "Disruptive by training.",
    description:
      "MBA candidate at CSULB in a program built around Disruptive Technologies — AI, Blockchain, Sustainability. Strategy fluency to back the execution.",
  },
];

export function ValueProps() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section
      ref={ref}
      aria-label="Value propositions"
      className="relative overflow-hidden py-32 md:py-44"
    >
      <motion.div
        style={{ y: yBg }}
        aria-hidden
        className="pointer-events-none absolute -inset-x-20 inset-y-0 -z-10 opacity-50"
      >
        <div className="absolute left-1/2 top-1/3 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-accent-electric/15 blur-[100px]" />
      </motion.div>

      <div className="container-page relative">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.3em] text-accent"
          >
            ◆ Why this lens
          </motion.span>
          <RevealText
            as="h2"
            className="font-display text-display-lg font-semibold tracking-tight text-balance"
          >
            The human layer is the hard part.
          </RevealText>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.article
                key={v.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6 }}
                className="group relative flex flex-col rounded-3xl border border-white/5 bg-gradient-to-b from-ink-800 to-ink-900 p-8 transition-all duration-500 hover:border-accent/30 hover:shadow-[0_30px_80px_-20px_rgba(124,92,255,0.35)]"
              >
                <div className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent transition-all duration-500 group-hover:scale-110 group-hover:bg-accent group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-3 font-display text-2xl font-semibold tracking-tight text-white">
                  {v.title}
                </h3>
                <p className="text-pretty text-zinc-400">{v.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
