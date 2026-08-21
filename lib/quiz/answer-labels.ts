import type { Question } from "@/lib/types";
import type { UserAnswer } from "@/lib/quiz/scoring";
import type { AnswerLabels } from "@/lib/quiz/score-attempt";

export function buildAnswerLabels(
  questions: Question[],
  answers: Record<string, UserAnswer>
): AnswerLabels {
  const labels: AnswerLabels = {};
  for (const question of questions) {
    const answer = answers[question.id];
    if (answer === undefined) continue;
    if (Array.isArray(answer)) {
      labels[question.id] = answer
        .map((index) => question.options[index])
        .filter((label): label is string => Boolean(label));
    } else {
      const label = question.options[answer];
      if (label) labels[question.id] = label;
    }
  }
  return labels;
}
