import { allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";
import { buildModuleVideoScript } from "@/lib/data/shared/module-video-script";

function vendorForTrack(trackSlug: string): string {
  if (trackSlug === "kandji-fundamentals") return "Kandji";
  if (trackSlug === "mosyle-fundamentals") return "Mosyle";
  if (trackSlug === "addigy-fundamentals") return "Addigy";
  if (trackSlug === "workspace-one-apple") return "Workspace ONE UEM";
  return "MDM Apple Enterprise";
}

export const altMdmVideoScripts = allAltMdmModules.map((mod) => ({
  slug: mod.videoSlug,
  title: mod.title,
  duration: "10 min",
  durationSeconds: 600,
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
    vendor: vendorForTrack(mod.trackSlug),
  }),
  relatedCourseSlug: mod.trackSlug,
  relatedLabSlug: mod.labSlug ?? "",
  heygenStyle: "Apple Training Premium + MDM Vendor Catalog",
}));

export const altMdmLessonVideoMap = Object.fromEntries(
  allAltMdmModules.map((m) => [m.slug, m.videoSlug])
);
