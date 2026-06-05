import type { Course } from "@/lib/types";

export const courses: Course[] = [
  {
    slug: "apple-fundamentals",
    trackSlug: "apple-fundamentals",
    title: "Apple Fundamentals",
    description: "Parcours complet pour comprendre l'écosystème Apple en contexte entreprise.",
    duration: "12 h",
    objectives: [
      "Comprendre l'architecture macOS, iOS et iPadOS",
      "Maîtriser les bases de la sécurité Apple",
      "Connaître les services Apple pour l'entreprise",
    ],
    modules: [
      {
        title: "Écosystème Apple",
        lessons: [
          { slug: "historique-ecosysteme", title: "Historique et positionnement Apple", duration: "25 min" },
          { slug: "macos-ios-ipados", title: "macOS vs iOS vs iPadOS", duration: "30 min" },
          { slug: "apple-silicon", title: "Apple Silicon et performances", duration: "20 min" },
        ],
      },
      {
        title: "Sécurité de base",
        lessons: [
          { slug: "filevault-chiffrement", title: "FileVault et chiffrement", duration: "35 min" },
          { slug: "touch-id-face-id", title: "Touch ID, Face ID et Secure Enclave", duration: "25 min" },
          { slug: "gatekeeper-notarisation", title: "Gatekeeper et notarisation", duration: "30 min" },
        ],
      },
      {
        title: "Réseau & services",
        lessons: [
          { slug: "wifi-ethernet", title: "Wi‑Fi et Ethernet sur Apple", duration: "25 min" },
          { slug: "icloud-comptes", title: "iCloud et comptes Apple", duration: "30 min" },
          { slug: "services-entreprise", title: "Services Apple en entreprise", duration: "35 min" },
        ],
      },
    ],
  },
  {
    slug: "apple-device-support",
    trackSlug: "apple-device-support",
    title: "Apple Device Support",
    description: "Formation complète pour la certification Apple Device Support.",
    duration: "24 h",
    objectives: [
      "Diagnostiquer et résoudre les problèmes macOS",
      "Gérer les comptes et l'identité utilisateur",
      "Dépanner les problèmes réseau avancés",
    ],
    modules: [
      {
        title: "Support macOS",
        lessons: [
          { slug: "diagnostic-systeme", title: "Outils de diagnostic système", duration: "40 min" },
          { slug: "console-logs", title: "Console et analyse des logs", duration: "35 min" },
          { slug: "mode-recovery", title: "Mode Recovery et réinstallation", duration: "45 min" },
        ],
      },
      {
        title: "Comptes & identité",
        lessons: [
          { slug: "comptes-locaux-managed", title: "Comptes locaux vs Managed Apple ID", duration: "30 min" },
          { slug: "sso-kerberos", title: "SSO et Kerberos", duration: "40 min" },
          { slug: "profils-utilisateur", title: "Profils utilisateur et données", duration: "25 min" },
        ],
      },
    ],
  },
  {
    slug: "apple-it-professional",
    trackSlug: "apple-it-professional",
    title: "Apple IT Professional",
    description: "Maîtrise le MDM natif Apple et l'architecture de déploiement entreprise.",
    duration: "30 h",
    objectives: [
      "Configurer Apple Business Manager et DEP",
      "Déployer des profils MDM et commandes push",
      "Architecturer la sécurité Apple en entreprise",
    ],
    modules: [
      {
        title: "Apple Business Manager",
        lessons: [
          { slug: "abm-creation-roles", title: "Création ABM et gestion des rôles", duration: "35 min" },
          { slug: "dep-enrollment", title: "Device Enrollment Program", duration: "45 min" },
          { slug: "apps-books", title: "Apps & Books et VPP", duration: "40 min" },
        ],
      },
      {
        title: "MDM natif Apple",
        lessons: [
          { slug: "profils-configuration", title: "Profils de configuration", duration: "50 min" },
          { slug: "commandes-mdm", title: "Commandes MDM et payloads", duration: "45 min" },
          { slug: "apns-certificats", title: "APNs et certificats push", duration: "40 min" },
        ],
      },
    ],
  },
  {
    slug: "jamf-100",
    trackSlug: "jamf-100",
    title: "Jamf 100 — Fondamentaux",
    description: "Première certification Jamf : inventaire, groups et policies essentielles.",
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
        ],
      },
    ],
  },
];

export function getCourse(slug: string) {
  return courses.find((c) => c.slug === slug);
}

export function getCoursesByTrack(trackSlug: string) {
  return courses.filter((c) => c.trackSlug === trackSlug);
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
