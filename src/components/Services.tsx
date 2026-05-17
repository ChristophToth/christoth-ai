"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RevealText } from "@/components/ui/RevealText";
import { SERVICES } from "@/data/services";

export function Services() {
  return (
    <section
      id="services"
      aria-label="Services"
      className="relative py-32 md:py-44"
    >
      <div className="container-page">
        <div className="mb-16 flex flex-col gap-8 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.3em] text-accent"
            >
              ◆ How I work
            </motion.span>
            <RevealText
              as="h2"
              className="font-display text-display-lg font-semibold tracking-normal text-balance"
            >
              The work behind real adoption.
            </RevealText>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="max-w-md text-pretty text-zinc-400"
          >
            Most AI rollouts stall in the gap between executive ambition and
            day-one fluency. My work is about closing that gap with practical
            systems people can actually use.
          </motion.p>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-3xl border border-white/5 bg-white/5 md:grid-cols-3">
          {SERVICES.map((service, i) => (
            <motion.li
              key={service.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group relative overflow-hidden bg-ink-900 p-8 transition-colors duration-500 hover:bg-ink-800 md:p-10"
            >
              <div className="mb-12 flex items-start justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
                  {service.number}
                </span>
                <ArrowUpRight className="h-5 w-5 -translate-y-1 translate-x-1 text-zinc-500 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-accent group-hover:opacity-100" />
              </div>

              <h3 className="mb-4 font-display text-3xl font-semibold tracking-normal text-white md:text-4xl">
                {service.title}
              </h3>
              <p className="mb-8 max-w-sm text-zinc-400">{service.description}</p>

              <ul className="space-y-2 border-t border-white/5 pt-6">
                {service.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-center gap-3 text-sm text-zinc-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent" />
                    {bullet}
                  </li>
                ))}
              </ul>

              <div
                aria-hidden
                className="absolute inset-x-0 -bottom-px h-px scale-x-0 bg-gradient-to-r from-transparent via-accent to-transparent transition-transform duration-700 group-hover:scale-x-100"
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
