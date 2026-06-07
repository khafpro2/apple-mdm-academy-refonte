import type { JamfTrainingTopicId } from "@/lib/data/jamf/jamf-training-registry";

export type JamfTrainingDeliverable = {
  frenchSummary: string[];
  heygenScript: string;
  labOutline: string[];
  enterpriseScenario: string;
};

export const JAMF_TRAINING_CONTENT: Record<JamfTrainingTopicId, JamfTrainingDeliverable> = {
  "smart-groups": {
    frenchSummary: [
      "Les Smart Groups Jamf Pro 11.16 mettent à jour dynamiquement l'appartenance des Mac, appareils mobiles et utilisateurs selon l'inventaire.",
      "Ils servent au scope des policies, profils, patch policies et packages — pas au reporting ad hoc (Advanced Search).",
      "Les critères combinent attributs inventaire, Extension Attributes et opérateurs AND/OR avec preview obligatoire avant production.",
      "Cas entreprise : segmenter les Mac finance (FileVault ON, OS ≥ 14) vs labo (exclusion Static Group) pour déploiement progressif.",
    ],
    heygenScript: `Bonjour. Dans cette leçon Apple MDM Academy, nous maîtrisons les Smart Groups Jamf Pro 11.16.

Objectif certification Jamf 100 : créer des groupes dynamiques fiables pour le scope et le déploiement.

Scénario entreprise : vous gérez 800 Mac. Vous devez cibler uniquement les postes macOS Sonoma avec Microsoft Teams absent, pour déployer une policy d'installation silencieuse.

Étape 1 — Computers, Smart Computer Groups, New. Nommez SITE-FIN-SONOMA-NO-TEAMS.
Étape 2 — Critères : Operating System Version ≥ 14, Application Title does not contain Microsoft Teams.
Étape 3 — Preview membership : validez le nombre de Mac avant scope.
Étape 4 — Scope une policy pilote sur ce groupe, exclusions Static Group VIP.

Erreurs fréquentes : critère trop large, Smart Groups circulaires, confusion avec Advanced Search.

Résumé : Smart Groups = ciblage dynamique scoped, preview, critères stables. Passez au lab jamf-smart-groups puis au quiz module 13.`,
    labOutline: [
      "Créer un Smart Computer Group avec critères OS + application",
      "Preview membership et comparer avec Advanced Search",
      "Scope une policy pilote",
      "Tester exclusion Static Group VIP",
    ],
    enterpriseScenario:
      "Parc 800 Mac — déploiement Teams ciblé sur Mac Sonoma sans l'application, hors VIP et labo.",
  },
  policies: {
    frenchSummary: [
      "Les policies Jamf Pro automatisent scripts, packages, maintenance et actions compte via triggers et payloads.",
      "Triggers clés : Enrollment Complete, Recurring Check-in, Login, Startup, Self Service — chacun avec une fréquence d'exécution.",
      "Le scope lie Smart/Static Groups ; retirer un Mac du scope n'annule pas les réglages déjà appliqués (doc 11.16).",
      "Cas entreprise : policy Recurring Check-in pour maintenance hebdomadaire, scope groupe production, logs Policy vérifiés.",
    ],
    heygenScript: `Bonjour. Les policies sont le moteur d'automatisation Jamf Pro 11.16.

Scénario : déployer un script de conformité FileVault sur les Mac finance au prochain check-in.

Computers → Policies → New. Trigger Recurring Check-in, frequency Once per week per computer.
Payload Scripts : script idempotent avec logs dans /var/log/jamf-compliance.log.
Scope : Smart Group FIN-MACOS. Exclusions : Static Group LAB.

Sur le Mac pilote : sudo jamf policy. Vérifiez Policy Logs Completed.

Self Service tab : optionnel pour actions utilisateur. User Interaction : deferrals si reboot requis.

Pièges : policy Enrollment Complete trop lourde, frequency agressive, oubli Restart Options après package.

Lab jamf-policies. Quiz module 14. Préparation Jamf 100.`,
    labOutline: [
      "Créer policy avec trigger Recurring Check-in",
      "Ajouter payload Script ou Package",
      "Configurer scope et exclusions",
      "Forcer exécution et analyser Policy Logs",
    ],
    enterpriseScenario:
      "Automatisation conformité FileVault hebdomadaire sur parc finance avec deferrals utilisateur.",
  },
  "configuration-profiles": {
    frenchSummary: [
      "Les Configuration Profiles Jamf Pro transportent des payloads MDM Apple : Wi-Fi, VPN, restrictions, FileVault, PPPC, extensions.",
      "Computers → Configuration Profiles → New : composer payloads, scope Smart Groups, déploiement push via APNs.",
      "Profils ≠ packages : payloads MDM signés vs fichiers PKG/DMG installables via policy.",
      "Cas entreprise : profil Wi-Fi enterprise WPA2-Enterprise + certificat, scope Mac onboarding ADE.",
    ],
    heygenScript: `Configuration Profiles Jamf Pro 11.16 — fondamental certification Jamf 100.

Scénario : déployer Wi-Fi enterprise et exiger FileVault sur Mac supervisés ADE.

Computers → Configuration Profiles → New. Payload Wi-Fi : SSID CORP, security WPA2 Enterprise, certificat utilisateur.
Payload FileVault : escrow clé recovery vers Jamf, prompt utilisateur au login.

Scope Smart Group ADE-SUPERVISED-MAC. Save. Push au prochain check-in.

Vérification Mac : Réglages → Profils, FileVault activé, Wi-Fi connecté.

Conflits : deux profils Wi-Fi même SSID — isoler payloads. Dépannage via Management History.

Lab jamf-discovery section profils. Ressource PDF jamf-guide-configuration-profiles.`,
    labOutline: [
      "Créer profil Wi-Fi enterprise",
      "Ajouter payload FileVault avec escrow",
      "Scope groupe pilote ADE",
      "Vérifier installation et Management History",
    ],
    enterpriseScenario:
      "Onboarding ADE : Wi-Fi corporate + FileVault escrow dès le premier boot Mac supervisé.",
  },
  "self-service": {
    frenchSummary: [
      "Jamf Self Service macOS/iOS expose un catalogue IT : apps VPP, policies et ressources approuvées sans ticket systématique.",
      "Settings → Self Service : branding, catégories, notifications. Policy → Self Service tab pour rendre une policy exécutable.",
      "Patch policies peuvent être visibles Self Service mais n'apparaissent pas dans la recherche (doc 11.16).",
      "Cas entreprise : catalogue Productivité (Teams, Zoom) + Utilities (imprimante) avec descriptions Markdown claires.",
    ],
    heygenScript: `Self Service Jamf 11.16 — expérience utilisateur et réduction des tickets IT.

Scénario : permettre aux employés d'installer Microsoft Teams et une policy maintenance à la demande.

Settings → Self Service → macOS : logo, couleurs, catégories Productivité et Utilities.
Policy Teams : Self Service tab activé, description utilisateur, bouton Install.

Sur Mac utilisateur : ouvrir Self Service, installer Teams, lancer policy maintenance.

UX : descriptions courtes, icônes cohérentes, jamais de policy destructive sans confirmation.

Lab jamf-self-service. Quiz dédié. Préparation Jamf 100 et 200 avancé.`,
    labOutline: [
      "Configurer branding Self Service",
      "Exposer policy via Self Service tab",
      "Tester catalogue sur Mac utilisateur",
      "Collecter feedback UX pilote",
    ],
    enterpriseScenario:
      "Catalogue Self Service pour 2000 utilisateurs — apps métier et maintenance sans surcharge helpdesk.",
  },
  packages: {
    frenchSummary: [
      "Packages Jamf = PKG/DMG sur Distribution Point, référencés dans Jamf Pro, déployés via payload Packages d'une policy.",
      "Actions : Install, Cache, Uninstall — avec OS requirements et Restart Options.",
      "Composer ou pkgbuild pour créer PKG signés ; workflow 11.16 : upload DP → policy → scope.",
      "Cas entreprise : déployer agent sécurité PKG sur Smart Group Mac Intel, Self Service pour demandes ad hoc.",
    ],
    heygenScript: `Packages Jamf Pro 11.16 — déploiement logiciel enterprise.

Scénario : installer un PKG métier signé sur 300 Mac via Distribution Point régional.

Computers → Packages → New : upload PKG, OS min macOS 13, catégorie Security.
Computers → Policies → New : payload Packages, action Install, Restart Options si requis.
Scope Smart Group cible. Option Self Service pour réinstallations.

Vérifier : app installée, Policy Logs Completed, espace disque suffisant.

Erreurs : DP inaccessible WAN, PKG non signé Gatekeeper, mauvaise action Cache vs Install.

Lab jamf-packages. Aligné Jamf 100 et 200.`,
    labOutline: [
      "Uploader PKG vers Distribution Point",
      "Créer policy payload Packages Install",
      "Scope Smart Group pilote",
      "Valider installation et logs",
    ],
    enterpriseScenario:
      "Déploiement agent EDR PKG sur parc Mac via DP régional et Self Service complémentaire.",
  },
  scripts: {
    frenchSummary: [
      "Scripts Jamf (Settings → Computer Management → Scripts) s'exécutent via payload Scripts des policies.",
      "Paramètres $4–$11, idempotence, codes retour et logs Policy + fichiers locaux sont obligatoires en production.",
      "Scripts alimentent Extension Attributes pour Smart Groups dynamiques (ex. version app custom).",
      "Cas entreprise : script idempotent vérifiant présence certificat, log /var/log/jamf-cert-check.log, Once per computer.",
    ],
    heygenScript: `Scripts Jamf Pro 11.16 — automation avancée, certification Jamf 200.

Scénario : script bash idempotent vérifiant certificat client VPN, alimentant Extension Attribute.

Settings → Computer Management → Scripts → New : upload .sh, documenter paramètres.
Policy Scripts : Once per computer, scope pilote, priority Before.

Tester : sudo jamf policy. Relancer pour valider idempotence. Policy Logs + fichier témoin.

Pièges : PATH différent du Terminal, exit 0 sans action réelle, secrets en clair dans script.

Lab jamf-scripts. Module 15. Préparation Jamf 200.`,
    labOutline: [
      "Écrire script idempotent avec logging",
      "Upload Jamf + policy Scripts",
      "Tester exécution et idempotence",
      "Optionnel : EA alimentée par script",
    ],
    enterpriseScenario:
      "Conformité certificat VPN automatisée avec EA pour Smart Group non-conformes.",
  },
  "patch-management": {
    frenchSummary: [
      "Patch Management 11.16 suit Software Titles, versions inventaire et Patch Policies pour macOS et apps tierces.",
      "Create Patch Policy : version cible, eligible computers auto-générés, Patch Unknown Versions, scope Smart Group.",
      "Dashboard Patch Management + inventaire Software pour reporting conformité post-déploiement.",
      "Cas entreprise : patch Chrome cible version LTS, fenêtre maintenance, notifications User Interaction.",
    ],
    heygenScript: `Patch Management Jamf Pro 11.16 — conformité logicielle à l'échelle.

Scénario : imposer Google Chrome version entreprise sur Mac non conformes.

Computers → Patch Management → Software Titles → Google Chrome → Create Patch Policy.
Target version, Patch Unknown Versions si parc hétérogène. Preview eligible computers.
Scope Smart Group PROD-MACOS. User Interaction : deadline 7 jours.

Monitorer dashboard : taux conformité, échecs espace disque ou app ouverte.

Lab jamf-patch-management. Module 16. Jamf 200.`,
    labOutline: [
      "Sélectionner Software Title",
      "Créer Patch Policy avec version cible",
      "Vérifier eligible computers",
      "Monitorer conformité post-patch",
    ],
    enterpriseScenario:
      "Conformité Chrome LTS sur 1500 Mac avec deadlines et reporting direction sécurité.",
  },
  inventory: {
    frenchSummary: [
      "Inventaire Jamf : Computers / Mobile Devices avec onglets General, Hardware, Software, Security, Extension Attributes.",
      "Advanced Search pour reporting ad hoc ; Extension Attributes enrichissent critères Smart Groups.",
      "Last check-in, supervision, profils installés et Management History sont essentiels au dépannage.",
      "Cas entreprise : audit FileVault OFF via Advanced Search avant campagne chiffrement.",
    ],
    heygenScript: `Inventaire Jamf Pro 11.16 — fondation de toute stratégie MDM.

Scénario : identifier Mac FileVault désactivé avant déploiement profil sécurité.

Computers → recherche appareil → onglets Hardware, Software, Security.
Advanced Search : FileVault Status is Off, OS Version ≥ 13. Export CSV pour équipe sécurité.

Extension Attributes : script ou LDAP pour champs métier (cost center, site).

Last check-in > 7 jours = appareil stale à investiguer.

Lab jamf-discovery. Module 12. Jamf Pro Fundamentals.`,
    labOutline: [
      "Explorer fiche Computer complète",
      "Advanced Search FileVault OFF",
      "Créer EA pilote",
      "Interpréter last check-in et Management History",
    ],
    enterpriseScenario:
      "Audit conformité FileVault pré-campagne via Advanced Search sur parc 1200 Mac.",
  },
  enrollment: {
    frenchSummary: [
      "Enrollment ADE via Apple Business Manager : token serveur MDM, PreStage Enrollment Mac/mobile.",
      "Computer PreStage : scope initial profils, packages, comptes admin, Self Service au Setup Assistant.",
      "APNs valide requis pour push MDM ; token ABM synchronisé régulièrement.",
      "Cas entreprise : PreStage Mac finance — Wi-Fi, FileVault, agent, compte admin local break-glass.",
    ],
    heygenScript: `Enrollment Jamf Pro 11.16 — Automated Device Enrollment et PreStage.

Scénario : Mac neufs ABM arrivent configurés automatiquement pour équipe finance.

Settings → Computer Management → Automated Device Enrollment : token ABM, sync appareils.
Computer PreStage : profils Wi-Fi + FileVault, policy agent, scope ADE devices finance.

Test : effacer Mac lab, enrollment ADE, vérifier profils au premier boot.

Erreurs : token ABM expiré, PreStage trop lourd, APNs invalide.

Vidéos complémentaires jamf-prestage. Lab jamf-discovery. Jamf Pro Fundamentals.`,
    labOutline: [
      "Vérifier token ABM et APNs",
      "Configurer Computer PreStage",
      "Tester enrollment ADE Mac lab",
      "Valider profils au Setup Assistant",
    ],
    enterpriseScenario:
      "Zero-touch Mac finance : PreStage ADE avec Wi-Fi, FileVault escrow et agent sécurité.",
  },
};

export function getJamfTrainingContent(topicId: JamfTrainingTopicId): JamfTrainingDeliverable {
  return JAMF_TRAINING_CONTENT[topicId];
}
