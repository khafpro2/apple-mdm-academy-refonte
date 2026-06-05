import { allAdvancedModules } from "@/lib/data/advanced-tracks/module-definitions";
import type { AcademyResource } from "@/src/lib/resources";

function badgeForTrack(track: string): "Apple" | "Intune" | "Jamf" | "Sécurité" {
  if (track.startsWith("jamf")) return "Jamf";
  if (track.startsWith("intune")) return "Intune";
  if (track.includes("security") || track.includes("enterprise")) return "Apple";
  return "Apple";
}

/** Ressources téléchargeables — une checklist par module expert */
export const advancedResources: AcademyResource[] = allAdvancedModules.map((mod) => ({
  slug: mod.resourceSlug,
  title: `Checklist — ${mod.title}`,
  description: `Runbook et checklist validation pour le module ${mod.title}.`,
  category: "checklist" as const,
  level: "Avancé" as const,
  badge: badgeForTrack(mod.trackSlug),
  module: mod.title,
  relatedCourseSlug: mod.trackSlug,
  relatedLabSlug: mod.labSlug ?? "",
  sections: [
    {
      title: "Prérequis",
      items: [
        "Parcours prérequis complété (Jamf 200 / Apple IT Pro / Intune base)",
        "Environnement de test ou pilot group défini",
        "Accès admin MDM et documentation org",
      ],
    },
    {
      title: "Étapes clés",
      items: [
        `Étudier le cours ${mod.title}`,
        `Compléter le quiz (${mod.quizCount} questions, seuil 75 %)`,
        mod.labSlug ? `Lab pratique : ${mod.labSlug}` : "Valider en environnement pilote",
        "Documenter résultat et rollback plan",
      ],
    },
    {
      title: "Validation",
      items: [
        "Checklist signée par responsable IT",
        "Logs MDM archivés",
        "Badge module obtenu",
      ],
    },
  ],
}));
