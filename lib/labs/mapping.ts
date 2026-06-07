/** Correspondance leçon → lab pratique associé */

import { proModules } from "@/lib/data/pro-modules/index";
import { allAdvancedModules } from "@/lib/data/advanced-tracks/module-definitions";
import { allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";

export const lessonToLabSlug: Record<string, string> = {
  "abm-creation-roles": "apple-training-lab-abm",
  "dep-enrollment": "apple-training-lab-ade",
  "apps-books": "apple-training-lab-apps-books",
  "abm-intune": "abm-intune",
  "ade-iphone": "ade-iphone",
  "ade-mac": "ade-macos",
  "apns-certificates": "apple-training-lab-apns",
  "apns-certificats": "apple-training-lab-apns",
  "vpp-apps-books": "apple-training-lab-apps-books",
  "managed-apple-ids": "apple-training-lab-managed-apple-ids",
  "platform-sso": "apple-training-lab-platform-sso",
  "declarative-device-management": "apple-training-lab-ddm",
  "managed-device-attestation": "apple-training-lab-ddm",
  "smart-groups": "jamf-smart-groups",
  "policies-base": "jamf-policies",
  "self-service": "jamf-self-service",
  "m14-packages-deploiement": "jamf-packages",
  "filevault-chiffrement": "apple-training-lab-filevault",
  "macos-security": "macos-security",
  "enrollment-token": "enrollment-program-token",
  "ios-configuration-profiles": "ios-configuration-profile",
  "macos-configuration-profiles": "macos-configuration-profile",
  "conditional-access": "intune-conditional-access-mac",
  "intune-defender-macos": "defender-macos-intune",
  "intune-introduction": "abm-intune",
  "intune-troubleshooting": "intune-compliance",
  "azure-entra-id-introduction": "azure-entra-user-group-license",
  "azure-modern-authentication": "azure-mfa-sso-test",
  "azure-entra-groups": "azure-dynamic-group-macos",
  "azure-abm-entra-federation": "azure-abm-entra-federation",
  "azure-intune-entra-enrollment": "azure-intune-macos-deployment",
  "azure-conditional-access-macos": "azure-conditional-access-macos",
  "azure-platform-sso": "azure-platform-sso-deployment",
  "azure-defender-macos": "azure-defender-macos-deployment",
  "compliance-policies": "intune-compliance",
  "scripts-policies": "jamf-scripts",
  "patch-management": "jamf-patch-management",
  "patch-management-intro": "jamf-patch-management",
  "integrations-tierces": "jamf-protect",
  "comptes-locaux-managed": "managed-apple-id-federation",
  "platform-sso-mfa": "platform-sso-mfa",
  "j300-m03": "jamf-extension-attributes",
  "j300-m04": "jamf-advanced-scripts",
  "j300-m07": "jamf-api",
  "j300-m08": "jamf-webhooks",
  "j400-m02": "jamf-api",
  "j400-m07": "jamf-advanced-scripts",
  "j400-m09": "jamf-migration",
  "aee-m04": "platform-sso-advanced",
  "aee-m05": "declarative-device-management",
  "aee-m06": "managed-device-attestation",
  "iaa-m02": "intune-conditional-access",
  "iaa-m04": "microsoft-defender-macos",
  "iaa-m08": "platform-sso-advanced",
  "aea-m01": "aea-architecture-stack",
  "aea-m02": "aea-identity-architecture",
  "aea-m03": "aea-jamf-500-mac",
  "aea-m04": "aea-intune-global",
  "aea-m05": "aea-security-audit",
  "aea-m06": "aea-automation-deploy",
  "aea-m07": "aea-troubleshooting-lab",
  "aea-m08": "aea-capstone-projects",
  "kfd-m02": "kandji-blueprint",
  "kfd-m06": "kandji-liftoff",
  "msl-m02": "mosyle-enrollment",
  "msl-m05": "mosyle-auth",
  "adg-m02": "addigy-golive",
  "adg-m03": "addigy-policy",
  "wsa-m02": "workspace-one-apple-enrollment",
  "wsa-m06": "workspace-one-compliance",
  "mdm-m08": "mdm-comparison",
};

export function getLabSlugForLesson(lessonSlug: string): string | undefined {
  const direct = lessonToLabSlug[lessonSlug];
  if (direct) return direct;

  for (const mod of proModules) {
    if (mod.lessons.some((l) => l.slug === lessonSlug)) {
      return mod.labSlug;
    }
  }
  for (const mod of allAdvancedModules) {
    if (mod.slug === lessonSlug) {
      return mod.labSlug ?? undefined;
    }
  }
  for (const mod of allAltMdmModules) {
    if (mod.slug === lessonSlug) {
      return mod.labSlug ?? undefined;
    }
  }
  return undefined;
}
