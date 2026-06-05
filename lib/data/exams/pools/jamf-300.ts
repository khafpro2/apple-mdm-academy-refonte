import type { Question } from "@/lib/types";
import { jamf200Pool } from "./jamf-200";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation };
}

export const jamf300Pool: Question[] = [
  ...jamf200Pool,
  q("j300-01", "Architecture Jamf multi-site recommande :", ["Single server global", "Sites + distribution points par région", "No inventory", "API only"], 1, "Sites isolent policies et distribution."),
  q("j300-02", "Extension Attribute type Pop-up menu :", ["Script only", "Valeurs prédéfinies sélectionnables", "Binary", "Image"], 1, "Pop-up = liste contrôlée pour reporting."),
  q("j300-03", "Jamf API OAuth client credentials :", ["Username/password in URL", "POST /api/oauth/token", "FTP", "SNMP"], 1, "OAuth2 client credentials flow standard."),
  q("j300-04", "Webhook Jamf event ComputerCheckIn :", ["Email alert", "HTTP POST JSON payload", "SMS", "Print"], 1, "Webhooks POST vers endpoint HTTPS."),
  q("j300-05", "Patch policy deferral count :", ["Blocks forever", "Nombre de reports avant force install", "Deletes app", "Wipes device"], 1, "Deferral limite reports utilisateur."),
  q("j300-06", "Policy trigger Recurring Check-in :", ["Once only", "Every MDM check-in interval", "Never", "On login only"], 1, "Recurring = à chaque check-in."),
  q("j300-07", "Package cache distribution point :", ["Stores packages for local deploy", "Email packages", "Deletes packages", "Only logs"], 0, "DP cache accélère déploiement remote sites."),
  q("j300-08", "Smart Group nested criteria AND/OR :", ["Not supported", "Boolean logic on multiple criteria", "Manual only", "Random"], 1, "Logique booléenne pour groupes complexes."),
  q("j300-09", "Script priority in policy :", ["Alphabetical", "Order defined in policy scripts tab", "Random", "By file size"], 1, "Ordre d'exécution scripts configurable."),
  q("j300-10", "Jamf Pro log level for troubleshooting :", ["Silent", "Debug on Jamf Pro Server / Tomcat logs", "Delete logs", "Public blog"], 1, "Logs Tomcat + jamf.log pour diagnostic."),
  q("j300-11", "Computer PreStage mandatory minimum OS :", ["Optional", "Enforces minimum version at enrollment", "Disables updates", "Wipes device"], 1, "PreStage peut bloquer OS trop ancien."),
  q("j300-12", "API pagination page-size max typical :", ["1", "100-1000 depending endpoint", "Unlimited", "0"], 1, "Respecter page-size pour performance."),
  q("j300-13", "Policy execution frequency Once per computer :", ["Runs every minute", "Runs once ever per computer", "Never runs", "Runs on server only"], 1, "Once per computer = idempotence one-shot."),
  q("j300-14", "Extension Attribute regex validation :", ["Not available", "Can validate inventory values", "Only dates", "Only numbers 1-5"], 1, "Regex EA pour qualité inventaire."),
  q("j300-15", "Patch Management third-party titles :", ["Not supported", "Supported via Jamf patch catalog", "Mac App Store only", "Manual email"], 1, "Catalogue inclut apps tierces courantes."),
];
