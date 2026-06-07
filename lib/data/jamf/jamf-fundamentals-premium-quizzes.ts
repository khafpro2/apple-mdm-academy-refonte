import type { Question } from "@/lib/types";
import type { JamfFundamentalsModuleId } from "@/lib/data/jamf/jamf-fundamentals-premium";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string,
  difficulty: "easy" | "medium" | "hard"
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation, difficulty };
}

type PremiumQuizDef = {
  slug: string;
  moduleId: JamfFundamentalsModuleId;
  title: string;
  trackSlug: string;
  questions: Question[];
};

export const JAMF_FUNDAMENTALS_PREMIUM_QUIZZES: PremiumQuizDef[] = [
  {
    slug: "quiz-jamf-intro",
    moduleId: "intro-jamf-pro",
    title: "Quiz — Introduction Jamf Pro",
    trackSlug: "jamf-100",
    questions: [
      q("jfp-i1", "Jamf Pro sert principalement à :", ["Gérer uniquement iPhone", "Administrer Mac/iPad/iPhone via MDM Apple", "Remplacer Active Directory", "Héberger des sites web"], 1, "Jamf Pro = plateforme MDM Apple enterprise.", "easy"),
      q("jfp-i2", "Apple Business Manager alimente :", ["Les Distribution Points", "L'enrollment automatique (ADE)", "Les scripts Bash", "Les certificats SSL web"], 1, "ABM = source appareils supervisés ADE.", "easy"),
      q("jfp-i3", "APNs dans Jamf permet :", ["Email push", "Commandes MDM push vers appareils", "Backup iCloud", "VPN site-to-site"], 1, "APNs = canal push MDM Apple.", "medium"),
      q("jfp-i4", "Premier réflexe onboarding Jamf enterprise :", ["Déployer 500 policies", "Mac/iPad pilote supervisé + doc architecture", "Supprimer inventaire", "Désactiver APNs"], 1, "Pilote + architecture documentée avant scale.", "medium"),
      q("jfp-i5", "Jamf Cloud vs on-prem diffère par :", ["La console admin (identique)", "Uniquement la couleur UI", "Le protocole MDM (différent)", "Le type d'appareils supportés"], 0, "Même Jamf Pro ; hébergement diffère.", "hard"),
    ],
  },
  {
    slug: "quiz-jamf-interface",
    moduleId: "interface-jamf",
    title: "Quiz — Interface Jamf Pro",
    trackSlug: "jamf-100",
    questions: [
      q("jfp-ui1", "Le Dashboard Jamf affiche :", ["Uniquement les factures", "KPI parc, alertes certificats, activité", "Code source Jamf", "Apps App Store"], 1, "Dashboard = vue santé parc.", "easy"),
      q("jfp-ui2", "Les Sites Jamf servent à :", ["Stocker packages uniquement", "Segmenter configs multi-entité/MSP", "Remplacer Smart Groups", "Gérer DNS"], 1, "Sites = isolation tenant/filiale.", "medium"),
      q("jfp-ui3", "Rôle Auditor recommandé :", ["Full Access", "Read inventaire/rapports sans Create policies", "Accès root serveur", "Aucun login"], 1, "RBAC least-privilege.", "medium"),
      q("jfp-ui4", "SSO admin Jamf se configure dans :", ["Self Service branding", "Settings → System Settings → SSO", "Policy General", "Mobile Devices → Apps"], 1, "SSO admin ≠ Platform SSO utilisateur.", "hard"),
      q("jfp-ui5", "Policy Logs permettent :", ["Modifier triggers", "Voir exécutions sans modifier policy", "Créer certificats APNs", "Enroller iPad"], 1, "Logs = diagnostic read-only.", "easy"),
    ],
  },
  {
    slug: "quiz-jamf-computers",
    moduleId: "computers",
    title: "Quiz — Computers Jamf Pro",
    trackSlug: "jamf-100",
    questions: [
      q("jfp-c1", "Management History sur fiche Mac montre :", ["Facturation Jamf", "Timeline profils/policies appliqués", "Photos iCloud", "Emails utilisateur"], 1, "History = audit déploiements MDM.", "easy"),
      q("jfp-c2", "Update Inventory force :", ["Wipe Mac", "Collecte inventaire au prochain check-in", "Suppression profils", "Renouvellement ABM"], 1, "Refresh inventaire à la demande.", "easy"),
      q("jfp-c3", "Bootstrap Token ADE sert à :", ["Wi-Fi enterprise", "FileVault escrow sans prompt admin local", "Patch Chrome", "Self Service branding"], 1, "Bootstrap Token = FV escrow ADE.", "medium"),
      q("jfp-c4", "Action Wipe Mac via Jamf :", ["Efface contenu (Erase All Content and Settings)", "Désinstalle Jamf uniquement", "Change wallpaper", "Reset mot de passe uniquement"], 0, "Wipe = effacement complet MDM.", "medium"),
      q("jfp-c5", "Premier diagnostic policy échouée sur Mac :", ["Changer logo Self Service", "Policy Logs + Management History", "Recréer ABM", "Supprimer Site"], 1, "Logs + history = L1 standard.", "hard"),
    ],
  },
  {
    slug: "quiz-jamf-mobile-devices",
    moduleId: "mobile-devices",
    title: "Quiz — Mobile Devices Jamf",
    trackSlug: "jamf-100",
    questions: [
      q("jfp-m1", "Supervision iOS permet :", ["Uniquement email", "Options MDM avancées (silent VPP, restrictions)", "Android enrollment", "Remplacer ABM"], 1, "Supervision = contrôle MDM étendu.", "easy"),
      q("jfp-m2", "VPP token sert à :", ["Distribution packages PKG Mac", "Licences apps App Store gérées", "Certificat APNs", "LDAP bind"], 1, "VPP = Volume Purchase Program apps.", "medium"),
      q("jfp-m3", "PreStage mobile configure :", ["Enrollment initial iOS/iPadOS ADE", "Patch Management Mac", "Distribution Point", "Script bash Mac"], 0, "PreStage = onboarding zero-touch mobile.", "medium"),
      q("jfp-m4", "Profil Wi-Fi macOS copié tel quel sur iOS :", ["Toujours OK", "Peut échouer — payloads spécifiques plateforme", "Interdit Apple", "Remplace ABM"], 1, "Payloads diffèrent macOS vs iOS.", "hard"),
      q("jfp-m5", "Commande Erase sur iPad :", ["Change wallpaper", "Efface appareil (MDM remote wipe)", "Installe app", "Sync calendrier"], 1, "Erase = wipe MDM mobile.", "easy"),
    ],
  },
  {
    slug: "quiz-jamf-static-groups",
    moduleId: "static-groups",
    title: "Quiz — Static Groups Jamf",
    trackSlug: "jamf-100",
    questions: [
      q("jfp-sg1", "Static Group vs Smart Group :", ["Identiques", "Static = liste manuelle ; Smart = critères dynamiques", "Static recalcule à check-in", "Smart = manuel"], 1, "Static manuel vs Smart dynamique.", "easy"),
      q("jfp-sg2", "Static Group typique enterprise :", ["Tous Mac automatiquement", "VIP, labo, exclusions stables", "Remplace patch policy", "APNs renewal"], 1, "VIP/labo = cas Static fréquents.", "easy"),
      q("jfp-sg3", "Exclusion policy via Static Group :", ["Impossible", "Scope Smart + exclusion Static LAB/VIP", "Uniquement sur mobile", "Remplace trigger"], 1, "Pattern scope + exclusion.", "medium"),
      q("jfp-sg4", "Maintenance Static Groups :", ["Jamais", "Revue trimestrielle membership", "Automatique via APNs", "Via patch policy"], 1, "Static obsolète = exclusions fausses.", "medium"),
      q("jfp-sg5", "Static Group pour reporting ad hoc :", ["Recommandé", "Non — utiliser Advanced Search", "Obligatoire Jamf 100", "Remplace inventory"], 1, "Reporting = Advanced Search.", "hard"),
    ],
  },
  {
    slug: "quiz-jamf-reporting",
    moduleId: "reporting",
    title: "Quiz — Reporting Jamf Pro",
    trackSlug: "jamf-100",
    questions: [
      q("jfp-r1", "Advanced Search sert à :", ["Scope policies production", "Requêtes inventaire ad hoc et exports", "Renouveler APNs", "Créer packages"], 1, "Advanced Search = reporting.", "easy"),
      q("jfp-r2", "Export CSV Advanced Search sert à :", ["Installer apps", "Audit conformité externe (Excel, BI)", "Push profils", "Wipe Mac"], 1, "Export pour audit/BI.", "easy"),
      q("jfp-r3", "Patch dashboard affiche :", ["Emails admins", "Versions apps et conformité patch", "Code scripts", "Token ABM"], 1, "Dashboard patch = versions apps.", "medium"),
      q("jfp-r4", "Smart Group pour rapport ponctuel :", ["Bonne pratique", "Déconseillé — recalculs inutiles", "Obligatoire", "Remplace API"], 1, "Ne pas confondre scope et reporting.", "medium"),
      q("jfp-r5", "API REST Jamf pour reporting :", ["Impossible", "Export inventaire vers BI externe", "Remplace MDM", "Uniquement mobile"], 1, "API = intégration BI/automation.", "hard"),
    ],
  },
  {
    slug: "quiz-jamf-troubleshooting",
    moduleId: "troubleshooting",
    title: "Quiz — Troubleshooting Jamf Pro",
    trackSlug: "jamf-100",
    questions: [
      q("jfp-t1", "Policy package Failed — vérifier d'abord :", ["Logo Self Service", "DP accessible, espace disque, Policy Logs", "Couleur Site", "Nom admin"], 1, "DP + espace + logs = L1 package.", "easy"),
      q("jfp-t2", "Profil Wi-Fi non installé — consulter :", ["Management History fiche Mac", "App Store", "Jamf Account billing", "DNS public"], 0, "History = timeline profils.", "easy"),
      q("jfp-t3", "Check-in forcé sur Mac :", ["jamf reboot only", "sudo jamf policy + Update Inventory", "Wipe", "Unmanage"], 1, "jamf policy + inventory refresh.", "medium"),
      q("jfp-t4", "Alerte APNs expiré Dashboard :", ["Ignorer", "Renouveler certificat APNs selon procédure", "Supprimer Mac", "Désactiver policies"], 1, "APNs expiré = push MDM mort.", "medium"),
      q("jfp-t5", "Smart Groups circulaires A↔B causent :", ["Meilleure perf", "Recalculs circulaires charge serveur", "Plus de licenses", "Enrollment auto"], 1, "Circularité = charge serveur.", "hard"),
    ],
  },
];

export function getJamfFundamentalsPremiumQuizSlugs(): string[] {
  return JAMF_FUNDAMENTALS_PREMIUM_QUIZZES.map((quiz) => quiz.slug);
}
