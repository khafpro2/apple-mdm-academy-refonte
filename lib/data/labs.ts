import type { Lab } from "@/lib/types";

export const labs: Lab[] = [
  {
    slug: "inscrire-mac-jamf",
    title: "Inscrire un Mac dans Jamf Pro",
    trackSlug: "jamf-100",
    objective: "Enrôler un Mac via Quick Add ou DEP et vérifier l'inventaire dans Jamf Pro.",
    prerequisites: ["Accès Jamf Pro admin", "Mac de test macOS 14+", "Certificat Quick Add ou token DEP"],
    steps: [
      "Générer un fichier Quick Add ou configurer le token DEP dans Jamf Pro",
      "Lancer l'enrollment sur le Mac de test",
      "Vérifier l'apparition dans l'inventaire Jamf",
      "Assigner une policy de base (nom, timezone, restrictions)",
      "Valider la réception des commandes MDM",
    ],
    duration: "45 min",
    difficulty: "Débutant",
  },
  {
    slug: "profil-wifi-securise",
    title: "Créer un profil Wi‑Fi sécurisé",
    trackSlug: "apple-it-professional",
    objective: "Déployer un profil Wi‑Fi WPA2-Enterprise avec certificat client via MDM.",
    prerequisites: ["Serveur RADIUS configuré", "Certificat CA d'entreprise", "Console MDM (Jamf ou Intune)"],
    steps: [
      "Créer le payload Wi‑Fi avec SSID et sécurité Enterprise",
      "Associer le certificat client et la CA",
      "Tester le profil sur un appareil supervisé",
      "Déployer via Smart Group ou groupe d'appareils",
      "Valider la connexion automatique",
    ],
    duration: "30 min",
    difficulty: "Intermédiaire",
  },
  {
    slug: "deployer-chrome-macos",
    title: "Déployer Google Chrome sur macOS",
    trackSlug: "jamf-170",
    objective: "Packager et déployer Chrome via Jamf Pro avec policies de mise à jour.",
    prerequisites: ["PKG Chrome signé", "Accès admin Jamf Pro", "Groupe de test Mac"],
    steps: [
      "Télécharger le PKG Chrome Enterprise",
      "Uploader dans Jamf Pro",
      "Créer une policy d'installation",
      "Configurer les préférences Chrome via plist",
      "Vérifier l'installation et les mises à jour",
    ],
    duration: "25 min",
    difficulty: "Intermédiaire",
  },
  {
    slug: "filevault-mdm",
    title: "Activer FileVault via MDM",
    trackSlug: "apple-it-professional",
    objective: "Forcer FileVault 2 avec clé escrow vers le serveur MDM sur macOS supervisé.",
    prerequisites: ["Mac supervisé", "Profil FileVault MDM", "Accès admin MDM"],
    steps: [
      "Créer le payload FileVault avec escrow",
      "Définir la politique de chiffrement (institution vs personal)",
      "Déployer le profil sur le groupe cible",
      "Vérifier l'activation FileVault et la clé escrow",
      "Tester la récupération via console MDM",
    ],
    duration: "40 min",
    difficulty: "Avancé",
  },
  {
    slug: "ade-abm",
    title: "Configurer ADE / Apple Business Manager",
    trackSlug: "apple-it-professional",
    objective: "Lier ABM à Jamf Pro ou Intune et assigner des appareils au MDM.",
    prerequisites: ["Compte Apple Business Manager", "Token MDM", "Appareils achetés via canal autorisé"],
    steps: [
      "Télécharger le token MDM depuis Jamf/Intune",
      "Uploader le token dans Apple Business Manager",
      "Assigner les appareils au serveur MDM",
      "Configurer le profil d'enrollment par défaut",
      "Tester l'enrollment zero-touch sur un nouvel appareil",
    ],
    duration: "50 min",
    difficulty: "Avancé",
  },
  {
    slug: "conformite-intune",
    title: "Créer une règle de conformité Intune",
    trackSlug: "intune-mac",
    objective: "Définir une compliance policy iOS/macOS et lier Conditional Access.",
    prerequisites: ["Tenant Intune", "Appareils Apple enrollés", "Azure AD Premium"],
    steps: [
      "Créer une compliance policy (OS min, jailbreak, encryption)",
      "Assigner aux groupes d'appareils Apple",
      "Configurer Conditional Access pour bloquer les non-conformes",
      "Tester avec un appareil conforme et non-conforme",
      "Analyser les rapports de conformité",
    ],
    duration: "35 min",
    difficulty: "Intermédiaire",
  },
  {
    slug: "self-service-jamf",
    title: "Configurer Jamf Self Service",
    trackSlug: "jamf-170",
    objective: "Créer un catalogue Self Service avec apps, scripts et policies pour les utilisateurs.",
    prerequisites: ["Jamf Pro admin", "Apps PKG test", "Mac enrollé"],
    steps: [
      "Activer Self Service dans Jamf Pro",
      "Créer des catégories et icônes",
      "Ajouter des policies au catalogue Self Service",
      "Configurer les notifications et branding",
      "Tester l'expérience utilisateur sur un Mac",
    ],
    duration: "40 min",
    difficulty: "Intermédiaire",
  },
  {
    slug: "smart-groups-jamf",
    title: "Créer des Smart Groups avancés",
    trackSlug: "jamf-100",
    objective: "Construire des Smart Groups avec critères multiples et Extension Attributes.",
    prerequisites: ["Jamf Pro admin", "Inventaire Mac populated", "Extension Attribute de test"],
    steps: [
      "Créer un Extension Attribute (script ou inventaire)",
      "Définir les critères du Smart Group (OS, apps, EA)",
      "Combiner critères AND/OR",
      "Vérifier l'appartenance dynamique",
      "Utiliser le Smart Group dans une policy",
    ],
    duration: "30 min",
    difficulty: "Débutant",
  },
];

export function getLab(slug: string) {
  return labs.find((l) => l.slug === slug);
}

export function getLabsByTrack(trackSlug: string) {
  return labs.filter((l) => l.trackSlug === trackSlug);
}
