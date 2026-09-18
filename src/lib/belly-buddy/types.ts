export type Feeling = "great" | "okay" | "uncomfortable" | "hurts";

export type SymptomId =
  | "burping"
  | "gas"
  | "bloating"
  | "pain"
  | "nausea"
  | "heartburn"
  | "fullness";

export type MealTagId =
  | "dairy"
  | "gluten"
  | "spicy"
  | "fried"
  | "beans"
  | "onion_garlic"
  | "soda"
  | "coffee"
  | "sweets"
  | "raw_veggie"
  | "fruit"
  | "meat"
  | "eggs"
  | "simple_gentle";

export type StressLevel = 1 | 2 | 3 | 4 | 5;
export type SleepQuality = 1 | 2 | 3 | 4 | 5;
export type WaterLevel = "little" | "some" | "plenty";

export interface DailyCheckIn {
  date: string; // YYYY-MM-DD
  feeling: Feeling;
  symptoms: SymptomId[];
  symptomStrength: 1 | 2 | 3;
  meals: MealTagId[];
  mealNotes: string;
  stress: StressLevel;
  sleep: SleepQuality;
  water: WaterLevel;
  movedBody: boolean;
  remedies: string;
  notes: string;
  completedAt: string;
}

export interface BellyBuddyProfile {
  name: string;
  createdAt: string;
  planStartDate: string | null;
}

export interface BellyBuddyState {
  profile: BellyBuddyProfile | null;
  checkIns: Record<string, DailyCheckIn>;
  version: 1;
}

export const STORAGE_KEY = "belly-buddy-v1";

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function emptyState(): BellyBuddyState {
  return {
    profile: null,
    checkIns: {},
    version: 1,
  };
}
