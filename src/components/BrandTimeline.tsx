"use client";

import { motion } from "framer-motion";
import { RevealText } from "@/components/ui/RevealText";
import { BRAND_PHASES, type Brand } from "@/data/brands";
import { cn } from "@/lib/utils";

const BRANDS = BRAND_PHASES.flatMap((phase) =>
  phase.brands.map((brand) => ({
    ...brand,
    phase: phase.current ? "Current" : phase.label,
    current: phase.current,
  })),
);

const TOP_ROW = BRANDS.filter((_, index) => index % 2 === 0);
const BOTTOM_ROW = BRANDS.filter((_, index) => index % 2 === 1);

export function BrandTimeline() {
  return (
    <section
      id="track-record"
      aria-label="Track record"
      className="relative overflow-hidden py-32 md:py-44"
    >
      <div className="container-page mb-16 md:mb-24">
        <div className="mb-16 max-w-3xl md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-block font-mono text-xs uppercase tracking-[0.3em] text-accent"
          >
            ◆ Track record
          </motion.span>
          <RevealText
            as="h2"
            className="font-display text-display-lg font-semibold tracking-tight text-balance"
          >
            Fourteen years studying behavior across categories.
          </RevealText>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mt-6 max-w-xl text-pretty text-zinc-400"
          >
            Entertainment, automotive, retail, gaming, tech, music, telecom —
            the through-line is how people decide, adopt, resist, and change.
            That is the muscle I bring to AI adoption.
          </motion.p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative space-y-3 md:space-y-4"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-950 to-transparent md:w-48"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-950 to-transparent md:w-48"
        />

        <BrandMarquee brands={TOP_ROW} direction="right" />
        <BrandMarquee brands={BOTTOM_ROW} direction="left" />
      </motion.div>
    </section>
  );
}

function BrandMarquee({
  brands,
  direction,
}: {
  brands: Array<Brand & { phase: string; current?: boolean }>;
  direction: "left" | "right";
}) {
  const repeatedBrands = [...brands, ...brands];

  return (
    <div className="group/marquee flex overflow-hidden">
      <ul
        className="flex min-w-max animate-marquee gap-3 will-change-transform group-hover/marquee:[animation-play-state:paused] md:gap-4"
        style={{
          animationDuration: "42s",
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {repeatedBrands.map((brand, index) => (
          <li key={`${brand.name}-${index}`}>
            <BrandCard brand={brand} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function BrandCard({
  brand,
}: {
  brand: Brand & { phase: string; current?: boolean };
}) {
  return (
    <article
      className={cn(
        "group/card flex h-32 w-[19rem] items-center gap-6 rounded-[8px] border border-white/5 bg-ink-900/90 px-8 transition-all duration-500 hover:border-accent/30 hover:bg-ink-800 md:h-40 md:w-[26rem] md:px-10",
        brand.current && "border-emerald-400/20 bg-emerald-400/[0.04]",
      )}
    >
      <BrandLogo brand={brand} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {brand.current && (
            <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
          )}
          <h3 className="truncate font-display text-lg font-semibold uppercase tracking-tight text-white md:text-xl">
            {brand.name}
          </h3>
        </div>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
          {brand.phase}
        </p>
      </div>
    </article>
  );
}

/**
 * Rendered as a CSS mask so each logo can share one consistent visual box
 * while still fading to its own brand color on hover.
 */
function BrandLogo({ brand }: { brand: Brand }) {
  return (
    <span className="grid h-16 w-16 shrink-0 place-items-center rounded-[8px] border border-white/5 bg-white/[0.03] md:h-20 md:w-20">
      <span
        role="img"
        aria-label={brand.name}
        title={brand.name}
        className="brand-logo inline-block max-h-10 max-w-12 transition-[background-color] duration-500 ease-out md:max-h-12 md:max-w-14"
        style={
          {
            width: `${Math.min(3.5, Math.max(1.8, brand.ratio * 1.75))}rem`,
            height: `${Math.min(3, Math.max(1.5, 3 / brand.ratio))}rem`,
            ["--brand-color" as string]: brand.color,
            maskImage: `url(${brand.logo})`,
            WebkitMaskImage: `url(${brand.logo})`,
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            maskSize: "contain",
            WebkitMaskSize: "contain",
          } as React.CSSProperties
        }
      />
    </span>
  );
}
