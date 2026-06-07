import type { LessonContent } from "@/lib/types";
import { getScreenshotsForLesson } from "@/lib/data/lesson-screenshots";
import { JAMF_FUNDAMENTALS_MODULES } from "@/lib/data/jamf/jamf-fundamentals-premium";
import {
  getJamfPremiumLessonSections,
  JAMF_FUNDAMENTALS_PREMIUM_CONTENT,
} from "@/lib/data/jamf/jamf-fundamentals-premium-content";

export function isJamfFundamentalsLesson(lessonSlug: string): boolean {
  return JAMF_FUNDAMENTALS_MODULES.some((m) => m.lessonSlug === lessonSlug);
}

export function getJamfFundamentalsLessonContent(
  courseSlug: string,
  lessonSlug: string
): LessonContent | null {
  const mod = JAMF_FUNDAMENTALS_MODULES.find((m) => m.lessonSlug === lessonSlug);
  if (!mod) return null;

  const content = JAMF_FUNDAMENTALS_PREMIUM_CONTENT[mod.id];
  const sections = getJamfPremiumLessonSections(mod.id);

  return {
    objectives: content.introduction,
    prerequisites: [
      "Accès console Jamf Pro (Cloud ou on-prem)",
      mod.order > 1 ? "Modules précédents du parcours Jamf Fundamentals Premium" : "Notions MDM Apple de base",
    ],
    theory: sections.map((s) => ({ title: s.title, body: s.items })),
    steps: content.demonstration.map((step, i) => ({
      title: `Étape ${i + 1}`,
      description: step,
    })),
    screenshots: getScreenshotsForLesson(lessonSlug),
    bestPractices: content.bestPractices,
    troubleshooting: content.commonErrors.map((problem) => ({
      problem,
      solution:
        "Appliquer la checklist L1 : scope, Policy Logs, Management History, check-in (`sudo jamf policy`), certificats APNs/ABM. Documenter serial + policy ID avant escalade L2.",
    })),
    summary: content.summary,
    finalQuizSlug: mod.quizSlug,
  };
}
