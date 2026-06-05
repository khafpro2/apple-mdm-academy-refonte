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

export const appleEnterpriseExpertPool: Question[] = [
  q("aee-01", "Apple Platform Deployment inclut :", ["Games only", "ABM + ADE + MDM + apps", "Email setup", "iCloud photos"], 1, "Platform Deployment = chaîne complète Apple enterprise."),
  q("aee-02", "ABM federated authentication avec :", ["FTP", "Microsoft Entra ID / Google Workspace", "Bonjour", "Telnet"], 1, "Federation IdP pour Managed Apple IDs."),
  q("aee-03", "Managed Apple ID password policy :", ["No policy", "Org-controlled via ABM/ASM", "User only", "Apple Support"], 1, "Politiques mot de passe org-managed."),
  q("aee-04", "Platform SSO macOS utilise :", ["Kerberos extension + IdP", "FileVault only", "Gatekeeper", "AirDrop"], 0, "Extensible SSO + IdP federation."),
  q("aee-05", "Declarative Device Management (DDM) :", ["Legacy profiles only", "Declarations + status channel", "Email policies", "USB config"], 1, "DDM = modèle déclaratif Apple."),
  q("aee-06", "Managed Device Attestation purpose :", ["Wallpaper", "Cryptographic device integrity proof", "Battery stats", "Language"], 1, "MDA pour Zero Trust access decisions."),
  q("aee-07", "Return to Service (RTS) :", ["Permanent lock", "Re-enroll supervised device after service", "Delete ABM", "Disable MDM forever"], 1, "RTS remet device en service supervisé."),
  q("aee-08", "Apple Security Compliance benchmarks :", ["None", "CIS Apple benchmarks + org policies", "Social media", "Games"], 1, "CIS + internal compliance frameworks."),
  q("aee-09", "Apple Silicon enterprise deployment :", ["Rosetta required for all", "Native ARM apps + PPPC + MDM", "Disable updates", "Intel only"], 1, "ARM-native avec profils PPPC appropriés."),
  q("aee-10", "International deployment considerations :", ["Single language only", "Data residency, GDPR, regional ABM", "Ignore privacy", "One timezone"], 1, "Réglementations et résidence données."),
  q("aee-11", "Activation Lock bypass code ABM :", ["Public", "Stored in ABM for org devices", "User iCloud only", "Not available"], 1, "Bypass codes gérés org via ABM."),
  q("aee-12", "VPP token in ABM :", ["Optional for free apps", "Required for app licensing", "Replaces MDM", "DNS record"], 1, "Token VPP pour Apps & Books."),
  q("aee-13", "Supervision enables :", ["Jailbreak", "Silent app install, restrictions avancées", "Root access", "Disable encryption"], 1, "Supervision = capacités MDM étendues."),
  q("aee-14", "APNs certificate renewal :", ["Never", "Annual renewal before expiry", "Automatic always", "User action"], 1, "Renouveler cert push avant expiration."),
  q("aee-15", "Device Enrollment Program token expiry alert :", ["365 days — monitor in MDM", "Never expires", "1 day", "Ignored"], 0, "Token DEP expire — alertes MDM."),
];
