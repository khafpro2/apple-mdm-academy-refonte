import { allAdvancedModules } from "@/lib/data/advanced-tracks/module-definitions";
import { buildModuleVideoScript } from "@/lib/data/shared/module-video-script";

/** Scripts HeyGen — un par module expert (40 vidéos) avec objectifs, scénario et liens lab */
export const advancedVideoScripts = allAdvancedModules.map((mod) => ({
  slug: mod.videoSlug,
  title: mod.title,
  duration: "12 min",
  durationSeconds: 720,
  module: mod.title,
  level: "Avancé" as const,
  heygenAvatar: "Professional IT Instructor",
  language: "fr-FR",
  script: buildModuleVideoScript({
    title: mod.title,
    trackSlug: mod.trackSlug,
    quizCount: mod.quizCount,
    labSlug: mod.labSlug,
    resourceSlug: mod.resourceSlug,
  }),
  relatedCourseSlug: mod.trackSlug,
  relatedLabSlug: mod.labSlug ?? "",
  heygenStyle: mod.trackSlug.startsWith("jamf") ? "Apple Training Premium + Jamf Training Catalog" : "Apple Training Premium",
  jamfTrack: mod.trackSlug.startsWith("jamf") ? ("jamf-200" as const) : undefined,
}));

export const advancedLessonVideoMap = Object.fromEntries(
  allAdvancedModules.map((m) => [m.slug, m.videoSlug])
);
