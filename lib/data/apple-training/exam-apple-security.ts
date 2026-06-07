import type { Question } from "@/lib/types";
import { shuffleArray } from "@/lib/quiz/seeded-random";
import { enrichQuestionWithModule } from "@/lib/data/exams/question-modules";
import { appleSecurityBank } from "@/lib/data/exams/pools/banks/apple-security-bank";

export const APPLE_SECURITY_EXAM_TOTAL = 100;
export const APPLE_SECURITY_PASSING_SCORE = 80;

export const appleSecurityExamPool100: Question[] = appleSecurityBank;

export function pickAppleSecurityExamQuestions(sessionSeed: string): Question[] {
  const shuffled = shuffleArray(appleSecurityBank, sessionSeed);
  return shuffled.slice(0, APPLE_SECURITY_EXAM_TOTAL).map((question, i) =>
    enrichQuestionWithModule({
      ...question,
      id: `asec-exam-${sessionSeed.slice(0, 8)}-${i}-${question.id}`,
    })
  );
}
