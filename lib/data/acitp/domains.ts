/** Domaines examen Apple Certified IT Professional — répartition officielle */

export type AcitpExamDomain =
  | "macos"
  | "abm"
  | "security"
  | "deployment"
  | "network"
  | "productivity"
  | "troubleshooting";

export const ACITP_DOMAIN_LABELS: Record<AcitpExamDomain, string> = {
  macos: "macOS",
  abm: "Apple Business Manager",
  security: "Sécurité",
  deployment: "Déploiement",
  network: "Réseau",
  productivity: "Productivité",
  troubleshooting: "Dépannage",
};

/** Répartition 200 questions */
export const ACITP_DOMAIN_COUNTS: Record<AcitpExamDomain, number> = {
  macos: 40,
  abm: 40,
  security: 30,
  deployment: 30,
  network: 20,
  productivity: 20,
  troubleshooting: 20,
};

export const ACITP_EXAM_TOTAL = 200;
export const ACITP_EXAM_DURATION_MINUTES = 150; // 2h30
export const ACITP_PASSING_SCORE = 80;
