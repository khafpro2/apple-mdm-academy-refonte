import { courses } from "@/lib/data/courses";
import { getLabsByTrack } from "@/lib/labs";
import { getFlatLessons } from "@/lib/course/helpers";
import type { TrackCertificateDef } from "@/lib/types";
import {
  certificationPaths,
  type CertificationPath,
} from "@/lib/data/pro-modules/paths";
import { getProModulesForPath, type ProModule } from "@/lib/data/pro-modules/index";

export const trackCertificates: TrackCertificateDef[] = [
  {
    id: "apple-mdm-fundamentals",
    title: "Apple MDM Fundamentals",
    trackSlug: "apple-fundamentals",
    examQuizSlug: "quiz-apple-fundamentals",
    passingScore: 70,
  },
  {
    id: "abm-specialist",
    title: "Apple Business Manager Specialist",
    trackSlug: "apple-it-professional",
    examQuizSlug: "examen-apple-it-pro",
    passingScore: 80,
  },
  {
    id: "intune-apple-specialist",
    title: "Intune Apple Devices Specialist",
    trackSlug: "intune-mac",
    examQuizSlug: "examen-intune-apple",
    passingScore: 80,
  },
  {
    id: "jamf-pro-fundamentals",
    title: "Jamf Pro Fundamentals",
    trackSlug: "jamf-100",
    examQuizSlug: "examen-jamf-100-blanc",
    passingScore: 75,
  },
  {
    id: "apple-security-compliance",
    title: "Apple Security & Compliance",
    trackSlug: "intune-mac",
    examQuizSlug: "examen-intune-apple",
    passingScore: 80,
  },
  {
    id: "jamf-100-path",
    title: "Parcours Certification Jamf 100",
    trackSlug: "jamf-100",
    examQuizSlug: "examen-jamf-100-blanc",
    passingScore: 75,
  },
  {
    id: "jamf-200-path",
    title: "Parcours Certification Jamf 200",
    trackSlug: "jamf-200",
    examQuizSlug: "examen-jamf-200",
    passingScore: 75,
  },
  {
    id: "apple-enterprise-path",
    title: "Parcours Apple Enterprise",
    trackSlug: "parcours-professionnel",
    examQuizSlug: "examen-apple-it-pro",
    passingScore: 80,
  },
  {
    id: "jamf-300-path",
    title: "Jamf 300 Prep — Certification Ready",
    trackSlug: "jamf-300",
    examQuizSlug: "examen-jamf-300",
    passingScore: 75,
  },
  {
    id: "jamf-400-path",
    title: "Jamf 400 Prep — Architect Ready",
    trackSlug: "jamf-400",
    examQuizSlug: "examen-jamf-400",
    passingScore: 75,
  },
  {
    id: "apple-enterprise-expert-path",
    title: "Apple Enterprise Expert",
    trackSlug: "apple-enterprise-expert",
    examQuizSlug: "examen-apple-enterprise-expert",
    passingScore: 80,
  },
  {
    id: "apple-enterprise-architect-path",
    title: "Apple Enterprise Architect",
    trackSlug: "apple-enterprise-architect",
    examQuizSlug: "examen-apple-enterprise-architect",
    passingScore: 80,
  },
  {
    id: "intune-apple-advanced-path",
    title: "Intune Apple Advanced",
    trackSlug: "intune-apple-advanced",
    examQuizSlug: "examen-intune-apple-advanced",
    passingScore: 80,
  },
  // mdm-comparatif-path retiré de la V1 (parcours masqué) — données course conservées hors catalogue.
];

export function getTrackCertificate(id: string) {
  return trackCertificates.find((c) => c.id === id);
}

export function getCertificatesForTrack(trackSlug: string) {
  return trackCertificates.filter((c) => c.trackSlug === trackSlug);
}

export type CertificationEligibility = {
  cert: TrackCertificateDef;
  eligible: boolean;
  lessonsComplete: boolean;
  labsComplete: boolean;
  examPassed: boolean;
  lessonsPercent: number;
  labsPercent: number;
  examScore: number | null;
};

export function evaluateCertification(
  cert: TrackCertificateDef,
  completedLessonSlugs: Set<string>,
  completedLabSlugs: Set<string>,
  examScores: Map<string, number>
): CertificationEligibility {
  const course = courses.find((c) => c.trackSlug === cert.trackSlug);
  const allLessons = course ? getFlatLessons(course).map((f) => f.lesson.slug) : [];
  const trackLabs = getLabsByTrack(cert.trackSlug).map((l) => l.slug);

  const lessonsDone = allLessons.filter((s) => completedLessonSlugs.has(s)).length;
  const labsDone = trackLabs.filter((s) => completedLabSlugs.has(s)).length;

  const lessonsPercent =
    allLessons.length > 0 ? Math.round((lessonsDone / allLessons.length) * 100) : 100;
  const labsPercent =
    trackLabs.length > 0 ? Math.round((labsDone / trackLabs.length) * 100) : 100;

  const examScore = examScores.get(cert.examQuizSlug) ?? null;
  const examPassed = examScore !== null && examScore >= cert.passingScore;

  const lessonsComplete = lessonsPercent >= 100;
  const labsComplete = labsPercent >= 100;
  const eligible = lessonsComplete && labsComplete && examPassed;

  return {
    cert,
    eligible,
    lessonsComplete,
    labsComplete,
    examPassed,
    lessonsPercent,
    labsPercent,
    examScore,
  };
}

export type ModuleProgress = {
  number: number;
  title: string;
  lessonsPercent: number;
  labDone: boolean;
  quizPassed: boolean;
  complete: boolean;
};

export type PathCertificationEligibility = {
  path: CertificationPath;
  eligible: boolean;
  modulesComplete: boolean;
  labsComplete: boolean;
  examPassed: boolean;
  modulesPercent: number;
  labsPercent: number;
  examScore: number | null;
  moduleDetails: ModuleProgress[];
};

function evaluateProModule(
  module: ProModule,
  completedLessonSlugs: Set<string>,
  completedLabSlugs: Set<string>,
  quizScores: Map<string, number>
): ModuleProgress {
  const lessonsDone = module.lessons.filter((l) => completedLessonSlugs.has(l.slug)).length;
  const lessonsPercent =
    module.lessons.length > 0 ? Math.round((lessonsDone / module.lessons.length) * 100) : 100;
  const labDone = completedLabSlugs.has(module.labSlug);
  const quizScore = quizScores.get(module.quizSlug) ?? 0;
  const quizPassed = quizScore >= 80;
  const complete = lessonsPercent >= 100 && labDone && quizPassed;

  return {
    number: module.number,
    title: module.title,
    lessonsPercent,
    labDone,
    quizPassed,
    complete,
  };
}

export function evaluateCertificationPath(
  path: CertificationPath,
  completedLessonSlugs: Set<string>,
  completedLabSlugs: Set<string>,
  quizScores: Map<string, number>
): PathCertificationEligibility {
  const proModuleNumbers = path.moduleNumbers.filter((n) => n >= 11);
  const modules = getProModulesForPath(proModuleNumbers);
  const moduleDetails = modules.map((m) =>
    evaluateProModule(m, completedLessonSlugs, completedLabSlugs, quizScores)
  );

  const modulesComplete = moduleDetails.every((m) => m.complete);
  const labsComplete = moduleDetails.every((m) => m.labDone);
  const modulesPercent =
    moduleDetails.length > 0
      ? Math.round(
          moduleDetails.reduce((s, m) => s + m.lessonsPercent, 0) / moduleDetails.length
        )
      : 100;
  const labsPercent =
    moduleDetails.length > 0
      ? Math.round(
          (moduleDetails.filter((m) => m.labDone).length / moduleDetails.length) * 100
        )
      : 100;

  const examScore = quizScores.get(path.examQuizSlug) ?? null;
  const examPassed = examScore !== null && examScore >= path.passingScore;
  const eligible = modulesComplete && labsComplete && examPassed;

  return {
    path,
    eligible,
    modulesComplete,
    labsComplete,
    examPassed,
    modulesPercent,
    labsPercent,
    examScore,
    moduleDetails,
  };
}

export function evaluateAllCertificationPaths(
  completedLessonSlugs: Set<string>,
  completedLabSlugs: Set<string>,
  quizScores: Map<string, number>
): PathCertificationEligibility[] {
  return certificationPaths.map((path) =>
    evaluateCertificationPath(path, completedLessonSlugs, completedLabSlugs, quizScores)
  );
}
