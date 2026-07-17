import type { ApplePlatformName } from "@/lib/types";

export type EnrollmentType =
  | "Automated Device Enrollment"
  | "Device Enrollment"
  | "User Enrollment";

export type MdmProvider = "Jamf Pro" | "Microsoft Intune" | "Apple MDM native";

export type CompatibilityFeature = {
  id: string;
  feature: string;
  platforms: ApplePlatformName[];
  minimumVersion?: string;
  recommendedVersion?: string;
  enrollmentTypes?: EnrollmentType[];
  requiresSupervision?: boolean;
  mdmProviders?: MdmProvider[];
  appleSilicon?: boolean | "required" | "recommended";
  intel?: boolean | "legacy-only";
  deprecationStatus?: "active" | "deprecated" | "needs-review";
  notes?: string;
  lastVerifiedAt: string;
};

/**
 * Matrice de compatibilité — uniquement des faits largement documentés.
 * Les champs absents signifient « non affirmé / à vérifier », jamais une invention.
 */
export const compatibilityMatrix: CompatibilityFeature[] = [
  {
    id: "platform-sso",
    feature: "Platform SSO",
    platforms: ["macOS"],
    minimumVersion: "13",
    recommendedVersion: "26",
    enrollmentTypes: ["Automated Device Enrollment", "Device Enrollment"],
    requiresSupervision: false,
    mdmProviders: ["Jamf Pro", "Microsoft Intune"],
    appleSilicon: "recommended",
    intel: true,
    deprecationStatus: "active",
    notes: "L’expérience et les IdP supportés évoluent selon la version de macOS et le fournisseur d’identité.",
    lastVerifiedAt: "2026-07-17",
  },
  {
    id: "filevault",
    feature: "FileVault",
    platforms: ["macOS"],
    minimumVersion: "10.7",
    recommendedVersion: "26",
    enrollmentTypes: ["Automated Device Enrollment", "Device Enrollment"],
    requiresSupervision: false,
    mdmProviders: ["Jamf Pro", "Microsoft Intune", "Apple MDM native"],
    appleSilicon: true,
    intel: true,
    deprecationStatus: "active",
    notes: "Sur Apple Silicon, le modèle de clés et RecoveryOS diffère d’Intel.",
    lastVerifiedAt: "2026-07-17",
  },
  {
    id: "ddm",
    feature: "Declarative Device Management",
    platforms: ["macOS", "iOS", "iPadOS"],
    recommendedVersion: "26",
    enrollmentTypes: ["Automated Device Enrollment", "Device Enrollment", "User Enrollment"],
    requiresSupervision: false,
    mdmProviders: ["Jamf Pro", "Microsoft Intune"],
    deprecationStatus: "active",
    notes: "Les déclarations disponibles dépendent de la version OS et du serveur MDM.",
    lastVerifiedAt: "2026-07-17",
  },
  {
    id: "ade",
    feature: "Automated Device Enrollment",
    platforms: ["macOS", "iOS", "iPadOS"],
    enrollmentTypes: ["Automated Device Enrollment"],
    requiresSupervision: true,
    mdmProviders: ["Jamf Pro", "Microsoft Intune", "Apple MDM native"],
    deprecationStatus: "active",
    notes: "Repose sur Apple Business Manager (ou Apple School Manager) et l’assignation à un serveur MDM.",
    lastVerifiedAt: "2026-07-17",
  },
  {
    id: "user-enrollment",
    feature: "User Enrollment",
    platforms: ["iOS", "iPadOS", "macOS"],
    enrollmentTypes: ["User Enrollment"],
    requiresSupervision: false,
    mdmProviders: ["Jamf Pro", "Microsoft Intune"],
    deprecationStatus: "active",
    notes: "Sépare données personnelles et gérées — adapté BYOD. Capacités MDM plus limitées que ADE.",
    lastVerifiedAt: "2026-07-17",
  },
  {
    id: "shared-ipad",
    feature: "Shared iPad",
    platforms: ["iPadOS"],
    enrollmentTypes: ["Automated Device Enrollment"],
    requiresSupervision: true,
    mdmProviders: ["Jamf Pro", "Microsoft Intune"],
    deprecationStatus: "active",
    notes: "Spécifique iPadOS — sessions multi-utilisateurs Managed Apple Account.",
    lastVerifiedAt: "2026-07-17",
  },
  {
    id: "managed-lost-mode",
    feature: "Managed Lost Mode",
    platforms: ["iOS", "iPadOS"],
    enrollmentTypes: ["Automated Device Enrollment", "Device Enrollment"],
    requiresSupervision: true,
    mdmProviders: ["Jamf Pro", "Microsoft Intune"],
    deprecationStatus: "active",
    lastVerifiedAt: "2026-07-17",
  },
  {
    id: "activation-lock",
    feature: "Activation Lock (MDM bypass / Bypass Code)",
    platforms: ["macOS", "iOS", "iPadOS"],
    enrollmentTypes: ["Automated Device Enrollment"],
    requiresSupervision: true,
    mdmProviders: ["Jamf Pro", "Microsoft Intune"],
    deprecationStatus: "active",
    lastVerifiedAt: "2026-07-17",
  },
];

export function getCompatibilityFeature(id: string) {
  return compatibilityMatrix.find((f) => f.id === id);
}

export function getCompatibilityByPlatform(platform: ApplePlatformName) {
  return compatibilityMatrix.filter((f) => f.platforms.includes(platform));
}
