/** Association leçon → IDs de la bibliothèque pédagogique (01–90) */
import { allAdvancedModules } from "@/lib/data/advanced-tracks/module-definitions";
import { allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";
import { proModules } from "@/lib/data/pro-modules/index";

const CORE_LESSON_SCREENSHOT_IDS: Record<string, string[]> = {
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
  "abm-creation-roles": ["01", "02", "03", "09", "15", "abm-apps", "abm-federation"],
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

  // Jamf Fundamentals Premium
  "jf-intro-jamf-pro": ["64", "65", "75"],
  "jf-interface-jamf": ["64", "65"],
  "jf-inventory": ["74", "65"],
  "jf-computers": ["65", "69"],
  "jf-mobile-devices": ["66", "77"],
  "jf-smart-groups": ["67", "68"],
  "jf-static-groups": ["68", "67"],
  "jf-policies": ["69", "71"],
  "jf-configuration-profiles": ["70", "85"],
  "jf-self-service": ["77", "71"],
  "jf-packages": ["71", "69"],
  "jf-scripts": ["72", "69"],
  "jf-patch-management": ["73", "71"],
  "jf-reporting": ["74", "67"],
  "jf-troubleshooting": ["64", "69", "74"],

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

const TRACK_SCREENSHOT_POOLS: Record<string, string[]> = {
  "jamf-300": ["64", "65", "66", "67", "68", "69", "70", "72", "73", "74"],
  "jamf-400": ["64", "72", "73", "75", "76", "77", "78"],
  "apple-enterprise-expert": ["01", "02", "09", "16", "17", "18", "79", "80", "81", "82"],
  "apple-enterprise-architect": ["01", "02", "09", "16", "17", "18", "79", "80"],
  "intune-apple-advanced": ["26", "27", "28", "35", "36", "37", "38", "39", "79", "80"],
  "kandji-fundamentals": ["16", "17", "69", "70", "75", "76", "77"],
  "mosyle-fundamentals": ["16", "17", "18", "32", "38", "39"],
  "addigy-fundamentals": ["64", "65", "69", "72", "74"],
  "workspace-one-apple": ["26", "27", "32", "35", "36", "38"],
  "mdm-comparatif-apple": ["64", "26", "02", "16", "69", "70"],
  "parcours-professionnel": ["02", "16", "64", "26", "70", "79"],
};

function idsForTrack(trackSlug: string, index: number): string[] {
  const pool = TRACK_SCREENSHOT_POOLS[trackSlug] ?? ["02", "64", "26"];
  const n = pool.length;
  return [pool[index % n]!, pool[(index + 1) % n]!, pool[(index + 2) % n]!];
}

function buildExtendedLessonScreenshotIds(): Record<string, string[]> {
  const out = { ...CORE_LESSON_SCREENSHOT_IDS };
  allAdvancedModules.forEach((mod, i) => {
    if (!out[mod.slug]) out[mod.slug] = idsForTrack(mod.trackSlug, i);
  });
  allAltMdmModules.forEach((mod, i) => {
    if (!out[mod.slug]) out[mod.slug] = idsForTrack(mod.trackSlug, i);
  });
  proModules.forEach((pm, mi) => {
    pm.lessons.forEach((lesson, li) => {
      if (!out[lesson.slug]) out[lesson.slug] = idsForTrack("parcours-professionnel", mi * 5 + li);
    });
  });
  return out;
}

export const LESSON_SCREENSHOT_IDS: Record<string, string[]> = buildExtendedLessonScreenshotIds();

/** Fallback par piste (track) quand aucune association explicite */
export const TRACK_DEFAULT_SCREENSHOT_IDS: Record<string, string[]> = {
  "intune-mac": ["26", "27", "28"],
  "jamf-100": ["64", "65", "69"],
  "jamf-170": ["64", "72", "77"],
  "jamf-200": ["64", "73", "78"],
  "jamf-300": ["64", "65", "72", "73"],
  "jamf-400": ["64", "72", "75", "78"],
  "apple-it-professional": ["02", "04", "41"],
  "apple-enterprise-expert": ["01", "02", "16", "79"],
  "apple-enterprise-architect": ["01", "02", "16", "79", "80"],
  "intune-apple-advanced": ["26", "27", "35", "36"],
  "apple-fundamentals": ["02", "79", "81"],
  "apple-device-support": ["38", "54", "87"],
  "kandji-fundamentals": ["16", "69", "70"],
  "mosyle-fundamentals": ["16", "32", "38"],
  "addigy-fundamentals": ["64", "69", "72"],
  "workspace-one-apple": ["26", "32", "35"],
  "mdm-comparatif-apple": ["64", "26", "02"],
  "parcours-professionnel": ["02", "64", "26"],
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
