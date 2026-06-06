import { courses } from "@/lib/data/courses";
import { getFlatLessons } from "@/lib/course/helpers";
import {
  ACITP_CURRICULUM,
  ACITP_REQUIRED_LAB_SLUGS,
} from "@/lib/data/acitp/curriculum";
import { ACITP_PASSING_SCORE } from "@/lib/data/acitp/domains";
import { getCustomLesson } from "@/lib/data/lessons/custom-lessons";
import { APPLE_PLATFORM_DEPLOYMENT_TOPICS } from "@/lib/data/apple-platform-deployment/topic-overrides";

const allLessonSlugs = new Set(
  courses.flatMap((c) => getFlatLessons(c).map((f) => f.lesson.slug))
);

export type AcitpModuleReadiness = {
  id: string;
  title: string;
  lessonsFound: number;
  lessonsRequired: number;
  labReady: boolean;
  percent: number;
};

export type AcitpReadiness = {
  overallPercent: number;
  lessonsPercent: number;
  labsPercent: number;
  examPercent: number;
  examScore: number | null;
  examPassed: boolean;
  labsComplete: boolean;
  eligibleForCertificate: boolean;
  modules: AcitpModuleReadiness[];
};

export function evaluateAcitpReadiness(
  completedLessonSlugs: Set<string>,
  completedLabSlugs: Set<string>,
  examScore: number | null
): AcitpReadiness {
  const modules: AcitpModuleReadiness[] = ACITP_CURRICULUM.map((mod) => {
    const found = mod.lessonSlugs.filter((s) => allLessonSlugs.has(s)).length;
    const done = mod.lessonSlugs.filter((s) => completedLessonSlugs.has(s)).length;
    const labReady = mod.labSlug ? completedLabSlugs.has(mod.labSlug) : true;
    const lessonPct = mod.lessonSlugs.length
      ? Math.round((done / mod.lessonSlugs.length) * 100)
      : 100;
    const percent = Math.round(labReady ? lessonPct : lessonPct * 0.85);
    return {
      id: mod.id,
      title: mod.title,
      lessonsFound: found,
      lessonsRequired: mod.lessonSlugs.length,
      labReady,
      percent,
    };
  });

  const totalLessons = ACITP_CURRICULUM.reduce((s, m) => s + m.lessonSlugs.length, 0);
  const doneLessons = ACITP_CURRICULUM.reduce(
    (s, m) => s + m.lessonSlugs.filter((l) => completedLessonSlugs.has(l)).length,
    0
  );
  const lessonsPercent = totalLessons ? Math.round((doneLessons / totalLessons) * 100) : 0;

  const labsDone = ACITP_REQUIRED_LAB_SLUGS.filter((s) => completedLabSlugs.has(s)).length;
  const labsPercent = Math.round((labsDone / ACITP_REQUIRED_LAB_SLUGS.length) * 100);
  const labsComplete = labsPercent >= 100;

  const examPassed = examScore !== null && examScore >= ACITP_PASSING_SCORE;
  const examPercent = examScore ?? 0;

  const overallPercent = Math.round(
    lessonsPercent * 0.35 + labsPercent * 0.35 + (examPassed ? 100 : examPercent) * 0.3
  );

  const eligibleForCertificate = examPassed && labsComplete && lessonsPercent >= 60;

  return {
    overallPercent,
    lessonsPercent,
    labsPercent,
    examPercent: examPassed ? 100 : examPercent,
    examScore,
    examPassed,
    labsComplete,
    eligibleForCertificate,
    modules,
  };
}

export function getAcitpCurriculumCoverage(): {
  module: string;
  covered: boolean;
  lessonCount: number;
}[] {
  return ACITP_CURRICULUM.map((mod) => {
    const hasLessons = mod.lessonSlugs.some((s) => allLessonSlugs.has(s));
    const enriched = mod.lessonSlugs.some(
      (s) =>
        getCustomLesson("intune-mac", s) ||
        getCustomLesson("apple-it-professional", s) ||
        APPLE_PLATFORM_DEPLOYMENT_TOPICS[s]
    );
    return {
      module: mod.title,
      covered: hasLessons || enriched,
      lessonCount: mod.lessonSlugs.filter((s) => allLessonSlugs.has(s)).length,
    };
  });
}
