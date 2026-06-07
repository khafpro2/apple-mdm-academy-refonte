/** Audit qualité global — cours, labs, quiz, examens Apple */

import { courses } from "@/lib/data/courses";
import { getFlatLessons } from "@/lib/course/helpers";
import { labs } from "@/lib/labs";
import { quizzes, getExams } from "@/lib/data/quizzes";
import { examQuestionCounts } from "@/lib/data/exams/pools";
import { getAcitpTopicCoverage, getAcitpOverallCoveragePercent } from "@/lib/data/apple-training/coverage";
import { APPLE_DEPLOYMENT_TOPICS } from "@/lib/data/apple-training/deployment-topics";
import { APPLE_SECURITY_TOPICS } from "@/lib/data/apple-training/security-scenarios";

export type QualityIssue = "weak" | "incomplete" | "generic" | "obsolete";

export type AuditedItem = {
  id: string;
  label: string;
  type: "course" | "lab" | "quiz" | "exam";
  trackSlug: string;
  qualityScore: number;
  issues: QualityIssue[];
  notes: string;
};

export type AppleTrainingAuditReport = {
  generatedAt: string;
  globalQualityScore: number;
  acitpCoveragePercent: number;
  deploymentCoveragePercent: number;
  securityCoveragePercent: number;
  items: AuditedItem[];
  weakItems: AuditedItem[];
  incompleteItems: AuditedItem[];
  genericItems: AuditedItem[];
  obsoleteItems: AuditedItem[];
  recommendations: string[];
};

const APPLE_TRACK_SLUGS = [
  "apple-fundamentals",
  "apple-device-support",
  "apple-it-professional",
  "apple-enterprise-expert",
  "apple-enterprise-architect",
  "intune-mac",
];

function scoreCourse(trackSlug: string, lessonCount: number, declaredLessons: number): AuditedItem {
  const issues: QualityIssue[] = [];
  let score = 50;

  if (lessonCount >= declaredLessons * 0.8) score += 25;
  else if (lessonCount >= 3) {
    score += 10;
    issues.push("incomplete");
  } else {
    issues.push("weak", "incomplete");
  }

  const trackLabs = labs.filter((l) => l.trackSlug === trackSlug).length;
  if (trackLabs >= 3) score += 15;
  else if (trackLabs >= 1) score += 5;
  else issues.push("incomplete");

  const hasExam = getExams().some((e) => e.trackSlug === trackSlug);
  if (hasExam) score += 10;
  else if (trackSlug !== "apple-fundamentals") issues.push("incomplete");

  if (trackSlug === "apple-fundamentals" || trackSlug === "apple-device-support") {
    if (lessonCount < 10) issues.push("weak");
  }

  if (trackSlug === "apple-it-professional" && lessonCount < 15) {
    issues.push("incomplete");
  } else if (trackSlug === "apple-it-professional") {
    score += 10;
  }

  return {
    id: `course-${trackSlug}`,
    label: courses.find((c) => c.trackSlug === trackSlug)?.title ?? trackSlug,
    type: "course",
    trackSlug,
    qualityScore: Math.min(100, score),
    issues: [...new Set(issues)],
    notes: `${lessonCount} leçons actives / ${declaredLessons} déclarées · ${trackLabs} labs`,
  };
}

function scoreLab(labSlug: string, trackSlug: string): AuditedItem {
  const lab = labs.find((l) => l.slug === labSlug);
  const issues: QualityIssue[] = [];
  let score = 40;

  if (!lab) {
    return {
      id: `lab-${labSlug}`,
      label: labSlug,
      type: "lab",
      trackSlug,
      qualityScore: 0,
      issues: ["weak", "incomplete"],
      notes: "Lab manquant",
    };
  }

  if (lab.steps.length >= 5) score += 25;
  else issues.push("incomplete");

  if (lab.description.includes("enterprise") || lab.description.includes("Scénario")) score += 15;
  else issues.push("generic");

  if (lab.objectives.length >= 3) score += 10;
  if (lab.prerequisites.length >= 2) score += 10;

  return {
    id: `lab-${labSlug}`,
    label: lab.title,
    type: "lab",
    trackSlug: lab.trackSlug,
    qualityScore: Math.min(100, score),
    issues: [...new Set(issues)],
    notes: `${lab.steps.length} étapes · ${lab.level}`,
  };
}

function scoreQuiz(quizSlug: string, trackSlug: string): AuditedItem {
  const quiz = quizzes.find((q) => q.slug === quizSlug);
  const issues: QualityIssue[] = [];
  let score = 30;

  if (!quiz) {
    return {
      id: `quiz-${quizSlug}`,
      label: quizSlug,
      type: "quiz",
      trackSlug,
      qualityScore: 0,
      issues: ["incomplete"],
      notes: "Quiz absent",
    };
  }

  const qCount = quiz.questions.length;
  if (qCount >= 20) score += 35;
  else if (qCount >= 10) score += 20;
  else {
    score += 5;
    issues.push("weak");
  }

  const hasEnterprise = quiz.questions.some(
    (q) => q.text.includes("enterprise") || q.text.includes("MDM") || q.text.includes("Intune") || q.text.includes("Jamf")
  );
  if (hasEnterprise || quiz.examMode) score += 20;
  else issues.push("generic");

  if (quiz.description && quiz.description.length > 40) score += 15;

  return {
    id: `quiz-${quizSlug}`,
    label: quiz.title,
    type: "quiz",
    trackSlug: quiz.trackSlug ?? trackSlug,
    qualityScore: Math.min(100, score),
    issues: [...new Set(issues)],
    notes: `${qCount} questions`,
  };
}

function scoreExam(examSlug: string): AuditedItem {
  const exam = getExams().find((e) => e.slug === examSlug);
  const issues: QualityIssue[] = [];
  let score = 40;
  const qTarget = examQuestionCounts[examSlug] ?? exam?.questions.length ?? 0;

  if (!exam) {
    return {
      id: `exam-${examSlug}`,
      label: examSlug,
      type: "exam",
      trackSlug: "apple-it-professional",
      qualityScore: 0,
      issues: ["incomplete"],
      notes: "Examen non enregistré",
    };
  }

  if (qTarget >= 100) score += 30;
  else if (qTarget >= 30) score += 15;
  else issues.push("weak");

  if (exam.examMode) score += 15;
  if (exam.duration && parseInt(exam.duration, 10) >= 60) score += 10;

  const poolRegistered = examSlug in examQuestionCounts;
  if (poolRegistered) score += 15;
  else issues.push("incomplete");

  return {
    id: `exam-${examSlug}`,
    label: exam.title,
    type: "exam",
    trackSlug: exam.trackSlug ?? "apple-it-professional",
    qualityScore: Math.min(100, score),
    issues: [...new Set(issues)],
    notes: `${qTarget} questions · seuil ${exam.passingScore}%`,
  };
}

export function runAppleTrainingAudit(): AppleTrainingAuditReport {
  const items: AuditedItem[] = [];

  for (const trackSlug of APPLE_TRACK_SLUGS) {
    const course = courses.find((c) => c.trackSlug === trackSlug);
    const trackMeta: Record<string, number> = {
      "apple-fundamentals": 18,
      "apple-device-support": 32,
      "apple-it-professional": 40,
    };
    const declared = trackMeta[trackSlug] ?? (course ? getFlatLessons(course).length : 10);
    const lessonCount = course ? getFlatLessons(course).length : 0;
    items.push(scoreCourse(trackSlug, lessonCount, declared));
  }

  const appleLabSlugs = [
    ...new Set([
      ...labs.filter((l) => APPLE_TRACK_SLUGS.includes(l.trackSlug)).map((l) => l.slug),
      ...APPLE_DEPLOYMENT_TOPICS.map((t) => t.labSlug),
      ...APPLE_SECURITY_TOPICS.map((t) => t.labSlug),
    ]),
  ];
  for (const slug of appleLabSlugs) {
    const lab = labs.find((l) => l.slug === slug);
    items.push(scoreLab(slug, lab?.trackSlug ?? "apple-it-professional"));
  }

  const appleQuizSlugs = quizzes
    .filter(
      (q) =>
        (q.trackSlug && APPLE_TRACK_SLUGS.includes(q.trackSlug)) ||
        q.slug.includes("apple") ||
        q.slug.includes("abm") ||
        q.slug.includes("ade")
    )
    .map((q) => q.slug);

  for (const slug of appleQuizSlugs) {
    const quiz = quizzes.find((q) => q.slug === slug);
    items.push(scoreQuiz(slug, quiz?.trackSlug ?? "apple-it-professional"));
  }

  const appleExams = [
    "examen-apple-it-pro",
    "examen-apple-deployment",
    "examen-apple-security",
    "examen-apple-device-support",
    "examen-apple-enterprise-expert",
    "examen-apple-enterprise-architect",
    "quiz-apple-fundamentals",
    "quiz-abm-certification",
    "quiz-ade-certification",
  ];
  for (const slug of appleExams) {
    if (getExams().some((e) => e.slug === slug) || quizzes.some((q) => q.slug === slug)) {
      items.push(scoreExam(slug));
    }
  }

  const acitpTopics = getAcitpTopicCoverage();
  for (const t of acitpTopics.filter((x) => x.status !== "complete")) {
    items.push({
      id: `acitp-topic-${t.id}`,
      label: `ACITP — ${t.title}`,
      type: "course",
      trackSlug: "apple-it-professional",
      qualityScore: t.coveragePercent,
      issues: t.coveragePercent < 45 ? ["weak", "incomplete"] : ["incomplete"],
      notes: `Couverture ${t.coveragePercent}% · leçon ${t.hasLesson ? "✓" : "✗"} · lab ${t.hasLab ? "✓" : "✗"}`,
    });
  }

  const globalQualityScore = Math.round(items.reduce((s, i) => s + i.qualityScore, 0) / Math.max(items.length, 1));

  const filterBy = (issue: QualityIssue) => items.filter((i) => i.issues.includes(issue));

  const deployPct = Math.round(
    APPLE_DEPLOYMENT_TOPICS.reduce((s, t) => s + t.coveragePercent, 0) / APPLE_DEPLOYMENT_TOPICS.length
  );
  const secPct = Math.round(
    APPLE_SECURITY_TOPICS.reduce((s, t) => s + t.coveragePercent, 0) / APPLE_SECURITY_TOPICS.length
  );

  return {
    generatedAt: new Date().toISOString(),
    globalQualityScore,
    acitpCoveragePercent: getAcitpOverallCoveragePercent(),
    deploymentCoveragePercent: deployPct,
    securityCoveragePercent: secPct,
    items,
    weakItems: filterBy("weak"),
    incompleteItems: filterBy("incomplete"),
    genericItems: filterBy("generic"),
    obsoleteItems: filterBy("obsolete"),
    recommendations: [
      "Enrichir apple-fundamentals et apple-device-support avec curriculum dédié (pattern ACITP).",
      "Compléter les sujets ACITP partiels : Dock, Notes, FaceTime avec leçons dédiées.",
      "Maintenir tokens ABM/APNs/VPP sur calendrier renouvellement 30/7/1 jours.",
      "Relier chaque sujet Entra ID au contexte Apple (Intune, Jamf, Platform SSO, MAID).",
    ],
  };
}
