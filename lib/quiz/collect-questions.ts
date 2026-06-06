import type { Question } from "@/lib/types";
import { rawQuizzesBeforePrepare } from "@/lib/data/quizzes";
import { examPools } from "@/lib/data/exams/pools";

export function collectAllQuizSets(): { slug: string; questions: Question[] }[] {
  const sets: { slug: string; questions: Question[] }[] = [];

  for (const quiz of rawQuizzesBeforePrepare) {
    sets.push({ slug: quiz.slug, questions: quiz.questions });
  }
  for (const [slug, pool] of Object.entries(examPools)) {
    sets.push({ slug: `pool:${slug}`, questions: pool });
  }

  return sets;
}

export function collectAllQuestions(): Question[] {
  return collectAllQuizSets().flatMap((s) => s.questions);
}
