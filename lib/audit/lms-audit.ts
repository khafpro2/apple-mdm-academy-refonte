import { LMS_PLATFORM_MODULES } from "@/lib/data/apple-platform-deployment/module-registry";
import { courses } from "@/lib/data/courses";
import { labs } from "@/lib/labs";
import { quizzes, getExams } from "@/lib/data/quizzes";
import { academyResources } from "@/src/lib/resources";
import { getLessonContent } from "@/lib/data/lesson-content";
import { getFlatLessons } from "@/lib/course/helpers";
import { getCustomLesson } from "@/lib/data/lessons/custom-lessons";
import { APPLE_PLATFORM_DEPLOYMENT_TOPICS } from "@/lib/data/apple-platform-deployment/topic-overrides";

export type LmsModuleStatus = "complet" | "partiel" | "incomplet";

export type LmsModuleAuditRow = {
  id: string;
  title: string;
  status: LmsModuleStatus;
  score: number;
  lessons: { found: number; required: number; slugs: string[] };
  labs: { found: number; required: number; slugs: string[] };
  quizzes: { found: number; required: number; slugs: string[] };
  exams: { found: number; required: number; slugs: string[] };
  resources: { found: number; required: number; slugs: string[] };
  gaps: string[];
};

export type LmsAuditReport = {
  generatedAt: string;
  globalScore: number;
  modulesComplete: number;
  modulesPartial: number;
  modulesIncomplete: number;
  totals: {
    quizzes: number;
    exams: number;
    labs: number;
    resources: number;
    platformTopicsEnriched: number;
  };
  modules: LmsModuleAuditRow[];
  blockers: string[];
};

const allLessonSlugs = new Set(
  courses.flatMap((c) => getFlatLessons(c).map((f) => f.lesson.slug))
);
const labSlugs = new Set(labs.map((l) => l.slug));
const quizSlugs = new Set(quizzes.map((q) => q.slug));
const examSlugs = new Set(getExams().map((e) => e.slug));
const resourceSlugs = new Set(academyResources.map((r) => r.slug));

function lessonQualityScore(slug: string, courseSlug: string): number {
  if (getCustomLesson(courseSlug, slug)) return 95;
  if (APPLE_PLATFORM_DEPLOYMENT_TOPICS[slug]) return 92;
  const flat = courses
    .flatMap((c) => getFlatLessons(c).map((f) => ({ ...f, course: c })))
    .find((x) => x.lesson.slug === slug);
  if (!flat) return 0;
  const content = getLessonContent(flat.course, flat.course.modules[flat.moduleIndex]!, flat.lesson, flat.globalIndex, 999);
  const chars = content.theory.reduce((n, t) => n + t.body.join(" ").length, 0);
  if (chars >= 1200) return 88;
  if (chars >= 600) return 72;
  return 50;
}

function auditModule(spec: (typeof LMS_PLATFORM_MODULES)[0]): LmsModuleAuditRow {
  const lessonFound = spec.lessonSlugs.filter((s) => allLessonSlugs.has(s));
  const labFound = spec.labSlugs.filter((s) => labSlugs.has(s));
  const quizFound = spec.quizSlugs.filter((s) => quizSlugs.has(s));
  const examFound = spec.examSlugs.filter((s) => examSlugs.has(s));
  const resourceFound = spec.resourceSlugs.filter((s) => resourceSlugs.has(s));

  const gaps: string[] = [];
  const missingLessons = spec.lessonSlugs.filter((s) => !allLessonSlugs.has(s));
  const missingLabs = spec.labSlugs.filter((s) => !labSlugs.has(s));
  const missingQuizzes = spec.quizSlugs.filter((s) => !quizSlugs.has(s));
  const missingExams = spec.examSlugs.filter((s) => !examSlugs.has(s));
  const missingResources = spec.resourceSlugs.filter((s) => !resourceSlugs.has(s));

  if (missingLessons.length) gaps.push(`Leçons manquantes : ${missingLessons.join(", ")}`);
  if (missingLabs.length) gaps.push(`Labs manquants : ${missingLabs.join(", ")}`);
  if (missingQuizzes.length) gaps.push(`Quiz manquants : ${missingQuizzes.join(", ")}`);
  if (missingExams.length && spec.examSlugs.length) gaps.push(`Examens manquants : ${missingExams.join(", ")}`);
  if (missingResources.length) gaps.push(`Ressources manquantes : ${missingResources.join(", ")}`);

  const lessonScores = lessonFound.map((s) => {
    const flat = courses
      .flatMap((c) => getFlatLessons(c).map((f) => ({ ...f, course: c })))
      .find((x) => x.lesson.slug === s);
    return flat ? lessonQualityScore(s, flat.course.slug) : 70;
  });
  const avgLesson = lessonScores.length ? lessonScores.reduce((a, b) => a + b, 0) / lessonScores.length : 0;

  const labRatio = spec.labSlugs.length ? labFound.length / spec.labSlugs.length : 1;
  const quizRatio = spec.quizSlugs.length ? quizFound.length / spec.quizSlugs.length : 1;
  const examRatio = spec.examSlugs.length ? examFound.length / spec.examSlugs.length : 1;
  const resourceRatio = spec.resourceSlugs.length ? resourceFound.length / spec.resourceSlugs.length : 1;
  const lessonRatio = spec.lessonSlugs.length ? lessonFound.length / spec.lessonSlugs.length : 1;

  const score = Math.round(
    avgLesson * 0.4 +
      lessonRatio * 100 * 0.15 +
      labRatio * 100 * 0.15 +
      quizRatio * 100 * 0.15 +
      examRatio * 100 * 0.075 +
      resourceRatio * 100 * 0.075
  );

  let status: LmsModuleStatus = "complet";
  if (score < 70 || missingLessons.length > 0 || missingLabs.length > 0) status = "incomplet";
  else if (score < 90 || gaps.length > 0) status = "partiel";

  return {
    id: spec.id,
    title: spec.title,
    status,
    score,
    lessons: { found: lessonFound.length, required: spec.lessonSlugs.length, slugs: lessonFound },
    labs: { found: labFound.length, required: spec.labSlugs.length, slugs: labFound },
    quizzes: { found: quizFound.length, required: spec.quizSlugs.length, slugs: quizFound },
    exams: { found: examFound.length, required: spec.examSlugs.length, slugs: examFound },
    resources: { found: resourceFound.length, required: spec.resourceSlugs.length, slugs: resourceFound },
    gaps,
  };
}

export function runLmsAudit(): LmsAuditReport {
  const modules = LMS_PLATFORM_MODULES.map(auditModule);
  const weighted = modules.map((m, i) => ({
    score: m.score,
    weight: LMS_PLATFORM_MODULES[i]!.weight,
  }));
  const totalWeight = weighted.reduce((s, w) => s + w.weight, 0);
  const globalScore = Math.round(
    weighted.reduce((s, w) => s + w.score * w.weight, 0) / totalWeight
  );

  const blockers = modules
    .filter((m) => m.status === "incomplet")
    .flatMap((m) => m.gaps.slice(0, 2));

  return {
    generatedAt: new Date().toISOString(),
    globalScore,
    modulesComplete: modules.filter((m) => m.status === "complet").length,
    modulesPartial: modules.filter((m) => m.status === "partiel").length,
    modulesIncomplete: modules.filter((m) => m.status === "incomplet").length,
    totals: {
      quizzes: quizzes.filter((q) => q.type === "quiz").length,
      exams: getExams().length,
      labs: labs.length,
      resources: academyResources.length,
      platformTopicsEnriched: Object.keys(APPLE_PLATFORM_DEPLOYMENT_TOPICS).length,
    },
    modules,
    blockers,
  };
}
