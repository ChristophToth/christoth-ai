"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/belly-buddy", label: "Home", match: (p: string) => p === "/belly-buddy" },
  {
    href: "/belly-buddy/check-in",
    label: "Check-in",
    match: (p: string) => p.startsWith("/belly-buddy/check-in"),
  },
  {
    href: "/belly-buddy/plan",
    label: "Plan",
    match: (p: string) => p.startsWith("/belly-buddy/plan"),
  },
  {
    href: "/belly-buddy/report",
    label: "Report",
    match: (p: string) => p.startsWith("/belly-buddy/report"),
  },
];

export function BellyBuddyNav({ name }: { name?: string }) {
  const pathname = usePathname();

  return (
    <header className="bb-nav sticky top-0 z-40 border-b border-[color:var(--bb-line)] bg-[color:var(--bb-cream)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/belly-buddy" className="group flex min-w-0 items-center gap-3">
          <span
            aria-hidden
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[color:var(--bb-leaf)] text-lg text-white shadow-[0_8px_20px_rgba(61,110,84,0.28)] transition-transform duration-300 group-hover:-rotate-6"
          >
            ◐
          </span>
          <span className="min-w-0">
            <span className="block font-bb-display text-lg leading-tight text-[color:var(--bb-ink)] sm:text-xl">
              Belly Buddy
            </span>
            {name ? (
              <span className="block truncate text-sm text-[color:var(--bb-mute)]">
                For {name}
              </span>
            ) : null}
          </span>
        </Link>
        <nav aria-label="Belly Buddy" className="hidden items-center gap-1 sm:flex">
          {LINKS.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-[color:var(--bb-leaf)] text-white"
                    : "text-[color:var(--bb-ink)] hover:bg-[color:var(--bb-mint)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <nav
        aria-label="Belly Buddy mobile"
        className="flex gap-1 overflow-x-auto border-t border-[color:var(--bb-line)] px-3 py-2 sm:hidden"
      >
        {LINKS.map((link) => {
          const active = link.match(pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "shrink-0 rounded-full px-3 py-2 text-sm font-semibold",
                active
                  ? "bg-[color:var(--bb-leaf)] text-white"
                  : "bg-white/70 text-[color:var(--bb-ink)]",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
