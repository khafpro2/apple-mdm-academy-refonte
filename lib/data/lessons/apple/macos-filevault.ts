import type { ModularLessonModule } from "@/lib/data/lessons/types";
import { PLATFORM_LAST_VERIFIED_AT } from "@/lib/platform-versions";

/**
 * Pilot modular lesson — FileVault (Apple Fundamentals).
 * Demonstrates the per-lesson module shape without inventing OS version claims.
 * Claude drafts under docs/content-drafts should replace or enrich content later.
 */
export const macosFileVaultLesson: ModularLessonModule = {
  meta: {
    slug: "filevault-chiffrement",
    courseSlug: "apple-fundamentals",
    family: "apple",
    title: "FileVault et chiffrement",
    editorialStatus: "pilot",
    platforms: ["macOS"],
    versionStatus: "needs-review",
    lastVerifiedAt: PLATFORM_LAST_VERIFIED_AT,
    requiresSupervision: false,
    enrollmentTypes: ["Device Enrollment", "Automated Device Enrollment"],
    officialSources: [
      {
        title: "Use FileVault to encrypt your Mac startup disk",
        publisher: "Apple",
        url: "https://support.apple.com/102537",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
      {
        title: "Apple Platform Security — Volume encryption",
        publisher: "Apple",
        url: "https://support.apple.com/guide/security/welcome/web",
        checkedAt: PLATFORM_LAST_VERIFIED_AT,
      },
    ],
    draftSourcePath: "docs/content-drafts (absent — awaiting Claude package)",
  },
  content: {
    objectives: [
      "Expliquer le rôle de FileVault pour le chiffrement du volume de démarrage macOS",
      "Différencier clé personnelle, clé de secours institutionnelle et escrow MDM",
      "Identifier les points de contrôle support (oubli de mot de passe, recovery, rotation)",
      "Relier FileVault aux exigences enterprise sans inventer de versions non vérifiées",
    ],
    prerequisites: [
      "Notions macOS et comptes locaux",
      "Comprendre la différence appareil personnel / appareil d’entreprise",
    ],
    theory: [
      {
        title: "Qu’est-ce que FileVault ?",
        body: [
          "FileVault chiffre le volume de démarrage macOS afin de protéger les données au repos si l’appareil est perdu ou volé.",
          "En entreprise, la valeur opérationnelle vient surtout de la capacité à récupérer l’accès via une clé de secours gérée (escrow), pas seulement du chiffrement lui-même.",
        ],
      },
      {
        title: "Escrow et MDM",
        body: [
          "Lorsque FileVault est imposé par politique MDM (Jamf Pro, Microsoft Intune, etc.), la clé de secours institutionnelle peut être déposée (escrow) côté serveur de gestion.",
          "Sans escrow fiable, un oubli de mot de passe ou un départ collaborateur devient un incident de perte de données — pas seulement un ticket support.",
        ],
      },
      {
        title: "Périmètre pédagogique",
        body: [
          "Cette leçon pilote structure le module d’intégration V1. Les détails versionnés (seuils OS, écarts UI) seront enrichis lorsque les fondations Codex (platform-versions) et les brouillons Claude seront disponibles.",
          "Aucun numéro de version macOS n’est présenté ici comme « officiel actuel » sans source vérifiée dans les métadonnées de compatibilité.",
        ],
      },
    ],
    steps: [
      {
        title: "Vérifier l’état FileVault",
        description:
          "Sur un Mac de labo, ouvrir Réglages Système → Confidentialité et sécurité → FileVault (libellés susceptibles de varier selon la version) et noter l’état activé / désactivé.",
      },
      {
        title: "Identifier la stratégie MDM",
        description:
          "Dans la console MDM, localiser le profil ou la déclaration qui impose FileVault et l’escrow de clé — ne pas activer manuellement en production sans politique.",
      },
      {
        title: "Documenter la récupération",
        description:
          "Écrire la procédure support : qui peut récupérer la clé institutionnelle, dans quel délai, et comment invalider l’accès après départ.",
      },
    ],
    screenshots: [],
    bestPractices: [
      "Toujours prévoir l’escrow avant un déploiement FileVault massif",
      "Tester la récupération sur un appareil pilote avant le rollout",
      "Séparer clairement clé personnelle utilisateur et clé institutionnelle",
      "Ne pas afficher de badge de version vide : n’afficher la compatibilité que si les métadonnées existent",
    ],
    troubleshooting: [
      {
        problem: "L’utilisateur a oublié son mot de passe et FileVault est actif",
        solution:
          "Utiliser la clé de secours institutionnelle depuis la console MDM si escrowé ; sinon, restauration depuis une sauvegarde connue — pas de contournement magique.",
      },
      {
        problem: "La politique MDM n’active pas FileVault",
        solution:
          "Vérifier le scope (smart group / filtre d’affectation), le type d’enrôlement et les prérequis plateforme documentés par l’éditeur MDM.",
      },
    ],
    summary: [
      "FileVault protège les données au repos ; en entreprise, l’escrow et la procédure de récupération sont aussi critiques que l’activation.",
      "Les métadonnées de version et les sources officielles s’afficheront sous le titre lorsque Codex/Claude auront fourni des données vérifiées.",
    ],
  },
};
