import { allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";
import type { AcademyResource } from "@/src/lib/resources";

function badgeForTrack(track: string): "Apple" | "Intune" | "Jamf" | "Sécurité" {
  if (track.includes("intune") || track.includes("workspace")) return "Intune";
  if (track.includes("jamf") || track.includes("kandji")) return "Jamf";
  if (track.includes("comparatif")) return "Apple";
  return "Apple";
}

export const altMdmResources: AcademyResource[] = allAltMdmModules.map((mod) => ({
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
        "Parcours Apple IT Pro ou fondamentaux MDM complété",
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
