import type { Question } from "@/lib/types";
import { aeaModuleQuizBanks } from "@/lib/data/apple-enterprise-architect/quiz-banks";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation };
}

/** Banques manuelles par module — questions techniques précises */
export const moduleQuizBanks: Record<string, Question[]> = {
  "j300-m01": [
    q("j300m01-1", "Jamf Pro Sites servent à :", ["Games", "Isoler policies et ressources par région/BU", "Email", "DNS"], 1, "Sites = segmentation organisationnelle."),
    q("j300m01-2", "Distribution Point principal :", ["Email packages", "Cache local packages pour WAN", "Delete inventory", "APNs only"], 1, "DP accélère déploiement remote sites."),
    q("j300m01-3", "HA Jamf Pro cluster utilise :", ["Single Mac mini", "Load balancer + multiple Tomcat nodes", "FTP", "iCloud"], 1, "LB + cluster pour haute dispo."),
    q("j300m01-4", "LDAP/SSO admin Jamf :", ["Not supported", "SAML SSO for admin console", "Only local", "FTP auth"], 1, "Admins peuvent SSO via IdP."),
    q("j300m01-5", "Check-in frequency impact :", ["Nothing", "Inventory freshness and policy execution", "Wallpaper", "Language"], 1, "Check-in = heartbeat MDM."),
    q("j300m01-6", "Tomcat logs for Jamf troubleshooting :", ["/var/log/jamf.log and Tomcat catalina", "iCloud", "Email", "USB"], 0, "jamf.log + catalina.out."),
    q("j300m01-7", "Database backend Jamf Pro :", ["SQLite only", "MySQL or PostgreSQL", "MongoDB", "Excel"], 1, "PostgreSQL/MySQL en production."),
    q("j300m01-8", "Capacity planning 10k Macs :", ["Ignore", "Size DB, Tomcat heap, check-in load", "One policy", "Disable inventory"], 1, "Dimensionner infra selon parc."),
    q("j300m01-9", "Multi-tenant MSP architecture :", ["One site per customer recommended", "Single global site always", "No separation", "Delete ABM"], 0, "MSP = site/instance par client."),
    q("j300m01-10", "Certificate management Jamf :", ["Ignore expiry", "Monitor APNs and DEP token annually", "Never renew", "User task"], 1, "Renouveler certificats avant expiration."),
  ],
  "j300-m07": [
    q("j300m07-1", "Jamf API auth flow :", ["FTP", "OAuth2 client credentials", "Basic only", "SNMP"], 1, "POST /api/oauth/token."),
    q("j300m07-2", "API pagination param :", ["color", "page-size and page", "email", "random"], 1, "Paginer gros datasets."),
    q("j300m07-3", "Rate limit headers :", ["None", "X-Rate-Limit-*", "Cookie", "HTML"], 1, "Respecter limites API."),
    q("j300m07-4", "Create Smart Group via API :", ["GET only", "POST /api/v1/computer-groups", "DELETE all", "Email"], 1, "CRUD groups via REST."),
    q("j300m07-5", "Inventory endpoint :", ["/api/v1/computers-inventory", "/email", "/ftp", "/dns"], 0, "Inventory REST v1."),
    q("j300m07-6", "API role best practice :", ["Global admin API user", "Dedicated API account least privilege", "Share password", "Public"], 1, "Compte API dédié moindre privilège."),
    q("j300m07-7", "Token expiry typical :", ["Forever", "~3600 seconds", "1 second", "Never issued"], 1, "Refresh token before expiry."),
    q("j300m07-8", "Webhook vs API polling :", ["Same", "Webhooks push events, API pulls data", "Webhooks slower always", "API deprecated"], 1, "Event-driven vs pull."),
    q("j300m07-9", "API automation use case :", ["Games", "CMDB sync, policy as code", "Wallpaper", "Music"], 1, "IaC + intégrations SIEM."),
    q("j300m07-10", "Classic API vs Jamf Pro API :", ["Identical", "Jamf Pro API v1 is modern REST", "Classic only", "Neither exists"], 1, "Migrer vers Pro API v1."),
  ],
  "j300-m08": [
    q("j300m08-1", "Jamf webhook delivery :", ["Email", "HTTP POST JSON", "SMS", "Print"], 1, "POST vers endpoint HTTPS."),
    q("j300m08-2", "Webhook auth options :", ["None only", "Basic auth or header secret", "FTP", "USB"], 1, "Sécuriser endpoint webhook."),
    q("j300m08-3", "ComputerCheckIn event :", ["User login UI", "MDM check-in occurred", "Wallpaper change", "Delete device"], 1, "Event inventaire/check-in."),
    q("j300m08-4", "SmartGroupMembershipChange use :", ["Ignore", "Trigger automation on group change", "Delete ABM", "Disable MDM"], 1, "Automatiser tickets/SIEM."),
    q("j300m08-5", "Webhook retry on failure :", ["Never", "Jamf retries delivery", "Wipes device", "Deletes webhook"], 1, "Retries configurables."),
  ],
  "j400-m09": [
    q("j400m09-1", "Jamf migration critical asset :", ["Wallpaper", "APNs cert + DEP token + scope mapping", "iCloud photos", "Music"], 1, "Certificats et tokens critiques."),
    q("j400m09-2", "Duplicate serial in migration :", ["Ignore", "Reconcile ABM assignment before cutover", "Wipe all", "Delete ABM"], 1, "Reconcilier inventaire serial."),
    q("j400m09-3", "Migration pilot phase :", ["Skip", "Move pilot group first, validate 48h", "All devices day 1", "Random"], 1, "Pilot avant masse."),
    q("j400m09-4", "Policy export migration :", ["Manual/API export and scope validation", "Impossible", "Email only", "USB"], 0, "Exporter et valider scope."),
    q("j400m09-5", "Rollback plan includes :", ["Nothing", "DNS cutback, token restore, comms", "Delete users", "Disable internet"], 1, "Rollback documenté."),
  ],
  "aee-m05": [
    q("aeem05-1", "DDM stands for :", ["Direct Device Mail", "Declarative Device Management", "Delete Device Mode", "DNS"], 1, "Modèle déclaratif Apple."),
    q("aeem05-2", "DDM status channel :", ["Email reports", "Device reports declaration status to MDM", "FTP", "None"], 1, "Status reports vers serveur."),
    q("aeem05-3", "Software update declaration :", ["Manual email", "Defer/schedule OS updates declaratively", "Delete OS", "Jailbreak"], 1, "Declarations software update."),
    q("aeem05-4", "DDM vs classic profiles :", ["Same", "Declarative desired state + status", "Profiles only forever", "No MDM"], 1, "DDM = état désiré."),
    q("aeem05-5", "DDM minimum OS :", ["iOS 5", "iOS 17+ / macOS 14+ for many declarations", "Windows XP", "None"], 1, "Versions récentes requises."),
  ],
  "aee-m06": [
    q("aeem06-1", "MDA purpose :", ["Wallpaper", "Cryptographic device integrity attestation", "Music", "Email"], 1, "Managed Device Attestation."),
    q("aeem06-2", "MDA used for :", ["Games", "Zero Trust access decisions", "Printing", "DNS"], 1, "Confiance device pour accès."),
    q("aeem06-3", "MDA flow involves :", ["FTP", "Device attestation → MDM → IdP/CA", "USB only", "Email"], 1, "Chaîne attestation complète."),
  ],
  "iaa-m02": [
    q("iaam02-1", "CA with Intune Apple requires :", ["Nothing", "Compliance policy + device registration", "Wallpaper", "iCloud"], 1, "Device compliance requis."),
    q("iaam02-2", "Non-compliant Mac blocked from :", ["Nothing", "M365 apps when CA enforced", "Local login always", "DNS"], 1, "CA bloque ressources cloud."),
    q("iaam02-3", "FileVault OFF compliance result :", ["Compliant", "Non-compliant", "Unknown", "Premium"], 1, "FileVault souvent requis."),
    q("iaam02-4", "Sign-in logs for CA debug :", ["Entra ID sign-in logs", "iCloud", "Bonjour", "FTP"], 0, "Entra logs montrent CA block."),
    q("iaam02-5", "Break-glass account :", ["Same CA rules", "Excluded from CA for emergency", "Blocked always", "Public"], 1, "Compte urgence hors CA."),
  ],
  "iaa-m04": [
    q("iaam04-1", "Defender for macOS onboarding :", ["Email", "Intune MDM onboarding profile", "FTP", "Manual only forever"], 1, "Profile MDM onboarding."),
    q("iaam04-2", "Defender health status :", ["M365 Defender portal Devices", "iCloud", "ABM", "DNS"], 0, "Portal Defender endpoint."),
    q("iaam04-3", "Tamper protection :", ["Disable", "Should remain enabled in production", "Optional always off", "User choice"], 1, "Tamper protection ON."),
  ],
  ...aeaModuleQuizBanks,
};

export function getModuleQuizBank(moduleSlug: string): Question[] | undefined {
  return moduleQuizBanks[moduleSlug];
}
