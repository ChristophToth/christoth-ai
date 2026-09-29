"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useBellyBuddy } from "@/components/belly-buddy/BellyBuddyProvider";
import {
  KindBubble,
  PrimaryButton,
  WeekDots,
} from "@/components/belly-buddy/ui";
import { greetingFor } from "@/data/belly-buddy/options";
import {
  buildPatternHints,
  completedDayCount,
  lastNDates,
  streakEndingToday,
} from "@/lib/belly-buddy/insights";
import { feelingLabel } from "@/lib/belly-buddy/insights";

export function HomeScreen() {
  const { state, todayCheckIn } = useBellyBuddy();
  const name = state.profile?.name ?? "Friend";
  const week = lastNDates(7);
  const completed = new Set(
    week.filter((d) => Boolean(state.checkIns[d])),
  );
  const daysDone = completedDayCount(state.checkIns, week);
  const streak = streakEndingToday(state.checkIns);
  const hints = buildPatternHints(state.checkIns, name);
  const planStarted = Boolean(state.profile?.planStartDate);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[2rem] border border-[color:var(--bb-line)] bg-gradient-to-br from-[color:var(--bb-sky)] via-[color:var(--bb-cream)] to-[color:var(--bb-mint)] px-6 py-8 sm:px-8"
      >
        <div
          aria-hidden
          className="bb-float pointer-events-none absolute right-6 top-6 h-20 w-20 rounded-full bg-[color:var(--bb-honey)]/40 blur-xl"
        />
        <p className="font-bb-display text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--bb-leaf)]">
          Today
        </p>
        <h1 className="mt-2 font-bb-display text-3xl text-[color:var(--bb-ink)] sm:text-4xl">
          {greetingFor(name)}
        </h1>
        <p className="mt-3 max-w-md text-lg text-[color:var(--bb-mute)]">
          {todayCheckIn
            ? `You already checked in. Your belly felt ${feelingLabel(todayCheckIn.feeling).toLowerCase()}. You can update it anytime.`
            : "A short check-in helps us learn what makes burping, gas, or discomfort louder or quieter."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton href="/belly-buddy/check-in">
            {todayCheckIn ? "Update today’s check-in" : "Start today’s check-in"}
          </PrimaryButton>
          <Link
            href="/belly-buddy/plan"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-[color:var(--bb-line)] bg-white/70 px-6 py-3 text-base font-semibold text-[color:var(--bb-ink)] transition-colors hover:bg-white"
          >
            {planStarted ? "See my gentle plan" : "Start 7-day gentle plan"}
          </Link>
        </div>
      </motion.section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <KindBubble>
          <p className="text-sm font-semibold text-[color:var(--bb-mute)]">This week</p>
          <p className="mt-1 font-bb-display text-3xl text-[color:var(--bb-ink)]">
            {daysDone}/7
          </p>
          <p className="text-sm text-[color:var(--bb-mute)]">days logged</p>
        </KindBubble>
        <KindBubble>
          <p className="text-sm font-semibold text-[color:var(--bb-mute)]">Streak</p>
          <p className="mt-1 font-bb-display text-3xl text-[color:var(--bb-ink)]">
            {streak}
          </p>
          <p className="text-sm text-[color:var(--bb-mute)]">
            {streak === 1 ? "day in a row" : "days in a row"}
          </p>
        </KindBubble>
        <KindBubble>
          <p className="text-sm font-semibold text-[color:var(--bb-mute)]">Doctor ready</p>
          <p className="mt-1 font-bb-display text-3xl text-[color:var(--bb-ink)]">
            {daysDone >= 7 ? "Yes" : `${7 - daysDone} left`}
          </p>
          <p className="text-sm text-[color:var(--bb-mute)]">
            {daysDone >= 7 ? "Full week of notes" : "to complete 7 days"}
          </p>
        </KindBubble>
      </section>

      <section className="mt-8">
        <h2 className="font-bb-display text-2xl text-[color:var(--bb-ink)]">
          Your 7-day path
        </h2>
        <p className="mt-1 text-[color:var(--bb-mute)]">
          Each filled circle is a day you showed up for yourself.
        </p>
        <div className="mt-4">
          <WeekDots dates={week} completed={completed} />
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="font-bb-display text-2xl text-[color:var(--bb-ink)]">
          Kind clues so far
        </h2>
        {hints.map((hint, index) => (
          <motion.div
            key={hint.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * index }}
          >
            <KindBubble>
              <p className="font-semibold text-[color:var(--bb-leaf)]">{hint.title}</p>
              <p className="mt-1 text-[color:var(--bb-ink)]">{hint.detail}</p>
            </KindBubble>
          </motion.div>
        ))}
      </section>

      <div className="mt-8 flex flex-wrap gap-3">
        <PrimaryButton href="/belly-buddy/report">Open doctor report</PrimaryButton>
        <Link
          href="/belly-buddy/plan"
          className="inline-flex min-h-[52px] items-center justify-center rounded-full px-4 text-base font-semibold text-[color:var(--bb-leaf)] underline-offset-4 hover:underline"
        >
          Prevention &amp; elimination plan
        </Link>
      </div>
    </div>
  );
}
