import type { Question } from "@/lib/types";
import { jamf300Pool } from "./jamf-300";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation };
}

export const jamf400Pool: Question[] = [
  ...jamf300Pool,
  q("j400-01", "CI/CD avec Jamf API typiquement :", ["Manual GUI only", "Pipeline Git → API policies/profiles", "FTP deploy", "USB"], 1, "Infrastructure as Code + Jamf API."),
  q("j400-02", "Migration Jamf instance :", ["Copy database blindly", "Export/import structured + validate check-ins", "Email devices", "Ignore certificates"], 1, "Migration planifiée avec validation APNs/DEP."),
  q("j400-03", "Jamf Pro cluster load balancer :", ["Optional decoration", "Required for HA multi-node", "Replaces MDM", "Only for mobile"], 1, "LB devant cluster Tomcat pour HA."),
  q("j400-04", "Bash script parameter $4 in Jamf policy :", ["Fourth positional parameter", "Always empty", "Device serial", "Policy ID"], 0, "Paramètres positionnels passés au script."),
  q("j400-05", "Reporting advanced Jamf :", ["Jamf Pro Analytics + API export", "Paper only", "No reporting", "iCloud"], 0, "Analytics + API pour BI dashboards."),
  q("j400-06", "Zero-touch advanced stack :", ["ABM + PreStage + policies + Connect + Protect", "Manual enroll", "Email link", "QR only"], 0, "Chaîne complète identity + security."),
  q("j400-07", "API workflow automation :", ["Webhook → queue → API action", "Manual ticket only", "Disable API", "Print"], 0, "Event-driven automation enterprise."),
  q("j400-08", "Enterprise troubleshooting first step :", ["Mass wipe", "Verify check-in, scope, logs, network", "Delete ABM", "Disable APNs"], 1, "Méthode ITIL : scope, logs, réseau, certificats."),
  q("j400-09", "Final project Jamf 400 validates :", ["Single checkbox", "End-to-end architecture design + runbook", "Email summary", "Wallpaper change"], 1, "Projet = design + doc + preuves de tests."),
  q("j400-10", "Security advanced macOS with Jamf :", ["Disable SIP", "FileVault + PPPC + Protect + compliance", "Open all ports", "Remove Gatekeeper"], 1, "Defense in depth macOS enterprise."),
];
