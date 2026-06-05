import type { Question } from "@/lib/types";
import { intuneApplePool } from "./intune-apple";

function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string
): Question {
  return { id, text, options: [...options], correctIndex: correct, explanation };
}

export const intuneAppleAdvancedPool: Question[] = [
  ...intuneApplePool,
  q("iaa-01", "Intune macOS advanced enrollment :", ["Manual only", "ADE + Company Portal + Platform SSO", "FTP", "USB"], 1, "Stack ADE + CP + SSO pour Mac."),
  q("iaa-02", "Conditional Access for macOS requires :", ["Nothing", "Compliance policy + Entra integration", "Wallpaper", "iCloud"], 1, "CA = compliance + identity."),
  q("iaa-03", "Microsoft Defender for macOS onboarding :", ["Not supported", "MDM profile + onboarding package", "Email", "Manual download only"], 1, "Onboarding via Intune MDM profile."),
  q("iaa-04", "SCEP certificate profile Intune :", ["Static cert in email", "Automated cert enrollment via SCEP", "User generates manually", "FTP"], 1, "SCEP = déploiement certs automatisé."),
  q("iaa-05", "Wi-Fi 802.1X EAP-TLS on macOS Intune :", ["Open network", "Certificate or credential payload", "WEP", "Hidden SSID only"], 1, "EAP-TLS avec certificat client."),
  q("iaa-06", "VPN Always On macOS Intune :", ["Optional", "Per-app or full tunnel policies", "Disables network", "Telnet"], 1, "VPN profiles Always On disponibles."),
  q("iaa-07", "Platform SSO + Entra ID on macOS :", ["Not supported", "Extensible SSO + Company Portal", "FileVault only", "Gatekeeper"], 1, "Microsoft Enterprise SSO plug-in."),
  q("iaa-08", "Intune reporting for Apple devices :", ["None", "Device compliance, app status, scripts", "Paper", "iCloud"], 1, "Rapports compliance et inventaire."),
  q("iaa-09", "Troubleshooting Intune Apple first :", ["Wipe all", "Company Portal logs + MDM sync + cert validity", "Delete tenant", "Disable ABM"], 1, "Logs CP + sync MDM + certs."),
  q("iaa-10", "Compliance advanced macOS checks :", ["Wallpaper", "OS min, FileVault, SIP, Defender", "Language", "Model color"], 1, "Compliance multi-critères sécurité."),
];
