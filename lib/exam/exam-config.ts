export {
  EXAM_ROUTE_SLUGS,
  getExamDurationMinutes,
  getExamFormat,
  getExamFormatByQuizSlug,
  getExamPassingScore,
  getExamQuestionCount,
  shouldShowExplanations,
} from "@/lib/exams/exam-config";

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
