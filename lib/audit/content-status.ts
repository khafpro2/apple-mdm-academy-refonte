/** Statut de complétude d'un élément pédagogique */
export type ContentCompleteness =
  | "complet"
  | "partiellement complet"
  | "placeholder"
  | "vide"
  | "à améliorer";

export type ContentAuditItem = {
  id: string;
  type: "lesson" | "lab" | "quiz" | "video" | "resource" | "exam";
  title: string;
  trackSlug?: string;
  status: ContentCompleteness;
  score: number;
  issues: string[];
  meta?: Record<string, string | number | boolean>;
};

export function statusRank(status: ContentCompleteness): number {
  const map: Record<ContentCompleteness, number> = {
    complet: 5,
    "partiellement complet": 4,
    "à améliorer": 3,
    placeholder: 2,
    vide: 1,
  };
  return map[status];
}

export function aggregateScore(items: ContentAuditItem[]): number {
  if (items.length === 0) return 100;
  const sum = items.reduce((a, i) => a + i.score, 0);
  return Math.round(sum / items.length);
}

export function countByStatus(items: ContentAuditItem[]): Record<ContentCompleteness, number> {
  const counts: Record<ContentCompleteness, number> = {
    complet: 0,
    "partiellement complet": 0,
    placeholder: 0,
    vide: 0,
    "à améliorer": 0,
  };
  items.forEach((i) => {
    counts[i.status]++;
  });
  return counts;
}
