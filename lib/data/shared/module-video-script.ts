type VideoScriptInput = {
  title: string;
  trackSlug: string;
  quizCount: number;
  labSlug: string | null;
  resourceSlug: string;
  vendor?: string;
};

function trackLabel(trackSlug: string, vendor?: string): string {
  if (vendor) return vendor;
  if (trackSlug.startsWith("jamf-300")) return "Jamf 300 Prep";
  if (trackSlug.startsWith("jamf-400")) return "Jamf 400 Prep";
  if (trackSlug === "apple-enterprise-expert") return "Apple Enterprise Expert";
  if (trackSlug === "intune-apple-advanced") return "Intune Apple Advanced";
  if (trackSlug === "kandji-fundamentals") return "Kandji Fundamentals";
  if (trackSlug === "mosyle-fundamentals") return "Mosyle Fundamentals";
  if (trackSlug === "addigy-fundamentals") return "Addigy Fundamentals";
  if (trackSlug === "workspace-one-apple") return "Workspace ONE Apple";
  if (trackSlug === "mdm-comparatif-apple") return "Comparatif MDM Apple";
  return trackSlug;
}

function scenarioForTitle(title: string, trackSlug: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("blueprint") || lower.includes("library"))
    return "Une scale-up de 400 Mac doit standardiser l'onboarding développeurs avec Blueprint Kandji et Library Items réutilisables.";
  if (lower.includes("liftoff") || lower.includes("passport"))
    return "Le premier jour d'un nouvel employé : Mac livré en zero-touch, Liftoff brandé, Passport SSO et apps métier installées automatiquement.";
  if (lower.includes("enrollment") || lower.includes("ade"))
    return "L'IT doit enrôler 150 iPad éducation ou Mac corporate via ABM sans intervention manuelle au setup assistant.";
  if (lower.includes("compliance") || lower.includes("conditional"))
    return "La sécurité exige que seuls les appareils conformes (FileVault, OS à jour) accèdent à M365 ou aux apps SaaS.";
  if (lower.includes("api") || lower.includes("webhook"))
    return "L'équipe automation synchronise l'inventaire MDM vers ServiceNow toutes les 15 minutes via API REST.";
  if (lower.includes("smart group") || lower.includes("policy"))
    return "Un administrateur Jamf cible dynamiquement les Mac sans FileVault avant d'appliquer une restriction réseau.";
  if (lower.includes("comparatif") || lower.includes("matrice"))
    return "Le DSI doit choisir entre Jamf, Intune et Kandji pour 800 Mac — POC 30 jours sur deux finalistes.";
  if (lower.includes("golive") || lower.includes("remote"))
    return "Un MSP intervient à distance sur un Mac client via GoLive pour diagnostiquer un échec de policy.";
  if (trackSlug.startsWith("jamf"))
    return "Une entreprise Apple-first de 2 000 Mac utilise Jamf Pro pour automatiser déploiement, patch et conformité.";
  if (trackSlug === "intune-apple-advanced")
    return "Une organisation Microsoft 365 gère 1 500 Mac via Intune avec Conditional Access et Defender.";
  if (trackSlug === "apple-enterprise-expert")
    return "Un architecte Apple Platform Deployment prépare le rollout DDM et Platform SSO sur flotte internationale.";
  return "Votre équipe IT administre une flotte Apple en entreprise et doit maîtriser ce module en conditions réelles.";
}

/** Script vidéo académie — objectifs, scénario, points clés, lab, quiz, résumé */
export function buildModuleVideoScript(input: VideoScriptInput): string {
  const label = trackLabel(input.trackSlug, input.vendor);
  const scenario = scenarioForTitle(input.title, input.trackSlug);
  const labLine = input.labSlug
    ? `Exercice pratique : ouvrez le lab « ${input.labSlug} » et reproduisez le scénario sur votre environnement pilote.`
    : "Consultez les étapes pratiques de la leçon pour valider sur appareil test.";
  const resourceLine = `Téléchargez la ressource ${input.resourceSlug} pour votre runbook et checklist validation.`;

  return [
    `Parcours ${label} — ${input.title}.`,
    "",
    "Objectifs pédagogiques :",
    `• Comprendre le rôle de « ${input.title} » en production enterprise.`,
    "• Configurer et valider sur un groupe pilote avant généralisation.",
    "• Diagnostiquer les erreurs courantes et documenter le runbook support.",
    "",
    "Scénario entreprise :",
    scenario,
    "",
    "Points clés :",
    "• Toujours tester en sandbox ou pilot group (5–10 appareils) avant déploiement global.",
    "• Vérifier prérequis ABM, APNs, IdP et droits admin avant toute modification.",
    "• Capturer preuves : console MDM, état appareil, logs et checklist signée.",
    "",
    labLine,
    `Quiz module : ${input.quizCount} questions — seuil 75 % pour valider.`,
    resourceLine,
    "",
    "Résumé :",
    `À l'issue de ce module, vous savez implémenter « ${input.title} » avec méthode académie : cadrage, pilote, validation, industrialisation.`,
  ].join("\n");
}
