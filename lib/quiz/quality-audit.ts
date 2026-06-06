import type { Question } from "@/lib/types";

export type QuestionIssueType =
  | "position_bias"
  | "length_imbalance"
  | "weak_distractor"
  | "too_easy"
  | "scenario_missing";

export type QuestionIssue = {
  questionId: string;
  type: QuestionIssueType;
  severity: "low" | "medium" | "high";
  message: string;
};

export type QuizAuditResult = {
  quizSlug: string;
  questionCount: number;
  issues: QuestionIssue[];
  positionDistribution: Record<number, number>;
  positionBiasScore: number;
  lengthImbalanceCount: number;
  weakDistractorCount: number;
  qualityScore: number;
};

export type GlobalQuizAudit = {
  totalQuestions: number;
  totalQuizzes: number;
  globalPositionDistribution: Record<number, number>;
  positionBiasScore: number;
  lengthImbalanceCount: number;
  weakDistractorCount: number;
  tooEasyCount: number;
  qualityScore: number;
  quizResults: QuizAuditResult[];
  topIssues: QuestionIssue[];
};

const WEAK_DISTRACTOR_PATTERNS: RegExp[] = [
  /\bnetflix\b/i,
  /\bspotify\b/i,
  /\bbluetooth\b/i,
  /\bmarketing\b/i,
  /\bcomptabilit[eé]\b/i,
  /\bdesign\b/i,
  /\bftp\b/i,
  /\bwallpaper\b/i,
  /\bcouleur\b/i,
  /\bemail\b/i,
  /\baucun(e)?\b/i,
  /\btoujours\b/i,
  /\bjamais\b/i,
  /\bgratuit\b/i,
  /\bfacebook\b/i,
  /\bexcel\b/i,
  /\brecettes?\b/i,
  /\bcuisine\b/i,
  /\bide\b/i,
  /\bmainframe\b/i,
  /\bimprimante\b/i,
];

const SCENARIO_MARKERS = [
  "après",
  "lorsque",
  "un utilisateur",
  "une équipe",
  "diagnostic",
  "dépannage",
  "incident",
  "symptôme",
  "vérification",
  "priorité",
  "scénario",
  "cas ",
];

function optionLength(text: string): number {
  return text.trim().length;
}

export function isWeakDistractor(option: string, correctOption: string): boolean {
  const trimmed = option.trim();
  if (trimmed.length < 4) return true;
  if (WEAK_DISTRACTOR_PATTERNS.some((re) => re.test(trimmed))) {
    if (WEAK_DISTRACTOR_PATTERNS.some((re) => re.test(correctOption))) return false;
    return true;
  }
  return false;
}

export function hasLengthImbalance(question: Question): boolean {
  const lengths = question.options.map(optionLength);
  const correctLen = lengths[question.correctIndex] ?? 0;
  const others = lengths.filter((_, i) => i !== question.correctIndex);
  if (others.length === 0) return false;
  const avgOther = others.reduce((a, b) => a + b, 0) / others.length;
  const maxOther = Math.max(...others);
  return correctLen > avgOther * 1.35 || correctLen > maxOther * 1.25;
}

export function isTooEasy(question: Question): boolean {
  const weakCount = question.options.filter(
    (opt, i) => i !== question.correctIndex && isWeakDistractor(opt, question.options[question.correctIndex]!)
  ).length;
  return weakCount >= 2;
}

export function lacksScenario(question: Question): boolean {
  const lower = question.text.toLowerCase();
  return !SCENARIO_MARKERS.some((m) => lower.includes(m));
}

export function auditQuestion(question: Question): QuestionIssue[] {
  const issues: QuestionIssue[] = [];
  const correct = question.options[question.correctIndex] ?? "";

  if (hasLengthImbalance(question)) {
    issues.push({
      questionId: question.id,
      type: "length_imbalance",
      severity: "high",
      message: "La bonne réponse est nettement plus longue que les distracteurs.",
    });
  }

  question.options.forEach((opt, i) => {
    if (i === question.correctIndex) return;
    if (isWeakDistractor(opt, correct)) {
      issues.push({
        questionId: question.id,
        type: "weak_distractor",
        severity: "medium",
        message: `Distracteur faible : « ${opt.slice(0, 60)}${opt.length > 60 ? "…" : ""} »`,
      });
    }
  });

  if (isTooEasy(question)) {
    issues.push({
      questionId: question.id,
      type: "too_easy",
      severity: "medium",
      message: "Plusieurs distracteurs sont trop évidents.",
    });
  }

  if (lacksScenario(question) && question.text.length < 80) {
    issues.push({
      questionId: question.id,
      type: "scenario_missing",
      severity: "low",
      message: "Question factuelle sans scénario de diagnostic/déploiement.",
    });
  }

  return issues;
}

function positionBiasScore(dist: Record<number, number>, total: number): number {
  if (total === 0) return 100;
  const expected = total / 4;
  let deviation = 0;
  for (let i = 0; i < 4; i++) {
    deviation += Math.abs((dist[i] ?? 0) - expected);
  }
  const maxDeviation = total * 1.5;
  return Math.max(0, Math.round(100 - (deviation / maxDeviation) * 100));
}

function computeQualityScore(issues: QuestionIssue[], total: number, positionScore: number): number {
  if (total === 0) return 100;
  const penalty =
    issues.filter((i) => i.severity === "high").length * 8 +
    issues.filter((i) => i.severity === "medium").length * 3 +
    issues.filter((i) => i.severity === "low").length * 1;
  const perQuestion = Math.min(60, penalty);
  return Math.max(0, Math.round(positionScore * 0.4 + (100 - perQuestion) * 0.6));
}

export function auditQuestionSet(
  questions: Question[],
  quizSlug = "unknown"
): QuizAuditResult {
  const positionDistribution: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const issues: QuestionIssue[] = [];

  questions.forEach((q) => {
    positionDistribution[q.correctIndex] = (positionDistribution[q.correctIndex] ?? 0) + 1;
    issues.push(...auditQuestion(q));
  });

  const total = questions.length;
  const posScore = positionBiasScore(positionDistribution, total);

  if (total >= 8) {
    for (let i = 0; i < 4; i++) {
      const pct = ((positionDistribution[i] ?? 0) / total) * 100;
      if (pct > 40) {
        issues.push({
          questionId: quizSlug,
          type: "position_bias",
          severity: "high",
          message: `Position ${String.fromCharCode(65 + i)} sur-représentée (${pct.toFixed(0)} %).`,
        });
      }
    }
  }

  return {
    quizSlug,
    questionCount: total,
    issues,
    positionDistribution,
    positionBiasScore: posScore,
    lengthImbalanceCount: issues.filter((i) => i.type === "length_imbalance").length,
    weakDistractorCount: issues.filter((i) => i.type === "weak_distractor").length,
    qualityScore: computeQualityScore(issues, total, posScore),
  };
}

export function auditAllQuizSets(
  sets: { slug: string; questions: Question[] }[]
): GlobalQuizAudit {
  const quizResults = sets.map((s) => auditQuestionSet(s.questions, s.slug));
  const globalPositionDistribution: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  let totalQuestions = 0;
  const allIssues: QuestionIssue[] = [];

  quizResults.forEach((r) => {
    totalQuestions += r.questionCount;
    allIssues.push(...r.issues);
    Object.entries(r.positionDistribution).forEach(([k, v]) => {
      globalPositionDistribution[Number(k)] =
        (globalPositionDistribution[Number(k)] ?? 0) + v;
    });
  });

  const posScore = positionBiasScore(globalPositionDistribution, totalQuestions);
  const topIssues = [...allIssues]
    .sort((a, b) => {
      const sev = { high: 3, medium: 2, low: 1 };
      return sev[b.severity] - sev[a.severity];
    })
    .slice(0, 20);

  return {
    totalQuestions,
    totalQuizzes: sets.length,
    globalPositionDistribution,
    positionBiasScore: posScore,
    lengthImbalanceCount: allIssues.filter((i) => i.type === "length_imbalance").length,
    weakDistractorCount: allIssues.filter((i) => i.type === "weak_distractor").length,
    tooEasyCount: allIssues.filter((i) => i.type === "too_easy").length,
    qualityScore: computeQualityScore(allIssues, totalQuestions, posScore),
    quizResults: quizResults.sort((a, b) => a.qualityScore - b.qualityScore),
    topIssues,
  };
}
