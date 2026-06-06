import type { LessonContent } from "@/lib/types";
import { allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";
import { MDM_COMPARISON_TABLE } from "@/lib/data/alternative-mdm-tracks/comparison-table";
import { getScreenshotsForLesson } from "@/lib/data/lesson-screenshots";

const COMPARISON_HIGHLIGHT: Record<string, string> = {
  "mdm-m02": "Jamf",
  "mdm-m03": "Microsoft Intune",
  "mdm-m04": "Kandji",
  "mdm-m05": "Mosyle",
  "mdm-m06": "Addigy",
  "mdm-m07": "Workspace ONE",
};

const COMPARISON_LINES = [
  "Jamf Pro — profondeur Apple, API mature, coût élevé, déploiement complexe.",
  "Microsoft Intune — stack Microsoft, Conditional Access, UX Apple moins native.",
  "Kandji — Blueprints, Liftoff, Apple-only, UX moderne.",
  "Mosyle — pricing compétitif, éducation/PME, simplicité.",
  "Addigy — multi-tenant MSP, GoLive, Smart Software.",
  "Workspace ONE — multi-OS VMware, Apple moins spécialisé.",
];

type AltMdmTheory = {
  overview: string[];
  concepts: string[];
  enterprise: string[];
  steps: string[];
  checks: string[];
  risks: string[];
};

const MODULE_THEORY: Record<string, Partial<AltMdmTheory>> = {
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
    enterprise: ["POC 30 jours sur 2 finalistes", "TCO sur 3 ans : licence × flotte + temps admin + migration + formation"],
  },
};

function vendorName(trackSlug: string): string {
  return trackSlug === "kandji-fundamentals"
    ? "Kandji"
    : trackSlug === "mosyle-fundamentals"
      ? "Mosyle"
      : trackSlug === "addigy-fundamentals"
        ? "Addigy"
        : trackSlug === "workspace-one-apple"
          ? "Workspace ONE UEM"
          : "MDM Apple Enterprise";
}

function defaultTheory(title: string, trackSlug: string, lessonSlug: string): AltMdmTheory {
  const vendor = vendorName(trackSlug);
  const lower = `${lessonSlug} ${title}`.toLowerCase();
  const isComparison = trackSlug === "mdm-comparatif-apple";

  if (isComparison) {
    return {
      overview: [
        `Cette leçon analyse « ${title} » dans une démarche de choix MDM Apple enterprise.`,
        "Le but est de comparer les plateformes sur des critères vérifiables : profondeur Apple, intégrations, coût total, automatisation, sécurité, support et vitesse de déploiement.",
        "Une bonne décision ne consiste pas à choisir l'outil le plus populaire, mais celui qui correspond au contexte de flotte, d'équipe et de contraintes métiers.",
      ],
      concepts: [
        ...COMPARISON_LINES,
        "Le TCO doit inclure licences, temps d'administration, migration, formation, support, intégrations et coût des erreurs de déploiement.",
      ],
      enterprise: [
        "Construire une matrice pondérée avec 8 à 12 critères maximum.",
        "Lancer un POC court sur deux finalistes avec les mêmes scénarios de test.",
        "Impliquer IT, sécurité, support, achats et représentants utilisateurs avant décision.",
      ],
      steps: [
        "Définir le contexte de flotte : Mac/iPhone/iPad, BYOD/corporate, régions, niveau d'automatisation attendu.",
        "Choisir les critères pondérés : enrollment, apps, sécurité, API, reporting, support, coûts, expérience utilisateur.",
        "Évaluer chaque fournisseur sur preuves : capture, test appareil, export rapport, documentation.",
        "Produire une recommandation avec risques, coûts sur 3 ans et plan de migration.",
      ],
      checks: [
        "La matrice explique pourquoi un fournisseur gagne pour ce contexte précis.",
        "Les limites et coûts cachés sont visibles.",
        "La recommandation inclut un plan pilote et une stratégie de sortie.",
      ],
      risks: [
        "Choisir un MDM sur une démo commerciale sans test appareil.",
        "Comparer uniquement le prix par device sans mesurer les coûts d'exploitation.",
      ],
    };
  }

  if (lower.includes("blueprint") || lower.includes("library") || lower.includes("auto apps") || lower.includes("passport") || lower.includes("liftoff")) {
    return {
      overview: [
        `${title} couvre une brique centrale de Kandji pour standardiser le cycle de vie des appareils Apple.`,
        "Kandji privilégie une approche Apple-only avec Blueprints, Library Items et automatisations prêtes à l'emploi pour accélérer le déploiement.",
      ],
      concepts: [
        "Les Blueprints définissent l'état attendu par population : sécurité, apps, paramètres et expérience d'accueil.",
        "Les Library Items regroupent profils, apps, scripts, contrôles et automatisations réutilisables.",
        "Liftoff et Passport améliorent l'expérience du premier démarrage et de l'identité utilisateur.",
      ],
      enterprise: [
        "Créer un Blueprint par persona ou niveau de risque, pas par exception individuelle.",
        "Tester chaque Library Item sur un Mac pilote avant rattachement à un Blueprint large.",
        "Documenter les dépendances ABM, IdP, réseau et apps critiques.",
      ],
      steps: [
        "Créer ou sélectionner le Blueprint pilote.",
        "Ajouter les Library Items nécessaires avec descriptions claires.",
        "Enrôler un appareil test via ABM/ADE.",
        "Vérifier conformité, installation d'apps et expérience utilisateur.",
      ],
      checks: [
        "L'appareil reçoit le bon Blueprint.",
        "Les apps et paramètres attendus s'appliquent sans action manuelle.",
        "Les erreurs de conformité sont lisibles dans la console.",
      ],
      risks: [
        "Multiplier les Blueprints jusqu'à rendre le modèle illisible.",
        "Mettre en production un item sans tester son impact sur l'ouverture de session.",
      ],
    };
  }

  if (trackSlug === "mosyle-fundamentals") {
    return {
      overview: [
        `${title} présente Mosyle comme plateforme MDM Apple orientée simplicité, éducation, PME et sécurité intégrée selon les offres.`,
        "Mosyle mise sur des workflows guidés pour enrollment, profils, apps, authentification et reporting.",
      ],
      concepts: [
        "L'enrollment Mosyle repose sur ABM/ADE, APNs et profils de gestion.",
        "Management Profiles, Apps & Books et Mosyle Auth structurent configuration, apps et identité.",
        "Mosyle Fuse ajoute des fonctions sécurité et conformité selon le périmètre choisi.",
      ],
      enterprise: [
        "Séparer profils de base, sécurité, réseau et restrictions pour faciliter le support.",
        "Tester les scénarios éducation/PME : appareil partagé, utilisateur jeune, apps obligatoires, web filtering.",
        "Vérifier les rapports disponibles avant de promettre une conformité détaillée.",
      ],
      steps: [
        "Préparer ABM, APNs et le groupe pilote.",
        "Configurer le profil ou service Mosyle étudié.",
        "Assigner à un petit groupe d'appareils représentatifs.",
        "Contrôler check-in, application des profils et expérience utilisateur.",
      ],
      checks: [
        "L'appareil apparaît actif et conforme.",
        "Le profil ciblé est bien installé.",
        "Le reporting donne une information exploitable par le support.",
      ],
      risks: [
        "Sous-estimer les différences entre usage école, PME et entreprise régulée.",
        "Créer des profils trop larges difficiles à dépanner.",
      ],
    };
  }

  if (trackSlug === "addigy-fundamentals") {
    return {
      overview: [
        `${title} aborde Addigy sous l'angle MSP et administration multi-tenant de flottes Apple.`,
        "Addigy est fort sur visibilité temps réel, GoLive, policies, Smart Software et gestion à distance.",
      ],
      concepts: [
        "GoLive permet d'interagir rapidement avec un appareil pour diagnostic ou action support.",
        "Les policies définissent l'état souhaité et organisent les configurations par périmètre client ou site.",
        "Smart Software facilite packaging, installation et suivi applicatif.",
      ],
      enterprise: [
        "Structurer clients, sites et rôles pour éviter les erreurs multi-tenant.",
        "Limiter les actions remote aux équipes habilitées et journaliser les interventions.",
        "Créer des standards réutilisables sans perdre la capacité d'exception par client.",
      ],
      steps: [
        "Identifier le tenant, site ou groupe concerné.",
        "Configurer la policy, action GoLive ou Smart Software en pilote.",
        "Observer l'état temps réel et les logs.",
        "Documenter l'action pour réutilisation MSP ou support interne.",
      ],
      checks: [
        "Le bon tenant reçoit la bonne configuration.",
        "L'action distante est visible et auditable.",
        "Les apps ou profils sont conformes après check-in.",
      ],
      risks: [
        "Appliquer une action au mauvais tenant ou mauvais site.",
        "Utiliser le remote management sans procédure d'autorisation.",
      ],
    };
  }

  if (trackSlug === "workspace-one-apple") {
    return {
      overview: [
        `${title} situe Workspace ONE UEM dans une stratégie multi-OS où Apple doit cohabiter avec Windows, Android et accès applicatif.`,
        "La valeur vient de l'intégration UEM, identité, compliance, apps et accès conditionnel.",
      ],
      concepts: [
        "Apple Enrollment s'appuie sur ABM/ADE, APNs et profils UEM.",
        "Les profils macOS/iOS doivent être organisés par plateforme et cas d'usage.",
        "Compliance et Conditional Access relient posture appareil et accès aux ressources.",
      ],
      enterprise: [
        "Vérifier que les besoins Apple ne sont pas dilués dans une approche trop générique multi-OS.",
        "Aligner UEM, IdP, réseau, certificats et catalogue applicatif.",
        "Mesurer l'expérience utilisateur au premier démarrage et lors des remédiations compliance.",
      ],
      steps: [
        "Préparer les intégrations Apple et les groupes de test.",
        "Créer le profil, l'app ou la règle compliance ciblée.",
        "Déployer sur appareils Mac/iOS pilotes.",
        "Valider statut UEM, accès applicatif et logs d'identité.",
      ],
      checks: [
        "L'appareil Apple est bien enrôlé et classé.",
        "Les profils s'appliquent sans conflit.",
        "L'accès conditionnel reflète correctement la conformité.",
      ],
      risks: [
        "Traiter macOS comme un poste Windows avec les mêmes hypothèses.",
        "Activer une règle d'accès avant d'avoir testé les exclusions admin.",
      ],
    };
  }

  return {
    overview: [
      `Module « ${title} » — ${vendor} en contexte entreprise Apple.`,
      "La leçon doit être validée sur un appareil pilote avant toute généralisation.",
      "Le résultat attendu doit être visible dans la console MDM, sur l'appareil et dans le runbook support.",
    ],
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
    steps: [
      "Préparer ABM, APNs, compte admin et groupe pilote.",
      `Configurer ${title} dans ${vendor}.`,
      "Valider le comportement sur appareil test et dans la console.",
      "Documenter runbook, rollback et critères d'extension.",
    ],
    checks: [
      "Le check-in MDM est récent.",
      "La configuration attendue est visible côté appareil.",
      "Le support sait diagnostiquer les erreurs courantes.",
    ],
    risks: [
      "Déployer sans groupe pilote.",
      "Oublier les dépendances APNs, ABM ou réseau.",
    ],
  };
}

export function getAltMdmLessonContent(lessonSlug: string): LessonContent | null {
  const mod = allAltMdmModules.find((m) => m.slug === lessonSlug);
  if (!mod) return null;

  const defaults = defaultTheory(mod.title, mod.trackSlug, lessonSlug);
  const override = MODULE_THEORY[lessonSlug] ?? {};
  const theory: AltMdmTheory = {
    overview: override.overview ?? defaults.overview,
    concepts: override.concepts ?? defaults.concepts,
    enterprise: override.enterprise ?? defaults.enterprise,
    steps: override.steps ?? defaults.steps,
    checks: override.checks ?? defaults.checks,
    risks: override.risks ?? defaults.risks,
  };
  const vendor = vendorName(mod.trackSlug);
  const isComparatif = mod.trackSlug === "mdm-comparatif-apple";

  return {
    objectives: [
      `Comprendre les fondamentaux de ${mod.title}.`,
      `Configurer ${mod.title} en environnement pilote ${vendor}.`,
      "Comparer l'impact sur enrollment, apps, sécurité, reporting et support.",
      "Valider compliance et documenter le runbook.",
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
      ...theory.steps.map((description, index) => ({
        title: ["Préparation", "Configuration", "Validation", "Documentation"][index] ?? `Étape ${index + 1}`,
        description,
      })),
    ],
    screenshots: getScreenshotsForLesson(mod.slug, {
      courseSlug: mod.trackSlug,
      lesson: { slug: mod.slug, title: mod.title, duration: mod.duration },
      domain: vendor,
    }),
    bestPractices: [
      ...theory.checks.map((check) => `Contrôle : ${check}`),
      "Toujours tester en pilot group avant production",
      "Documenter chaque changement avec ticket ITSM",
      "Rotation secrets et moindre privilège admin",
      "Mesurer le coût réel : licences, temps support, migration, formation et intégrations.",
    ].slice(0, 7),
    troubleshooting: [
      ...theory.risks.map((risk) => ({
        problem: risk,
        solution:
          "Réduisez le scope au groupe pilote, vérifiez ABM/APNs/réseau, comparez l'état console avec l'appareil, puis mettez à jour le runbook avant de reprendre.",
      })),
      {
        problem: "Device ne check-in pas après configuration",
        solution: "Vérifier APNs, connectivité réseau, certificat MDM et scope assignment.",
      },
      {
        problem: "Compliance non appliquée",
        solution: "Confirmer scope, grace period et critères (OS, FileVault).",
      },
    ].slice(0, 5),
    finalQuizSlug: mod.quizSlug,
    ...(isComparatif
      ? {
          comparisonTable: MDM_COMPARISON_TABLE,
          comparisonHighlight: COMPARISON_HIGHLIGHT[lessonSlug],
        }
      : {}),
  };
}
