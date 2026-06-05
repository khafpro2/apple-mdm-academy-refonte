/** Thèmes visuels par plateforme — style formation 2026 */
export const THEMES = {
  "apple-business-manager": {
    product: "Apple Business Manager",
    url: "business.apple.com",
    sidebar: "#f5f5f7",
    sidebarText: "#1d1d1f",
    accent: "#0071e3",
    header: "#ffffff",
    body: "#fbfbfd",
    nav: ["Accueil", "Appareils", "Utilisateurs", "Apps & Books", "Réglages", "Emplacements"],
  },
  intune: {
    product: "Microsoft Intune admin center",
    url: "endpoint.microsoft.com",
    sidebar: "#f3f2f1",
    sidebarText: "#323130",
    accent: "#0078d4",
    header: "#ffffff",
    body: "#faf9f8",
    nav: ["Accueil", "Devices", "Apps", "Endpoint security", "Reports", "Tenant administration"],
  },
  jamf: {
    product: "Jamf Pro",
    url: "yourorg.jamfcloud.com",
    sidebar: "#1e293b",
    sidebarText: "#e2e8f0",
    accent: "#78be20",
    header: "#ffffff",
    body: "#f8fafc",
    nav: ["Dashboard", "Computers", "Mobile Devices", "Policies", "Configuration Profiles", "Settings"],
  },
  ade: {
    product: "Automated Device Enrollment",
    url: "Setup Assistant",
    sidebar: "#000000",
    sidebarText: "#ffffff",
    accent: "#007aff",
    header: "#000000",
    body: "#000000",
    nav: [],
  },
  apns: {
    product: "Apple Push Certificates Portal",
    url: "identity.apple.com/pushcert",
    sidebar: "#f5f5f7",
    sidebarText: "#1d1d1f",
    accent: "#0071e3",
    header: "#ffffff",
    body: "#fbfbfd",
    nav: ["Certificates", "Help", "Sign Out"],
  },
  "apps-books": {
    product: "Apps & Books",
    url: "business.apple.com/apps",
    sidebar: "#f5f5f7",
    sidebarText: "#1d1d1f",
    accent: "#0071e3",
    header: "#ffffff",
    body: "#fbfbfd",
    nav: ["Search", "Apps", "Books", "Licenses", "History"],
  },
  "managed-apple-id": {
    product: "Managed Apple IDs",
    url: "business.apple.com/accounts",
    sidebar: "#f5f5f7",
    sidebarText: "#1d1d1f",
    accent: "#0071e3",
    header: "#ffffff",
    body: "#fbfbfd",
    nav: ["Accounts", "Federation", "Domain", "Settings"],
  },
  "platform-sso": {
    product: "Platform SSO",
    url: "Entra ID + macOS",
    sidebar: "#f3f2f1",
    sidebarText: "#323130",
    accent: "#0078d4",
    header: "#ffffff",
    body: "#faf9f8",
    nav: ["Devices", "Configuration", "Platform SSO", "Compliance"],
  },
  filevault: {
    product: "macOS System Settings",
    url: "Réglages Système",
    sidebar: "#ebebeb",
    sidebarText: "#1d1d1f",
    accent: "#007aff",
    header: "#f5f5f5",
    body: "#f5f5f5",
    nav: ["Confidentialité et sécurité", "FileVault"],
  },
  security: {
    product: "macOS Security",
    url: "Réglages Système",
    sidebar: "#ebebeb",
    sidebarText: "#1d1d1f",
    accent: "#007aff",
    header: "#f5f5f5",
    body: "#f5f5f5",
    nav: ["Confidentialité et sécurité", "Sécurité"],
  },
  exams: {
    product: "Apple MDM Academy",
    url: "Examination Center",
    sidebar: "#1d1d1f",
    sidebarText: "#f5f5f7",
    accent: "#0071e3",
    header: "#ffffff",
    body: "#f5f5f7",
    nav: ["Exam", "Review", "Submit"],
  },
};

export const LAYOUT_BY_ID = {
  "01": "login",
  "20": "ios-setup",
  "21": "ios-setup",
  "22": "ios-setup",
  "23": "mac-setup",
  "24": "mac-setup",
  "61": "mac-login",
  "63": "mfa",
  "79": "mac-settings",
  "80": "mac-settings",
  "81": "mac-settings",
  "82": "mac-settings",
  "83": "mac-settings",
  "84": "mac-settings",
  "85": "mac-settings",
  "86": "mac-settings",
  "87": "exam",
  "88": "exam-results",
  "89": "exam",
  "90": "exam",
};

export function layoutFor(entry) {
  if (LAYOUT_BY_ID[entry.id]) return LAYOUT_BY_ID[entry.id];
  const p = entry.scenePrompt.toLowerCase();
  if (p.includes("login") || p.includes("sign-in")) return "login";
  if (p.includes("wizard") || p.includes("workflow") || p.includes("upload") || p.includes("import"))
    return "wizard";
  if (p.includes("setup assistant") || p.includes("activation")) return "ios-setup";
  if (p.includes("macos login")) return "mac-login";
  if (p.includes("filevault") || p.includes("gatekeeper") || p.includes("xprotect") || p.includes("sip"))
    return "mac-settings";
  if (p.includes("mock exam") || p.includes("practice exam")) return "exam";
  if (p.includes("results")) return "exam-results";
  if (p.includes("dashboard") || p.includes("overview")) return "dashboard";
  return "console";
}
