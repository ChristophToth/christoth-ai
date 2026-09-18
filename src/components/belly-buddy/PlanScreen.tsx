"use client";

import { useBellyBuddy } from "@/components/belly-buddy/BellyBuddyProvider";
import { KindBubble, PrimaryButton } from "@/components/belly-buddy/ui";
import {
  DOCTOR_TALKING_POINTS,
  ELIMINATION_PLAN,
  PREVENTION_HABITS,
} from "@/data/belly-buddy/plan";
import { todayKey } from "@/lib/belly-buddy/types";

function planDayNumber(planStartDate: string | null): number {
  if (!planStartDate) return 1;
  const start = new Date(`${planStartDate}T12:00:00`);
  const today = new Date(`${todayKey()}T12:00:00`);
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return Math.min(7, Math.max(1, diff + 1));
}

export function PlanScreen() {
  const { state, startPlan } = useBellyBuddy();
  const name = state.profile?.name ?? "Friend";
  const started = Boolean(state.profile?.planStartDate);
  const dayNum = planDayNumber(state.profile?.planStartDate ?? null);
  const todayPlan = ELIMINATION_PLAN[dayNum - 1];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="font-bb-display text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--bb-leaf)]">
        Gentle plan
      </p>
      <h1 className="mt-2 font-bb-display text-3xl text-[color:var(--bb-ink)] sm:text-4xl">
        A calm 7-day path for {name}
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-[color:var(--bb-mute)]">
        This is a soft elimination and prevention guide to help your notes tell
        a clearer story. It is not a prescription. If anything feels scary or
        severe, contact a clinician.
      </p>

      {!started ? (
        <KindBubble className="mt-6">
          <p className="text-lg text-[color:var(--bb-ink)]">
            Ready when you are. Starting the plan marks Day 1 and keeps meals
            simple while you log.
          </p>
          <div className="mt-4">
            <PrimaryButton onClick={startPlan}>Start my 7-day plan</PrimaryButton>
          </div>
        </KindBubble>
      ) : (
        <section className="mt-6 overflow-hidden rounded-[2rem] border border-[color:var(--bb-line)] bg-gradient-to-br from-[color:var(--bb-honey)]/30 via-white to-[color:var(--bb-mint)] p-6 sm:p-8">
          <p className="text-sm font-semibold text-[color:var(--bb-leaf)]">
            Today · Day {dayNum} of 7
          </p>
          <h2 className="mt-1 font-bb-display text-3xl text-[color:var(--bb-ink)]">
            {todayPlan.title}
          </h2>
          <p className="mt-2 text-lg text-[color:var(--bb-mute)]">{todayPlan.focus}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-[color:var(--bb-line)]">
              <p className="font-semibold text-[color:var(--bb-leaf)]">Kind to try</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[color:var(--bb-ink)]">
                {todayPlan.eat.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 ring-1 ring-[color:var(--bb-line)]">
              <p className="font-semibold text-[color:var(--bb-coral)]">Pause for today</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[color:var(--bb-ink)]">
                {todayPlan.skip.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-5 rounded-2xl bg-[color:var(--bb-sky)]/70 px-4 py-3 text-[color:var(--bb-ink)]">
            Tiny tip: {todayPlan.tip}
          </p>
          <div className="mt-5">
            <PrimaryButton href="/belly-buddy/check-in">Log how today feels</PrimaryButton>
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-bb-display text-2xl text-[color:var(--bb-ink)]">
          Full week at a glance
        </h2>
        <div className="mt-4 space-y-3">
          {ELIMINATION_PLAN.map((day) => (
            <KindBubble
              key={day.day}
              className={day.day === dayNum && started ? "ring-2 ring-[color:var(--bb-leaf)]" : ""}
            >
              <p className="font-semibold text-[color:var(--bb-leaf)]">
                Day {day.day}: {day.title}
              </p>
              <p className="mt-1 text-[color:var(--bb-ink)]">{day.focus}</p>
            </KindBubble>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-bb-display text-2xl text-[color:var(--bb-ink)]">
          Indigestion prevention habits
        </h2>
        <p className="mt-1 text-[color:var(--bb-mute)]">
          Small habits that often make burping and gas quieter over time.
        </p>
        <div className="mt-4 space-y-3">
          {PREVENTION_HABITS.map((habit) => (
            <KindBubble key={habit.title}>
              <p className="font-semibold text-[color:var(--bb-ink)]">{habit.title}</p>
              <p className="mt-1 text-[color:var(--bb-mute)]">{habit.detail}</p>
            </KindBubble>
          ))}
        </div>
      </section>

      <section className="mt-10 mb-6">
        <h2 className="font-bb-display text-2xl text-[color:var(--bb-ink)]">
          What to tell the doctor
        </h2>
        <ul className="mt-4 space-y-2">
          {DOCTOR_TALKING_POINTS.map((point) => (
            <li
              key={point}
              className="rounded-2xl bg-white/80 px-4 py-3 text-[color:var(--bb-ink)] ring-1 ring-[color:var(--bb-line)]"
            >
              {point}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <PrimaryButton href="/belly-buddy/report">Open my doctor report</PrimaryButton>
        </div>
      </section>
    </div>
  );
}
