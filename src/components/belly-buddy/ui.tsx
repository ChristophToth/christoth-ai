"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function KindBubble({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-[1.5rem] border border-[color:var(--bb-line)] bg-white/80 px-4 py-3 text-[color:var(--bb-ink)] shadow-[0_10px_30px_rgba(61,110,84,0.08)]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function BigChoiceButton({
  selected,
  onClick,
  title,
  detail,
  leading,
  className,
}: {
  selected?: boolean;
  onClick: () => void;
  title: string;
  detail?: string;
  leading?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex min-h-[64px] w-full items-start gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-200",
        selected
          ? "border-[color:var(--bb-leaf)] bg-[color:var(--bb-mint)] shadow-[0_8px_24px_rgba(61,110,84,0.16)]"
          : "border-[color:var(--bb-line)] bg-white/80 hover:border-[color:var(--bb-leaf-soft)]",
        className,
      )}
    >
      {leading ? (
        <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[color:var(--bb-cream)] text-xl">
          {leading}
        </span>
      ) : null}
      <span className="min-w-0">
        <span className="block font-bb-display text-lg text-[color:var(--bb-ink)]">
          {title}
        </span>
        {detail ? (
          <span className="mt-0.5 block text-sm text-[color:var(--bb-mute)]">
            {detail}
          </span>
        ) : null}
      </span>
    </button>
  );
}

export function PrimaryButton({
  children,
  onClick,
  href,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const className = cn(
    "inline-flex min-h-[52px] items-center justify-center rounded-full bg-[color:var(--bb-leaf)] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_28px_rgba(61,110,84,0.28)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0",
  );

  if (href && !disabled) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-[color:var(--bb-line)] bg-white/70 px-6 py-3 text-base font-semibold text-[color:var(--bb-ink)] transition-colors hover:bg-white disabled:opacity-50"
    >
      {children}
    </button>
  );
}

export function WeekDots({
  dates,
  completed,
}: {
  dates: string[];
  completed: Set<string>;
}) {
  return (
    <ol className="flex flex-wrap gap-2" aria-label="Seven day progress">
      {dates.map((date) => {
        const done = completed.has(date);
        const day = new Date(`${date}T12:00:00`);
        const label = day.toLocaleDateString(undefined, { weekday: "short" });
        const isToday = date === dates[dates.length - 1];
        return (
          <li key={date} className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full text-xs font-bold",
                done
                  ? "bg-[color:var(--bb-leaf)] text-white"
                  : "bg-white/80 text-[color:var(--bb-mute)] ring-1 ring-[color:var(--bb-line)]",
                isToday && !done
                  ? "ring-2 ring-[color:var(--bb-honey)]"
                  : null,
              )}
              aria-label={`${label}${isToday ? ", today" : ""}${done ? ", logged" : ", not logged yet"}`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
