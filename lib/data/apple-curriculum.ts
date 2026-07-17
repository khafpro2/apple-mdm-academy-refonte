/**
 * Cartographie pédagogique Apple — 5 niveaux.
 * Mappe les parcours existants sans créer de doublons inutiles.
 */

export type ApplePedagogyLevelDef = {
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  trackSlug: string;
  focus: string[];
  platforms: ("macOS" | "iOS" | "iPadOS")[];
};

export const applePedagogyLevels: ApplePedagogyLevelDef[] = [
  {
    level: 1,
    title: "Fondamentaux Apple",
    trackSlug: "apple-fundamentals",
    focus: [
      "Écosystème Apple",
      "macOS / iOS / iPadOS",
      "Apple Silicon",
      "Apple Account et Managed Apple Account",
      "Sécurité intégrée",
      "Introduction au MDM",
    ],
    platforms: ["macOS", "iOS", "iPadOS"],
  },
  {
    level: 2,
    title: "Support Apple",
    trackSlug: "apple-device-support",
    focus: [
      "Installation et configuration",
      "Comptes, permissions, stockage",
      "Réseau et diagnostics",
      "FileVault et RecoveryOS",
      "Dépannage macOS, iOS et iPadOS",
      "Incidents MDM courants",
    ],
    platforms: ["macOS", "iOS", "iPadOS"],
  },
  {
    level: 3,
    title: "Déploiement Apple",
    trackSlug: "apple-it-professional",
    focus: [
      "Apple Business Manager",
      "Automated Device Enrollment",
      "Device Enrollment et User Enrollment",
      "Apple Configurator",
      "Profils, certificats, Wi-Fi, VPN, SSO",
      "Declarative Device Management",
    ],
    platforms: ["macOS", "iOS", "iPadOS"],
  },
  {
    level: 4,
    title: "Sécurité Apple",
    trackSlug: "apple-enterprise-expert",
    focus: [
      "Secure Enclave et démarrage sécurisé",
      "Data Protection, Gatekeeper, SIP, TCC",
      "Activation Lock, Recovery Lock, Bootstrap Token",
      "Conformité et durcissement",
      "Correctifs et réponse à incident",
    ],
    platforms: ["macOS", "iOS", "iPadOS"],
  },
  {
    level: 5,
    title: "Administration Apple en entreprise",
    trackSlug: "apple-enterprise-architect",
    focus: [
      "Architecture et choix MDM",
      "Identité et Platform SSO",
      "Shared iPad et BYOD",
      "Cycle de vie, perte/vol, départ utilisateur",
      "Automatisation, audit et reprise d’activité",
    ],
    platforms: ["macOS", "iOS", "iPadOS"],
  },
];

export function getApplePedagogyLevel(trackSlug: string) {
  return applePedagogyLevels.find((l) => l.trackSlug === trackSlug);
}
