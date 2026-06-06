import type { Question } from "@/lib/types";

export type UserAnswer = number | number[] | undefined;

export function isMultiSelectQuestion(q: Question): boolean {
  return Boolean(q.selectMultiple && q.correctIndices && q.correctIndices.length > 1);
}

export function isAnswerCorrect(q: Question, userAnswer: UserAnswer): boolean {
  if (userAnswer === undefined) return false;

  if (isMultiSelectQuestion(q)) {
    const selected = (Array.isArray(userAnswer) ? userAnswer : [userAnswer]).slice().sort((a, b) => a - b);
    const expected = [...(q.correctIndices ?? [])].sort((a, b) => a - b);
    return (
      selected.length === expected.length &&
      selected.every((v, i) => v === expected[i])
    );
  }

  return userAnswer === q.correctIndex;
}

export function scoreQuestions(questions: Question[], answers: Record<string, UserAnswer>) {
  let correct = 0;
  questions.forEach((q) => {
    if (isAnswerCorrect(q, answers[q.id])) correct++;
  });
  return { correct, total: questions.length };
}
