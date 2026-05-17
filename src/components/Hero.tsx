"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pb-16 pt-36 md:pb-24 md:pt-40"
      aria-label="Hero"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />

      <motion.div style={{ y, opacity, scale }} className="container-page relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Currently driving AI adoption at AT&amp;T
        </motion.div>

        <h1 className="font-display max-w-6xl text-[3rem] font-semibold leading-[1.08] tracking-normal text-balance sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.35rem] xl:text-[6rem]">
          <RevealLine delay={0.05}>AI adoption</RevealLine>
          <RevealLine delay={0.18}>
            is behavior{" "}
            <span className="relative inline-block">
              <span className="gradient-text">change</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -bottom-[0.16em] left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-accent to-accent-electric"
              />
            </span>
            .
          </RevealLine>
          <RevealLine delay={0.32}>At enterprise scale.</RevealLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-7 max-w-2xl text-pretty text-base leading-7 text-zinc-400 md:mt-8 md:text-lg md:leading-8"
        >
          I&apos;m Chris Toth — 14 years across market research, consumer insights, and
          marketing, now focused on AI adoption inside AT&amp;T. I translate
          insight muscle into the operating rhythms, enablement, and behavior
          change that make enterprise AI stick.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <MagneticButton href="#work" variant="primary">
            See the work
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </MagneticButton>
          <MagneticButton href="#contact" variant="ghost">
            Get in touch
          </MagneticButton>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/5 bg-white/5 sm:grid-cols-4"
        >
          {[
            ["14yr", "Research & insights"],
            ["AI", "Enterprise adoption"],
            ["AT&T", "Current focus"],
            ["MBA", "Disruptive tech"],
          ].map(([value, label]) => (
            <div key={label} className="bg-ink-900/80 p-4">
              <dt className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-zinc-500">
                {label}
              </dt>
              <dd className="mt-1 font-display text-2xl font-semibold tracking-normal text-white">
                {value}
              </dd>
            </div>
          ))}
        </motion.dl>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500 md:flex"
        >
          <span>Scroll</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          >
            <ArrowDown className="h-4 w-4" />
          </motion.span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function RevealLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="block will-change-transform"
      >
        {children}
      </motion.span>
    </span>
  );
}
