import type { LessonContent } from "@/lib/types";
import { allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";

const COMPARISON_LINES = [
  "Jamf Pro — profondeur Apple, API mature, coût élevé, déploiement complexe.",
  "Microsoft Intune — stack Microsoft, Conditional Access, UX Apple moins native.",
  "Kandji — Blueprints, Liftoff, Apple-only, UX moderne.",
  "Mosyle — pricing compétitif, éducation/PME, simplicité.",
  "Addigy — multi-tenant MSP, GoLive, Smart Software.",
  "Workspace ONE — multi-OS VMware, Apple moins spécialisé.",
];

const MODULE_THEORY: Record<string, { overview: string[]; concepts: string[]; enterprise: string[] }> = {
  "kfd-m02": {
    overview: ["Les Blueprints Kandji modélisent le cycle de vie device : enrollment → config → compliance → offboarding."],
    concepts: ["Library Items réutilisables", "Auto Apps pour déploiement automatique", "Compliance intégrée au workflow"],
    enterprise: ["Documenter Blueprint par persona (dev, sales, exec)", "Pilot group 10 Mac avant rollout"],
  },
  "kfd-m06": {
    overview: ["Liftoff personnalise l'expérience zero-touch Mac avec Passport et apps essentielles."],
    concepts: ["Écran bienvenue brandé", "Passport SSO/local", "Apps auto-installées"],
    enterprise: ["Tester ADE + Liftoff sur Mac neuf", "Runbook support first-day"],
  },
  "mdm-m08": {
    overview: ["Matrice de décision MDM pour choisir Jamf, Intune, Kandji, Mosyle, Addigy ou Workspace ONE."],
    concepts: COMPARISON_LINES,
    enterprise: ["POC 30 jours sur 2 finalistes", "TCO placeholder €/device/mois × flotte × 3 ans"],
  },
};

function defaultTheory(title: string, trackSlug: string): { overview: string[]; concepts: string[]; enterprise: string[] } {
  const vendor =
    trackSlug === "kandji-fundamentals"
      ? "Kandji"
      : trackSlug === "mosyle-fundamentals"
        ? "Mosyle"
        : trackSlug === "addigy-fundamentals"
          ? "Addigy"
          : trackSlug === "workspace-one-apple"
            ? "Workspace ONE UEM"
            : "MDM Apple Enterprise";

  return {
    overview: [`Module « ${title} » — ${vendor} en contexte entreprise Apple.`],
    concepts: [
      "Intégration ABM et Automated Device Enrollment (ADE)",
      "Configuration, compliance et reporting",
      "Moindre privilège et documentation runbook",
    ],
    enterprise: [
      "Pilot group avant production",
      "Ticket ITSM pour chaque changement",
      "Plan rollback documenté",
    ],
  };
}

export function getAltMdmLessonContent(lessonSlug: string): LessonContent | null {
  const mod = allAltMdmModules.find((m) => m.slug === lessonSlug);
  if (!mod) return null;

  const theory = MODULE_THEORY[lessonSlug] ?? defaultTheory(mod.title, mod.trackSlug);

  return {
    objectives: [
      `Comprendre les fondamentaux de ${mod.title}`,
      `Configurer ${mod.title} en environnement pilote`,
      `Valider compliance et documenter le runbook`,
    ],
    prerequisites: [
      "Notions Apple MDM (ABM, APNs, ADE)",
      "Accès console admin MDM (test ou sandbox)",
      mod.trackSlug === "mdm-comparatif-apple"
        ? "Aucun prérequis vendor spécifique"
        : `Compte ${mod.trackSlug.split("-")[0]} ou environnement démo`,
    ],
    theory: [
      { title: "Vue d'ensemble", body: theory.overview },
      { title: "Concepts essentiels", body: theory.concepts },
      { title: "Contexte entreprise", body: theory.enterprise },
    ],
    steps: [
      { title: "Préparation", description: `Revoyez les prérequis ABM/APNs pour ${mod.title}.` },
      { title: "Configuration", description: `Appliquez la configuration ${mod.title} selon la documentation vendor.` },
      { title: "Validation", description: "Vérifiez check-in MDM, compliance et résultat attendu." },
      { title: "Documentation", description: "Rédigez runbook, checklist validation et plan rollback." },
    ],
    screenshots: [],
    bestPractices: [
      "Toujours tester en pilot group avant production",
      "Documenter chaque changement avec ticket ITSM",
      "Rotation secrets et moindre privilège admin",
    ],
    troubleshooting: [
      {
        problem: "Device ne check-in pas après configuration",
        solution: "Vérifier APNs, connectivité réseau, certificat MDM et scope assignment.",
      },
      {
        problem: "Compliance non appliquée",
        solution: "Confirmer scope, grace period et critères (OS, FileVault).",
      },
    ],
    finalQuizSlug: mod.quizSlug,
  };
}
