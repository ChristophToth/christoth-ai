"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Thesis", href: "#thesis" },
  { label: "Work", href: "#work" },
  { label: "Expertise", href: "#expertise" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 80], [0, 14]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        style={{ backdropFilter: blur.get() ? `blur(${blur.get()}px)` : undefined }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-3" : "py-6",
        )}
      >
        <div
          className={cn(
            "container-page flex items-center justify-between rounded-full transition-all duration-500",
            scrolled
              ? "bg-ink-900/70 px-4 py-2 backdrop-blur-xl ring-1 ring-white/5"
              : "px-0",
          )}
        >
          <a
            href="#"
            className="group flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
          >
            <span className="relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-electric text-white shadow-[0_0_24px_rgba(124,92,255,0.45)] transition-transform duration-500 group-hover:rotate-[20deg]">
              <span className="text-[0.7rem] font-bold tracking-tight">CT</span>
            </span>
            <span className="hidden sm:block">Chris Toth</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative rounded-full px-4 py-2 text-sm text-zinc-300 transition-colors hover:text-white"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute inset-0 -z-0 rounded-full bg-white/0 transition-all duration-300 group-hover:bg-white/5" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden rounded-full bg-white px-4 py-2 text-sm font-medium text-ink-950 transition-all hover:bg-accent hover:text-white md:inline-flex"
            >
              Let&apos;s talk
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:border-accent/40 hover:bg-accent/10 md:hidden"
            >
              <motion.span
                animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                className="absolute h-px w-5 bg-white"
              />
              <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                className="absolute h-px w-5 bg-white"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 8 }}
                className="absolute h-px w-5 bg-white"
                style={{ transform: "translateY(8px)" }}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex h-full flex-col items-start justify-center gap-2 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setOpen(false)}
                  className="font-display text-5xl font-semibold tracking-tight text-white transition-colors hover:text-accent"
                >
                  {link.label}.
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
