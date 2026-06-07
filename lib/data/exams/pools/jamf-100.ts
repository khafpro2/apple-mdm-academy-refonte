import type { Question } from "@/lib/types";
import { jamf116ExamQuestions } from "@/lib/data/jamf/quiz-11-16-questions";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation };
}

/** Pool de base — Jamf 100 */
export const jamf100Pool: Question[] = [
  q("j100-01", "Jamf Pro est un :", ["Antivirus", "Serveur MDM/UEM pour Apple", "Cloud storage", "IDE"], 1, "Jamf Pro est la plateforme MDM leader pour l'écosystème Apple."),
  q("j100-02", "Un Smart Group se met à jour :", ["Manuellement uniquement", "Automatiquement selon critères", "Une fois par an", "Via email"], 1, "Les critères d'inventaire mettent à jour l'appartenance dynamiquement."),
  q("j100-03", "Le scope d'une policy définit :", ["Le prix de la licence", "Les cibles (computers, users, groups)", "La couleur du logo", "Le certificat APNs"], 1, "Scope = qui reçoit la policy."),
  q("j100-04", "Configuration Profile contient :", ["Scripts uniquement", "Payloads MDM", "Factures", "Logs APNs"], 1, "Wi-Fi, restrictions, certificats = payloads."),
  q("j100-05", "Jamf communique via :", ["FTP", "APNs", "SMTP", "SNMP"], 1, "Identique à tout serveur MDM Apple."),
  q("j100-06", "Computer PreStage sert à :", ["Backup Time Machine", "Automatiser enrollment DEP/ADE", "Patch Windows", "Gérer Azure"], 1, "PreStage configure les Mac à la première activation."),
  q("j100-07", "Mobile Device PreStage concerne :", ["Windows", "iOS/iPadOS", "Linux", "ChromeOS"], 1, "PreStage mobile pour iPhone/iPad supervisés."),
  q("j100-08", "Extension Attribute permet :", ["Chiffrer le disque", "Stocker une donnée inventaire custom", "Créer un certificat", "Supprimer APNs"], 1, "EA enrichit l'inventaire (script, LDAP, etc.)."),
  q("j100-09", "Self Service permet aux utilisateurs :", ["Jailbreak", "Installer apps/scripts approuvés", "Modifier SIP", "Créer des admin locaux"], 1, "Catalogue self-service contrôlé par IT."),
  q("j100-10", "Static Group vs Smart Group :", ["Identiques", "Static = manuel, Smart = critères", "Static = critères", "Smart = manuel"], 1, "Static pour pilotes ; Smart pour dynamique."),
  q("j100-11", "Jamf Pro enrollment DEP requiert :", ["Token ABM lié au serveur Jamf", "Compte iCloud", "Certificat SSL web", "License Microsoft"], 0, "Liaison ABM ↔ Jamf via token MDM."),
  q("j100-12", "Policy trigger « Recurring Check-in » :", ["Une fois", "À chaque check-in MDM", "Jamais", "Au boot uniquement"], 1, "Exécution à chaque inventory update."),
  q("j100-13", "Package (.pkg) dans Jamf :", ["Est un profil Wi-Fi", "Logiciel déployé via policy", "Certificat push", "Token ABM"], 1, "PKG distribués via policies scoped."),
  q("j100-14", "Site dans Jamf Pro sert à :", ["Héberger le site web", "Segmenter infra multi-tenant", "Stocker photos", "Gérer DNS"], 1, "Sites isolent configs pour filiales/clients MSP."),
  q("j100-15", "Recherche avancée (Advanced Search) :", ["Cherche sur Google", "Critères inventaire complexes", "Supprime des Mac", "Crée des tokens"], 1, "Base des Smart Groups avancés."),
  q("j100-16", "Jamf Pro supporte la gestion :", ["Apple uniquement", "Apple + apps associées", "Windows Server", "Android natif"], 1, "Focus Apple ; apps via VPP/PKG."),
  q("j100-17", "Restrictions payload permet :", ["Augmenter stockage", "Bloquer App Store, caméra, etc.", "Créer APNs", "Activer root"], 1, "Restrictions = contrôle fonctionnel supervisé."),
  q("j100-18", "Inventory Update sur un Mac :", ["Efface données", "Rafraîchit données inventaire Jamf", "Installe macOS", "Reset password"], 1, "Force un check-in inventaire."),
  q("j100-19", "Certificate payload sert à :", ["Wi-Fi enterprise 802.1X", "Backup iCloud", "Games", "Photos"], 0, "Certificats pour Wi-Fi, VPN, S/MIME."),
  q("j100-20", "Jamf Admin account requiert :", ["Compte Apple ID perso", "Compte avec rôles RBAC Jamf", "Compte Facebook", "Aucun login"], 1, "RBAC granulaire dans Jamf Pro."),
  q("j100-21", "Flush Policy Logs :", ["Supprime Mac", "Efface historique exécution policy", "Reset APNs", "Efface ABM"], 1, "Nettoie logs pour re-test policy."),
  q("j100-22", "Scope exclusion permet :", ["Ajouter des apps", "Retirer des groupes du scope", "Créer token", "Chiffrer"], 1, "Exclusions affinent le ciblage."),
  q("j100-23", "Mobile config profile signé :", ["Non requis", "Recommandé pour confiance", "Interdit", "Remplace APNs"], 1, "Signature garantit intégrité du profil."),
  q("j100-24", "Jamf Pro cloud vs on-prem :", ["Identiques fonctionnellement", "Cloud = SaaS Jamf", "On-prem = pas d'APNs", "Cloud = sans DEP"], 1, "Jamf Cloud est l'offre hébergée."),
  q("j100-25", "Device Enrollment Program est aujourd'hui :", ["ADE", "VPP", "APNs", "SIP"], 0, "DEP renommé Automated Device Enrollment."),
  ...jamf116ExamQuestions,
];
