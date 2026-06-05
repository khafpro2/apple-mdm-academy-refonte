/** Stats démo admin — parcours avancés Phase 13 */

export type AdvancedTrackAdminStat = {
  trackSlug: string;
  title: string;
  enrolled: number;
  avgProgress: number;
  examPassRate: number;
  labsCompleted: number;
};

export const advancedTrackAdminStats: AdvancedTrackAdminStat[] = [
  { trackSlug: "jamf-300", title: "Jamf 300 Prep", enrolled: 24, avgProgress: 42, examPassRate: 68, labsCompleted: 89 },
  { trackSlug: "jamf-400", title: "Jamf 400 Prep", enrolled: 12, avgProgress: 28, examPassRate: 55, labsCompleted: 34 },
  { trackSlug: "apple-enterprise-expert", title: "Apple Enterprise Expert", enrolled: 31, avgProgress: 51, examPassRate: 72, labsCompleted: 67 },
  { trackSlug: "intune-apple-advanced", title: "Intune Apple Advanced", enrolled: 19, avgProgress: 38, examPassRate: 64, labsCompleted: 45 },
];

export function advancedStatsToCsv(stats: AdvancedTrackAdminStat[]): string {
  const header = "track,enrolled,avgProgress,examPassRate,labsCompleted";
  return [header, ...stats.map((s) => [s.title, s.enrolled, s.avgProgress, s.examPassRate, s.labsCompleted].join(","))].join("\n");
}

export const expertLabSlugs = [
  "jamf-api",
  "jamf-webhooks",
  "jamf-extension-attributes",
  "jamf-advanced-scripts",
  "jamf-migration",
  "declarative-device-management",
  "managed-device-attestation",
  "platform-sso-advanced",
  "intune-conditional-access",
  "microsoft-defender-macos",
];
