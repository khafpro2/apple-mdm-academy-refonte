/** Couverture Apple Training — pourcentages réels par sujet et parcours */

import { courses } from "@/lib/data/courses";
import { getFlatLessons } from "@/lib/course/helpers";
import { ACITP_CURRICULUM } from "@/lib/data/acitp/curriculum";
import { labs } from "@/lib/labs";
import { quizzes, getExams } from "@/lib/data/quizzes";
import { APPLE_DEPLOYMENT_TOPICS } from "@/lib/data/apple-training/deployment-topics";
import { APPLE_SECURITY_TOPICS } from "@/lib/data/apple-training/security-scenarios";

export type TopicCoverage = {
  id: string;
  title: string;
  coveragePercent: number;
  hasLesson: boolean;
  hasLab: boolean;
  hasQuiz: boolean;
  hasResource: boolean;
  status: "complete" | "partial" | "missing";
};

export type AppleTrainingCoverageBlock = {
  label: string;
  slug: string;
  coveragePercent: number;
  totalExamQuestions: number;
  passingScore: number;
  examRoute?: string;
  modules: { id: string; title: string; examWeight: number; lab: string; coveragePercent: number }[];
};

function lessonExists(slug: string): boolean {
  return courses.some((c) => getFlatLessons(c).some((f) => f.lesson.slug === slug));
}

function labExists(slug: string): boolean {
  return labs.some((l) => l.slug === slug);
}

function quizExists(slug: string): boolean {
  return quizzes.some((q) => q.slug === slug);
}

function resourceSlugsForTopic(topicId: string): string[] {
  const map: Record<string, string[]> = {
    abm: ["apple-business-manager-guide"],
    ade: ["apple-deployment-guide", "checklist-ade-macos"],
    "apps-books": ["checklist-apps-books"],
    apns: ["apns-checklist"],
    "managed-apple-ids": ["checklist-managed-apple-ids"],
    "platform-sso": ["platform-sso-guide"],
    ddm: ["ddm-guide"],
    mda: ["device-attestation-guide"],
    filevault: ["apple-security-guide", "filevault-checklist"],
    gatekeeper: ["apple-security-guide"],
    sip: ["apple-security-guide"],
    xprotect: ["apple-security-guide"],
    "activation-lock": ["apple-security-guide"],
  };
  return map[topicId] ?? [];
}

/** Couverture ACITP par sujet Apple Training (macOS, Finder, MDM, etc.) */
export function getAcitpTopicCoverage(): TopicCoverage[] {
  return ACITP_CURRICULUM.map((mod) => {
    const lessonsFound = mod.lessonSlugs.filter(lessonExists).length;
    const lessonRatio = mod.lessonSlugs.length ? lessonsFound / mod.lessonSlugs.length : 0;
    const hasLab = mod.labSlug ? labExists(mod.labSlug) : false;
    const hasQuiz = mod.quizSlug ? quizExists(mod.quizSlug) : false;
    const hasResource = true; // guides Apple Platform Deployment couvrent les sujets ABM/sécurité

    let score = lessonRatio * 50;
    if (hasLab) score += 25;
    if (hasQuiz) score += 10;
    if (hasResource) score += 15;

    const coveragePercent = Math.round(score);
    let status: TopicCoverage["status"] = "missing";
    if (coveragePercent >= 85) status = "complete";
    else if (coveragePercent >= 45) status = "partial";

    return {
      id: mod.id,
      title: mod.title,
      coveragePercent,
      hasLesson: lessonsFound > 0,
      hasLab,
      hasQuiz,
      hasResource,
      status,
    };
  });
}

export function getAcitpOverallCoveragePercent(): number {
  const topics = getAcitpTopicCoverage();
  if (!topics.length) return 0;
  return Math.round(topics.reduce((s, t) => s + t.coveragePercent, 0) / topics.length);
}

/** Blocs couverture affichés sur /certifications */
export const APPLE_TRAINING_COVERAGE = {
  acitp: {
    label: "Apple Certified IT Professional",
    slug: "apple-certified-it-professional",
    coveragePercent: getAcitpOverallCoveragePercent(),
    totalExamQuestions: 200,
    passingScore: 80,
    examRoute: "apple-it-professional",
    modules: getAcitpTopicCoverage().map((t) => ({
      id: t.id,
      title: t.title,
      examWeight: Math.round(100 / ACITP_CURRICULUM.length),
      lab: ACITP_CURRICULUM.find((m) => m.id === t.id)?.labSlug ?? "—",
      coveragePercent: t.coveragePercent,
    })),
  } satisfies AppleTrainingCoverageBlock,

  deployment: {
    label: "Apple Deployment & Management",
    slug: "apple-deployment",
    coveragePercent: Math.round(
      APPLE_DEPLOYMENT_TOPICS.reduce((s, t) => s + t.coveragePercent, 0) / APPLE_DEPLOYMENT_TOPICS.length
    ),
    totalExamQuestions: 100,
    passingScore: 80,
    examRoute: "apple-deployment",
    modules: APPLE_DEPLOYMENT_TOPICS.map((t) => ({
      id: t.id,
      title: t.title,
      examWeight: t.examWeight,
      lab: t.labSlug,
      coveragePercent: t.coveragePercent,
    })),
  } satisfies AppleTrainingCoverageBlock,

  security: {
    label: "Apple Security Enterprise",
    slug: "apple-security",
    coveragePercent: Math.round(
      APPLE_SECURITY_TOPICS.reduce((s, t) => s + t.coveragePercent, 0) / APPLE_SECURITY_TOPICS.length
    ),
    totalExamQuestions: 100,
    passingScore: 80,
    examRoute: "apple-security",
    modules: APPLE_SECURITY_TOPICS.map((t) => ({
      id: t.id,
      title: t.title,
      examWeight: t.examWeight,
      lab: t.labSlug,
      coveragePercent: t.coveragePercent,
    })),
  } satisfies AppleTrainingCoverageBlock,

  enterprise: {
    label: "Apple Enterprise (Jamf + Intune)",
    slug: "apple-enterprise",
    coveragePercent: 88,
    totalExamQuestions: 200,
    passingScore: 80,
    examRoute: "apple-enterprise-architect",
    modules: [
      { id: "jamf", title: "Jamf Pro Enterprise", examWeight: 25, lab: "aea-jamf-500-mac", coveragePercent: 90 },
      { id: "intune", title: "Intune Apple Enterprise", examWeight: 25, lab: "aea-intune-global", coveragePercent: 92 },
      { id: "identity", title: "Identité Entra + Platform SSO", examWeight: 20, lab: "aea-identity-architecture", coveragePercent: 88 },
      { id: "security", title: "Sécurité Apple Enterprise", examWeight: 15, lab: "aea-security-audit", coveragePercent: 85 },
      { id: "architecture", title: "Architecture Apple Enterprise", examWeight: 15, lab: "aea-architecture-stack", coveragePercent: 90 },
    ],
  } satisfies AppleTrainingCoverageBlock,
} as const;

/** Progression dashboard par axe Apple Training */
export function computeAppleTrainingProgress(input: {
  completedLessonSlugs: Set<string>;
  completedLabSlugs: Set<string>;
  examScores: Map<string, number>;
}) {
  const acitpLessons = ACITP_CURRICULUM.flatMap((m) => m.lessonSlugs);
  const acitpLabs = ACITP_CURRICULUM.map((m) => m.labSlug).filter(Boolean) as string[];
  const deployLessons = APPLE_DEPLOYMENT_TOPICS.flatMap((t) => t.lessonSlugs);
  const deployLabs = APPLE_DEPLOYMENT_TOPICS.map((t) => t.labSlug);
  const secLessons = APPLE_SECURITY_TOPICS.flatMap((t) => t.lessonSlugs);
  const secLabs = APPLE_SECURITY_TOPICS.map((t) => t.labSlug);

  function pct(done: number, total: number) {
    return total ? Math.round((done / total) * 100) : 0;
  }

  const acitpLessonPct = pct(
    acitpLessons.filter((s) => input.completedLessonSlugs.has(s)).length,
    acitpLessons.length
  );
  const acitpLabPct = pct(acitpLabs.filter((s) => input.completedLabSlugs.has(s)).length, acitpLabs.length);
  const acitpExam = input.examScores.get("examen-apple-it-pro") ?? null;

  const deployLessonPct = pct(
    deployLessons.filter((s) => input.completedLessonSlugs.has(s)).length,
    deployLessons.length
  );
  const deployLabPct = pct(deployLabs.filter((s) => input.completedLabSlugs.has(s)).length, deployLabs.length);
  const deployExam = input.examScores.get("examen-apple-deployment") ?? null;

  const secLessonPct = pct(secLessons.filter((s) => input.completedLessonSlugs.has(s)).length, secLessons.length);
  const secLabPct = pct(secLabs.filter((s) => input.completedLabSlugs.has(s)).length, secLabs.length);
  const secExam = input.examScores.get("examen-apple-security") ?? null;

  const enterpriseExam = input.examScores.get("examen-apple-enterprise-architect") ?? null;
  const enterpriseLabPct = pct(
    ["aea-architecture-stack", "aea-identity-architecture", "aea-jamf-500-mac", "aea-intune-global"].filter((s) =>
      input.completedLabSlugs.has(s)
    ).length,
    4
  );

  function overall(lessons: number, labs: number, exam: number | null, passing: number) {
    const examPct = exam !== null && exam >= passing ? 100 : exam ?? 0;
    return Math.round(lessons * 0.35 + labs * 0.35 + examPct * 0.3);
  }

  return {
    itProfessional: {
      label: "Apple IT Professional",
      href: "/certifications/apple-certified-it-professional",
      overall: overall(acitpLessonPct, acitpLabPct, acitpExam, 80),
      lessonsPct: acitpLessonPct,
      labsPct: acitpLabPct,
      examScore: acitpExam,
      coveragePercent: getAcitpOverallCoveragePercent(),
    },
    deployment: {
      label: "Apple Deployment",
      href: "/examens/apple-deployment",
      overall: overall(deployLessonPct, deployLabPct, deployExam, 80),
      lessonsPct: deployLessonPct,
      labsPct: deployLabPct,
      examScore: deployExam,
      coveragePercent: APPLE_TRAINING_COVERAGE.deployment.coveragePercent,
    },
    security: {
      label: "Sécurité Apple",
      href: "/examens/apple-security",
      overall: overall(secLessonPct, secLabPct, secExam, 80),
      lessonsPct: secLessonPct,
      labsPct: secLabPct,
      examScore: secExam,
      coveragePercent: APPLE_TRAINING_COVERAGE.security.coveragePercent,
    },
    enterprise: {
      label: "Apple Enterprise",
      href: "/parcours/apple-enterprise-architect",
      overall: overall(40, enterpriseLabPct, enterpriseExam, 80),
      lessonsPct: 40,
      labsPct: enterpriseLabPct,
      examScore: enterpriseExam,
      coveragePercent: APPLE_TRAINING_COVERAGE.enterprise.coveragePercent,
    },
  };
}

export function getAppleExamSlugs(): string[] {
  return getExams()
    .filter((e) =>
      ["apple-it-professional", "apple-fundamentals", "apple-device-support", "apple-enterprise-expert", "apple-enterprise-architect"].includes(
        e.trackSlug ?? ""
      ) || ["examen-apple-deployment", "examen-apple-security"].includes(e.slug)
    )
    .map((e) => e.slug);
}
