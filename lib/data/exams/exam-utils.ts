import type { Question } from "@/lib/types";
import { enrichQuestionWithModule } from "@/lib/data/exams/question-modules";

/** Mélange déterministe (seed string) */
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function shuffleArray<T>(arr: T[], seed: string): T[] {
  const rng = seededRandom(seed);
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Variante d'une question avec options mélangées */
export function variantQuestion(q: Question, variantIndex: number): Question {
  const indices = q.options.map((_, i) => i);
  const shuffled = shuffleArray(indices, `${q.id}-v${variantIndex}`);
  const newOptions = shuffled.map((i) => q.options[i]);
  const newCorrectIndex = shuffled.indexOf(q.correctIndex);
  return {
    ...q,
    id: `${q.id}-v${variantIndex}`,
    options: newOptions,
    correctIndex: newCorrectIndex,
  };
}

/** Étend un pool de base jusqu'à targetCount via variantes */
export function expandQuestionPool(base: Question[], targetCount: number): Question[] {
  const pool: Question[] = [...base];
  let variant = 0;
  while (pool.length < targetCount) {
    for (const q of base) {
      if (pool.length >= targetCount) break;
      pool.push(variantQuestion(q, variant));
    }
    variant++;
  }
  return pool;
}

/** Sélection aléatoire (seed session) pour mode examen */
export function pickExamQuestions(
  base: Question[],
  count: number,
  sessionSeed: string
): Question[] {
  const expanded = expandQuestionPool(base, Math.max(count, base.length * 3));
  const shuffled = shuffleArray(expanded, sessionSeed);
  return shuffled.slice(0, count).map((q, i) =>
    enrichQuestionWithModule({
      ...q,
      id: `exam-${sessionSeed.slice(0, 8)}-${i}-${q.id}`,
    })
  );
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
