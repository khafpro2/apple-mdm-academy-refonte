import type { Question } from "@/lib/types";
import { jamf100Pool } from "./jamf-100";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation };
}

/** Pool de base — Jamf 200 (expert) — inclut fondamentaux + questions avancées */
export const jamf200Pool: Question[] = [
  ...jamf100Pool,
  q("j200-01", "Jamf Pro API REST v1 utilise :", ["Basic Auth seul", "OAuth 2.0 Bearer Token", "API Key URL", "Certificat client seul"], 1, "Client credentials → access token."),
  q("j200-02", "Patch Management source :", ["App Store manuel", "Catalogue Jamf + approbations", "Email", "USB"], 1, "Catalogue centralisé avec workflow approbation."),
  q("j200-03", "Extension Attribute type Script :", ["Tourne sur serveur", "Tourne sur client, retour inventaire", "Dans browser", "Via email"], 1, "Output script = valeur EA."),
  q("j200-04", "Scale 10 000+ devices :", ["Single server", "Load balancer + DB cluster", "Désactiver inventaire", "API only"], 1, "Architecture distribuée recommandée."),
  q("j200-05", "Jamf Connect synchronise :", ["Apps Store", "Identités cloud ↔ comptes Mac", "APNs", "Wi-Fi"], 1, "SSO Azure/Okta + création compte local."),
  q("j200-06", "Jamf Protect fournit :", ["Email", "EDR/analytics macOS", "DNS", "VPN"], 1, "Sécurité endpoint complémentaire Jamf."),
  q("j200-07", "API rate limiting Jamf :", ["Illimité", "Headers X-Rate-Limit", "Interdit", "1 req/jour"], 1, "Respecter limites pour automatisation."),
  q("j200-08", "Webhook Jamf Pro :", ["Email only", "HTTP POST events", "FTP", "SSH"], 1, "Intégration SIEM/tickets via webhooks."),
  q("j200-09", "Smart Group nested :", ["Impossible", "Smart Group basé sur autre Smart Group", "Static only", "Manual"], 1, "Critères composables pour logique complexe."),
  q("j200-10", "Policy priority :", ["Alphabétique", "Ordre numérique d'exécution", "Aléatoire", "Date création"], 1, "Priorité contrôle conflits policies."),
  q("j200-11", "Jamf Pro Server installer requires :", ["Windows only", "macOS or Linux (requirements)", "iOS", "Android"], 1, "On-prem sur Mac mini ou Linux supporté."),
  q("j200-12", "Reconciliation DEP :", ["Ignore ABM", "Sync appareils ABM ↔ Jamf", "Delete all", "Reset APNs"], 1, "Résout écarts inventaire DEP."),
  q("j200-13", "Log streaming Jamf :", ["Non disponible", "Syslog/SIEM integration", "Email only", "Print"], 1, "Logs vers Splunk/Datadog etc."),
  q("j200-14", "Computer inventory subset :", ["Full only", "Extension Attributes + apps + hardware", "Name only", "Serial only"], 1, "Inventaire riche alimente automation."),
  q("j200-15", "Patch policy deadline :", ["Optional", "Force install after deadline", "Never installs", "Deletes app"], 1, "Deadlines imposent mises à jour."),
  q("j200-16", "Jamf API pagination :", ["No pagination", "page-size / page", "Infinite scroll", "Email batches"], 1, "Utiliser params page pour gros datasets."),
  q("j200-17", "SSO SAML Jamf Pro admin :", ["Not supported", "Supported for admin login", "Mac only", "iOS only"], 1, "Admins peuvent SSO via IdP."),
  q("j200-18", "Policy deferred :", ["Runs immediately", "Runs at next check-in or user login", "Never", "Deletes device"], 1, "Différé selon trigger configuré."),
  q("j200-19", "Jamf Compliance Editor :", ["Games", "Benchmark CIS/custom compliance", "Music", "Photos"], 1, "Règles conformité avec remédiation."),
  q("j200-20", "Token expiration ABM in Jamf :", ["Ignored", "Alert before 365d expiry", "Auto-renew", "Never expires"], 1, "Surveiller expiration token DEP."),
  q("j200-21", "Computer history retention :", ["1 day", "Configurable in Jamf Pro", "Forever mandatory", "None"], 1, "Historique policies/logs configurable."),
  q("j200-22", "Mobile device wipe Jamf :", ["Remote wipe via MDM command", "Physical only", "Email", "USB"], 0, "Erase All Content and Settings."),
  q("j200-23", "Package priority vs Policy :", ["Same", "Policy wraps package execution", "Package replaces policy", "Random"], 1, "Policy orchestrates package deploy."),
  q("j200-24", "Jamf Marketplace :", ["App Store games", "Integrations and extensions", "ABM", "iCloud"], 1, "Connecteurs tiers certifiés."),
  q("j200-25", "Zero-touch Jamf stack :", ["ABM + PreStage + policies", "Manual only", "Email enroll", "USB only"], 0, "Chaîne complète zero-touch Apple."),
];
