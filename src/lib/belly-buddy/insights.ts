import type {
  DailyCheckIn,
  Feeling,
  MealTagId,
  SymptomId,
} from "./types";
import { todayKey } from "./types";

const FEELING_SCORE: Record<Feeling, number> = {
  great: 4,
  okay: 3,
  uncomfortable: 2,
  hurts: 1,
};

export function lastNDates(n: number, from = new Date()): string[] {
  const dates: string[] = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(from);
    d.setDate(from.getDate() - i);
    dates.push(todayKey(d));
  }
  return dates;
}

export function completedDayCount(
  checkIns: Record<string, DailyCheckIn>,
  dates: string[],
): number {
  return dates.filter((d) => Boolean(checkIns[d])).length;
}

export function streakEndingToday(
  checkIns: Record<string, DailyCheckIn>,
  from = new Date(),
): number {
  let streak = 0;
  for (let i = 0; i < 30; i += 1) {
    const d = new Date(from);
    d.setDate(from.getDate() - i);
    const key = todayKey(d);
    if (checkIns[key]) streak += 1;
    else break;
  }
  return streak;
}

export interface PatternHint {
  id: string;
  title: string;
  detail: string;
  tone: "gentle" | "curious" | "encourage";
}

function countBy<T extends string>(items: T[]): Partial<Record<T, number>> {
  const out: Partial<Record<T, number>> = {};
  for (const item of items) {
    out[item] = (out[item] ?? 0) + 1;
  }
  return out;
}

export function buildPatternHints(
  checkIns: Record<string, DailyCheckIn>,
  name: string,
): PatternHint[] {
  const entries = Object.values(checkIns).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  if (entries.length < 2) {
    return [
      {
        id: "keep-going",
        title: `Nice start, ${name}`,
        detail:
          "A few more check-ins will help your doctor see patterns. Every day you log is a gift to your future self.",
        tone: "encourage",
      },
    ];
  }

  const hints: PatternHint[] = [];
  const symptoms = entries.flatMap((e) => e.symptoms);
  const symptomCounts = countBy(symptoms);
  const topSymptom = (Object.entries(symptomCounts) as [SymptomId, number][])
    .sort((a, b) => b[1] - a[1])[0];

  if (topSymptom) {
    hints.push({
      id: "top-symptom",
      title: "Most common belly note",
      detail: `${formatSymptom(topSymptom[0])} showed up on ${topSymptom[1]} of your logged days. That is useful for your doctor.`,
      tone: "curious",
    });
  }

  const mealsOnHardDays = entries
    .filter((e) => e.feeling === "uncomfortable" || e.feeling === "hurts")
    .flatMap((e) => e.meals)
    .filter((m) => m !== "simple_gentle");
  const mealCounts = countBy(mealsOnHardDays);
  const topMeal = (Object.entries(mealCounts) as [MealTagId, number][])
    .sort((a, b) => b[1] - a[1])[0];

  if (topMeal && topMeal[1] >= 2) {
    hints.push({
      id: "food-link",
      title: "A possible food clue",
      detail: `${formatMeal(topMeal[0])} showed up on harder belly days ${topMeal[1]} times. This is a clue to share — not a diagnosis.`,
      tone: "curious",
    });
  }

  const highStressHard = entries.filter(
    (e) =>
      e.stress >= 4 &&
      (e.feeling === "uncomfortable" || e.feeling === "hurts"),
  ).length;
  if (highStressHard >= 2) {
    hints.push({
      id: "stress-link",
      title: "Stress may be part of the story",
      detail: `On ${highStressHard} days, a stressed mind and an unhappy belly showed up together. Soft breathing and rest can be part of your care plan.`,
      tone: "gentle",
    });
  }

  const avgFeeling =
    entries.reduce((sum, e) => sum + FEELING_SCORE[e.feeling], 0) /
    entries.length;
  if (avgFeeling >= 3.2) {
    hints.push({
      id: "good-trend",
      title: "Your belly has had kinder days",
      detail:
        "Overall, your recent logs look more okay than rough. Keep the gentle foods and habits that feel good.",
      tone: "encourage",
    });
  }

  if (hints.length === 0) {
    hints.push({
      id: "share",
      title: "You are collecting a clear story",
      detail:
        "Bring these notes to your visit. Doctors love real-life details like yours.",
      tone: "encourage",
    });
  }

  return hints.slice(0, 4);
}

export function formatSymptom(id: SymptomId): string {
  switch (id) {
    case "burping":
      return "Burping";
    case "gas":
      return "Gas";
    case "bloating":
      return "Bloating";
    case "pain":
      return "Belly pain";
    case "nausea":
      return "Queasy feeling";
    case "heartburn":
      return "Burning / heartburn";
    case "fullness":
      return "Feeling too full";
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export function formatMeal(id: MealTagId): string {
  switch (id) {
    case "dairy":
      return "Dairy";
    case "gluten":
      return "Bread / gluten";
    case "spicy":
      return "Spicy food";
    case "fried":
      return "Fried / greasy";
    case "beans":
      return "Beans / lentils";
    case "onion_garlic":
      return "Onion or garlic";
    case "soda":
      return "Soda / bubbly drinks";
    case "coffee":
      return "Coffee / strong tea";
    case "sweets":
      return "Sweets / candy";
    case "raw_veggie":
      return "Raw veggies";
    case "fruit":
      return "Fruit";
    case "meat":
      return "Meat";
    case "eggs":
      return "Eggs";
    case "simple_gentle":
      return "Simple gentle foods";
    default: {
      const _exhaustive: never = id;
      return _exhaustive;
    }
  }
}

export function feelingLabel(feeling: Feeling): string {
  switch (feeling) {
    case "great":
      return "Great";
    case "okay":
      return "Okay";
    case "uncomfortable":
      return "Uncomfortable";
    case "hurts":
      return "Hurts";
    default: {
      const _exhaustive: never = feeling;
      return _exhaustive;
    }
  }
}

export function buildDoctorReportText(
  name: string,
  checkIns: Record<string, DailyCheckIn>,
  dates: string[],
): string {
  const lines: string[] = [];
  lines.push(`Belly Buddy 7-day report for ${name}`);
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push("");
  lines.push(
    "This is a personal symptom and habit log to support a clinical visit. It is not a diagnosis.",
  );
  lines.push("");

  for (const date of dates) {
    const entry = checkIns[date];
    lines.push(`— ${date} —`);
    if (!entry) {
      lines.push("No check-in logged.");
      lines.push("");
      continue;
    }
    lines.push(`Overall feeling: ${feelingLabel(entry.feeling)}`);
    lines.push(
      `Symptoms: ${
        entry.symptoms.length
          ? entry.symptoms.map(formatSymptom).join(", ")
          : "None selected"
      }`,
    );
    lines.push(`Symptom strength (1–3): ${entry.symptomStrength}`);
    lines.push(
      `Foods tagged: ${
        entry.meals.length
          ? entry.meals.map(formatMeal).join(", ")
          : "None selected"
      }`,
    );
    if (entry.mealNotes.trim()) lines.push(`Meal notes: ${entry.mealNotes.trim()}`);
    lines.push(`Stress (1–5): ${entry.stress}`);
    lines.push(`Sleep (1–5): ${entry.sleep}`);
    lines.push(`Water: ${entry.water}`);
    lines.push(`Moved body: ${entry.movedBody ? "Yes" : "No"}`);
    if (entry.remedies.trim()) lines.push(`Remedies tried: ${entry.remedies.trim()}`);
    if (entry.notes.trim()) lines.push(`Extra notes: ${entry.notes.trim()}`);
    lines.push("");
  }

  const hints = buildPatternHints(checkIns, name);
  lines.push("Gentle pattern notes (for discussion, not diagnosis):");
  for (const hint of hints) {
    lines.push(`• ${hint.title}: ${hint.detail}`);
  }

  return lines.join("\n");
}
