/** Association leçon → IDs de la bibliothèque pédagogique (01–90) */
export const LESSON_SCREENSHOT_IDS: Record<string, string[]> = {
  // Intune Mac — leçons premium
  "abm-intune": ["01", "02", "03", "04", "05", "06", "26", "28", "30", "31"],
  "managed-apple-ids": ["09", "10", "11", "12", "54", "55", "56", "57", "58"],
  "platform-sso": ["59", "60", "61", "62", "63", "37"],
  "vpp-apps-books": ["08", "47", "48", "49", "50", "51", "52", "53"],
  "apns-certificates": ["41", "42", "43", "44", "45", "46", "29"],
  "ade-iphone": ["16", "17", "18", "19", "20", "21", "22", "25"],
  "ade-mac": ["16", "17", "18", "19", "23", "24", "25"],
  "ios-configuration-profiles": ["27", "32", "33", "39", "85"],
  "macos-configuration-profiles": ["32", "34", "39", "70", "79", "80", "85", "86"],
  "macos-security": ["79", "80", "81", "82", "83", "84", "85", "86"],
  "supervised-mode": ["21", "22", "25"],
  "enrollment-token": ["04", "05", "30", "31"],
  "compliance-policies": ["35", "40", "38"],
  "conditional-access": ["36", "35", "38"],
  "app-protection": ["33", "34", "38"],

  // Apple IT Professional
  "abm-creation-roles": ["01", "02", "03", "09", "15"],
  "dep-enrollment": ["16", "17", "18", "04", "05"],
  "apps-books": ["08", "47", "48", "50", "51"],
  "profils-configuration": ["32", "70", "39"],
  "commandes-mdm": ["38", "39", "29"],
  "apns-certificats": ["41", "42", "43", "44", "45", "46"],

  // Jamf 100
  "architecture-jamf": ["64", "65", "66", "75"],
  "inventaire-recherche": ["65", "66", "74"],
  "smart-groups": ["67", "68"],
  "config-profiles-jamf": ["70", "85"],
  "policies-base": ["69", "71"],
  "scope-deploiement": ["69", "67", "68"],

  // Jamf 170
  "extension-attributes": ["74", "67"],
  "scripts-policies": ["72", "69"],
  "self-service": ["77", "71"],
  "workflows-enrollment": ["75", "76", "16"],
  "patch-management-intro": ["73"],

  // Jamf 200
  "api-jamf": ["64", "72"],
  "patch-management": ["73", "71"],
  "integrations-tierces": ["64", "78", "55"],

  // Apple Fundamentals
  "historique-ecosysteme": ["02", "03"],
  "macos-ios-ipados": ["20", "23", "65", "66"],
  "apple-silicon": ["81", "83"],
  "filevault-chiffrement": ["79", "80"],
  "gatekeeper-notarisation": ["81", "82"],
  "touch-id-face-id": ["84", "85"],
  "wifi-ethernet": ["32", "70"],
  "services-entreprise": ["02", "08", "10"],
  "icloud-comptes": ["10", "54"],

  // Apple Device Support
  "comptes-locaux-managed": ["10", "54", "58"],
  "sso-kerberos": ["61", "59", "55"],
  "diagnostic-systeme": ["81", "83", "82"],
  "console-logs": ["82", "83", "38"],
  "mode-recovery": ["79", "83", "84"],
  "profils-utilisateur": ["39", "54", "58"],
};

/** Fallback par piste (track) quand aucune association explicite */
export const TRACK_DEFAULT_SCREENSHOT_IDS: Record<string, string[]> = {
  "intune-mac": ["26", "27", "28"],
  "jamf-100": ["64", "65", "69"],
  "jamf-170": ["64", "72", "77"],
  "jamf-200": ["64", "73", "78"],
  "apple-it-professional": ["02", "04", "41"],
  "apple-fundamentals": ["02", "79", "81"],
  "apple-device-support": ["38", "54", "87"],
};

/** Examens blancs — association quiz slug */
export const QUIZ_SCREENSHOT_IDS: Record<string, string[]> = {
  "examen-apple-device-support": ["87", "88"],
  "examen-jamf-200": ["90"],
  "quiz-jamf-100": ["89"],
  "quiz-apple-fundamentals": ["87"],
  "examen-apple-it-pro": ["87", "88"],
  "examen-jamf-100-blanc": ["89"],
};
