import type { Feeling, MealTagId, SymptomId, StressLevel, SleepQuality, WaterLevel } from "@/lib/belly-buddy/types";

export const SYMPTOM_OPTIONS: {
  id: SymptomId;
  label: string;
  hint: string;
  emoji: string;
}[] = [
  { id: "burping", label: "Burping", hint: "Lots of burps", emoji: "🫧" },
  { id: "gas", label: "Gas", hint: "Tooty / gassy", emoji: "💨" },
  { id: "bloating", label: "Bloating", hint: "Belly feels puffy", emoji: "🎈" },
  { id: "pain", label: "Belly pain", hint: "Ouch in the tummy", emoji: "😣" },
  { id: "nausea", label: "Queasy", hint: "Might throw up", emoji: "🤢" },
  { id: "heartburn", label: "Burning", hint: "Hot chest / throat", emoji: "🔥" },
  { id: "fullness", label: "Too full", hint: "Stuck / heavy", emoji: "🥣" },
];

export const FEELING_OPTIONS: {
  id: Feeling;
  label: string;
  detail: string;
  emoji: string;
}[] = [
  { id: "great", label: "Great", detail: "Belly feels calm", emoji: "🌟" },
  { id: "okay", label: "Okay", detail: "A little off, still fine", emoji: "🙂" },
  { id: "uncomfortable", label: "Uncomfortable", detail: "I notice it a lot", emoji: "😕" },
  { id: "hurts", label: "Hurts", detail: "I need extra care today", emoji: "💛" },
];

export const MEAL_OPTIONS: {
  id: MealTagId;
  label: string;
}[] = [
  { id: "simple_gentle", label: "Gentle foods" },
  { id: "dairy", label: "Dairy" },
  { id: "gluten", label: "Bread / pasta" },
  { id: "spicy", label: "Spicy" },
  { id: "fried", label: "Fried / greasy" },
  { id: "beans", label: "Beans" },
  { id: "onion_garlic", label: "Onion / garlic" },
  { id: "soda", label: "Soda / bubbles" },
  { id: "coffee", label: "Coffee / tea" },
  { id: "sweets", label: "Sweets" },
  { id: "raw_veggie", label: "Raw veggies" },
  { id: "fruit", label: "Fruit" },
  { id: "meat", label: "Meat" },
  { id: "eggs", label: "Eggs" },
];

export const STRESS_OPTIONS: {
  id: StressLevel;
  label: string;
  detail: string;
}[] = [
  { id: 1, label: "Calm", detail: "Soft and easy" },
  { id: 2, label: "Light", detail: "A tiny bit busy" },
  { id: 3, label: "Medium", detail: "My mind was working" },
  { id: 4, label: "High", detail: "Hard to relax" },
  { id: 5, label: "Max", detail: "Really overwhelmed" },
];

export const SLEEP_OPTIONS: {
  id: SleepQuality;
  label: string;
}[] = [
  { id: 1, label: "Rough" },
  { id: 2, label: "So-so" },
  { id: 3, label: "Okay" },
  { id: 4, label: "Good" },
  { id: 5, label: "Great" },
];

export const WATER_OPTIONS: {
  id: WaterLevel;
  label: string;
  detail: string;
}[] = [
  { id: "little", label: "A little", detail: "Not much water" },
  { id: "some", label: "Some", detail: "A few glasses" },
  { id: "plenty", label: "Plenty", detail: "I stayed hydrated" },
];

export function greetingFor(name: string, hour = new Date().getHours()): string {
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 17) return `Hi ${name}`;
  return `Evening, ${name}`;
}

export function encouragementAfterCheckIn(name: string): string[] {
  return [
    `You did it, ${name}. That check-in helps your doctor help you.`,
    "Rest your shoulders. Your body is allowed to take it slow.",
    "One kind day of notes is already progress.",
  ];
}
