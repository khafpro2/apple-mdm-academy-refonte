import type { LessonContent } from "@/lib/types";
import { allAdvancedModules } from "@/lib/data/advanced-tracks/module-definitions";

const MODULE_THEORY: Record<string, { overview: string[]; concepts: string[]; enterprise: string[] }> = {
  "j300-m01": {
    overview: [
      "Architecture Jamf Pro multi-site : sites, distribution points, LDAP/SSO et haute disponibilité.",
      "Planifier la capacité Tomcat, PostgreSQL et la latence check-in pour 5 000+ appareils.",
    ],
    concepts: [
      "Sites Jamf isolent policies et ressources par région ou business unit.",
      "Distribution Points cachent packages pour déploiements WAN optimisés.",
      "Load balancer devant cluster Jamf Pro pour HA production.",
    ],
    enterprise: [
      "Documenter RPO/RTO et runbook failover.",
      "Séparer environnements DEV / STAGING / PROD par instance ou site.",
    ],
  },
  "j300-m07": {
    overview: ["Jamf Pro API REST v1 — OAuth2 client credentials, pagination, rate limits."],
    concepts: [
      "POST /api/oauth/token avec client_id et client_secret.",
      "Endpoints computers-inventory, policies, computer-groups.",
      "Headers X-Rate-Limit pour automatisation batch.",
    ],
    enterprise: [
      "Stocker secrets dans vault (Azure Key Vault, HashiCorp).",
      "Automatiser inventaire export vers CMDB via pipeline planifié.",
    ],
  },
  "aee-m05": {
    overview: ["Declarative Device Management (DDM) — modèle déclaratif Apple remplaçant profils statiques."],
    concepts: [
      "Declarations MDM + status channel pour software update, passcode, etc.",
      "Device applique état désiré et remonte status reports.",
      "Compatible iOS 17+, macOS 14+ supervisés.",
    ],
    enterprise: [
      "Migrer progressivement depuis configuration profiles classiques.",
      "Monitorer status channel dans Jamf/Intune avant rollout global.",
    ],
  },
  "iaa-m02": {
    overview: ["Conditional Access Entra ID avec compliance Intune pour appareils Apple."],
    concepts: [
      "Compliance policy macOS : FileVault, OS min, SIP, Defender.",
      "CA policy : require compliant device for M365 apps.",
      "Sign-in logs Entra pour diagnostic blocages.",
    ],
    enterprise: [
      "Définir break-glass accounts hors CA pour admins.",
      "Pilot group avant enforcement production.",
    ],
  },
};

function defaultTheory(title: string, trackSlug: string): { overview: string[]; concepts: string[]; enterprise: string[] } {
  const domain = trackSlug.startsWith("jamf") ? "Jamf Pro" : trackSlug.startsWith("intune") ? "Microsoft Intune" : "Apple Platform";
  return {
    overview: [`Module expert « ${title} » — approfondissement ${domain} en contexte enterprise.`],
    concepts: [
      "Appliquer le principe du moindre privilège et documenter chaque changement.",
      "Valider sur groupe pilote avant déploiement global.",
      `Référencer la documentation officielle ${domain} et Apple Platform Deployment.`,
    ],
    enterprise: [
      "Intégrer SOC/IAM dans la conception.",
      "Prévoir rollback et communication utilisateurs.",
    ],
  };
}

export function getAdvancedLessonContent(lessonSlug: string): LessonContent | null {
  const mod = allAdvancedModules.find((m) => m.slug === lessonSlug);
  if (!mod) return null;

  const theory = MODULE_THEORY[lessonSlug] ?? defaultTheory(mod.title, mod.trackSlug);

  return {
    objectives: [
      `Maîtriser ${mod.title} en environnement production.`,
      `Configurer et valider ${mod.title} sur un groupe pilote.`,
      `Diagnostiquer les échecs courants liés à ${mod.title}.`,
      `Préparer le quiz de ${mod.quizCount} questions et l'examen blanc du parcours.`,
    ],
    prerequisites: [
      "Parcours prérequis complété (Jamf 200, Apple IT Pro ou Intune base selon le track).",
      "Accès admin MDM ou environnement lab/sandbox.",
      mod.labSlug ? `Lab associé recommandé : ${mod.labSlug}` : "Environnement pilote documenté.",
    ],
    theory: [
      { title: "Vue d'ensemble", body: theory.overview },
      { title: "Concepts essentiels", body: theory.concepts },
      { title: "Contexte entreprise", body: theory.enterprise },
    ],
    steps: [
      { title: "Préparer", description: `Vérifiez prérequis et accès pour ${mod.title}.` },
      { title: "Configurer", description: `Appliquez la configuration ${mod.title} en mode pilote.` },
      { title: "Valider", description: "Checklist validation + logs MDM + résultat attendu." },
      { title: "Documenter", description: "Runbook interne et plan rollback." },
      { title: "Quiz & lab", description: `Passez quiz-${mod.slug} et ${mod.labSlug ?? "exercice pratique"}.` },
    ],
    screenshots: [],
    bestPractices: [
      "Toujours tester en sandbox ou simulateur avant production.",
      "Archiver tokens, certificats et exports API de façon sécurisée.",
      "Aligner avec équipes sécurité et conformité.",
    ],
    troubleshooting: [
      {
        problem: "Policy ou configuration non appliquée",
        solution: "Vérifier scope, check-in MDM, conflits de profils et logs serveur.",
      },
      {
        problem: "Échec API ou webhook",
        solution: "Valider token OAuth, URL HTTPS, authentification webhook et rate limits.",
      },
    ],
    finalQuizSlug: mod.quizSlug,
  };
}

export function isAdvancedLesson(slug: string): boolean {
  return allAdvancedModules.some((m) => m.slug === slug);
}
