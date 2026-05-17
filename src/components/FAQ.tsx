"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { RevealText } from "@/components/ui/RevealText";
import { FAQ_ITEMS } from "@/data/faq";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" aria-label="Frequently asked questions" className="relative py-32 md:py-44">
      <div className="container-page">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.3em] text-accent"
            >
              ◆ FAQ
            </motion.span>
            <RevealText
              as="h2"
              className="font-display text-display-lg font-semibold tracking-tight text-balance"
            >
              Questions, answered.
            </RevealText>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="mt-6 text-pretty text-zinc-400"
            >
              Don&apos;t see what you&apos;re looking for?{" "}
              <a
                href="#contact"
                className="text-white underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                Just ask
              </a>
              .
            </motion.p>
          </div>

          <div className="lg:col-span-8">
            <ul className="divide-y divide-white/5 border-y border-white/5">
              {FAQ_ITEMS.map((item, i) => {
                const isOpen = open === i;
                return (
                  <li key={item.question}>
                    <motion.button
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-7 text-left transition-colors hover:text-white"
                    >
                      <span className="font-display text-xl font-medium text-white md:text-2xl">
                        {item.question}
                      </span>
                      <span
                        className={cn(
                          "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 transition-all duration-500",
                          isOpen
                            ? "rotate-45 border-accent/60 bg-accent text-white"
                            : "text-zinc-400 group-hover:border-white/20 group-hover:text-white",
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </motion.button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-panel-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-7 pr-12 text-pretty text-zinc-400">
                            {item.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
