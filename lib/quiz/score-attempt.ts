import type { Question } from "@/lib/types";
import { isMultiSelectQuestion } from "@/lib/quiz/scoring";

export type AnswerLabels = Record<string, string | string[]>;

export type AttemptReview = {
  questionId: string;
  correct: boolean;
  explanation: string;
  correctLabels: string[];
};

export type AttemptScore = {
  correct: number;
  total: number;
  percent: number;
  passed: boolean;
  reviews: AttemptReview[];
};

function asLabelList(value: string | string[] | undefined): string[] {
  if (value === undefined) return [];
  return (Array.isArray(value) ? value : [value])
    .map((label) => label.trim())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, "fr"));
}

function expectedLabels(question: Question): string[] {
  if (isMultiSelectQuestion(question)) {
    return (question.correctIndices ?? [])
      .map((index) => question.options[index])
      .filter((label): label is string => Boolean(label))
      .map((label) => label.trim())
      .sort((a, b) => a.localeCompare(b, "fr"));
  }
  const label = question.options[question.correctIndex];
  return label ? [label.trim()] : [];
}

function labelsMatch(expected: string[], selected: string[]): boolean {
  if (expected.length === 0 || selected.length !== expected.length) return false;
  return expected.every((label, index) => label === selected[index]);
}

function resolveBankQuestion(questionId: string, bankById: Map<string, Question>): Question | undefined {
  const direct = bankById.get(questionId);
  if (direct) return direct;
  for (const [id, question] of bankById) {
    if (questionId.endsWith(`-${id}`) || questionId.endsWith(id)) return question;
  }
  return undefined;
}

/**
 * Note une tentative à partir des libellés choisis (indépendant du mélange d'options côté client).
 * Les questions absentes de la banque sont ignorées. Les omissions comptent comme fausses jusqu'à `expectedTotal`.
 */
export function scoreAttemptByLabels(
  bank: Question[],
  answerLabels: AnswerLabels,
  expectedTotal: number,
  passingScore: number
): AttemptScore {
  const bankById = new Map(bank.map((question) => [question.id, question]));
  const reviews: AttemptReview[] = [];
  let correct = 0;

  const answeredIds = Object.keys(answerLabels);
  const seen = new Set<string>();

  for (const questionId of answeredIds) {
    const question = resolveBankQuestion(questionId, bankById);
    if (!question || seen.has(question.id)) continue;
    seen.add(question.id);
    const expected = expectedLabels(question);
    const selected = asLabelList(answerLabels[questionId]);
    const ok = labelsMatch(expected, selected);
    if (ok) correct += 1;
    reviews.push({
      questionId,
      correct: ok,
      explanation: question.explanation,
      correctLabels: expected,
    });
  }

  const total = Math.max(1, expectedTotal);
  const percent = Math.max(0, Math.min(100, Math.round((correct / total) * 100)));
  return {
    correct,
    total,
    percent,
    passed: percent >= passingScore,
    reviews,
  };
}

export function uniqueQuestionCount(questions: Question[]): number {
  const seen = new Set<string>();
  for (const question of questions) {
    const stableId = question.id.replace(/-(variant|v)\d+$/i, "");
    seen.add(stableId);
  }
  return seen.size;
}
