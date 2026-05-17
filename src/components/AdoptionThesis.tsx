"use client";

import { motion } from "framer-motion";
import { BarChart3, Brain, ShieldCheck, Users, Workflow } from "lucide-react";
import { RevealText } from "@/components/ui/RevealText";

const THESIS_POINTS = [
  {
    icon: Users,
    title: "Adoption beats access.",
    description:
      "Buying tools creates availability. Changing how teams plan, write, analyze, decide, and collaborate creates transformation.",
  },
  {
    icon: Workflow,
    title: "Use cases start in real work.",
    description:
      "The strongest AI workflows come from the friction inside existing jobs, not from vendor demos or abstract capability maps.",
  },
  {
    icon: Brain,
    title: "Research instincts matter.",
    description:
      "AI adoption is full of human signals: resistance, confusion, confidence, shortcuts, incentives, and behavior change.",
  },
  {
    icon: ShieldCheck,
    title: "Enablement needs operating rhythm.",
    description:
      "Prompt libraries, governance, champions, rituals, and feedback loops have to work together or momentum fades after launch.",
  },
  {
    icon: BarChart3,
    title: "Measurement has to mature.",
    description:
      "Usage is the floor. Durable adoption shows up in workflow depth, role coverage, repeat behavior, and business-relevant outcomes.",
  },
];

export function AdoptionThesis() {
  return (
    <section
      id="thesis"
      aria-label="AI adoption thesis"
      className="relative py-32 md:py-44"
    >
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.3em] text-accent"
            >
              ◆ Point of view
            </motion.span>
            <RevealText
              as="h2"
              className="font-display text-display-lg font-semibold tracking-tight text-balance"
            >
              AI adoption is a behavior-change problem.
            </RevealText>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mt-6 max-w-md text-pretty text-zinc-400"
            >
              The technology matters. But inside a large organization, the hard
              part is turning curiosity into repeatable practice, and repeatable
              practice into a new way of working.
            </motion.p>
          </div>

          <div className="lg:col-span-7">
            <ul className="grid gap-px overflow-hidden rounded-3xl border border-white/5 bg-white/5 sm:grid-cols-2">
              {THESIS_POINTS.map((point, i) => {
                const Icon = point.icon;
                return (
                  <motion.li
                    key={point.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{
                      delay: i * 0.06,
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group min-h-64 bg-ink-900 p-7 transition-colors duration-500 hover:bg-ink-800 md:p-8"
                  >
                    <div className="mb-10 grid h-11 w-11 place-items-center rounded-[8px] bg-accent/15 text-accent transition-all duration-500 group-hover:bg-accent group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-white">
                      {point.title}
                    </h3>
                    <p className="mt-3 text-pretty text-zinc-400">
                      {point.description}
                    </p>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
