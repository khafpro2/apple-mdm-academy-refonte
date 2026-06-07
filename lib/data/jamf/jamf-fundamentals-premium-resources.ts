import type { AcademyResource } from "@/src/lib/resources";
import {
  JAMF_FUNDAMENTALS_MODULES,
  type JamfFundamentalsModuleId,
} from "@/lib/data/jamf/jamf-fundamentals-premium";
import { JAMF_FUNDAMENTALS_PREMIUM_CONTENT } from "@/lib/data/jamf/jamf-fundamentals-premium-content";
import { getJamfTrainingResource } from "@/lib/data/jamf/jamf-training-resources";

const EXISTING_GUIDE_SLUGS = new Set([
  "jamf-guide-smart-groups",
  "jamf-guide-policies",
  "jamf-guide-configuration-profiles",
  "jamf-guide-self-service",
  "jamf-guide-packages",
  "jamf-guide-inventory",
  "jamf-guide-enrollment",
  "jamf-guide-scripts",
  "jamf-guide-patch-management",
]);

function buildPremiumResource(moduleId: JamfFundamentalsModuleId): AcademyResource {
  const mod = JAMF_FUNDAMENTALS_MODULES.find((m) => m.id === moduleId)!;
  const content = JAMF_FUNDAMENTALS_PREMIUM_CONTENT[moduleId];
  return {
    slug: mod.resourceSlug,
    title: `Guide Jamf Pro 11.16 — ${mod.title}`,
    description: `Procédure PDF premium ${mod.title} — parcours Jamf Fundamentals Apple MDM Academy.`,
    objective: content.enterpriseScenario,
    category: "procedure",
    level: mod.certificationLevel === "Jamf 200" ? "Avancé" : mod.certificationLevel === "Jamf 170" ? "Intermédiaire" : "Fondamental",
    badge: "Jamf",
    module: mod.title,
    relatedCourseSlug: mod.courseSlug,
    relatedLabSlug: mod.labSlug,
    relatedVideoSlug: mod.videoSlug,
    sections: [
      { title: "Introduction", items: content.introduction },
      { title: "Concepts", items: content.concepts },
      { title: "Architecture", items: content.architecture },
      { title: "Démonstration", items: content.demonstration },
      { title: "Bonnes pratiques", items: content.bestPractices },
      { title: "Erreurs fréquentes", items: content.commonErrors },
      { title: "Résumé", items: content.summary },
      { title: "Étapes lab", items: content.labSteps },
    ],
  };
}

/** Guides PDF premium — modules sans guide training existant */
export const JAMF_FUNDAMENTALS_PREMIUM_RESOURCES: AcademyResource[] = JAMF_FUNDAMENTALS_MODULES.filter(
  (m) => !EXISTING_GUIDE_SLUGS.has(m.resourceSlug)
).map((m) => buildPremiumResource(m.id));

export function getJamfFundamentalsResource(slug: string): AcademyResource | undefined {
  const premium = JAMF_FUNDAMENTALS_PREMIUM_RESOURCES.find((r) => r.slug === slug);
  if (premium) return premium;
  return getJamfTrainingResource(slug);
}
