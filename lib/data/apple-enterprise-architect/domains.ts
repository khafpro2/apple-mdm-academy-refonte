/** Domaines examen Apple Enterprise Architect — 200 questions expert */

export type AeaExamDomain =
  | "architecture"
  | "deployment"
  | "security"
  | "jamf"
  | "intune"
  | "entra"
  | "troubleshooting";

export const AEA_DOMAIN_LABELS: Record<AeaExamDomain, string> = {
  architecture: "Architecture Apple Enterprise",
  deployment: "Déploiement",
  security: "Sécurité Apple",
  jamf: "Jamf Pro",
  intune: "Microsoft Intune Apple",
  entra: "Entra ID & identité",
  troubleshooting: "Dépannage",
};

export const AEA_DOMAIN_COUNTS: Record<AeaExamDomain, number> = {
  architecture: 30,
  deployment: 30,
  security: 30,
  jamf: 25,
  intune: 25,
  entra: 30,
  troubleshooting: 30,
};

export const AEA_EXAM_TOTAL = 200;
export const AEA_EXAM_DURATION_MINUTES = 180;
export const AEA_PASSING_SCORE = 80;
