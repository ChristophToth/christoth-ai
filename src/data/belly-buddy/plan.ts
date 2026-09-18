export interface PlanDay {
  day: number;
  title: string;
  focus: string;
  eat: string[];
  skip: string[];
  tip: string;
}

export interface PreventionHabit {
  title: string;
  detail: string;
}

/** Educational guidance only — not a medical prescription. */
export const ELIMINATION_PLAN: PlanDay[] = [
  {
    day: 1,
    title: "Soft start",
    focus: "Keep meals simple so your belly can rest.",
    eat: ["Oatmeal or rice", "Banana or peeled apple", "Chicken or turkey (plain)", "Ginger tea or water"],
    skip: ["Soda", "Fried food", "Spicy sauce", "Big dairy servings"],
    tip: "Eat slowly. Put the fork down between bites.",
  },
  {
    day: 2,
    title: "Same gentle plate",
    focus: "Repeat yesterday’s calm foods so we can notice patterns.",
    eat: ["Toast if it feels okay, or rice cakes", "Eggs if they sit well", "Cooked carrots or zucchini", "Warm water"],
    skip: ["Onion and garlic", "Beans", "Candy", "Coffee on an empty stomach"],
    tip: "Stop eating when you feel comfortably full — not stuffed.",
  },
  {
    day: 3,
    title: "Check the bubbles",
    focus: "See if fizzy drinks or chewing gum make burping louder.",
    eat: ["Same gentle foods", "Broth or soft soup", "Ripe banana", "Herbal tea"],
    skip: ["All bubbly drinks", "Gum", "Straws", "Talking while chewing"],
    tip: "Sip drinks. No rushing, no big gulps.",
  },
  {
    day: 4,
    title: "Dairy detective",
    focus: "If you usually have milk, cheese, or ice cream, pause them today.",
    eat: ["Lactose-free or plant milk if needed", "Rice, potato, or oatmeal", "Lean protein", "Cooked veggies"],
    skip: ["Milk", "Soft cheese", "Ice cream", "Creamy sauces"],
    tip: "Write how your belly feels 1–2 hours after eating.",
  },
  {
    day: 5,
    title: "Gluten pause (optional)",
    focus: "If bread/pasta often bother you, try rice or potato instead.",
    eat: ["Rice bowls", "Potato", "Corn tortillas if okay", "Simple proteins"],
    skip: ["Regular bread", "Pasta", "Pastries", "Breaded fried foods"],
    tip: "This is a short experiment for your notes — not forever.",
  },
  {
    day: 6,
    title: "Stress + belly day",
    focus: "Pair gentle food with calm moments.",
    eat: ["Your favorite safe meals from this week", "Warm soup", "Soft fruit"],
    skip: ["Skipping meals", "Late-night heavy snacks", "Screens during dinner if they rush you"],
    tip: "Try 3 slow breaths before each meal. In for 4, out for 6.",
  },
  {
    day: 7,
    title: "Story day",
    focus: "Finish your week of notes and prepare for the doctor.",
    eat: ["Stick with foods that felt kindest", "Smaller portions", "Water through the day"],
    skip: ["Testing lots of new trigger foods today", "Judging yourself for hard days"],
    tip: "Open the Doctor Report and bring it or email it before your visit.",
  },
];

export const PREVENTION_HABITS: PreventionHabit[] = [
  {
    title: "Smaller plates, more often",
    detail: "Big meals can stretch the belly and make burping and gas louder. Try half portions and a snack later.",
  },
  {
    title: "Sit up after eating",
    detail: "Stay upright for about 30–60 minutes after a meal. Lying down right away can invite burning and burps.",
  },
  {
    title: "Chew like you have all day",
    detail: "Soft chewing means less air swallowed and easier work for your stomach.",
  },
  {
    title: "Watch the usual troublemakers",
    detail: "Many people feel worse with soda, greasy food, lots of dairy, onion/garlic, or very spicy plates. Your logs will show your truth.",
  },
  {
    title: "Water, not bubbles",
    detail: "Plain water or still herbal tea is usually kinder than soda or sparkling water when burping is loud.",
  },
  {
    title: "Protect sleep",
    detail: "Tired bodies get more stressed, and stress can tighten the gut. A calm bedtime helps the whole story.",
  },
  {
    title: "Name the stress",
    detail: "If your belly flares on hard emotion days, that is still real. Share that with your doctor too.",
  },
];

export const DOCTOR_TALKING_POINTS = [
  "When burping, gas, or pain usually starts (after meals, at night, when stressed).",
  "Foods that showed up on harder days in your log.",
  "Any burning, vomiting, weight change, or blood — say these right away if they happen.",
  "Medicines or remedies you already tried.",
  "How stress and sleep look across the week.",
];
