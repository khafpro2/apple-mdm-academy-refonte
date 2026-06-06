import type { Lab, LabLevel, LabTechnology } from "@/lib/types";
import type { AltMdmModuleDef } from "@/lib/data/alternative-mdm-tracks/module-definitions";
import { allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";

const NAMED_LAB_SLUGS = new Set([
  "kandji-blueprint",
  "kandji-liftoff",
  "mosyle-enrollment",
  "mosyle-auth",
  "addigy-policy",
  "addigy-golive",
  "workspace-one-apple-enrollment",
  "workspace-one-compliance",
  "mdm-comparison",
]);

function technologyForTrack(trackSlug: string): LabTechnology {
  if (trackSlug === "kandji-fundamentals") return "Kandji";
  if (trackSlug === "mosyle-fundamentals") return "Mosyle";
  if (trackSlug === "addigy-fundamentals") return "Addigy";
  if (trackSlug === "workspace-one-apple") return "Workspace ONE";
  return "Sécurité macOS";
}

function levelForModule(mod: AltMdmModuleDef): LabLevel {
  if (mod.trackSlug === "mdm-comparatif-apple") return "Intermédiaire";
  return mod.slug.includes("-m01") ? "Débutant" : "Intermédiaire";
}

function generateModuleLab(mod: AltMdmModuleDef): Lab {
  const vendor =
    mod.trackSlug === "kandji-fundamentals"
      ? "Kandji"
      : mod.trackSlug === "mosyle-fundamentals"
        ? "Mosyle"
        : mod.trackSlug === "addigy-fundamentals"
          ? "Addigy"
          : mod.trackSlug === "workspace-one-apple"
            ? "Workspace ONE UEM"
            : "MDM Apple";

  const slug = mod.labSlug!;
  return {
    slug,
    title: `Lab — ${mod.title}`,
    description: `Exercice pratique guidé : ${mod.title} (${vendor}). Validez la configuration en environnement pilote.`,
    level: levelForModule(mod),
    duration: "40 min",
    technology: technologyForTrack(mod.trackSlug),
    trackSlug: mod.trackSlug,
    objective: `Appliquer ${mod.title} sur un appareil pilote ${vendor}.`,
    objectives: [
      `Configurer ${mod.title} en mode pilote`,
      "Valider check-in MDM et résultat attendu",
      "Documenter runbook et checklist validation",
    ],
    prerequisites: [
      "Notions ABM, APNs et ADE",
      `Accès console ${vendor} (test ou sandbox)`,
      "Groupe pilote défini (1–3 appareils)",
    ],
    steps: [
      {
        id: "prep",
        title: "Préparation",
        instruction: `Vérifiez prérequis ABM/APNs et créez le groupe pilote pour « ${mod.title} ».`,
        expectedResult: "Groupe pilote et accès admin prêts.",
      },
      {
        id: "config",
        title: "Configuration",
        instruction: `Appliquez la configuration « ${mod.title} » dans ${vendor} selon le cours.`,
        expectedResult: "Configuration publiée et scoped au pilote.",
      },
      {
        id: "validate",
        title: "Validation appareil",
        instruction: "Enroll ou force check-in sur appareil test. Vérifiez inventaire et conformité.",
        expectedResult: "Appareil conforme, état visible dans la console.",
      },
      {
        id: "troubleshoot",
        title: "Dépannage",
        instruction: `Si la configuration « ${mod.title} » échoue : vérifiez scope, check-in MDM, logs ${vendor}, prérequis ABM/APNs et conflits de profils. Documentez l'erreur et la résolution.`,
        expectedResult: "Cause identifiée et procédure de correction documentée dans le runbook.",
      },
      {
        id: "checklist",
        title: "Checklist finale",
        instruction: `Checklist :\n• Configuration documentée\n• Screenshots archivés\n• Rollback plan défini\n• Quiz ${mod.quizSlug} prêt`,
        expectedResult: "Tous les points cochés et runbook signé.",
      },
    ],
    expectedResult: `${mod.title} validé en pilote, checklist complète, prêt pour le quiz module.`,
  };
}

/** Labs auto-générés pour modules sans lab nommé (section 6) */
export function generateModuleLabs(): Lab[] {
  return allAltMdmModules
    .filter((m) => m.labSlug && !NAMED_LAB_SLUGS.has(m.labSlug))
    .map(generateModuleLab);
}

export function isGeneratedLabSlug(slug: string): boolean {
  return slug.startsWith("lab-") && !NAMED_LAB_SLUGS.has(slug);
}
