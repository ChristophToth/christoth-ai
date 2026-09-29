"use client";

import { useMemo, useState } from "react";
import { useBellyBuddy } from "@/components/belly-buddy/BellyBuddyProvider";
import { KindBubble, PrimaryButton, SecondaryButton } from "@/components/belly-buddy/ui";
import {
  buildDoctorReportText,
  buildPatternHints,
  completedDayCount,
  feelingLabel,
  formatMeal,
  formatSymptom,
  lastNDates,
} from "@/lib/belly-buddy/insights";

export function ReportScreen() {
  const { state, resetAll } = useBellyBuddy();
  const name = state.profile?.name ?? "Friend";
  const week = lastNDates(7);
  const daysDone = completedDayCount(state.checkIns, week);
  const hints = buildPatternHints(state.checkIns, name);
  const reportText = useMemo(
    () => buildDoctorReportText(name, state.checkIns, week),
    [name, state.checkIns, week],
  );
  const [copied, setCopied] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function printReport() {
    window.print();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <p className="font-bb-display text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--bb-leaf)]">
        Doctor report
      </p>
      <h1 className="mt-2 font-bb-display text-3xl text-[color:var(--bb-ink)] sm:text-4xl">
        {name}&apos;s belly story
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-[color:var(--bb-mute)]">
        {daysDone} of 7 recent days logged. Bring this to your visit, or copy it
        into an email. This helps your doctor — it does not replace them.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <PrimaryButton onClick={copyReport}>
          {copied ? "Copied!" : "Copy report"}
        </PrimaryButton>
        <SecondaryButton onClick={printReport}>Print / save PDF</SecondaryButton>
        <PrimaryButton href="/belly-buddy/check-in">Add today’s notes</PrimaryButton>
      </div>

      <section className="mt-8 space-y-3 print:mt-4">
        <h2 className="font-bb-display text-2xl text-[color:var(--bb-ink)]">
          Gentle pattern notes
        </h2>
        {hints.map((hint) => (
          <KindBubble key={hint.id}>
            <p className="font-semibold text-[color:var(--bb-leaf)]">{hint.title}</p>
            <p className="mt-1 text-[color:var(--bb-ink)]">{hint.detail}</p>
          </KindBubble>
        ))}
      </section>

      <section className="mt-10 space-y-4">
        <h2 className="font-bb-display text-2xl text-[color:var(--bb-ink)]">
          Day-by-day
        </h2>
        {week.map((date) => {
          const entry = state.checkIns[date];
          return (
            <article
              key={date}
              className="rounded-2xl border border-[color:var(--bb-line)] bg-white/80 p-4"
            >
              <h3 className="font-bb-display text-xl text-[color:var(--bb-ink)]">
                {date}
              </h3>
              {!entry ? (
                <p className="mt-2 text-[color:var(--bb-mute)]">No check-in yet.</p>
              ) : (
                <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-[color:var(--bb-mute)]">Feeling</dt>
                    <dd className="text-[color:var(--bb-ink)]">
                      {feelingLabel(entry.feeling)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[color:var(--bb-mute)]">Strength</dt>
                    <dd className="text-[color:var(--bb-ink)]">{entry.symptomStrength}/3</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-semibold text-[color:var(--bb-mute)]">Symptoms</dt>
                    <dd className="text-[color:var(--bb-ink)]">
                      {entry.symptoms.length
                        ? entry.symptoms.map(formatSymptom).join(", ")
                        : "None selected"}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-semibold text-[color:var(--bb-mute)]">Foods</dt>
                    <dd className="text-[color:var(--bb-ink)]">
                      {entry.meals.length
                        ? entry.meals.map(formatMeal).join(", ")
                        : "None selected"}
                      {entry.mealNotes.trim() ? ` — ${entry.mealNotes.trim()}` : ""}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[color:var(--bb-mute)]">Stress</dt>
                    <dd className="text-[color:var(--bb-ink)]">{entry.stress}/5</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[color:var(--bb-mute)]">Sleep</dt>
                    <dd className="text-[color:var(--bb-ink)]">{entry.sleep}/5</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[color:var(--bb-mute)]">Water</dt>
                    <dd className="text-[color:var(--bb-ink)]">{entry.water}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[color:var(--bb-mute)]">Moved</dt>
                    <dd className="text-[color:var(--bb-ink)]">
                      {entry.movedBody ? "Yes" : "No"}
                    </dd>
                  </div>
                  {entry.remedies.trim() ? (
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-[color:var(--bb-mute)]">Remedies</dt>
                      <dd className="text-[color:var(--bb-ink)]">{entry.remedies}</dd>
                    </div>
                  ) : null}
                  {entry.notes.trim() ? (
                    <div className="sm:col-span-2">
                      <dt className="font-semibold text-[color:var(--bb-mute)]">Notes</dt>
                      <dd className="text-[color:var(--bb-ink)]">{entry.notes}</dd>
                    </div>
                  ) : null}
                </dl>
              )}
            </article>
          );
        })}
      </section>

      <section className="mt-10 print:hidden">
        <KindBubble>
          <p className="font-semibold text-[color:var(--bb-ink)]">Need a fresh start?</p>
          <p className="mt-1 text-sm text-[color:var(--bb-mute)]">
            Clearing data removes check-ins from this device only.
          </p>
          {!confirmReset ? (
            <button
              type="button"
              className="mt-3 text-sm font-semibold text-[color:var(--bb-coral)] underline-offset-2 hover:underline"
              onClick={() => setConfirmReset(true)}
            >
              Clear all Belly Buddy data
            </button>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              <SecondaryButton onClick={() => setConfirmReset(false)}>Keep my data</SecondaryButton>
              <button
                type="button"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[color:var(--bb-coral)] px-6 py-3 text-base font-semibold text-white"
                onClick={() => {
                  resetAll();
                  setConfirmReset(false);
                }}
              >
                Yes, clear everything
              </button>
            </div>
          )}
        </KindBubble>
      </section>

      <pre className="mt-8 hidden whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm text-[color:var(--bb-ink)] print:block">
        {reportText}
      </pre>
    </div>
  );
}
