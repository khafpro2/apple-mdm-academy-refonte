import { createProductionStoryboard } from "@/src/lib/video-storyboard-factory";
import {
  JAMF_FUNDAMENTALS_MODULES,
  type JamfFundamentalsModuleId,
} from "@/lib/data/jamf/jamf-fundamentals-premium";
import { JAMF_FUNDAMENTALS_PREMIUM_CONTENT } from "@/lib/data/jamf/jamf-fundamentals-premium-content";

const EXISTING_STORYBOARD_SLUGS = new Set([
  "jamf-pro-fundamentals",
  "jamf-dashboard",
  "jamf-smart-groups",
  "jamf-policies",
  "jamf-scripts",
  "jamf-patch-management",
  "jamf-configuration-profiles",
  "jamf-inventory",
  "jamf-enrollment",
  "jamf-self-service",
  "jamf-packages",
]);

function premiumStoryboard(moduleId: JamfFundamentalsModuleId) {
  const mod = JAMF_FUNDAMENTALS_MODULES.find((m) => m.id === moduleId)!;
  const content = JAMF_FUNDAMENTALS_PREMIUM_CONTENT[moduleId];
  const scriptLines = content.heygenScript.split("\n").filter(Boolean);
  return createProductionStoryboard({
    slug: mod.storyboardSlug,
    title: `${mod.title} — Jamf Pro 11.16 Premium`,
    module: mod.title,
    level: mod.certificationLevel === "Jamf 200" ? "Avancé" : mod.certificationLevel === "Jamf 170" ? "Intermédiaire" : "Débutant",
    objective: content.summary[0] ?? mod.description,
    courseSlug: mod.courseSlug,
    labSlug: mod.labSlug,
    quizSlug: mod.quizSlug,
    visualType: "screenshot",
    intro: {
      narration: scriptLines.slice(0, 2).join(" "),
      visual: `Avatar HeyGen + capture ${mod.screenshotSlug}`,
      animation: "Fade-in titre module",
      onScreenText: [mod.title, "Jamf Fundamentals Premium"],
    },
    architecture: {
      narration: content.architecture.join(" "),
      visual: "Diagramme architecture Jamf",
      animation: "Architecture nodes",
      nodes: [
        { id: "jamf", label: "Jamf Pro", icon: "jamf" },
        { id: "module", label: mod.title, icon: "certificate" },
        { id: "device", label: "Appareil géré", icon: "apple-device" },
      ],
      connections: [
        { from: "jamf", to: "module" },
        { from: "module", to: "device" },
      ],
      onScreenText: content.concepts.slice(0, 2),
    },
    demo: {
      narration: content.demonstration.join(" "),
      visual: `Capture ${mod.screenshotSlug}.webp`,
      animation: "Screen Studio zoom console Jamf",
      durationSeconds: 120,
      requiredScreenshots: content.labSteps.slice(0, 4),
      onScreenText: ["Démonstration", mod.title],
    },
    errors: {
      narration: content.commonErrors.join(" "),
      visual: "Checklist erreurs fréquentes",
      animation: "Puces warning",
      checklistItems: content.commonErrors,
      onScreenText: ["Erreurs fréquentes"],
    },
    recap: {
      narration: `${content.summary.join(" ")} Lab ${mod.labSlug}, quiz ${mod.quizSlug}.`,
      visual: "Récap + liens lab/quiz",
      animation: "Transition recap",
      onScreenText: [`Lab ${mod.labSlug}`, "Quiz", "PDF guide"],
    },
  });
}

/** Storyboards premium — modules sans storyboard production existant */
export const jamfFundamentalsPremiumStoryboards = JAMF_FUNDAMENTALS_MODULES.filter(
  (m) => !EXISTING_STORYBOARD_SLUGS.has(m.storyboardSlug)
).map((m) => premiumStoryboard(m.id));

export const jamfFundamentalsPremiumStoryboardSlugs = jamfFundamentalsPremiumStoryboards.map((s) => s.slug);
