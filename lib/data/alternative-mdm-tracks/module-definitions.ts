/** Phase 14 — Kandji, Mosyle, Addigy, Workspace ONE & comparatif MDM */

import type { LogoName } from "@/lib/navigation/logo-names";

export type AltMdmModuleDef = {
  slug: string;
  title: string;
  trackSlug: string;
  quizSlug: string;
  labSlug: string | null;
  badgeId: string;
  resourceSlug: string;
  videoSlug: string;
  quizCount: 15;
  duration: string;
};

function mod(
  track: string,
  prefix: string,
  n: number,
  title: string,
  lab: string | null,
  badge: string
): AltMdmModuleDef {
  const slug = `${prefix}-m${String(n).padStart(2, "0")}`;
  return {
    slug,
    title,
    trackSlug: track,
    quizSlug: `quiz-${slug}`,
    labSlug: lab ?? `lab-${slug}`,
    badgeId: badge,
    resourceSlug: `resource-${slug}`,
    videoSlug: `video-${slug}`,
    quizCount: 15,
    duration: "25 min",
  };
}

export const kandjiModules: AltMdmModuleDef[] = [
  mod("kandji-fundamentals", "kfd", 1, "Introduction à Kandji", null, "badge-kandji-fundamentals"),
  mod("kandji-fundamentals", "kfd", 2, "Blueprints Kandji", "kandji-blueprint", "badge-kandji-blueprint-specialist"),
  mod("kandji-fundamentals", "kfd", 3, "Library Items", null, "badge-kandji-fundamentals"),
  mod("kandji-fundamentals", "kfd", 4, "Auto Apps", null, "badge-kandji-fundamentals"),
  mod("kandji-fundamentals", "kfd", 5, "Passport", null, "badge-kandji-fundamentals"),
  mod("kandji-fundamentals", "kfd", 6, "Liftoff", "kandji-liftoff", "badge-kandji-fundamentals"),
  mod("kandji-fundamentals", "kfd", 7, "Kandji EDR", null, "badge-kandji-fundamentals"),
  mod("kandji-fundamentals", "kfd", 8, "Compliance Kandji", null, "badge-kandji-fundamentals"),
];

export const mosyleModules: AltMdmModuleDef[] = [
  mod("mosyle-fundamentals", "msl", 1, "Introduction à Mosyle", null, "badge-mosyle-fundamentals"),
  mod("mosyle-fundamentals", "msl", 2, "Enrollment Mosyle", "mosyle-enrollment", "badge-mosyle-fundamentals"),
  mod("mosyle-fundamentals", "msl", 3, "Management Profiles", null, "badge-mosyle-fundamentals"),
  mod("mosyle-fundamentals", "msl", 4, "Apps et Books", null, "badge-mosyle-fundamentals"),
  mod("mosyle-fundamentals", "msl", 5, "Mosyle Auth", "mosyle-auth", "badge-mosyle-fundamentals"),
  mod("mosyle-fundamentals", "msl", 6, "Mosyle Fuse", null, "badge-mosyle-fundamentals"),
  mod("mosyle-fundamentals", "msl", 7, "Sécurité Mosyle", null, "badge-mosyle-fundamentals"),
  mod("mosyle-fundamentals", "msl", 8, "Reporting Mosyle", null, "badge-mosyle-fundamentals"),
];

export const addigyModules: AltMdmModuleDef[] = [
  mod("addigy-fundamentals", "adg", 1, "Introduction à Addigy", null, "badge-addigy-fundamentals"),
  mod("addigy-fundamentals", "adg", 2, "GoLive", "addigy-golive", "badge-addigy-fundamentals"),
  mod("addigy-fundamentals", "adg", 3, "Policies Addigy", "addigy-policy", "badge-addigy-fundamentals"),
  mod("addigy-fundamentals", "adg", 4, "Smart Software", null, "badge-addigy-fundamentals"),
  mod("addigy-fundamentals", "adg", 5, "Compliance", null, "badge-addigy-fundamentals"),
  mod("addigy-fundamentals", "adg", 6, "Remote Management", null, "badge-addigy-fundamentals"),
  mod("addigy-fundamentals", "adg", 7, "Reporting", null, "badge-addigy-fundamentals"),
  mod("addigy-fundamentals", "adg", 8, "Dépannage", null, "badge-addigy-fundamentals"),
];

export const workspaceOneModules: AltMdmModuleDef[] = [
  mod("workspace-one-apple", "wsa", 1, "Introduction Workspace ONE UEM", null, "badge-workspace-one-apple-specialist"),
  mod("workspace-one-apple", "wsa", 2, "Apple Enrollment", "workspace-one-apple-enrollment", "badge-workspace-one-apple-specialist"),
  mod("workspace-one-apple", "wsa", 3, "Profils macOS", null, "badge-workspace-one-apple-specialist"),
  mod("workspace-one-apple", "wsa", 4, "Profils iOS", null, "badge-workspace-one-apple-specialist"),
  mod("workspace-one-apple", "wsa", 5, "Applications", null, "badge-workspace-one-apple-specialist"),
  mod("workspace-one-apple", "wsa", 6, "Compliance", "workspace-one-compliance", "badge-workspace-one-apple-specialist"),
  mod("workspace-one-apple", "wsa", 7, "Conditional Access", null, "badge-workspace-one-apple-specialist"),
  mod("workspace-one-apple", "wsa", 8, "Reporting", null, "badge-workspace-one-apple-specialist"),
];

export const mdmComparatifModules: AltMdmModuleDef[] = [
  mod("mdm-comparatif-apple", "mdm", 1, "Introduction comparatif MDM Apple", null, "badge-mdm-comparison-expert"),
  mod("mdm-comparatif-apple", "mdm", 2, "Jamf Pro dans l'écosystème", null, "badge-mdm-comparison-expert"),
  mod("mdm-comparatif-apple", "mdm", 3, "Microsoft Intune pour Apple", null, "badge-mdm-comparison-expert"),
  mod("mdm-comparatif-apple", "mdm", 4, "Kandji — forces et limites", null, "badge-mdm-comparison-expert"),
  mod("mdm-comparatif-apple", "mdm", 5, "Mosyle — forces et limites", null, "badge-mdm-comparison-expert"),
  mod("mdm-comparatif-apple", "mdm", 6, "Addigy — forces et limites", null, "badge-mdm-comparison-expert"),
  mod("mdm-comparatif-apple", "mdm", 7, "Workspace ONE UEM pour Apple", null, "badge-mdm-comparison-expert"),
  mod("mdm-comparatif-apple", "mdm", 8, "Matrice de décision & cas d'usage", "mdm-comparison", "badge-mdm-comparison-expert"),
];

/**
 * V1 : Kandji / Mosyle / Addigy / Workspace ONE retirés du catalogue.
 * Seul le comparatif est conservé en données (parcours masqué via tracks.hidden).
 * Les tableaux de modules ci-dessus restent pour archivage / reprise future.
 */
export const allAltMdmModules = [...mdmComparatifModules];

export const altMdmTrackMeta: {
  slug: string;
  title: string;
  level: "Pro";
  lessons: number;
  description: string;
  duration: string;
  logo: LogoName;
  certification: string;
  modules: AltMdmModuleDef[];
}[] = [
  {
    slug: "mdm-comparatif-apple",
    title: "Comparatif MDM Apple Enterprise",
    level: "Pro" as const,
    lessons: 8,
    description: "Jamf, Intune, Kandji, Mosyle, Addigy et Workspace ONE — forces, limites, coûts et cas d'usage.",
    duration: "12 h",
    logo: "dashboard",
    certification: "MDM Comparison Expert",
    modules: mdmComparatifModules,
  },
];

export const ALT_MDM_TRACK_SLUGS = altMdmTrackMeta.map((t) => t.slug);
