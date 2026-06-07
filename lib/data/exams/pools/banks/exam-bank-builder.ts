import type { Question } from "@/lib/types";
import { buildQuestion, resetQuestionPositionCounter } from "@/lib/quiz/question-builder";

export type ExamBankInput = {
  id: string;
  domain: string;
  difficulty: "easy" | "medium" | "hard";
  text: string;
  correct: string;
  distractors: [string, string, string];
  explanation: string;
  relatedModuleSlug?: string;
  relatedLabSlug?: string;
};

export function buildExamBank(inputs: ExamBankInput[]): Question[] {
  resetQuestionPositionCounter();
  return inputs.map((input) => {
    const q = buildQuestion({
      id: input.id,
      text: input.text,
      correct: input.correct,
      distractors: input.distractors,
      explanation: input.explanation,
      moduleHref: input.relatedModuleSlug ? `/cours/${input.relatedModuleSlug}` : undefined,
      moduleLabel: input.domain,
    });
    return {
      ...q,
      difficulty: input.difficulty,
      domain: input.domain,
      relatedModuleSlug: input.relatedModuleSlug,
      relatedLabSlug: input.relatedLabSlug,
    };
  });
}

export function countByDomain(questions: Question[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const q of questions) {
    const d = q.domain ?? "unknown";
    counts[d] = (counts[d] ?? 0) + 1;
  }
  return counts;
}

export function countCorrectIndexDistribution(questions: Question[]): Record<number, number> {
  const dist: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  for (const q of questions) {
    dist[q.correctIndex] = (dist[q.correctIndex] ?? 0) + 1;
  }
  return dist;
}
