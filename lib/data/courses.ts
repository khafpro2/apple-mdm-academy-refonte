import type { Course } from "@/lib/types";
import { proModules } from "@/lib/data/pro-modules/index";
import { advancedCourses } from "@/lib/data/advanced-tracks/courses";
import { withCourseCompatibility } from "@/lib/data/course-compatibility";

export const courses: Course[] = [
  {
    slug: "apple-fundamentals",
    trackSlug: "apple-fundamentals",
    title: "Apple Fundamentals",
    description:
      "Niveau 1 — comprendre l’écosystème Apple en entreprise : macOS, iOS, iPadOS, Apple Silicon, comptes et introduction au MDM.",
    duration: "12 h",
    objectives: [
      "Différencier macOS, iOS et iPadOS en contexte professionnel",
      "Expliquer Apple Silicon, Apple Account et Managed Apple Account",
      "Situer le rôle du MDM dans le cycle de vie des appareils",
    ],
    modules: [
      {
        title: "Écosystème Apple",
        lessons: [
          { slug: "historique-ecosysteme", title: "Historique et positionnement Apple", duration: "25 min" },
          { slug: "macos-ios-ipados", title: "macOS, iOS et iPadOS — différences réelles", duration: "35 min" },
          { slug: "apple-silicon", title: "Apple Silicon et performances", duration: "20 min" },
          { slug: "materiel-entreprise", title: "Matériel Apple en entreprise", duration: "25 min" },
        ],
      },
      {
        title: "Architecture des plateformes",
        lessons: [
          { slug: "architecture-macos", title: "Architecture générale de macOS", duration: "30 min" },
          { slug: "architecture-ios", title: "Architecture générale d’iOS", duration: "30 min" },
          { slug: "architecture-ipados", title: "Architecture générale d’iPadOS", duration: "30 min" },
        ],
      },
      {
        title: "Identité et sécurité de base",
        lessons: [
          { slug: "apple-account-managed", title: "Apple Account et Managed Apple Account", duration: "30 min" },
          { slug: "filevault-chiffrement", title: "FileVault et chiffrement", duration: "35 min" },
          { slug: "touch-id-face-id", title: "Touch ID, Face ID et Secure Enclave", duration: "25 min" },
          { slug: "gatekeeper-notarisation", title: "Gatekeeper et notarisation", duration: "30 min" },
          { slug: "perso-vs-entreprise", title: "Appareil personnel et appareil d’entreprise", duration: "25 min" },
        ],
      },
      {
        title: "Services et introduction MDM",
        lessons: [
          { slug: "wifi-ethernet", title: "Wi‑Fi et Ethernet sur Apple", duration: "25 min" },
          { slug: "services-entreprise", title: "Services Apple en entreprise", duration: "35 min" },
          { slug: "intro-mdm", title: "Introduction au MDM Apple", duration: "30 min" },
        ],
      },
    ],
  },
  {
    slug: "apple-device-support",
    trackSlug: "apple-device-support",
    title: "Apple Device Support",
    description:
      "Niveau 2 — support et dépannage macOS, iOS et iPadOS : comptes, stockage, RecoveryOS, diagnostics et incidents MDM.",
    duration: "24 h",
    objectives: [
      "Diagnostiquer et résoudre les problèmes macOS, iOS et iPadOS",
      "Gérer utilisateurs, permissions, sauvegardes et restaurations",
      "Traiter les incidents MDM courants en production",
    ],
    modules: [
      {
        title: "Support macOS",
        lessons: [
          { slug: "install-config-macos", title: "Installation et configuration de macOS", duration: "40 min" },
          { slug: "utilisateurs-groupes", title: "Utilisateurs, groupes et permissions", duration: "35 min" },
          { slug: "stockage-apps-processus", title: "Stockage, applications et processus", duration: "35 min" },
          { slug: "diagnostic-systeme", title: "Outils de diagnostic système", duration: "40 min" },
          { slug: "console-logs", title: "Console, journaux et Terminal", duration: "40 min" },
          { slug: "mode-recovery", title: "RecoveryOS, démarrage sécurisé et réinstallation", duration: "45 min" },
          { slug: "filevault-support", title: "FileVault en support", duration: "30 min" },
        ],
      },
      {
        title: "Support iOS",
        lessons: [
          { slug: "ios-activation-setup", title: "Activation et configuration initiale iOS", duration: "30 min" },
          { slug: "ios-securite-confidentialite", title: "Sécurité et confidentialité iOS", duration: "35 min" },
          { slug: "ios-connectivite-esim", title: "Connectivité, eSIM, VPN et certificats", duration: "35 min" },
          { slug: "ios-depannage-restore", title: "Dépannage, sauvegarde et restauration iOS", duration: "40 min" },
          { slug: "ios-managed-lost-mode", title: "Managed Lost Mode et appareils d’entreprise", duration: "30 min" },
        ],
      },
      {
        title: "Support iPadOS",
        lessons: [
          { slug: "ipados-vs-ios", title: "Différences iOS / iPadOS pour le support", duration: "30 min" },
          { slug: "ipados-multitache-accessoires", title: "Multitâche, clavier, Apple Pencil", duration: "35 min" },
          { slug: "ipados-depannage", title: "Dépannage et restauration iPadOS", duration: "35 min" },
        ],
      },
      {
        title: "Comptes, identité et MDM",
        lessons: [
          { slug: "comptes-locaux-managed", title: "Comptes locaux vs Managed Apple Account", duration: "30 min" },
          { slug: "sso-kerberos", title: "SSO et Kerberos", duration: "40 min" },
          { slug: "profils-utilisateur", title: "Profils utilisateur et données", duration: "25 min" },
          { slug: "incidents-mdm-courants", title: "Incidents MDM courants", duration: "40 min" },
        ],
      },
    ],
  },
  {
    slug: "apple-it-professional",
    trackSlug: "apple-it-professional",
    title: "Apple IT Professional",
    description:
      "Niveau 3 — déploiement Apple : Apple Business Manager, enrôlements, Configurator, profils, DDM et cycle de vie.",
    duration: "30 h",
    objectives: [
      "Configurer Apple Business Manager et Managed Apple Accounts",
      "Choisir et déployer ADE, Device Enrollment ou User Enrollment",
      "Administrer profils, certificats, mises à jour et Declarative Device Management",
    ],
    modules: [
      {
        title: "Apple Business Manager",
        lessons: [
          { slug: "abm-creation-roles", title: "Apple Business Manager — rôles et permissions", duration: "35 min" },
          { slug: "managed-apple-accounts", title: "Managed Apple Accounts", duration: "35 min" },
          { slug: "apps-books", title: "Apps et livres", duration: "40 min" },
        ],
      },
      {
        title: "Enrôlement et supervision",
        lessons: [
          { slug: "ade-enrollment", title: "Automated Device Enrollment", duration: "45 min" },
          { slug: "dep-enrollment", title: "Automated Device Enrollment — historique DEP", duration: "20 min" },
          { slug: "device-enrollment", title: "Device Enrollment", duration: "35 min" },
          { slug: "user-enrollment", title: "User Enrollment", duration: "35 min" },
          { slug: "supervision-configurator", title: "Supervision et Apple Configurator", duration: "40 min" },
        ],
      },
      {
        title: "MDM, profils et identité",
        lessons: [
          { slug: "serveurs-mdm", title: "Serveurs MDM et APNs", duration: "40 min" },
          { slug: "apns-certificats", title: "APNs et certificats push", duration: "40 min" },
          { slug: "profils-configuration", title: "Profils de configuration et restrictions", duration: "50 min" },
          { slug: "commandes-mdm", title: "Commandes MDM et payloads", duration: "45 min" },
          { slug: "wifi-vpn-certs", title: "Wi‑Fi, VPN et certificats", duration: "40 min" },
          { slug: "sso-platform-sso", title: "SSO et Platform SSO", duration: "40 min" },
          { slug: "declarative-device-management", title: "Declarative Device Management", duration: "45 min" },
        ],
      },
      {
        title: "Mises à jour et cycle de vie",
        lessons: [
          { slug: "os-updates-mdm", title: "Mises à jour macOS, iOS et iPadOS", duration: "40 min" },
          { slug: "wipe-reassign", title: "Effacement et réaffectation", duration: "30 min" },
          { slug: "shared-ipad-deploy", title: "Shared iPad et scénarios iPadOS", duration: "40 min" },
        ],
      },
    ],
  },
  {
    slug: "jamf-100",
    trackSlug: "jamf-100",
    title: "Jamf 100 — Fondamentaux",
    description: "Préparation indépendante aux fondamentaux Jamf : inventaire, groups et policies essentielles. Ne remplace pas les formations officielles Jamf.",
    duration: "16 h",
    objectives: [
      "Naviguer et administrer Jamf Pro",
      "Créer des Smart Groups et policies",
      "Déployer des Configuration Profiles",
    ],
    modules: [
      {
        title: "Jamf Pro fondamentaux",
        lessons: [
          { slug: "architecture-jamf", title: "Architecture et composants Jamf", duration: "30 min" },
          { slug: "inventaire-recherche", title: "Inventaire et recherche avancée", duration: "35 min" },
          { slug: "smart-groups", title: "Smart Groups et critères", duration: "40 min" },
        ],
      },
      {
        title: "Policies & profils",
        lessons: [
          { slug: "config-profiles-jamf", title: "Configuration Profiles Jamf", duration: "45 min" },
          { slug: "policies-base", title: "Policies de base", duration: "40 min" },
          { slug: "scope-deploiement", title: "Scope et déploiement", duration: "35 min" },
        ],
      },
    ],
  },
  {
    slug: "jamf-fundamentals",
    trackSlug: "jamf-100",
    title: "Jamf Fundamentals Premium",
    description:
      "Parcours premium francophone — 15 modules Jamf Pro : interface, inventaire, groups, policies, profils, Self Service, packages, scripts, patch, reporting et troubleshooting.",
    duration: "24 h",
    objectives: [
      "Maîtriser les 15 piliers Jamf Pro 11.16 en contexte enterprise",
      "Préparer certification Jamf 100 et Jamf 200",
      "Déployer avec labs, quiz et guides PDF premium",
    ],
    modules: [
      {
        title: "Fondations Jamf Pro",
        lessons: [
          { slug: "jf-intro-jamf-pro", title: "Introduction à Jamf Pro", duration: "35 min" },
          { slug: "jf-interface-jamf", title: "Interface Jamf", duration: "30 min" },
          { slug: "jf-inventory", title: "Inventory", duration: "40 min" },
          { slug: "jf-computers", title: "Computers", duration: "35 min" },
          { slug: "jf-mobile-devices", title: "Mobile Devices", duration: "40 min" },
        ],
      },
      {
        title: "Ciblage et déploiement",
        lessons: [
          { slug: "jf-smart-groups", title: "Smart Groups", duration: "45 min" },
          { slug: "jf-static-groups", title: "Static Groups", duration: "30 min" },
          { slug: "jf-policies", title: "Policies", duration: "45 min" },
          { slug: "jf-configuration-profiles", title: "Configuration Profiles", duration: "45 min" },
        ],
      },
      {
        title: "Autonomie et automation",
        lessons: [
          { slug: "jf-self-service", title: "Self Service", duration: "35 min" },
          { slug: "jf-packages", title: "Packages", duration: "40 min" },
          { slug: "jf-scripts", title: "Scripts", duration: "45 min" },
        ],
      },
      {
        title: "Opérations et dépannage",
        lessons: [
          { slug: "jf-patch-management", title: "Patch Management", duration: "45 min" },
          { slug: "jf-reporting", title: "Reporting", duration: "35 min" },
          { slug: "jf-troubleshooting", title: "Troubleshooting", duration: "40 min" },
        ],
      },
    ],
  },
  {
    slug: "jamf-170",
    trackSlug: "jamf-170",
    title: "Jamf 170 — Administration",
    description: "Administration avancée Jamf Pro pour les environnements professionnels.",
    duration: "20 h",
    objectives: [
      "Utiliser les Extension Attributes et scripts",
      "Configurer Self Service pour les utilisateurs",
      "Automatiser les workflows Jamf",
    ],
    modules: [
      {
        title: "Administration avancée",
        lessons: [
          { slug: "extension-attributes", title: "Extension Attributes", duration: "45 min" },
          { slug: "scripts-policies", title: "Scripts et policies avancées", duration: "50 min" },
          { slug: "self-service", title: "Self Service et catalogue apps", duration: "40 min" },
        ],
      },
      {
        title: "Workflows",
        lessons: [
          { slug: "workflows-enrollment", title: "Workflows d'enrollment", duration: "45 min" },
          { slug: "patch-management-intro", title: "Introduction au Patch Management", duration: "40 min" },
        ],
      },
    ],
  },
  {
    slug: "jamf-200",
    trackSlug: "jamf-200",
    title: "Jamf 200 — Expert",
    description: "Expertise Jamf Pro : API, scale et intégrations enterprise.",
    duration: "24 h",
    objectives: [
      "Maîtriser l'API Jamf Pro",
      "Implémenter le Patch Management complet",
      "Architecturer Jamf à grande échelle",
    ],
    modules: [
      {
        title: "Expertise technique",
        lessons: [
          { slug: "api-jamf", title: "API Jamf Pro REST", duration: "55 min" },
          { slug: "patch-management", title: "Patch Management avancé", duration: "50 min" },
          { slug: "integrations-tierces", title: "Intégrations tierces (IdP, SIEM)", duration: "45 min" },
        ],
      },
    ],
  },
  {
    slug: "intune-mac",
    trackSlug: "intune-mac",
    title: "Microsoft Intune pour Mac",
    description: "Gestion complète des appareils Apple via Microsoft Intune.",
    duration: "18 h",
    objectives: [
      "Enrôler des appareils Apple via ABM + Intune",
      "Configurer conformité et Conditional Access",
      "Déployer apps et scripts macOS",
    ],
    modules: [
      {
        title: "Fondamentaux Intune",
        lessons: [
          { slug: "intune-introduction", title: "Introduction à Microsoft Intune", duration: "35 min", points: 35 },
        ],
      },
      {
        title: "Enrollment Apple",
        lessons: [
          { slug: "abm-intune", title: "Lier ABM à Intune", duration: "40 min", points: 40 },
          {
            slug: "managed-apple-ids",
            title: "Managed Apple IDs (Identifiants Apple gérés)",
            duration: "90 min",
            points: 90,
          },
          {
            slug: "platform-sso",
            title: "Platform SSO (Single Sign-On moderne Apple)",
            duration: "120 min",
            points: 120,
          },
          {
            slug: "vpp-apps-books",
            title: "Applications VPP (Apps & Books) dans Apple Business Manager",
            duration: "60 min",
            points: 60,
          },
          {
            slug: "apns-certificates",
            title: "Certificats APNs : création, renouvellement et dépannage",
            duration: "60 min",
            points: 60,
          },
          { slug: "ade-iphone", title: "Déploiement automatique des iPhone avec ADE", duration: "45 min", points: 45 },
          {
            slug: "ade-mac",
            title: "Déploiement automatique des Mac avec Apple Business Manager et Intune",
            duration: "50 min",
            points: 50,
          },
          { slug: "supervised-mode", title: "Mode supervisé iOS/macOS", duration: "35 min" },
          { slug: "enrollment-token", title: "Enrollment Program Token", duration: "30 min" },
        ],
      },
      {
        title: "Conformité & sécurité",
        lessons: [
          {
            slug: "ios-configuration-profiles",
            title: "Profils de configuration iPhone et iPad (iOS/iPadOS)",
            duration: "75 min",
            points: 75,
          },
          {
            slug: "macos-configuration-profiles",
            title: "Profils de configuration macOS",
            duration: "90 min",
            points: 90,
          },
          {
            slug: "macos-security",
            title: "Sécurité macOS : FileVault, Gatekeeper, XProtect, SIP et Activation Lock",
            duration: "120 min",
            points: 120,
          },
          { slug: "compliance-policies", title: "Compliance policies Apple", duration: "45 min" },
          { slug: "conditional-access", title: "Conditional Access", duration: "40 min" },
          { slug: "app-protection", title: "App Protection Policies", duration: "35 min" },
          { slug: "intune-defender-macos", title: "Microsoft Defender pour macOS", duration: "50 min", points: 50 },
          { slug: "intune-troubleshooting", title: "Dépannage Intune Apple", duration: "45 min", points: 45 },
        ],
      },
    ],
  },
  {
    slug: "azure-for-apple-admins",
    trackSlug: "azure-for-apple-admins",
    title: "Azure essentiel pour Apple Administrators",
    description:
      "Les compétences Microsoft Entra ID et sécurité cloud nécessaires pour gérer des flottes Apple avec ABM, Intune, Platform SSO et Defender.",
    duration: "10 h",
    objectives: [
      "Comprendre Microsoft Entra ID sans devenir généraliste Azure",
      "Relier utilisateurs, groupes, licences et rôles aux workflows Apple",
      "Déployer MFA, Conditional Access, Platform SSO et Defender pour macOS",
      "Utiliser Entra ID comme socle identité pour ABM et Intune",
    ],
    modules: [
      {
        title: "Module 1 — Introduction à Microsoft Entra ID",
        lessons: [
          { slug: "azure-entra-id-introduction", title: "Introduction à Microsoft Entra ID", duration: "45 min", points: 45 },
        ],
      },
      {
        title: "Module 2 — Authentification moderne",
        lessons: [
          { slug: "azure-modern-authentication", title: "SSO, MFA, Passwordless et Passkeys", duration: "50 min", points: 50 },
        ],
      },
      {
        title: "Module 3 — Groupes Entra ID",
        lessons: [
          { slug: "azure-entra-groups", title: "Groupes statiques, dynamiques et affectations Intune", duration: "45 min", points: 45 },
        ],
      },
      {
        title: "Module 4 — Apple Business Manager + Entra ID",
        lessons: [
          { slug: "azure-abm-entra-federation", title: "Fédération ABM, Managed Apple IDs et synchronisation", duration: "55 min", points: 55 },
        ],
      },
      {
        title: "Module 5 — Intune + Entra ID",
        lessons: [
          { slug: "azure-intune-entra-enrollment", title: "Groupes, affectations et enrollment macOS", duration: "55 min", points: 55 },
        ],
      },
      {
        title: "Module 6 — Conditional Access",
        lessons: [
          { slug: "azure-conditional-access-macos", title: "Accès conditionnel, conformité et risques", duration: "60 min", points: 60 },
        ],
      },
      {
        title: "Module 7 — Platform SSO",
        lessons: [
          { slug: "azure-platform-sso", title: "Architecture Platform SSO avec Entra ID et macOS", duration: "60 min", points: 60 },
        ],
      },
      {
        title: "Module 8 — Microsoft Defender",
        lessons: [
          { slug: "azure-defender-macos", title: "Onboarding, sécurité et reporting Defender macOS", duration: "55 min", points: 55 },
        ],
      },
    ],
  },
  {
    slug: "parcours-professionnel",
    trackSlug: "parcours-professionnel",
    title: "Parcours Jamf Professionnel",
    description:
      "Modules 11 à 18 : Intune Apple, Jamf Pro, Smart Groups, Policies, Scripts, Patch Management, Jamf Protect et sécurité Apple enterprise.",
    duration: "22 h",
    objectives: [
      "Configurer Intune + Apple Business Manager pour appareils Apple",
      "Administrer Jamf Pro : enrollment, Smart Groups, policies et scripts",
      "Déployer patch management et Jamf Protect en production",
      "Sécuriser les Mac avec FileVault, Gatekeeper et Zero Trust",
    ],
    modules: proModules.map((m) => ({
      title: `Module ${m.number} — ${m.title}`,
      lessons: m.lessons,
    })),
  },
  ...advancedCourses,
];

export function getCourse(slug: string) {
  const course = courses.find((c) => c.slug === slug);
  return course ? withCourseCompatibility(course) : undefined;
}

export function getCoursesByTrack(trackSlug: string) {
  return courses.filter((c) => c.trackSlug === trackSlug).map(withCourseCompatibility);
}

export function getLesson(courseSlug: string, lessonSlug: string) {
  const course = getCourse(courseSlug);
  if (!course) return null;
  for (const mod of course.modules) {
    const lesson = mod.lessons.find((l) => l.slug === lessonSlug);
    if (lesson) return { course, module: mod, lesson };
  }
  return null;
}
