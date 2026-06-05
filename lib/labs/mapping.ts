/** Correspondance leçon → lab pratique associé */

import { proModules } from "@/lib/data/pro-modules/index";
import { allAdvancedModules } from "@/lib/data/advanced-tracks/module-definitions";
import { allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";

export const lessonToLabSlug: Record<string, string> = {
  "abm-intune": "abm-intune",
  "ade-iphone": "ade-iphone",
  "ade-mac": "ade-macos",
  "apns-certificates": "apns",
  "vpp-apps-books": "apps-books",
  "managed-apple-ids": "managed-apple-ids",
  "platform-sso": "platform-sso",
  "smart-groups": "jamf-smart-groups",
  "policies-base": "jamf-policies",
  "filevault-chiffrement": "filevault",
  "macos-security": "macos-security",
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
