"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useBellyBuddy } from "@/components/belly-buddy/BellyBuddyProvider";
import {
  BigChoiceButton,
  KindBubble,
  PrimaryButton,
  SecondaryButton,
} from "@/components/belly-buddy/ui";
import {
  FEELING_OPTIONS,
  MEAL_OPTIONS,
  SLEEP_OPTIONS,
  STRESS_OPTIONS,
  SYMPTOM_OPTIONS,
  WATER_OPTIONS,
  encouragementAfterCheckIn,
} from "@/data/belly-buddy/options";
import type {
  DailyCheckIn,
  Feeling,
  MealTagId,
  SleepQuality,
  StressLevel,
  SymptomId,
  WaterLevel,
} from "@/lib/belly-buddy/types";

type Step =
  | "feeling"
  | "symptoms"
  | "strength"
  | "meals"
  | "body"
  | "notes"
  | "done";

const STEPS: Step[] = [
  "feeling",
  "symptoms",
  "strength",
  "meals",
  "body",
  "notes",
  "done",
];

function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function CheckInScreen() {
  const { state, today, todayCheckIn, saveCheckIn } = useBellyBuddy();
  const router = useRouter();
  const name = state.profile?.name ?? "Friend";

  const [step, setStep] = useState<Step>("feeling");
  const [feeling, setFeeling] = useState<Feeling | null>(
    todayCheckIn?.feeling ?? null,
  );
  const [symptoms, setSymptoms] = useState<SymptomId[]>(
    todayCheckIn?.symptoms ?? [],
  );
  const [symptomStrength, setSymptomStrength] = useState<1 | 2 | 3>(
    todayCheckIn?.symptomStrength ?? 2,
  );
  const [meals, setMeals] = useState<MealTagId[]>(todayCheckIn?.meals ?? []);
  const [mealNotes, setMealNotes] = useState(todayCheckIn?.mealNotes ?? "");
  const [stress, setStress] = useState<StressLevel | null>(
    todayCheckIn?.stress ?? null,
  );
  const [sleep, setSleep] = useState<SleepQuality | null>(
    todayCheckIn?.sleep ?? null,
  );
  const [water, setWater] = useState<WaterLevel | null>(
    todayCheckIn?.water ?? null,
  );
  const [movedBody, setMovedBody] = useState<boolean | null>(
    todayCheckIn ? todayCheckIn.movedBody : null,
  );
  const [remedies, setRemedies] = useState(todayCheckIn?.remedies ?? "");
  const [notes, setNotes] = useState(todayCheckIn?.notes ?? "");

  const [encourage, setEncourage] = useState("");

  const stepIndex = STEPS.indexOf(step);
  const progressLabel = step === "done" ? "Done" : `Step ${stepIndex + 1} of 6`;

  function goNext() {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  }

  function goBack() {
    const prev = STEPS[stepIndex - 1];
    if (prev && prev !== "done") setStep(prev);
  }

  function finish() {
    if (!feeling || stress === null || sleep === null || water === null || movedBody === null) {
      return;
    }
    const checkIn: DailyCheckIn = {
      date: today,
      feeling,
      symptoms,
      symptomStrength,
      meals,
      mealNotes,
      stress,
      sleep,
      water,
      movedBody,
      remedies,
      notes,
      completedAt: new Date().toISOString(),
    };
    saveCheckIn(checkIn);
    const lines = encouragementAfterCheckIn(name);
    setEncourage(lines[Math.floor(Math.random() * lines.length)] ?? lines[0]);
    setStep("done");
  }

  const canContinue = (() => {
    switch (step) {
      case "feeling":
        return feeling !== null;
      case "symptoms":
        return true;
      case "strength":
        return true;
      case "meals":
        return true;
      case "body":
        return stress !== null && sleep !== null && water !== null && movedBody !== null;
      case "notes":
        return true;
      case "done":
        return true;
      default: {
        const _exhaustive: never = step;
        return _exhaustive;
      }
    }
  })();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[color:var(--bb-leaf)]">
            {progressLabel}
          </p>
          <h1 className="font-bb-display text-3xl text-[color:var(--bb-ink)]">
            Daily check-in
          </h1>
        </div>
        <div
          className="h-2 w-28 overflow-hidden rounded-full bg-white/80 ring-1 ring-[color:var(--bb-line)]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={6}
          aria-valuenow={Math.min(stepIndex + 1, 6)}
          aria-label="Check-in progress"
        >
          <div
            className="h-full rounded-full bg-[color:var(--bb-leaf)] transition-all duration-500"
            style={{ width: `${(Math.min(stepIndex + 1, 6) / 6) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.28 }}
        >
          {step === "feeling" ? (
            <section>
              <KindBubble className="mb-4">
                <p className="text-lg text-[color:var(--bb-ink)]">
                  Hi {name}. How does your belly feel today? Tap the closest match.
                </p>
              </KindBubble>
              <div className="grid gap-3">
                {FEELING_OPTIONS.map((option) => (
                  <BigChoiceButton
                    key={option.id}
                    selected={feeling === option.id}
                    onClick={() => setFeeling(option.id)}
                    title={option.label}
                    detail={option.detail}
                    leading={option.emoji}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === "symptoms" ? (
            <section>
              <KindBubble className="mb-4">
                <p className="text-lg text-[color:var(--bb-ink)]">
                  What showed up today? You can pick more than one — or none.
                </p>
              </KindBubble>
              <div className="grid gap-3 sm:grid-cols-2">
                {SYMPTOM_OPTIONS.map((option) => (
                  <BigChoiceButton
                    key={option.id}
                    selected={symptoms.includes(option.id)}
                    onClick={() => setSymptoms((prev) => toggleItem(prev, option.id))}
                    title={option.label}
                    detail={option.hint}
                    leading={option.emoji}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === "strength" ? (
            <section>
              <KindBubble className="mb-4">
                <p className="text-lg text-[color:var(--bb-ink)]">
                  How strong were those belly feelings?
                </p>
              </KindBubble>
              <div className="grid gap-3">
                {(
                  [
                    { id: 1 as const, label: "Mild", detail: "I noticed it, but okay" },
                    { id: 2 as const, label: "Medium", detail: "It got my attention" },
                    { id: 3 as const, label: "Strong", detail: "It was hard to ignore" },
                  ] as const
                ).map((option) => (
                  <BigChoiceButton
                    key={option.id}
                    selected={symptomStrength === option.id}
                    onClick={() => setSymptomStrength(option.id)}
                    title={option.label}
                    detail={option.detail}
                  />
                ))}
              </div>
            </section>
          ) : null}

          {step === "meals" ? (
            <section>
              <KindBubble className="mb-4">
                <p className="text-lg text-[color:var(--bb-ink)]">
                  What kinds of food or drinks did you have? Tap anything that fits.
                </p>
              </KindBubble>
              <div className="flex flex-wrap gap-2">
                {MEAL_OPTIONS.map((option) => {
                  const selected = meals.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setMeals((prev) => toggleItem(prev, option.id))}
                      className={
                        selected
                          ? "min-h-[48px] rounded-full bg-[color:var(--bb-leaf)] px-4 py-2 text-sm font-semibold text-white"
                          : "min-h-[48px] rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--bb-ink)] ring-1 ring-[color:var(--bb-line)]"
                      }
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <label className="mt-5 block">
                <span className="text-sm font-semibold text-[color:var(--bb-ink)]">
                  Extra food notes (optional)
                </span>
                <textarea
                  value={mealNotes}
                  onChange={(e) => setMealNotes(e.target.value)}
                  rows={3}
                  placeholder="Example: pizza at lunch, yogurt at night"
                  className="mt-2 w-full rounded-2xl border-2 border-[color:var(--bb-line)] bg-white px-4 py-3 text-base text-[color:var(--bb-ink)] outline-none focus:ring-2 focus:ring-[color:var(--bb-leaf)]"
                />
              </label>
            </section>
          ) : null}

          {step === "body" ? (
            <section className="space-y-8">
              <div>
                <h2 className="font-bb-display text-xl text-[color:var(--bb-ink)]">
                  Stress level
                </h2>
                <p className="mb-3 text-sm text-[color:var(--bb-mute)]">
                  How busy or worried did your mind feel?
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {STRESS_OPTIONS.map((option) => (
                    <BigChoiceButton
                      key={option.id}
                      selected={stress === option.id}
                      onClick={() => setStress(option.id)}
                      title={option.label}
                      detail={option.detail}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-bb-display text-xl text-[color:var(--bb-ink)]">
                  Sleep
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {SLEEP_OPTIONS.map((option) => {
                    const selected = sleep === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setSleep(option.id)}
                        className={
                          selected
                            ? "min-h-[48px] rounded-full bg-[color:var(--bb-leaf)] px-4 py-2 font-semibold text-white"
                            : "min-h-[48px] rounded-full bg-white/80 px-4 py-2 font-semibold text-[color:var(--bb-ink)] ring-1 ring-[color:var(--bb-line)]"
                        }
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="font-bb-display text-xl text-[color:var(--bb-ink)]">
                  Water
                </h2>
                <div className="mt-3 grid gap-2">
                  {WATER_OPTIONS.map((option) => (
                    <BigChoiceButton
                      key={option.id}
                      selected={water === option.id}
                      onClick={() => setWater(option.id)}
                      title={option.label}
                      detail={option.detail}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-bb-display text-xl text-[color:var(--bb-ink)]">
                  Did you move your body a little?
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <BigChoiceButton
                    selected={movedBody === true}
                    onClick={() => setMovedBody(true)}
                    title="Yes"
                    detail="Walk, stretch, or play"
                  />
                  <BigChoiceButton
                    selected={movedBody === false}
                    onClick={() => setMovedBody(false)}
                    title="Not really"
                    detail="Mostly resting today"
                  />
                </div>
              </div>
            </section>
          ) : null}

          {step === "notes" ? (
            <section className="space-y-5">
              <KindBubble>
                <p className="text-lg text-[color:var(--bb-ink)]">
                  Almost done. Anything else your doctor should know?
                </p>
              </KindBubble>
              <label className="block">
                <span className="text-sm font-semibold text-[color:var(--bb-ink)]">
                  Remedies tried (optional)
                </span>
                <textarea
                  value={remedies}
                  onChange={(e) => setRemedies(e.target.value)}
                  rows={2}
                  placeholder="Example: antacid, ginger tea, heating pad"
                  className="mt-2 w-full rounded-2xl border-2 border-[color:var(--bb-line)] bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[color:var(--bb-leaf)]"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-[color:var(--bb-ink)]">
                  Extra notes (optional)
                </span>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Example: worse after lunch, better after a walk"
                  className="mt-2 w-full rounded-2xl border-2 border-[color:var(--bb-line)] bg-white px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[color:var(--bb-leaf)]"
                />
              </label>
            </section>
          ) : null}

          {step === "done" ? (
            <section className="rounded-[2rem] border border-[color:var(--bb-line)] bg-gradient-to-br from-[color:var(--bb-mint)] to-[color:var(--bb-sky)] px-6 py-10 text-center">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              >
                <p className="font-bb-display text-4xl text-[color:var(--bb-ink)]">
                  Beautiful work, {name}.
                </p>
                <p className="mx-auto mt-3 max-w-md text-lg text-[color:var(--bb-mute)]">
                  {encourage}
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <PrimaryButton href="/belly-buddy">Back home</PrimaryButton>
                  <SecondaryButton onClick={() => router.push("/belly-buddy/report")}>
                    See doctor report
                  </SecondaryButton>
                </div>
              </motion.div>
            </section>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {step !== "done" ? (
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <SecondaryButton onClick={goBack} disabled={stepIndex === 0}>
            Back
          </SecondaryButton>
          {step === "notes" ? (
            <PrimaryButton onClick={finish} disabled={!canContinue}>
              Save today’s check-in
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={goNext} disabled={!canContinue}>
              Next
            </PrimaryButton>
          )}
        </div>
      ) : null}
    </div>
  );
}
