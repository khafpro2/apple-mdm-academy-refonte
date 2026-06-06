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

function enterpriseContext(mod: AltMdmModuleDef, vendor: string): string {
  const title = mod.title.toLowerCase();
  if (mod.trackSlug === "kandji-fundamentals") {
    if (title.includes("blueprint") || title.includes("library"))
      return "TechCorp (400 Mac) standardise l'onboarding dev avec Blueprint « Engineering » et Library Items partagés.";
    if (title.includes("liftoff") || title.includes("passport"))
      return "ScaleUp Inc. livre des Mac zero-touch : Liftoff brandé + Passport Entra ID au premier démarrage.";
    return `Flotte Kandji de 250 Mac/iOS — valider « ${mod.title} » avant rollout Q2.`;
  }
  if (mod.trackSlug === "mosyle-fundamentals") {
    if (title.includes("enrollment"))
      return "École Horizon (180 iPad) enrôle via ABM + Mosyle sans config manuelle au setup assistant.";
    if (title.includes("auth") || title.includes("fuse"))
      return "PME RetailCo déploie Mosyle Auth + Fuse pour Mac magasin avec conformité renforcée.";
    return `PME Mosyle (120 appareils) — scénario pilote « ${mod.title} » sur 3 devices représentatifs.`;
  }
  if (mod.trackSlug === "addigy-fundamentals") {
    if (title.includes("golive") || title.includes("remote"))
      return "MSP CloudMac intervient sur Mac client Acme Corp via GoLive pour policy non appliquée.";
    return `MSP multi-tenant Addigy — client pilote 15 Mac, site « HQ-Paris », policy « ${mod.title} ».`;
  }
  if (mod.trackSlug === "workspace-one-apple") {
    return `Enterprise MultiOS Corp (VMware stack) — segment Apple 200 Mac/iOS, UEM ${vendor}, module « ${mod.title} ».`;
  }
  if (mod.trackSlug === "mdm-comparatif-apple") {
    return "DSI GlobalTech (800 Mac) — POC comparatif Jamf vs Intune vs Kandji, critères pondérés documentés.";
  }
  return `Organisation enterprise — valider « ${mod.title} » sur ${vendor} en pilote contrôlé.`;
}

function commonErrors(vendor: string): { problem: string; solution: string }[] {
  return [
    {
      problem: "Appareil absent de la console après enrollment",
      solution: `Vérifier token ABM actif, profil MDM assigné dans ABM, APNs valide et connectivité réseau. Forcer check-in depuis ${vendor}.`,
    },
    {
      problem: "Configuration scoped mais non reçue",
      solution: "Confirmer groupe pilote, ordre de priorité profils, conflit payload et dernier check-in < 15 min.",
    },
    {
      problem: "Compliance rouge sans cause visible",
      solution: "Ouvrir détail compliance device : FileVault, OS version, apps requises. Corriger payload ou grace period.",
    },
  ];
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

  const context = enterpriseContext(mod, vendor);
  const errors = commonErrors(vendor);
  const slug = mod.labSlug!;

  return {
    slug,
    title: `Lab — ${mod.title}`,
    description: `Scénario entreprise ${vendor} : ${context} Durée estimée 40 min.`,
    level: levelForModule(mod),
    duration: "40 min",
    technology: technologyForTrack(mod.trackSlug),
    trackSlug: mod.trackSlug,
    objective: `Implémenter et valider « ${mod.title} » en environnement pilote ${vendor}.`,
    objectives: [
      `Configurer « ${mod.title} » selon le runbook module`,
      "Valider check-in MDM, conformité et résultat attendu sur appareil test",
      "Documenter erreurs rencontrées et procédure support tier 1",
    ],
    prerequisites: [
      "Notions ABM, APNs et Automated Device Enrollment (ADE)",
      `Accès console ${vendor} (sandbox ou tenant test)`,
      "Groupe pilote défini (1–3 appareils Mac ou iOS représentatifs)",
      "Ticket ITSM ouvert pour tracer le changement",
    ],
    steps: [
      {
        id: "context",
        title: "Contexte entreprise",
        instruction: `Lisez le scénario : ${context} Identifiez appareils pilote, critères de réussite et fenêtre de test.`,
        expectedResult: "Scénario compris, pilote sélectionné, critères go/no-go notés.",
      },
      {
        id: "prep",
        title: "Préparation",
        instruction: `Vérifiez ABM, APNs, droits admin ${vendor} et groupe pilote pour « ${mod.title} ». Exportez état initial (inventaire, compliance).`,
        expectedResult: "Prérequis OK, baseline capturée (screenshot ou export).",
      },
      {
        id: "config",
        title: "Configuration",
        instruction: `Appliquez « ${mod.title} » dans ${vendor}. Scope strictement au groupe pilote. Notez chaque modification dans le change log.`,
        expectedResult: "Configuration publiée, scoped au pilote, change log à jour.",
      },
      {
        id: "validate",
        title: "Validation appareil",
        instruction: "Enroll ou force check-in sur appareil test. Comparez console MDM vs Réglages/Profils locaux. Capturez preuves.",
        expectedResult: "Appareil conforme, état attendu visible console + device.",
      },
      {
        id: "troubleshoot",
        title: "Dépannage",
        instruction: `Simulez ou documentez une erreur courante :\n• ${errors[0]!.problem} → ${errors[0]!.solution}\n• ${errors[1]!.problem} → ${errors[1]!.solution}\nMettez à jour le runbook support.`,
        expectedResult: "Procédure dépannage testée ou documentée avec symptômes et escalade.",
      },
      {
        id: "checklist",
        title: "Checklist finale",
        instruction: `Checklist :\n• Runbook signé avec rollback\n• Screenshots archivés\n• Quiz ${mod.quizSlug} réussi (≥ 75 %)\n• Ticket ITSM clôturé avec résultat`,
        expectedResult: "Lab validé, prêt pour extension production contrôlée.",
      },
    ],
    expectedResult: `« ${mod.title} » validé en pilote ${vendor}, runbook support complet, quiz module prêt.`,
  };
}

/** Labs auto-générés pour modules sans lab nommé */
export function generateModuleLabs(): Lab[] {
  return allAltMdmModules
    .filter((m) => m.labSlug && !NAMED_LAB_SLUGS.has(m.labSlug))
    .map(generateModuleLab);
}

export function isGeneratedLabSlug(slug: string): boolean {
  return slug.startsWith("lab-") && !NAMED_LAB_SLUGS.has(slug);
}
