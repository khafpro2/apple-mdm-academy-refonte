import type { Question } from "@/lib/types";

/** Question servie au navigateur : sans indice ni explication. */
export function toPublicQuestion(question: Question): Question {
  return {
    ...question,
    correctIndex: -1,
    correctIndices: undefined,
    explanation: "",
  };
}

export function toPublicQuestions(questions: Question[]): Question[] {
  return questions.map(toPublicQuestion);
}

export function isPublicQuestion(question: Question): boolean {
  return question.correctIndex < 0 && !question.explanation;
}
