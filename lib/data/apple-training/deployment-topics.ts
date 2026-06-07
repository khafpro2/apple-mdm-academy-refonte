/** Sujets Apple Deployment & Management — cours, lab, quiz, examen, ressource */

import { courses } from "@/lib/data/courses";
import { getFlatLessons } from "@/lib/course/helpers";
import { labs } from "@/lib/labs";
import { quizzes } from "@/lib/data/quizzes";

export type DeploymentTopic = {
  id: string;
  title: string;
  lessonSlugs: string[];
  labSlug: string;
  quizSlug?: string;
  resourceSlug: string;
  examWeight: number;
  coveragePercent: number;
};

function lessonExists(slug: string): boolean {
  return courses.some((c) => getFlatLessons(c).some((f) => f.lesson.slug === slug));
}

function scoreTopic(lessonSlugs: string[], labSlug: string, quizSlug?: string, resource = true): number {
  const lr = lessonSlugs.length ? lessonSlugs.filter(lessonExists).length / lessonSlugs.length : 0;
  const hasLab = labs.some((l) => l.slug === labSlug);
  const hasQuiz = quizSlug ? quizzes.some((q) => q.slug === quizSlug) : false;
  let s = lr * 50;
  if (hasLab) s += 30;
  if (hasQuiz) s += 10;
  if (resource) s += 10;
  return Math.round(s);
}

export const APPLE_DEPLOYMENT_TOPICS: DeploymentTopic[] = [
  {
    id: "abm",
    title: "Apple Business Manager",
    lessonSlugs: ["abm-creation-roles", "abm-intune"],
    labSlug: "apple-training-lab-abm",
    quizSlug: "quiz-abm-certification",
    resourceSlug: "apple-business-manager-guide",
    examWeight: 15,
    coveragePercent: 0,
  },
  {
    id: "ade",
    title: "Automated Device Enrollment",
    lessonSlugs: ["dep-enrollment", "ade-mac", "ade-iphone"],
    labSlug: "apple-training-lab-ade",
    quizSlug: "quiz-ade-certification",
    resourceSlug: "apple-deployment-guide",
    examWeight: 15,
    coveragePercent: 0,
  },
  {
    id: "apps-books",
    title: "Apps & Books",
    lessonSlugs: ["apps-books"],
    labSlug: "apple-training-lab-apps-books",
    resourceSlug: "checklist-apps-books",
    examWeight: 10,
    coveragePercent: 0,
  },
  {
    id: "apns",
    title: "APNs",
    lessonSlugs: ["apns-certificats", "apns-certificates"],
    labSlug: "apple-training-lab-apns",
    resourceSlug: "apns-checklist",
    examWeight: 15,
    coveragePercent: 0,
  },
  {
    id: "managed-apple-ids",
    title: "Managed Apple IDs",
    lessonSlugs: ["managed-apple-ids", "comptes-locaux-managed"],
    labSlug: "apple-training-lab-managed-apple-ids",
    resourceSlug: "checklist-managed-apple-ids",
    examWeight: 15,
    coveragePercent: 0,
  },
  {
    id: "platform-sso",
    title: "Platform SSO",
    lessonSlugs: ["platform-sso"],
    labSlug: "apple-training-lab-platform-sso",
    resourceSlug: "platform-sso-guide",
    examWeight: 15,
    coveragePercent: 0,
  },
  {
    id: "ddm",
    title: "Declarative Device Management",
    lessonSlugs: ["declarative-device-management"],
    labSlug: "apple-training-lab-ddm",
    resourceSlug: "ddm-guide",
    examWeight: 10,
    coveragePercent: 0,
  },
  {
    id: "mda",
    title: "Managed Device Attestation",
    lessonSlugs: ["managed-device-attestation"],
    labSlug: "apple-training-lab-ddm",
    resourceSlug: "device-attestation-guide",
    examWeight: 5,
    coveragePercent: 0,
  },
].map((t) => ({ ...t, coveragePercent: scoreTopic(t.lessonSlugs, t.labSlug, t.quizSlug) }));
