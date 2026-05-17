"use client";

import { motion } from "framer-motion";
import { Compass, Gauge, LibraryBig, MessageSquareText, Workflow } from "lucide-react";
import { RevealText } from "@/components/ui/RevealText";

const MODEL_STEPS = [
  {
    icon: Compass,
    label: "Signal",
    title: "Find the work that matters",
    description:
      "Start with friction, repeat decisions, knowledge bottlenecks, and handoffs where AI can change the way work moves.",
  },
  {
    icon: Workflow,
    label: "System",
    title: "Design the operating rhythm",
    description:
      "Turn loose enthusiasm into rituals, ownership, governance, prompts, examples, and feedback loops.",
  },
  {
    icon: MessageSquareText,
    label: "Enable",
    title: "Build role-level fluency",
    description:
      "Give teams practical patterns they can reuse in the flow of their job, not abstract training they forget by Friday.",
  },
  {
    icon: Gauge,
    label: "Measure",
    title: "Read behavior over time",
    description:
      "Track depth, confidence, repeat usage, role coverage, and qualitative signal before calling adoption real.",
  },
];

export function OperatingModel() {
  return (
    <section
      id="model"
      aria-label="AI adoption operating model"
      className="relative overflow-hidden py-32 md:py-44"
    >
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.3em] text-accent"
            >
              ◆ Adoption OS
            </motion.span>
            <RevealText
              as="h2"
              className="font-display text-display-lg font-semibold tracking-normal text-balance"
            >
              From tool access to operating advantage.
            </RevealText>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mt-6 max-w-md text-pretty text-zinc-400"
            >
              My lane is the adoption layer: the connective tissue between
              strategy, enablement, workflow design, and measurable behavior
              change.
            </motion.p>
          </div>

          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-[8px] border border-white/5 bg-ink-900">
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40"
              />
              <div
                aria-hidden
                className="absolute left-8 right-8 top-[5.9rem] hidden h-px bg-gradient-to-r from-accent/0 via-accent/70 to-accent/0 md:block"
              />

              <div className="relative grid gap-px bg-white/5 md:grid-cols-4">
                {MODEL_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.article
                      key={step.label}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.65,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group min-h-[22rem] bg-ink-900 p-7 transition-colors duration-500 hover:bg-ink-800"
                    >
                      <div className="mb-10 flex items-center justify-between">
                        <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
                          {step.label}
                        </span>
                        <span className="grid h-11 w-11 place-items-center rounded-[8px] border border-white/10 bg-white/5 text-accent transition-all duration-500 group-hover:border-accent/50 group-hover:bg-accent group-hover:text-white">
                          <Icon className="h-5 w-5" />
                        </span>
                      </div>
                      <h3 className="font-display text-2xl font-semibold tracking-normal text-white">
                        {step.title}
                      </h3>
                      <p className="mt-4 text-pretty text-sm leading-6 text-zinc-400">
                        {step.description}
                      </p>
                    </motion.article>
                  );
                })}
              </div>

              <div className="relative flex flex-col gap-4 border-t border-white/5 bg-ink-950/40 p-7 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-[8px] bg-accent/15 text-accent">
                    <LibraryBig className="h-5 w-5" />
                  </span>
                  <p className="font-display text-xl font-semibold tracking-normal text-white">
                    Adoption becomes durable when the system makes the new
                    behavior easier than the old one.
                  </p>
                </div>
                <p className="max-w-sm text-sm leading-6 text-zinc-500">
                  The goal is not novelty. It is a repeatable way for people to
                  think, decide, and produce better work.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
