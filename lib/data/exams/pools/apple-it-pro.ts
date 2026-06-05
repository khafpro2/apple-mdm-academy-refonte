import type { Question } from "@/lib/types";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation };
}

/** Pool de base — Apple Certified IT Professional */
export const appleItProPool: Question[] = [
  q("itp-01", "Quel portail Apple gère les appareils entreprise et ADE ?", ["App Store Connect", "Apple Business Manager", "Apple Configurator", "Developer Portal"], 1, "ABM centralise appareils, apps, Managed Apple IDs et tokens MDM."),
  q("itp-02", "Le jeton ABM exporté pour Intune est un fichier :", [".pem", ".p7m", ".mobileconfig", ".json"], 1, "server_token.p7m établit la relation de confiance ABM ↔ MDM."),
  q("itp-03", "Automated Device Enrollment (ADE) permet :", ["Le jailbreak", "L'enrollment automatique au Setup Assistant", "La suppression de FileVault", "L'accès root"], 1, "ADE (ex-DEP) enrôle automatiquement à la première activation."),
  q("itp-04", "Le certificat APNs est obligatoire pour :", ["Wi-Fi enterprise", "Commandes push MDM", "FileVault escrow", "Platform SSO"], 1, "Sans APNs, le serveur MDM ne peut pas contacter les appareils."),
  q("itp-05", "Le mode supervisé débloque :", ["Jailbreak", "Installations silencieuses et restrictions avancées", "Désactivation SIP", "Root access"], 1, "La supervision est requise pour de nombreuses restrictions iOS/macOS."),
  q("itp-06", "FileVault 2 chiffre :", ["La RAM", "Le volume de démarrage complet", "iCloud uniquement", "Les emails"], 1, "FileVault utilise XTS-AES-128 sur le volume système."),
  q("itp-07", "Gatekeeper vérifie :", ["Les certificats Wi-Fi", "Signature et notarisation des apps", "Les tokens ABM", "Les profils VPN"], 1, "Gatekeeper contrôle l'exécution des apps sur macOS."),
  q("itp-08", "SIP (System Integrity Protection) protège :", ["Les fichiers système Apple", "Uniquement iCloud", "Les apps App Store", "Les profils MDM"], 0, "SIP empêche la modification des composants système même par root."),
  q("itp-09", "Managed Apple ID est créé via :", ["App Store personnel", "Apple Business Manager ou fédération", "iCloud.com", "Face ID"], 1, "Les Managed Apple IDs sont gérés par l'organisation."),
  q("itp-10", "Apps & Books (VPP) permet :", ["Achat personnel d'apps", "Licences en volume pour l'organisation", "Jailbreak apps", "TestFlight entreprise"], 1, "VPP/Apps & Books gère les licences assignables aux appareils."),
  q("itp-11", "Un profil de configuration MDM contient :", ["Uniquement des scripts", "Un ou plusieurs payloads", "Des certificats APNs uniquement", "Des logs système"], 1, "Les profils agrègent des payloads Wi-Fi, VPN, restrictions, etc."),
  q("itp-12", "Platform SSO sur macOS requiert minimum :", ["macOS 10.14", "macOS 14 (Sonoma)", "macOS 11", "macOS 12"], 1, "Platform SSO nécessite macOS 14+ et un IdP compatible."),
  q("itp-13", "Activation Lock MDM permet :", ["Jailbreak", "Bypass supervisé pour récupération d'appareil", "Suppression FileVault", "Désactivation APNs"], 1, "Le bypass code permet de retirer Activation Lock en entreprise."),
  q("itp-14", "PPPC (Privacy Preferences) sert à :", ["Configurer Wi-Fi", "Pré-approuver accès disque/caméra/micro", "Gérer APNs", "Créer des comptes"], 1, "PPPC évite les invites TCC pour les apps gérées."),
  q("itp-15", "XProtect est :", ["Un antivirus tiers", "Le système anti-malware intégré macOS", "Un certificat push", "Un profil VPN"], 1, "XProtect analyse les signatures de malware connues."),
  q("itp-16", "La notarisation Apple garantit :", ["Que l'app est gratuite", "Qu'Apple a scanné l'app pour malware", "Le chiffrement FileVault", "La supervision"], 1, "Notarization est requise pour les apps distribuées hors App Store."),
  q("itp-17", "Secure Enclave stocke :", ["Photos iCloud", "Clés biométriques et cryptographiques", "Profils MDM", "Tokens ABM"], 1, "Le Secure Enclave isole les données sensibles."),
  q("itp-18", "Un serveur MDM communique avec les appareils via :", ["Email", "APNs puis canal MDM", "SSH direct", "AirDrop"], 1, "APNs réveille l'appareil ; le canal MDM livre les commandes."),
  q("itp-19", "Domain Capture convertit :", ["Les Mac en iPhone", "Les comptes @domaine en Managed Apple IDs", "Les apps en web apps", "Les profils en policies"], 1, "Domain Capture fédère automatiquement les comptes du domaine."),
  q("itp-20", "Conditional Access avec Intune vérifie :", ["La couleur du device", "La conformité avant accès M365", "Le numéro IMEI uniquement", "La langue système"], 1, "CA bloque l'accès si l'appareil n'est pas conforme."),
  q("itp-21", "TCC (Transparency, Consent, Control) gère :", ["Les tokens ABM", "Les autorisations confidentialité macOS", "Les certificats SSL", "Les smart groups"], 1, "TCC contrôle l'accès aux ressources protégées."),
  q("itp-22", "Apple Configurator peut :", ["Remplacer ABM", "Ajouter des appareils à ABM/ADE manuellement", "Créer des certificats APNs", "Gérer Entra ID"], 1, "Configurator enregistre des appareils USB dans ABM."),
  q("itp-23", "System Extensions remplacent progressivement :", ["FileVault", "Kernel Extensions (kexts)", "APNs", "ADE"], 1, "Apple déprécie les kexts au profit des System Extensions."),
  q("itp-24", "Un token ABM expire après :", ["30 jours", "365 jours", "90 jours", "Jamais"], 1, "Renouvellement annuel obligatoire du server_token.p7m."),
  q("itp-25", "La conformité Intune pour macOS peut exiger :", ["Wallpaper spécifique", "FileVault activé et OS minimum", "Compte iCloud personnel", "Jailbreak détecté"], 1, "Compliance policies vérifient chiffrement, OS, etc."),
];
