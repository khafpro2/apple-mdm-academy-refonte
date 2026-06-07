export type CourseEnrichedContent = {
  objectives: string[];
  prerequisites: string[];
  architecture: { title: string; paragraphs: string[] }[];
  procedure: { title: string; steps: string[] }[];
  commonErrors: { problem: string; solution: string }[];
  bestPractices: string[];
  summary: string[];
};

const ENRICHED: Record<string, CourseEnrichedContent> = {
  "apple-it-professional": {
    objectives: [
      "Comprendre le rôle d'Apple Business Manager dans la chaîne MDM enterprise",
      "Configurer APNs et les certificats push pour la communication MDM",
      "Déployer Managed Apple IDs et séparer identité personnelle et professionnelle",
      "Activer FileVault et l'escrow des clés de récupération en contexte MDM",
    ],
    prerequisites: [
      "Compte administrateur Apple Business Manager avec rôle Device Manager",
      "Accès au portail MDM (Intune ou Jamf) et aux certificats push",
      "Parc d'appareils pilotes Mac, iPhone ou iPad pour validation",
    ],
    architecture: [
      {
        title: "Chaîne de confiance Apple MDM",
        paragraphs: [
          "Apple Business Manager centralise l'inventaire des appareils, les achats d'applications et l'assignation aux serveurs MDM.",
          "Le serveur MDM s'authentifie via un certificat APNs pour envoyer des commandes push aux appareils.",
          "Les profils de configuration et payloads définissent la posture de sécurité : chiffrement, comptes, restrictions.",
        ],
      },
      {
        title: "Identité et sécurité",
        paragraphs: [
          "Les Managed Apple IDs permettent une identité Apple contrôlée par l'organisation, distincte du compte personnel iCloud.",
          "FileVault chiffre le volume de démarrage macOS ; la clé de récupération peut être escrowée via le MDM pour support IT.",
        ],
      },
    ],
    procedure: [
      {
        title: "Mise en place ABM → MDM",
        steps: [
          "Créer ou vérifier l'organisation ABM et les rôles administrateurs",
          "Ajouter le serveur MDM et télécharger le token d'enrollment",
          "Synchroniser les appareils et assigner le profil d'enrollment automatique",
          "Valider sur un appareil pilote effacé ou neuf",
        ],
      },
      {
        title: "APNs et push MDM",
        steps: [
          "Créer ou renouveler le certificat APNs avec le même Apple ID propriétaire",
          "Importer le certificat dans le portail MDM",
          "Tester une commande simple (verrouillage, inventaire) sur un appareil géré",
        ],
      },
    ],
    commonErrors: [
      {
        problem: "Les appareils n'apparaissent pas dans le MDM après assignation ABM",
        solution: "Vérifiez le serveur MDM assigné dans ABM, l'expiration du token ADE et forcez une synchronisation.",
      },
      {
        problem: "Les commandes MDM ne parviennent pas aux appareils",
        solution: "Renouvelez le certificat APNs sans changer de compte Apple propriétaire et contrôlez la connectivité réseau.",
      },
      {
        problem: "FileVault activé sans clé de récupération escrowée",
        solution: "Déployez le profil FileVault avec escrow via le MDM avant l'activation sur les Mac de production.",
      },
    ],
    bestPractices: [
      "Documenter le compte Apple propriétaire de chaque certificat (APNs, MDM)",
      "Utiliser des appareils pilotes avant déploiement massif",
      "Renouveler les tokens et certificats 30 jours avant expiration",
      "Séparer les environnements test et production dans ABM quand possible",
    ],
    summary: [
      "Apple IT Professional repose sur ABM comme source de vérité des appareils, APNs pour le push MDM, Managed Apple IDs pour l'identité, et FileVault pour le chiffrement macOS.",
      "Chaque maillon doit rester cohérent : un renouvellement mal fait peut bloquer les nouveaux enrollments sans impacter les appareils déjà gérés.",
      "Les vidéos illustrées complètent ce parcours ; le contenu textuel, les labs et les quiz permettent d'apprendre dès maintenant.",
    ],
  },
  "intune-mac": {
    objectives: [
      "Relier Apple Business Manager à Microsoft Intune pour l'enrollment automatique",
      "Comprendre ADE (Automated Device Enrollment) sur iPhone, iPad et Mac",
      "Configurer Platform SSO pour une authentification moderne sur macOS",
      "Déployer profils, conformité et apps sans attendre la vidéo finale",
    ],
    prerequisites: [
      "Tenant Microsoft Entra ID et licence Intune",
      "Accès administrateur ABM et Intune",
      "Certificat APNs valide dans Intune",
    ],
    architecture: [
      {
        title: "Intune + Apple",
        paragraphs: [
          "Intune consomme les tokens ABM/ADE pour enrôler les appareils en mode supervisé ou BYOD selon le profil.",
          "Les profils de configuration Apple transitent par le canal MDM d'Intune avec les mêmes payloads que Jamf ou un MDM natif.",
          "Platform SSO étend Entra ID à macOS via une extension d'authentification Apple.",
        ],
      },
    ],
    procedure: [
      {
        title: "Enrollment ABM + Intune",
        steps: [
          "Connecter ABM dans Intune (Devices > Apple > Enrollment Program Tokens)",
          "Créer les profils d'enrollment ADE par type d'appareil",
          "Assigner les profils aux groupes d'appareils ABM",
          "Valider l'enrollment sur un appareil pilote",
        ],
      },
      {
        title: "Platform SSO",
        steps: [
          "Préparer l'application Entra ID et l'extension Platform SSO",
          "Déployer le profil SSO via Intune sur macOS 13+",
          "Tester la connexion sans mot de passe sur une app compatible",
        ],
      },
    ],
    commonErrors: [
      {
        problem: "Token ADE expiré ou non synchronisé",
        solution: "Renouvelez le token dans ABM, re-téléchargez-le dans Intune et attendez la synchronisation (jusqu'à 24 h).",
      },
      {
        problem: "Platform SSO ne s'active pas",
        solution: "Vérifiez la version macOS, l'assignation du profil et les journaux Entra ID côté extension.",
      },
    ],
    bestPractices: [
      "Un profil d'enrollment par scénario (Mac employé, iPhone partagé, BYOD)",
      "Tester ADE sur appareil effacé pour reproduire l'expérience utilisateur réelle",
      "Documenter les groupes Dynamiques Intune liés aux appareils Apple",
    ],
    summary: [
      "Intune pour Mac s'appuie sur ABM pour l'inventaire, ADE pour l'enrollment zero-touch, et des profils Apple standard pour la configuration.",
      "Platform SSO modernise l'authentification macOS en s'intégrant à Entra ID.",
      "Le parcours textuel + labs + quiz couvre l'essentiel avant publication des vidéos MP4.",
    ],
  },
  "jamf-100": {
    objectives: [
      "Naviguer dans Jamf Pro et comprendre inventaire, Smart Groups et policies",
      "Relier l'enrollment Apple à Jamf via ABM",
      "Déployer des Configuration Profiles et policies de base",
      "Préparer la certification Jamf Certified Associate",
    ],
    prerequisites: [
      "Instance Jamf Pro (cloud ou on-premise)",
      "Accès ABM et certificat APNs configuré dans Jamf",
      "Mac ou iOS de test pour validation des policies",
    ],
    architecture: [
      {
        title: "Composants Jamf Pro",
        paragraphs: [
          "Jamf Pro centralise l'inventaire, les Smart Groups (critères dynamiques), les Configuration Profiles et les policies.",
          "Le Jamf Pro Server communique avec les appareils via APNs ; le MDM push déclenche check-in et exécution des commandes.",
          "Les policies combinent scope (Smart Groups), scripts et profils pour automatiser le déploiement.",
        ],
      },
    ],
    procedure: [
      {
        title: "Premiers pas Jamf Pro",
        steps: [
          "Explorer Computers & Devices et l'inventaire",
          "Créer une Smart Group sur critère OS ou modèle",
          "Associer un Configuration Profile à la Smart Group",
          "Déclencher une policy et vérifier l'application sur un Mac pilote",
        ],
      },
    ],
    commonErrors: [
      {
        problem: "Policy non appliquée sur l'appareil cible",
        solution: "Vérifiez le scope Smart Group, la priorité de la policy et forcez un recon Jamf.",
      },
      {
        problem: "Appareil absent de l'inventaire Jamf",
        solution: "Contrôlez l'assignation MDM dans ABM et le profil d'enrollment Jamf.",
      },
    ],
    bestPractices: [
      "Nommer les Smart Groups et policies avec une convention claire (site, rôle, OS)",
      "Tester sur un groupe pilote avant déploiement global",
      "Utiliser Self Service pour les actions utilisateur non bloquantes",
    ],
    summary: [
      "Jamf 100 pose les fondations : inventaire fiable, groupes dynamiques, profils et policies cohérents.",
      "La vidéo Jamf Pro Fundamentals complétera la démonstration visuelle ; le cours textuel et le lab jamf-discovery suffisent pour démarrer.",
    ],
  },
};

export function getCourseEnrichedContent(courseSlug: string): CourseEnrichedContent | undefined {
  return ENRICHED[courseSlug];
}
