"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const SOCIALS = [
  { label: "Email", href: "mailto:chris@christoth.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/christoth/" },
  { label: "Resume", href: "/resume.pdf" },
];

export function Footer() {
  return (
    <footer
      id="contact"
      aria-label="Contact"
      className="relative overflow-hidden pt-32 md:pt-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60rem] bg-[radial-gradient(60rem_30rem_at_50%_0%,rgba(124,92,255,0.18),transparent_70%)]"
      />

      <div className="container-page relative">
        <div className="mx-auto max-w-5xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-block font-mono text-xs uppercase tracking-[0.3em] text-accent"
          >
            ◆ Get in touch
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-display-xl font-semibold tracking-tight text-balance"
          >
            Adopting AI at scale?{" "}
            <span className="gradient-text">Let&apos;s talk.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mx-auto mt-6 max-w-xl text-pretty text-zinc-400 md:text-lg"
          >
            Whether you&apos;re scoping a rollout, designing an enablement
            program, or hiring for a senior AI-adoption role — send a note and
            I&apos;ll reply within one business day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton href="mailto:chris@christoth.com" variant="primary">
              chris@christoth.com
              <ArrowUpRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              href="https://www.linkedin.com/in/christoth/"
              variant="ghost"
            >
              Connect on LinkedIn
            </MagneticButton>
          </motion.div>
        </div>

        <div className="mt-32 grid gap-10 border-t border-white/5 pt-10 md:grid-cols-3 md:items-center">
          <div className="space-y-2 font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
            <p>© {new Date().getFullYear()} Chris Toth. All rights reserved.</p>
            <p className="normal-case tracking-normal">
              Views are my own and do not represent AT&amp;T.
            </p>
          </div>
          <ul className="flex flex-wrap justify-center gap-6">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  className="group inline-flex items-center gap-1 text-sm text-zinc-300 transition-colors hover:text-white"
                >
                  {s.label}
                  <ArrowUpRight className="h-3.5 w-3.5 -translate-y-px opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
          <div className="text-right font-mono text-xs uppercase tracking-[0.25em] text-zinc-500 md:text-right">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-emerald-400" />
              Currently online
            </span>
          </div>
        </div>

        <div
          aria-hidden
          className="select-none pb-10 pt-20 text-center font-display text-[clamp(4rem,18vw,18rem)] font-semibold leading-none tracking-tighter"
        >
          <span className="bg-gradient-to-b from-white/10 to-white/0 bg-clip-text text-transparent">
            CHRIS&nbsp;TOTH
          </span>
        </div>
      </div>
    </footer>
  );
}
