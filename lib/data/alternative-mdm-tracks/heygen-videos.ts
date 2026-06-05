import { allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";

export const altMdmVideoScripts = allAltMdmModules.map((mod) => ({
  slug: mod.videoSlug,
  title: mod.title,
  duration: "10 min",
  durationSeconds: 600,
  module: mod.title,
  level: "Avancé" as const,
  heygenAvatar: "Professional IT Instructor",
  language: "fr-FR",
  script: `Bienvenue dans le module « ${mod.title} » du parcours ${mod.trackSlug}.
Objectif : maîtriser ${mod.title} en contexte entreprise Apple avec bonnes pratiques MDM.
Nous couvrons les concepts clés, un scénario réel et les points de validation avant mise en production.
À la fin, passez le quiz de ${mod.quizCount} questions et le lab associé si disponible.
Consultez la ressource téléchargeable ${mod.resourceSlug} pour votre runbook.`,
  relatedCourseSlug: mod.trackSlug,
  relatedLabSlug: mod.labSlug ?? "",
  heygenStyle: "Apple Training Premium + MDM Vendor Catalog",
}));

export const altMdmLessonVideoMap = Object.fromEntries(
  allAltMdmModules.map((m) => [m.slug, m.videoSlug])
);
