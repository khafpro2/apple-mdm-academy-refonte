import { examRouteToQuizSlug } from "@/lib/data/exams/pools";

/** Durées officielles par route /examens/[slug] (minutes). */
export const EXAM_DURATION_BY_ROUTE: Record<string, number> = {
  "apple-it-professional": 120,
  "jamf-100": 120,
  "jamf-200": 180,
  "intune-apple": 120,
  "apple-security": 120,
};

export const EXAM_ROUTE_SLUGS = Object.keys(examRouteToQuizSlug);

export function getExamDurationMinutes(routeSlug: string, fallback?: number): number {
  return EXAM_DURATION_BY_ROUTE[routeSlug] ?? fallback ?? 120;
}

export type ScoreTier = {
  id: string;
  label: string;
  min: number;
  max: number;
  className: string;
};

export const SCORE_TIERS: ScoreTier[] = [
  { id: "review", label: "À revoir", min: 0, max: 59, className: "bg-red-100 text-red-800" },
  { id: "competent", label: "Compétent", min: 60, max: 79, className: "bg-amber-100 text-amber-800" },
  { id: "ready", label: "Prêt certification", min: 80, max: 89, className: "bg-blue-100 text-blue-800" },
  { id: "expert", label: "Expert", min: 90, max: 100, className: "bg-green-100 text-green-800" },
];

export function getScoreTier(percent: number): ScoreTier {
  return SCORE_TIERS.find((t) => percent >= t.min && percent <= t.max) ?? SCORE_TIERS[0];
}
