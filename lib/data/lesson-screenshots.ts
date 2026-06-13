import type { Lesson, LessonScreenshot } from "@/lib/types";
import {
  getScreenshotsByCategory,
  getScreenshotsByIds,
  toLessonScreenshot,
  SCREENSHOT_LIBRARY_BY_ID,
} from "@/lib/data/screenshot-library";
import {
  LESSON_SCREENSHOT_IDS,
  QUIZ_SCREENSHOT_IDS,
  TRACK_DEFAULT_SCREENSHOT_IDS,
} from "@/lib/data/lesson-screenshot-mapping";

function resolveTrackKey(courseSlug: string): string | undefined {
  if (TRACK_DEFAULT_SCREENSHOT_IDS[courseSlug]) return courseSlug;
  if (courseSlug.startsWith("jamf-400")) return "jamf-400";
  if (courseSlug.startsWith("jamf-300")) return "jamf-300";
  if (courseSlug.startsWith("jamf-200")) return "jamf-200";
  if (courseSlug.startsWith("jamf-170")) return "jamf-170";
  if (courseSlug.startsWith("jamf")) return "jamf-100";
  if (courseSlug === "apple-enterprise-expert") return "apple-enterprise-expert";
  if (courseSlug === "azure-for-apple-admins") return "intune-apple-advanced";
  if (courseSlug === "intune-apple-advanced") return "intune-apple-advanced";
  if (courseSlug.startsWith("kandji")) return "kandji-fundamentals";
  if (courseSlug.startsWith("mosyle")) return "mosyle-fundamentals";
  if (courseSlug.startsWith("addigy")) return "addigy-fundamentals";
  if (courseSlug.startsWith("workspace-one")) return "workspace-one-apple";
  if (courseSlug.startsWith("mdm-comparatif")) return "mdm-comparatif-apple";
  if (courseSlug === "parcours-professionnel") return "parcours-professionnel";
  return undefined;
}

function generateGenericScreenshots(
  courseSlug: string,
  lesson: Lesson,
  domain: string
): LessonScreenshot[] {
  const trackKey = resolveTrackKey(courseSlug);
  if (trackKey) {
    const defaults = TRACK_DEFAULT_SCREENSHOT_IDS[trackKey];
    if (defaults) return getScreenshotsByIds(defaults);
  }

  const base = `/images/courses/${courseSlug}/${lesson.slug}`;
  return [
    {
      id: `${lesson.slug}-1`,
      title: `${domain} — Vue principale`,
      description: `Console d'administration ${domain} pour « ${lesson.title} ».`,
      src: `${base}/01-console-principale.webp`,
      caption: `Référence ${domain} — console administration (1920×1080).`,
    },
    {
      id: `${lesson.slug}-2`,
      title: `${domain} — Configuration`,
      description: `Écran de configuration associé à « ${lesson.title} ».`,
      src: `${base}/02-configuration.webp`,
      caption: "Documenter chaque modification dans un change log interne.",
    },
    {
      id: `${lesson.slug}-3`,
      title: `${domain} — Conformité`,
      description: "Statut de conformité ou rapport de déploiement.",
      src: `${base}/03-conformite.webp`,
      caption: "Valider sur un appareil pilote avant déploiement global.",
    },
  ];
}

export function getScreenshotsForLesson(
  lessonSlug: string,
  options?: { courseSlug?: string; lesson?: Lesson; domain?: string }
): LessonScreenshot[] {
  const ids = LESSON_SCREENSHOT_IDS[lessonSlug];
  if (ids) return getScreenshotsByIds(ids);

  if (options?.courseSlug && options.lesson && options.domain) {
    return generateGenericScreenshots(options.courseSlug, options.lesson, options.domain);
  }

  return [];
}

export function getScreenshotsForQuiz(quizSlug: string): LessonScreenshot[] {
  const ids = QUIZ_SCREENSHOT_IDS[quizSlug];
  if (ids) return getScreenshotsByIds(ids);
  return getScreenshotsByIds(["87", "88"]);
}

export function getAllLibraryScreenshots(): LessonScreenshot[] {
  return Object.values(SCREENSHOT_LIBRARY_BY_ID).map(toLessonScreenshot);
}

export { getScreenshotsByCategory, getScreenshotsByIds };
