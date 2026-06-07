/** Liens Microsoft Learn par ressource ou leçon Intune */
export const MICROSOFT_LEARN_LINKS: Record<string, { href: string; description: string }> = {
  "intune-apns-guide": {
    href: "https://learn.microsoft.com/mem/intune/enrollment/apple-mdm-push-certificate-get",
    description:
      "Création, import et renouvellement du certificat Apple MDM Push (APNs) dans Microsoft Intune.",
  },
  "intune-ade-guide": {
    href: "https://learn.microsoft.com/mem/intune/enrollment/device-enrollment-program-enroll-ios",
    description:
      "Automated Device Enrollment (ADE) pour iOS et macOS via Apple Business Manager et Intune.",
  },
  "intune-platform-sso-guide": {
    href: "https://learn.microsoft.com/intune/intune-service/configuration/platform-sso-macos",
    description:
      "Configuration Platform SSO macOS avec Microsoft Entra ID et profils Intune.",
  },
  "intune-defender-guide": {
    href: "https://learn.microsoft.com/defender-endpoint/mac-install-with-intune",
    description:
      "Déploiement de Microsoft Defender for Endpoint sur macOS via Endpoint security Intune.",
  },
  "intune-mac": {
    href: "https://learn.microsoft.com/mem/intune/fundamentals/what-is-intune",
    description: "Vue d'ensemble Microsoft Intune et gestion des appareils Apple.",
  },
  "platform-sso": {
    href: "https://learn.microsoft.com/intune/intune-service/configuration/platform-sso-macos",
    description: "Platform SSO macOS — documentation Microsoft Learn.",
  },
  "azure-for-apple-admins": {
    href: "https://learn.microsoft.com/entra/identity/",
    description: "Documentation Microsoft Entra ID pour les administrateurs.",
  },
};

export function getMicrosoftLearnLink(key: string) {
  return MICROSOFT_LEARN_LINKS[key];
}
