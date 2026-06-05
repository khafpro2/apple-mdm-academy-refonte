import { allAdvancedModules } from "@/lib/data/advanced-tracks/module-definitions";

/** Scripts HeyGen prêts — un par module expert (40 vidéos) */
export const advancedVideoScripts = allAdvancedModules.map((mod) => ({
  slug: mod.videoSlug,
  title: mod.title,
  duration: "12 min",
  durationSeconds: 720,
  module: mod.title,
  level: "Avancé" as const,
  heygenAvatar: "Professional IT Instructor",
  language: "fr-FR",
  script: `Bienvenue dans le module « ${mod.title} » du parcours ${mod.trackSlug}.
Objectif : maîtriser ${mod.title} en contexte entreprise avec bonnes pratiques Apple, Jamf ou Intune.
Nous couvrons les concepts clés, un scénario réel et les points de validation avant mise en production.
À la fin, passez le quiz de ${mod.quizCount} questions et le lab associé si disponible.
Consultez la ressource téléchargeable ${mod.resourceSlug} pour votre runbook.`,
  relatedCourseSlug: mod.trackSlug,
  relatedLabSlug: mod.labSlug ?? "",
  heygenStyle: mod.trackSlug.startsWith("jamf") ? "Apple Training Premium + Jamf Training Catalog" : "Apple Training Premium",
  jamfTrack: mod.trackSlug.startsWith("jamf") ? ("jamf-200" as const) : undefined,
}));

export const advancedLessonVideoMap = Object.fromEntries(
  allAdvancedModules.map((m) => [m.slug, m.videoSlug])
);
