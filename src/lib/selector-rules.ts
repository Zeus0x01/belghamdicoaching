import { CATALOG, type Product } from "@/lib/catalog";

export interface SelectorAnswers {
  goal: "build-muscle" | "lose-fat" | "strength" | "athletic";
  experience: "beginner" | "intermediate" | "advanced";
  days: number;
  location: "gym" | "home";
  support: "self-guided" | "online-coaching";
}

export const SELECTOR_QUESTIONS = [
  {
    id: "goal",
    question: "What is your primary goal?",
    options: [
      { value: "build-muscle", label: "Build muscle" },
      { value: "lose-fat", label: "Lose fat" },
      { value: "strength", label: "Get stronger" },
      { value: "athletic", label: "Athletic performance" },
    ],
  },
  {
    id: "experience",
    question: "What is your training experience?",
    options: [
      { value: "beginner", label: "Beginner (under 1 year)" },
      { value: "intermediate", label: "Intermediate (1-3 years)" },
      { value: "advanced", label: "Advanced (3+ years)" },
    ],
  },
  {
    id: "days",
    question: "How many days can you train weekly?",
    options: [
      { value: "3", label: "3 days" },
      { value: "4", label: "4 days" },
      { value: "5", label: "5 days" },
      { value: "6", label: "6 days" },
    ],
  },
  {
    id: "location",
    question: "Do you train at home or in a gym?",
    options: [
      { value: "gym", label: "In a gym" },
      { value: "home", label: "At home" },
    ],
  },
  {
    id: "support",
    question: "What type of coaching support do you need?",
    options: [
      { value: "self-guided", label: "Self-guided program" },
      { value: "online-coaching", label: "Online coaching" },
    ],
  },
] as const;

const SCORE_WEIGHTS = { tag: 3, level: 2, days: 2, equipment: 3 } as const;

function scoreProduct(product: Product, answers: SelectorAnswers): number {
  let score = 0;
  const tagMap: Record<SelectorAnswers["goal"], string[]> = {
    "build-muscle": ["hypertrophy", "muscle"],
    "lose-fat": ["fat-loss"],
    strength: ["strength"],
    athletic: ["athletic", "power"],
  };
  for (const tag of tagMap[answers.goal]) {
    if (product.tags.includes(tag)) score += SCORE_WEIGHTS.tag;
  }

  if (product.level === answers.experience) score += SCORE_WEIGHTS.level;
  else if (answers.experience === "advanced" && product.level === "intermediate") score += 1;

  const dayDelta = Math.abs(product.daysPerWeek - answers.days);
  score += Math.max(0, SCORE_WEIGHTS.days - dayDelta);

  if (product.equipment === answers.location || product.equipment === "both") {
    score += SCORE_WEIGHTS.equipment;
  }

  return score;
}

export function recommendPrograms(answers: SelectorAnswers): Product[] {
  const ranked = [...CATALOG]
    .map((product) => ({ product, score: scoreProduct(product, answers) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const results = ranked.slice(0, 3).map((r) => r.product);
  return results.length > 0 ? results : [CATALOG[0]];
}
