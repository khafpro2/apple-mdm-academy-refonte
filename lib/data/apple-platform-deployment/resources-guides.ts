import type { AcademyResource } from "@/src/lib/resources";

function guide(
  slug: string,
  title: string,
  description: string,
  module: string,
  courseSlug: string,
  labSlug: string,
  sections: AcademyResource["sections"]
): AcademyResource {
  return {
    slug,
    title,
    description,
    category: "procedure",
    level: "Avancé",
    badge: "Apple",
    module,
    relatedCourseSlug: courseSlug,
    relatedLabSlug: labSlug,
    popular: true,
    sections,
  };
}

/** 7 guides Apple Platform Deployment — français, PDF via export existant */
export const platformDeploymentGuides: AcademyResource[] = [
  guide(
    "apple-deployment-guide",
    "Guide Apple Platform Deployment",
    "Guide complet francophone : architecture déploiement Apple enterprise, ADE, MDM et cycle de vie appareil.",
    "Apple Platform Deployment",
    "apple-it-professional",
    "ade-zero-touch-500",
    [
      {
        title: "Architecture",
        items: [
          "Apple Business Manager comme source vérité inventaire",
          "Serveur MDM (Intune, Jamf) + certificat APNs",
          "Automated Device Enrollment pour supervision zero-touch",
          "Apps & Books pour licences organisation",
        ],
      },
      {
        title: "Cycle de vie",
        items: [
          "Procurement revendeur agréé → ABM",
          "Assignation MDM → profil ADE",
          "Configuration policies → utilisateur productif",
          "Offboarding → wipe → release ABM si revente",
        ],
      },
      {
        title: "Bonnes pratiques",
        items: [
          "Séparer staging et production MDM",
          "Pilot 5–10 % flotte avant rollout",
          "Documenter tokens et dates expiration",
        ],
      },
    ]
  ),
  guide(
    "apple-business-manager-guide",
    "Guide Apple Business Manager",
    "Organisations, emplacements, rôles, domaines, fédération et serveurs MDM — référence ABM enterprise.",
    "Apple Business Manager",
    "apple-it-professional",
    "abm-enterprise-complete",
    [
      {
        title: "Gouvernance",
        items: [
          "D-U-N-S et entité légale",
          "Locations multi-pays",
          "Matrice rôles moindre privilège + MFA",
        ],
      },
      {
        title: "Identité",
        items: [
          "Domaines vérifiés DNS TXT",
          "Fédération Microsoft Entra ID / Google",
          "Managed Apple IDs vs Apple ID perso",
        ],
      },
      {
        title: "MDM & contenu",
        items: [
          "Création serveurs MDM et tokens .p7m",
          "Apps & Books : achat et assignation licences",
          "Inventaire appareils et audit serials",
        ],
      },
    ]
  ),
  guide(
    "apple-security-guide",
    "Guide sécurité Apple enterprise",
    "FileVault, Gatekeeper, XProtect, SIP, Activation Lock et conformité MDM.",
    "Apple Security",
    "apple-fundamentals",
    "filevault",
    [
      {
        title: "Chiffrement",
        items: [
          "FileVault 2 et Secure Enclave",
          "Escrow clé recovery via MDM",
          "Bootstrap Token macOS",
        ],
      },
      {
        title: "Protection apps",
        items: [
          "Gatekeeper et notarisation Apple",
          "Team ID allow list via MDM",
          "System Extensions contrôlées",
        ],
      },
      {
        title: "Conformité",
        items: [
          "Activation Lock organisation ABM",
          "SIP et XProtect (mises à jour silencieuses)",
          "Lien Conditional Access M365",
        ],
      },
    ]
  ),
  guide(
    "platform-sso-guide",
    "Guide Platform SSO macOS",
    "Principes PSSO, Microsoft Entra ID, Okta, Jamf Connect et déploiement enterprise.",
    "Platform SSO",
    "intune-mac",
    "platform-sso",
    [
      {
        title: "Principes",
        items: [
          "Authentification réseau + apps sans re-login",
          "Extension SSO macOS et enrollment MDM",
          "Clés Secure Enclave et registration token",
        ],
      },
      {
        title: "IdP",
        items: [
          "Microsoft Entra ID — configuration PSSO Intune",
          "Okta — device trust et policies",
          "Jamf Connect comme couche identité macOS",
        ],
      },
      {
        title: "Déploiement",
        items: [
          "Profil Platform SSO + certificats",
          "Tests pilote comptes hybrides",
          "Dépannage keychain et MFA",
        ],
      },
    ]
  ),
  guide(
    "ddm-guide",
    "Guide Declarative Device Management",
    "Architecture DDM, declarations, status reports, Intune et Jamf.",
    "Declarative Device Management",
    "apple-enterprise-expert",
    "declarative-device-management",
    [
      {
        title: "Architecture",
        items: [
          "Declarations vs profiles impératifs",
          "Status reports et channel MDM",
          "OS minimum macOS 13+ / iOS 16+",
        ],
      },
      {
        title: "Intune + Jamf",
        items: [
          "Settings Catalog et DDM payloads Intune",
          "Jamf declarative management",
          "Migration progressive imperative → declarative",
        ],
      },
      {
        title: "Cas d'usage",
        items: [
          "Software Update enforcement",
          "Passcode et restrictions déclaratives",
          "Monitoring conformité via status reports",
        ],
      },
    ]
  ),
  guide(
    "intune-apple-guide",
    "Guide Intune pour Apple",
    "ADE, compliance, configuration profiles, Platform SSO et Microsoft Defender macOS.",
    "Intune Apple",
    "intune-mac",
    "abm-intune",
    [
      {
        title: "Enrollment",
        items: [
          "Token ABM et profils ADE",
          "User vs Device enrollment",
          "Company Portal macOS",
        ],
      },
      {
        title: "Conformité",
        items: [
          "Compliance policies FileVault, OS min",
          "Conditional Access Entra",
          "Defender for Endpoint macOS",
        ],
      },
      {
        title: "Profiles",
        items: [
          "Settings catalog macOS",
          "Platform SSO device configuration",
          "Wi-Fi EAP-TLS et certs SCEP",
        ],
      },
    ]
  ),
  guide(
    "jamf-guide",
    "Guide Jamf Pro enterprise",
    "Smart Groups, policies, scripts, packages et Patch Management.",
    "Jamf Pro",
    "jamf-100",
    "jamf-smart-groups",
    [
      {
        title: "Fondamentaux",
        items: [
          "Smart Groups critères dynamiques",
          "Configuration Profiles et scope",
          "Policies récurrentes et Self Service",
        ],
      },
      {
        title: "Automatisation",
        items: [
          "Scripts Bash et Extension Attributes",
          "Packages .pkg deployment",
          "API REST et webhooks",
        ],
      },
      {
        title: "Patch Management",
        items: [
          "Software Title definitions",
          "Patch policies et deadlines",
          "Reporting compliance versions",
        ],
      },
    ]
  ),
];
