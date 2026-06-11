/**
 * Spaced Repetition (SM-2 simplifié) pour le mode révision Apple MDM Academy
 * Basé sur l'algorithme SuperMemo 2 — adapté pour le web sans dépendances externes
 */

export type CardGrade = 0 | 1 | 2 | 3 | 4 | 5;
// 0-1 = raté, 2 = difficile, 3 = correct, 4 = facile, 5 = parfait

export interface RevisionCard {
  questionId: string;
  quizSlug: string;
  easinessFactor: number;  // EF: 1.3 à 2.5 (défaut 2.5)
  interval: number;         // jours avant prochaine révision
  repetitions: number;      // nombre de révisions réussies consécutives
  nextReview: string;       // date ISO de prochaine révision
  lastGrade: CardGrade;
}

const MIN_EF = 1.3;
const DEFAULT_EF = 2.5;

/**
 * Calcule le prochain intervalle SM-2
 * @returns intervalle en jours et nouveau EF
 */
export function calculateNextInterval(card: RevisionCard, grade: CardGrade): {
  interval: number;
  easinessFactor: number;
  repetitions: number;
} {
  let { interval, easinessFactor, repetitions } = card;

  if (grade < 3) {
    // Échec — réinitialiser les répétitions
    repetitions = 0;
    interval = 1;
  } else {
    // Succès
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easinessFactor);
    }
    repetitions += 1;
    // Mettre à jour EF
    easinessFactor = Math.max(
      MIN_EF,
      easinessFactor + 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)
    );
  }

  return { interval, easinessFactor, repetitions };
}

/**
 * Crée une nouvelle carte de révision
 */
export function createRevisionCard(questionId: string, quizSlug: string): RevisionCard {
  return {
    questionId,
    quizSlug,
    easinessFactor: DEFAULT_EF,
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(),
    lastGrade: 3,
  };
}

/**
 * Met à jour une carte après révision
 */
export function reviewCard(card: RevisionCard, grade: CardGrade): RevisionCard {
  const { interval, easinessFactor, repetitions } = calculateNextInterval(card, grade);
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    ...card,
    interval,
    easinessFactor,
    repetitions,
    nextReview: nextReview.toISOString(),
    lastGrade: grade,
  };
}

/**
 * Filtre les cartes dues pour révision aujourd'hui
 */
export function getDueCards(cards: RevisionCard[]): RevisionCard[] {
  const now = new Date();
  return cards
    .filter((c) => new Date(c.nextReview) <= now)
    .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
}

/**
 * Statistiques de révision
 */
export function getRevisionStats(cards: RevisionCard[]) {
  const now = new Date();
  const due = cards.filter((c) => new Date(c.nextReview) <= now).length;
  const learned = cards.filter((c) => c.repetitions >= 3).length;
  const struggling = cards.filter((c) => c.lastGrade < 3 && c.repetitions > 0).length;
  
  // Mastery par domaine
  const byQuiz = cards.reduce((acc, c) => {
    if (!acc[c.quizSlug]) acc[c.quizSlug] = { total: 0, mastered: 0 };
    acc[c.quizSlug].total++;
    if (c.repetitions >= 3 && c.lastGrade >= 3) acc[c.quizSlug].mastered++;
    return acc;
  }, {} as Record<string, { total: number; mastered: number }>);

  return { due, learned, struggling, total: cards.length, byQuiz };
}

/**
 * Prédiction de score examen basée sur les cartes maîtrisées
 * (heuristique simple basée sur la maîtrise des cartes)
 */
export function predictExamScore(cards: RevisionCard[], passingScore = 70): {
  predictedScore: number;
  readiness: "not_ready" | "almost" | "ready";
  confidence: number;
} {
  if (cards.length === 0) return { predictedScore: 0, readiness: "not_ready", confidence: 0 };

  const mastered = cards.filter((c) => c.repetitions >= 3 && c.lastGrade >= 3).length;
  const reviewed = cards.filter((c) => c.repetitions > 0).length;
  const avgEF = cards.reduce((sum, c) => sum + c.easinessFactor, 0) / cards.length;

  // Score prédit : % maîtrisé × ajustement EF
  const masteryRate = mastered / cards.length;
  const efBonus = (avgEF - 1.3) / (2.5 - 1.3); // 0 à 1
  const predictedScore = Math.round((masteryRate * 0.85 + efBonus * 0.15) * 100);
  const confidence = Math.min(100, Math.round((reviewed / cards.length) * 100));

  const readiness =
    predictedScore >= passingScore + 10
      ? "ready"
      : predictedScore >= passingScore
      ? "almost"
      : "not_ready";

  return { predictedScore, readiness, confidence };
}
