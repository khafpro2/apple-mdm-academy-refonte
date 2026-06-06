import type { Question } from "@/lib/types";
import { shuffleArray } from "@/lib/quiz/seeded-random";

/** Mélange les options d'une question et recalcule correctIndex. */
export function shuffleQuestionOptions(question: Question, seed: string): Question {
  if (question.selectMultiple && question.correctIndices) {
    const indices = question.options.map((_, i) => i);
    const shuffled = shuffleArray(indices, seed);
    const newOptions = shuffled.map((i) => question.options[i]);
    const newCorrectIndices = question.correctIndices
      .map((ci) => shuffled.indexOf(ci))
      .sort((a, b) => a - b);
    return {
      ...question,
      options: newOptions,
      correctIndices: newCorrectIndices,
      correctIndex: newCorrectIndices[0] ?? question.correctIndex,
    };
  }

  const indices = question.options.map((_, i) => i);
  const shuffled = shuffleArray(indices, seed);
  const newOptions = shuffled.map((i) => question.options[i]);
  const newCorrectIndex = shuffled.indexOf(question.correctIndex);
  return { ...question, options: newOptions, correctIndex: newCorrectIndex };
}

/** Place la bonne réponse à un index cible (0–3) en mélangant les distracteurs. */
export function placeCorrectAtIndex(
  question: Question,
  targetIndex: 0 | 1 | 2 | 3,
  seed: string
): Question {
  if (question.options.length !== 4) {
    return shuffleQuestionOptions(question, seed);
  }

  const correct = question.options[question.correctIndex];
  const distractors = shuffleArray(
    question.options.filter((_, i) => i !== question.correctIndex),
    `${seed}-d`
  );
  const newOptions: string[] = [];
  let d = 0;
  for (let i = 0; i < 4; i++) {
    if (i === targetIndex) newOptions.push(correct);
    else newOptions.push(distractors[d++]!);
  }

  if (question.selectMultiple && question.correctIndices) {
    const indexMap = new Map<string, number>();
    question.options.forEach((opt, oldIdx) => {
      indexMap.set(opt, newOptions.indexOf(opt));
    });
    const newCorrectIndices = question.correctIndices
      .map((ci) => indexMap.get(question.options[ci]!) ?? targetIndex)
      .sort((a, b) => a - b);
    return {
      ...question,
      options: newOptions,
      correctIndex: targetIndex,
      correctIndices: newCorrectIndices,
    };
  }

  return { ...question, options: newOptions, correctIndex: targetIndex };
}
