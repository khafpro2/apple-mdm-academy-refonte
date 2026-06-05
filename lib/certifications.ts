import { courses } from "@/lib/data/courses";
import { getLabsByTrack } from "@/lib/labs";
import { getFlatLessons } from "@/lib/course/helpers";
import type { TrackCertificateDef } from "@/lib/types";

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
