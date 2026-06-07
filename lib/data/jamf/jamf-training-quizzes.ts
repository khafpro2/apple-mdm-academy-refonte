import type { Question } from "@/lib/types";
import type { JamfTrainingTopicId } from "@/lib/data/jamf/jamf-training-registry";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation };
}

/** 5 questions par sujet — alignées Jamf Pro 11.16 et scénarios entreprise */
export const JAMF_TRAINING_TOPIC_QUIZZES: Record<JamfTrainingTopicId, Question[]> = {
  "smart-groups": [
    q("jt-sg-01", "Smart Groups Jamf 11.16 servent principalement à :", ["Reporting Advanced Search", "Scope et déploiement dynamique", "Stocker packages", "Renouveler APNs"], 1, "Doc 11.16 : Smart Groups pour scope, pas reporting."),
    q("jt-sg-02", "Avant scope production, la bonne pratique est :", ["Supprimer Static Groups", "Preview membership", "Désactiver inventaire", "Effacer EA"], 1, "Preview valide les Mac inclus."),
    q("jt-sg-03", "Extension Attributes enrichissent surtout :", ["Distribution Points", "Critères Smart Groups et inventaire", "Token ABM", "Composer"], 1, "EA = champs custom pour critères."),
    q("jt-sg-04", "Smart Groups circulaires peuvent :", ["Accélérer le serveur", "Provoquer recalculs problématiques", "Remplacer policies", "Signer profils"], 1, "Jamf 11.16 met en garde contre dépendances circulaires."),
    q("jt-sg-05", "Scénario : déployer app sur Mac sans Teams. Critère adapté :", ["Computer Name is Mac", "Application Title does not contain Teams", "Last check-in any", "Model is iPhone"], 1, "Critère application mesurable pour scope ciblé."),
  ],
  policies: [
    q("jt-pol-01", "Trigger Enrollment Complete convient pour :", ["Patch mensuel Chrome", "Actions premier enrollment Mac", "Rapport annuel", "Renouvellement certificat APNs"], 1, "Première config post-ADE/PreStage."),
    q("jt-pol-02", "Retirer Mac du scope policy après exécution :", ["Rollback automatique", "Ne supprime pas réglages déjà appliqués", "Désinstalle packages", "Révoque profils"], 1, "Policies 11.16 — retrait scope ≠ undo."),
    q("jt-pol-03", "Policy Logs se consultent via :", ["App Store Connect", "Computer → Management → Policy Logs", "ABM Devices", "Distribution Point FTP"], 1, "Logs par appareil et policy."),
    q("jt-pol-04", "Self Service tab sur policy permet :", ["Renouveler Wi-Fi", "Exécution à la demande par utilisateur", "Créer token ABM", "Patch Unknown Versions"], 1, "Policies exposées catalogue Self Service."),
    q("jt-pol-05", "Recurring Check-in trop fréquent peut :", ["Améliorer UX", "Surcharger serveur et Mac", "Désactiver FileVault", "Supprimer inventaire"], 1, "Frequency agressive = charge inutile."),
  ],
  "configuration-profiles": [
    q("jt-cp-01", "Configuration Profiles transportent :", ["PKG signés uniquement", "Payloads MDM Apple", "Scripts bash", "Distribution Points"], 1, "Profils = payloads MDM signés."),
    q("jt-cp-02", "FileVault escrow entreprise requiert typiquement :", ["Apple ID personnel", "Secure Token / Bootstrap Token MDM", "Email utilisateur", "FTP"], 1, "Escrow clé recovery via MDM."),
    q("jt-cp-03", "Conflit deux profils Wi-Fi même SSID :", ["Ignorer", "Isoler payloads et vérifier Management History", "Supprimer APNs", "Désenroller ADE"], 1, "Dépannage par profil gagnant."),
    q("jt-cp-04", "Profils vs packages :", ["Identiques", "Profils MDM vs fichiers installables PKG/DMG", "Packages remplacent profils", "Profils sur Distribution Point"], 1, "Distinction fondamentale Jamf 11.16."),
    q("jt-cp-05", "Scope profil s'effectue via :", ["Advanced Search", "Smart/Static Groups", "Composer", "Patch dashboard"], 1, "Scope standard MDM Jamf."),
  ],
  "self-service": [
    q("jt-ss-01", "Self Service macOS permet :", ["Tickets Jira automatiques", "Catalogue IT apps et policies approuvées", "Renouveler ABM", "Composer packages"], 1, "Catalogue contrôlé utilisateur."),
    q("jt-ss-02", "Patch policies dans Self Service 11.16 :", ["Toujours dans recherche", "Peuvent être visibles mais pas dans recherche", "Interdites", "Remplacent policies scripts"], 1, "Doc 11.16 limitation recherche."),
    q("jt-ss-03", "Branding Self Service se configure dans :", ["Computers → Policies", "Settings → Self Service", "Patch Management", "Advanced Search"], 1, "Settings Self Service macOS/iOS."),
    q("jt-ss-04", "Policy destructive en Self Service :", ["Recommandée sans garde-fous", "À éviter ou avec confirmations strictes", "Obligatoire pour Jamf 100", "Remplace User Interaction"], 1, "UX et sécurité catalogue."),
    q("jt-ss-05", "Utilisateur lance policy Self Service :", ["Email à IT requis", "Même moteur exécution que trigger Self Service", "Enrollment manuel", "FTP package"], 1, "Exécution policy standard."),
  ],
  packages: [
    q("jt-pkg-01", "Ordre déploiement package 11.16 :", ["Policy sans DP", "Package sur DP → Jamf → policy Packages", "Profil MDM seul", "Self Service sans policy"], 1, "Workflow Packages doc 11.16."),
    q("jt-pkg-02", "Action Cache sur package :", ["Désinstalle app", "Met package en cache selon config", "Renouvelle APNs", "Crée Smart Group"], 1, "Install / Cache / Uninstall."),
    q("jt-pkg-03", "Package échoue Mac distant — vérifier :", ["Logo Self Service", "DP accessible, espace disque, Policy Logs", "Couleur profil", "Token Credly"], 1, "Dépannage package standard."),
    q("jt-pkg-04", "OS requirement sur package évite :", ["Téléchargement", "Installation sur OS incompatible", "Scope Smart Group", "FileVault"], 1, "Requirement OS obligatoire."),
    q("jt-pkg-05", "Packages se distinguent des profils car :", ["Même payload", "Fichiers PKG/DMG installables", "Uniquement mobile", "Sans Distribution Point"], 1, "PKG vs payloads MDM."),
  ],
  scripts: [
    q("jt-scr-01", "Scripts Jamf s'exécutent via :", ["Email", "Payload Scripts d'une policy", "ABM sync", "Self Service search"], 1, "Policy payload Scripts."),
    q("jt-scr-02", "Exit code non zéro signifie :", ["Succès", "Échec policy", "APNs renouvelé", "Inventaire OK"], 1, "Code retour = statut policy."),
    q("jt-scr-03", "Idempotence script signifie :", ["Exécution infinie", "Relançable sans effet de bord", "Sans logs", "Root désactivé"], 1, "Bonnes pratiques production."),
    q("jt-scr-04", "Paramètres script Jamf typiques :", ["$1 email", "$4–$11 positionnels documentés", "UUID ABM", "SSID Wi-Fi"], 1, "jamf setParameter convention."),
    q("jt-scr-05", "Script alimente EA pour :", ["Renouveler certificat APNs", "Smart Groups dynamiques sur champ custom", "Supprimer packages", "Composer"], 1, "EA → critères Smart Groups."),
  ],
  "patch-management": [
    q("jt-pat-01", "Patch Policy eligible computers :", ["Manuels sans preview", "Auto-générés selon version cible", "Tous Mac site", "Uniquement iOS"], 1, "Creating Patch Policy 11.16."),
    q("jt-pat-02", "Patch Unknown Versions sert à :", ["Ignorer Mac", "Inclure versions inconnues du title", "Désactiver Self Service", "Supprimer Software Title"], 1, "Option General patch policy."),
    q("jt-pat-03", "Post-patch conformité se vérifie via :", ["ABM Users", "Inventaire Software version cible", "Gatekeeper seul", "Email IT"], 1, "Software inventory post-déploiement."),
    q("jt-pat-04", "Mac hors eligible list :", ["Patch immédiat", "Pas patché jusqu'à critères satisfaits", "Désenrollment", "Suppression EA"], 1, "Eligible list doc 11.16."),
    q("jt-pat-05", "Patch Management vs policy package app :", ["Identiques", "Software Titles + patch policies dédiées", "Profils MDM", "Scripts seuls"], 1, "Patch = workflow Software Titles."),
  ],
  inventory: [
    q("jt-inv-01", "Advanced Search sert à :", ["Scope policies", "Reporting ad hoc inventaire", "Renouveler APNs", "Composer"], 1, "Reporting vs Smart Groups scope."),
    q("jt-inv-02", "Last check-in > 7 jours indique :", ["Mac optimal", "Appareil stale à investiguer", "FileVault ON", "ADE expiré"], 1, "Stale device troubleshooting."),
    q("jt-inv-03", "Onglet Security affiche typiquement :", ["Packages DP", "FileVault, SIP, Gatekeeper", "Scripts uploadés", "Token ABM"], 1, "Inventaire sécurité Mac."),
    q("jt-inv-04", "Management History permet :", ["Créer packages", "Tracer profils et policies appliqués", "Renouveler Wi-Fi cert", "Supprimer ABM"], 1, "Historique management appareil."),
    q("jt-inv-05", "EA alimentée par script sert à :", ["Stocker PKG", "Enrichir inventaire pour critères", "Remplacer APNs", "Self Service branding"], 1, "Extension Attributes custom."),
  ],
  enrollment: [
    q("jt-enr-01", "ADE requiert :", ["App Store Connect", "Token ABM + serveur MDM Jamf", "Composer", "Patch policy"], 1, "Automated Device Enrollment chain."),
    q("jt-enr-02", "Computer PreStage configure :", ["Uniquement iOS", "Scope initial au Setup Assistant Mac", "Advanced Search", "Distribution Point FTP"], 1, "PreStage Mac ADE."),
    q("jt-enr-03", "APNs invalide provoque :", ["Enrollment instantané", "Commandes MDM pending", "FileVault escrow auto", "Self Service search OK"], 1, "Push MDM via APNs."),
    q("jt-enr-04", "Token ABM expiré impacte :", ["Smart Groups", "Sync appareils ADE", "Composer", "Scripts logs"], 1, "Renouvellement token ABM périodique."),
    q("jt-enr-05", "PreStage trop lourd peut :", ["Accélérer boot", "Ralentir premier boot Mac", "Désactiver supervision", "Supprimer inventaire"], 1, "PreStage lean recommandé."),
  ],
};

export function getJamfTrainingQuizQuestions(topicId: JamfTrainingTopicId): Question[] {
  return JAMF_TRAINING_TOPIC_QUIZZES[topicId] ?? [];
}
