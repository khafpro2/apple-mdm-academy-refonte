/** Correspondance leçon → lab pratique associé */

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
};

export function getLabSlugForLesson(lessonSlug: string): string | undefined {
  return lessonToLabSlug[lessonSlug];
}
