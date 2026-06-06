import type { Lab } from "@/lib/types";

function step(id: string, title: string, instruction: string, expectedResult: string) {
  return { id, title, instruction, expectedResult };
}

function acitpLab(
  slug: string,
  title: string,
  description: string,
  technology: Lab["technology"],
  objectives: string[],
  steps: ReturnType<typeof step>[],
  expectedResult: string
): Lab {
  return {
    slug,
    title,
    description: `${description} Scénario entreprise : poste neuf flotte corporate 500 Mac.`,
    level: "Intermédiaire",
    duration: "45 min",
    technology,
    trackSlug: "apple-it-professional",
    objectives,
    prerequisites: ["Mac test ou VM macOS", "Compte admin local", "Accès MDM lab (optionnel)"],
    steps,
    expectedResult,
    objective: `${objectives[0] ?? title} — validation certification ACITP.`,
  };
}

/** 10 labs certification Apple IT Professional */
export const acitpCertificationLabs: Lab[] = [
  acitpLab(
    "acitp-lab-01-mac-setup",
    "Lab 1 — Configuration complète d'un Mac neuf",
    "Setup Assistant, compte, Réglages Système et apps de base.",
    "Sécurité macOS",
    ["Passer Setup Assistant zero-touch ou manuel", "Configurer Réglages Système essentiels", "Valider Finder et Dock"],
    [
      step("setup", "Setup Assistant", "Allumez Mac neuf, Wi-Fi, compte Entra/local selon policy.", "Mac au bureau avec compte fonctionnel."),
      step("finder", "Finder", "Configurez sidebar, tags, Quick Look sur fichier test.", "Finder opérationnel documents test."),
      step("dock", "Dock", "Épinglez apps métier, auto-hide selon policy.", "Dock conforme runbook IT."),
    ],
    "Mac neuf configuré : compte, Finder, Dock, Réglages Système."
  ),
  acitpLab(
    "acitp-lab-02-enterprise-connect",
    "Lab 2 — Connexion entreprise",
    "Wi-Fi enterprise, VPN, certificats PKI.",
    "ABM + Intune",
    ["Profil Wi-Fi WPA2-Enterprise", "Certificat racine trusted", "Test accès ressource interne"],
    [
      step("wifi", "Wi-Fi enterprise", "Installez profil Wi-Fi 802.1X ou configurez manuellement EAP.", "Connexion Wi-Fi corporate OK."),
      step("trust", "Certificats", "Importez certificat racine PKI dans Trousseau Système.", "Sites HTTPS internes sans avertissement."),
      step("vpn", "VPN", "Connectez VPN corporate si requis, test ping/share.", "Accès réseau interne validé."),
    ],
    "Mac connecté enterprise : Wi-Fi, PKI, VPN."
  ),
  acitpLab(
    "acitp-lab-03-filevault",
    "Lab 3 — Sécurisation FileVault",
    "Activation FileVault, escrow MDM, recovery key.",
    "FileVault",
    ["Activer FileVault 2", "Vérifier escrow clé MDM", "Documenter procédure recovery"],
    [
      step("enable", "Activer FileVault", "Réglages > Confidentialité > FileVault ON ou policy MDM.", "FileVault encrypting/encrypted."),
      step("escrow", "Escrow MDM", "Vérifiez clé recovery dans console MDM.", "Clé escrow visible admin MDM."),
      step("test", "Test recovery", "Simulez demande support recovery sur Mac pilote.", "Procédure ITSM documentée."),
    ],
    "FileVault actif avec escrow enterprise."
  ),
  acitpLab(
    "acitp-lab-04-safari",
    "Lab 4 — Configuration Safari",
    "Extensions, certificats, homepage, restrictions.",
    "Sécurité macOS",
    ["Safari profils/proxy", "Extension enterprise si applicable", "Test portail SSO"],
    [
      step("homepage", "Safari prefs", "Homepage intranet, moteur recherche, téléchargements.", "Safari configuré policy."),
      step("certs", "HTTPS interne", "Accédez portail SSO sans erreur certificat.", "Login SSO réussi."),
      step("ext", "Extensions", "Installez extension MDM approuvée si applicable.", "Extension active sans prompt TCC bloquant."),
    ],
    "Safari enterprise opérationnel."
  ),
  acitpLab(
    "acitp-lab-05-passwords",
    "Lab 5 — Gestion des mots de passe",
    "Trousseau, mots de passe iCloud Keychain off, SSO.",
    "Platform SSO",
    ["Keychain unlock", "Password policy macOS", "SSO password sync Entra"],
    [
      step("keychain", "Trousseau", "Vérifiez login keychain déverrouillé post-login.", "Pas de prompt keychain répété."),
      step("policy", "Policy", "Réglages > Touch ID & Password — exigences complexité.", "Policy conforme sécurité."),
      step("sso", "SSO", "Test app M365 sans re-login password.", "SSO fonctionnel apps métier."),
    ],
    "Gestion mots de passe enterprise validée."
  ),
  acitpLab(
    "acitp-lab-06-mail",
    "Lab 6 — Configuration Mail",
    "Exchange/Office 365, autodiscover, certificats.",
    "Sécurité macOS",
    ["Compte Exchange configuré", "Sync mail/calendrier/contacts", "Dépannage autodiscover"],
    [
      step("account", "Compte Exchange", "Mail > Ajouter compte Microsoft/Exchange.", "Compte connecté sans erreur."),
      step("sync", "Sync", "Vérifiez réception envoi mail test.", "Mail sync bidirectionnelle."),
      step("autodiscover", "Autodiscover", "Si échec, test autodiscover URL et logs.", "Autodiscover documenté si manuel."),
    ],
    "Mail Exchange opérationnel."
  ),
  acitpLab(
    "acitp-lab-07-calendar",
    "Lab 7 — Configuration Calendrier",
    "Exchange Calendar, salles, délégués.",
    "Sécurité macOS",
    ["Calendrier Exchange ajouté", "Réservation salle test", "Partage calendrier"],
    [
      step("add", "Ajouter calendrier", "Calendar > Comptes > Exchange.", "Calendriers visibles."),
      step("room", "Salle", "Créez événement avec salle meeting.", "Réservation salle OK."),
      step("delegate", "Délégué", "Test vue calendrier délégué si applicable.", "Permissions calendrier validées."),
    ],
    "Calendar enterprise configuré."
  ),
  acitpLab(
    "acitp-lab-08-managed-apple-id",
    "Lab 8 — Configuration Managed Apple ID",
    "MAID, fédération Entra, services org.",
    "Managed Apple ID + Federation",
    ["MAID créé/fédéré", "Services iCloud org", "Restrictions Apple ID perso"],
    [
      step("maid", "Managed Apple ID", "Connectez MAID ou fédération Entra sur Mac test.", "MAID actif services org."),
      step("services", "Services", "Vérifiez iCloud org apps autorisées.", "Services conformes policy."),
      step("block", "Restrictions", "Confirmez Apple ID perso bloqué si policy.", "Pas de contournement App Store perso."),
    ],
    "Managed Apple ID enterprise validé."
  ),
  acitpLab(
    "acitp-lab-09-mdm-enrollment",
    "Lab 9 — Inscription MDM",
    "Enrollment ADE ou manuel, profils, check-in.",
    "ADE + Intune",
    ["Remote Management ou enrollment manuel", "Profils MDM reçus", "Inventaire MDM visible"],
    [
      step("enroll", "Enrollment", "Passez flux ADE ou install profile MDM lab.", "Appareil managed/supervised."),
      step("profiles", "Profils", "Listez profils installés Réglages > Général > VPN & Device Management.", "Profils Wi-Fi/compliance présents."),
      step("inventory", "Inventaire", "Vérifiez check-in console MDM < 30 min.", "Device visible inventaire MDM."),
    ],
    "Inscription MDM complète."
  ),
  acitpLab(
    "acitp-lab-10-macos-diagnostic",
    "Lab 10 — Diagnostic macOS",
    "Console, Activity Monitor, Safe Mode, logs.",
    "Sécurité macOS",
    ["Collecter crash log", "Identifier process CPU élevé", "Safe Mode diagnostic"],
    [
      step("console", "Console", "Ouvrez Console, filtre errors dernier boot.", "Logs exportés ticket ITSM."),
      step("activity", "Activity Monitor", "Identifiez process anormal CPU/RAM.", "Process problématique documenté."),
      step("safe", "Safe Mode", "Boot Safe Mode, reproduisez ou isolez panne.", "Rapport diagnostic rédigé."),
    ],
    "Diagnostic macOS enterprise documenté."
  ),
];
