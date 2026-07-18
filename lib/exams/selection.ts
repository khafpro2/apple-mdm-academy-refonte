import type { Question } from "@/lib/types";
import { enrichQuestionWithModule } from "@/lib/data/exams/question-modules";
import { shuffleArray } from "@/lib/quiz/seeded-random";
import type { ExamQuestion, ExamSelectionCriteria } from "@/lib/exams/exam-types";

export type ExamSelectionReport = {
  selected: Question[];
  requestedCount: number;
  availableCount: number;
  uniqueCount: number;
  effectiveCount: number;
  domainCounts: Record<string, number>;
  needsReviewCount: number;
  warnings: string[];
};

function questionDomain(question: Question): string {
  return question.domain ?? question.relatedModuleSlug ?? "general";
}

function matchesCriteria(question: ExamQuestion, criteria: ExamSelectionCriteria): boolean {
  if (question.disabled) return false;
  if (criteria.domains?.length && !criteria.domains.includes(questionDomain(question))) return false;
  if (criteria.difficulties?.length && question.difficulty && !criteria.difficulties.includes(question.difficulty)) return false;
  if (criteria.appleVersions?.length && question.appleVersion && !criteria.appleVersions.includes(question.appleVersion)) return false;
  if (
    criteria.platforms?.length &&
    question.platforms?.length &&
    !question.platforms.some((platform) => criteria.platforms?.includes(platform))
  ) return false;
  if (
    criteria.providerTags?.length &&
    question.providerTags?.length &&
    !question.providerTags.some((tag) => criteria.providerTags?.includes(tag))
  ) return false;
  if (criteria.level && question.level && question.level !== criteria.level) return false;
  return true;
}

function pickNextDomain(
  byDomain: Map<string, Question[]>,
  selectedDomainCounts: Record<string, number>,
  domainOrder: string[],
  weights?: Record<string, number>,
): string | null {
  const available = domainOrder.filter((domainId) => (byDomain.get(domainId)?.length ?? 0) > 0);
  if (available.length === 0) return null;
  return available.sort((a, b) => {
    const ratioA = (selectedDomainCounts[a] ?? 0) / Math.max(1, weights?.[a] ?? 1);
    const ratioB = (selectedDomainCounts[b] ?? 0) / Math.max(1, weights?.[b] ?? 1);
    return ratioA - ratioB;
  })[0];
}

function uniqueByStableQuestionId(pool: Question[]): Question[] {
  const seen = new Set<string>();
  const unique: Question[] = [];
  for (const question of pool) {
    const stableId = question.id.replace(/-(variant|v)\d+$/i, "");
    if (seen.has(stableId)) continue;
    seen.add(stableId);
    unique.push(question);
  }
  return unique;
}

export function selectExamQuestions(basePool: Question[], criteria: ExamSelectionCriteria): ExamSelectionReport {
  const warnings: string[] = [];
  const filtered = (basePool as ExamQuestion[]).filter((question) => matchesCriteria(question, criteria));
  const unique = uniqueByStableQuestionId(filtered);
  const source = unique.length > 0 ? unique : uniqueByStableQuestionId(basePool);
  const targetCount = Math.max(0, criteria.count);

  if (basePool.length === 0) {
    return {
      selected: [],
      requestedCount: targetCount,
      availableCount: 0,
      uniqueCount: 0,
      effectiveCount: 0,
      domainCounts: {},
      needsReviewCount: 0,
      warnings: ["Banque vide"],
    };
  }
  if (filtered.length === 0 && basePool.length > 0) warnings.push("Aucune question ne correspond aux critères fins ; sélection dans toute la banque.");
  if (source.length < targetCount) warnings.push(`Banque unique insuffisante (${source.length}/${targetCount}) ; la tentative est réduite aux questions uniques disponibles.`);

  const byDomain = new Map<string, Question[]>();
  for (const question of shuffleArray(source, `${criteria.seed}:domains`)) {
    const domain = questionDomain(question);
    byDomain.set(domain, [...(byDomain.get(domain) ?? []), question]);
  }

  const selected: Question[] = [];
  const selectedStableIds = new Set<string>();
  const domainOrder = shuffleArray([...byDomain.keys()], `${criteria.seed}:domain-order`);
  const selectedDomainCounts: Record<string, number> = {};

  const effectiveTargetCount = Math.min(targetCount, source.length);
  while (selected.length < effectiveTargetCount) {
    const domainId = pickNextDomain(byDomain, selectedDomainCounts, domainOrder, criteria.domainWeights);
    if (!domainId) break;
    const bucket = byDomain.get(domainId);
    const next = bucket?.shift();
    if (!next) continue;
    const stableId = next.id.replace(/-(variant|v)\d+$/i, "");
    if (selectedStableIds.has(stableId)) continue;
    selectedStableIds.add(stableId);
    selected.push(next);
    selectedDomainCounts[domainId] = (selectedDomainCounts[domainId] ?? 0) + 1;
  }

  const domainCounts: Record<string, number> = {};
  let needsReviewCount = 0;
  const normalized = selected.map((question, index) => {
    const domain = questionDomain(question);
    domainCounts[domain] = (domainCounts[domain] ?? 0) + 1;
    if ((question as ExamQuestion).verificationStatus === "needs-review") needsReviewCount++;
    return enrichQuestionWithModule({
      ...question,
      id: `exam-${criteria.seed.slice(0, 8)}-${index}-${question.id}`,
    });
  });

  return {
    selected: normalized,
    requestedCount: targetCount,
    availableCount: filtered.length || basePool.length,
    uniqueCount: source.length,
    effectiveCount: normalized.length,
    domainCounts,
    needsReviewCount,
    warnings,
  };
}
