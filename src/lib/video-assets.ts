import type { ArchitectureConnection, ArchitectureNode, VideoStoryboard } from "@/src/lib/video-lessons";
import { exportStoryboardToMarkdown } from "@/src/lib/video-lessons";
import { getIllustratedVideoLessons } from "@/src/lib/video-storyboards";
import type { VideoLevel } from "@/src/lib/video-scripts";
import {
  getScreenshotPublicPath,
  getScreenshotsForVideo,
  SCREENSHOT_CATALOG,
} from "@/src/lib/video-screenshots";
import type { VideoProductionPhase } from "@/src/lib/video-publish-status";
import { getVideoPublishLabel, resolveVideoPublishStatus } from "@/src/lib/video-publish-status";

const BASE = "/video-assets";

/** Icônes réutilisables pour la production vidéo */
export type VideoIconId =
  | "abm"
  | "intune"
  | "jamf"
  | "apns"
  | "ade"
  | "apps-books"
  | "managed-apple-id"
  | "platform-sso"
  | "filevault"
  | "gatekeeper"
  | "xprotect"
  | "sip"
  | "certificate"
  | "cloud"
  | "mac"
  | "iphone"
  | "ipad"
  | "user"
  | "admin"
  | "security-shield";

export type VideoBackgroundId =
  | "apple-light"
  | "microsoft-learn"
  | "jamf-training"
  | "macos-security"
  | "certification";

export type VideoDiagramId =
  | "abm-intune-apns-device"
  | "abm-jamf-apns-device"
  | "ade-workflow"
  | "apns-workflow"
  | "platform-sso-workflow"
  | "jamf-policy-workflow"
  | "filevault-key-escrow"
  | "apps-books-workflow";

export type LowerThirdId = "module" | "objective" | "step" | "recap";

export type VideoIconAsset = {
  id: VideoIconId;
  label: string;
  path: string;
};

export type VideoBackgroundAsset = {
  id: VideoBackgroundId;
  label: string;
  path: string;
  style: "Apple Training Premium" | "Microsoft Learn" | "Jamf Training Catalog" | "macOS Security" | "Certification";
};

export type VideoDiagramAsset = {
  id: VideoDiagramId;
  title: string;
  description: string;
  path: string;
  nodes: ArchitectureNode[];
  connections: ArchitectureConnection[];
};

export type LowerThirdAsset = {
  id: LowerThirdId;
  label: string;
  path: string;
  usage: string;
};

export type VideoAssetPack = {
  slug: string;
  icon: VideoIconId;
  background: VideoBackgroundId;
  diagram?: VideoDiagramId;
  icons: VideoIconId[];
  thumbnailPath: string;
  lowerThirds: LowerThirdId[];
};

export type VideoProductionStatus = {
  slug: string;
  title: string;
  module: string;
  level: VideoLevel;
  status: VideoProductionPhase;
  statusLabel: string;
  hasStoryboard: boolean;
  hasThumbnail: boolean;
  hasDiagram: boolean;
  hasScript: boolean;
  screenshotCount: number;
  screenshotFilesRequired: number;
  screenshotFilesPresent: number;
  assetCount: number;
  missingAssets: string[];
  missingScreenshotFiles: string[];
  missingScreenshots: string[];
  videoUrl?: string;
  productionReady: boolean;
  readyScore: number;
};

export const VIDEO_ICONS: VideoIconAsset[] = [
  { id: "abm", label: "Apple Business Manager", path: `${BASE}/icons/abm.svg` },
  { id: "intune", label: "Intune", path: `${BASE}/icons/intune.svg` },
  { id: "jamf", label: "Jamf", path: `${BASE}/icons/jamf.svg` },
  { id: "apns", label: "APNs", path: `${BASE}/icons/apns.svg` },
  { id: "ade", label: "ADE", path: `${BASE}/icons/ade.svg` },
  { id: "apps-books", label: "Apps & Books", path: `${BASE}/icons/apps-books.svg` },
  { id: "managed-apple-id", label: "Managed Apple ID", path: `${BASE}/icons/managed-apple-id.svg` },
  { id: "platform-sso", label: "Platform SSO", path: `${BASE}/icons/platform-sso.svg` },
  { id: "filevault", label: "FileVault", path: `${BASE}/icons/filevault.svg` },
  { id: "gatekeeper", label: "Gatekeeper", path: `${BASE}/icons/gatekeeper.svg` },
  { id: "xprotect", label: "XProtect", path: `${BASE}/icons/xprotect.svg` },
  { id: "sip", label: "SIP", path: `${BASE}/icons/sip.svg` },
  { id: "certificate", label: "Certificate", path: `${BASE}/icons/certificate.svg` },
  { id: "cloud", label: "Cloud", path: `${BASE}/icons/cloud.svg` },
  { id: "mac", label: "Mac", path: `${BASE}/icons/mac.svg` },
  { id: "iphone", label: "iPhone", path: `${BASE}/icons/iphone.svg` },
  { id: "ipad", label: "iPad", path: `${BASE}/icons/ipad.svg` },
  { id: "user", label: "User", path: `${BASE}/icons/user.svg` },
  { id: "admin", label: "Admin", path: `${BASE}/icons/admin.svg` },
  { id: "security-shield", label: "Security Shield", path: `${BASE}/icons/security-shield.svg` },
];

export const VIDEO_BACKGROUNDS: VideoBackgroundAsset[] = [
  { id: "apple-light", label: "Fond Apple clair", path: `${BASE}/backgrounds/apple-light.svg`, style: "Apple Training Premium" },
  { id: "microsoft-learn", label: "Fond Microsoft Learn", path: `${BASE}/backgrounds/microsoft-learn.svg`, style: "Microsoft Learn" },
  { id: "jamf-training", label: "Fond Jamf Training", path: `${BASE}/backgrounds/jamf-training.svg`, style: "Jamf Training Catalog" },
  { id: "macos-security", label: "Fond sécurité macOS", path: `${BASE}/backgrounds/macos-security.svg`, style: "macOS Security" },
  { id: "certification", label: "Fond certification", path: `${BASE}/backgrounds/certification.svg`, style: "Certification" },
];

export const VIDEO_DIAGRAMS: VideoDiagramAsset[] = [
  {
    id: "abm-intune-apns-device",
    title: "ABM → Intune → APNs → Device",
    description: "Chaîne d'enrollment et push MDM via Intune",
    path: `${BASE}/diagrams/abm-intune-apns-device.svg`,
    nodes: [
      { id: "abm", label: "ABM", icon: "abm" },
      { id: "intune", label: "Intune", icon: "intune" },
      { id: "apns", label: "APNs", icon: "apns" },
      { id: "device", label: "Device", icon: "apple-device" },
    ],
    connections: [
      { from: "abm", to: "intune", label: "ADE Token" },
      { from: "intune", to: "apns", label: "Push cert" },
      { from: "apns", to: "device", label: "MDM commands" },
    ],
  },
  {
    id: "abm-jamf-apns-device",
    title: "ABM → Jamf → APNs → Device",
    description: "Chaîne d'enrollment et push MDM via Jamf Pro",
    path: `${BASE}/diagrams/abm-jamf-apns-device.svg`,
    nodes: [
      { id: "abm", label: "ABM", icon: "abm" },
      { id: "jamf", label: "Jamf Pro", icon: "jamf" },
      { id: "apns", label: "APNs", icon: "apns" },
      { id: "device", label: "Device", icon: "apple-device" },
    ],
    connections: [
      { from: "abm", to: "jamf", label: "ADE Token" },
      { from: "jamf", to: "apns", label: "Push cert" },
      { from: "apns", to: "device", label: "MDM commands" },
    ],
  },
  {
    id: "ade-workflow",
    title: "ADE Workflow",
    description: "Automated Device Enrollment de l'achat au Setup Assistant",
    path: `${BASE}/diagrams/ade-workflow.svg`,
    nodes: [
      { id: "purchase", label: "Achat", icon: "certificate" },
      { id: "abm", label: "ABM", icon: "abm" },
      { id: "mdm", label: "MDM Server", icon: "cloud" },
      { id: "setup", label: "Setup Assistant", icon: "apple-device" },
    ],
    connections: [
      { from: "purchase", to: "abm", label: "Serial sync" },
      { from: "abm", to: "mdm", label: "Assignment" },
      { from: "mdm", to: "setup", label: "Remote Management" },
    ],
  },
  {
    id: "apns-workflow",
    title: "APNs Workflow",
    description: "Certificat push, renouvellement et communication MDM",
    path: `${BASE}/diagrams/apns-workflow.svg`,
    nodes: [
      { id: "mdm", label: "MDM", icon: "intune" },
      { id: "apns", label: "APNs", icon: "apns" },
      { id: "apple", label: "Apple", icon: "cloud" },
      { id: "device", label: "Device", icon: "apple-device" },
    ],
    connections: [
      { from: "mdm", to: "apns", label: "Push cert" },
      { from: "apns", to: "apple", label: "Gateway" },
      { from: "apple", to: "device", label: "Wake device" },
    ],
  },
  {
    id: "platform-sso-workflow",
    title: "Platform SSO Workflow",
    description: "Authentification fédérée macOS via Entra ID",
    path: `${BASE}/diagrams/platform-sso-workflow.svg`,
    nodes: [
      { id: "idp", label: "IdP", icon: "cloud" },
      { id: "entra", label: "Entra ID", icon: "intune" },
      { id: "macos", label: "macOS", icon: "apple-device" },
      { id: "apps", label: "Apps", icon: "certificate" },
    ],
    connections: [
      { from: "idp", to: "entra", label: "Federation" },
      { from: "entra", to: "macos", label: "Platform SSO" },
      { from: "macos", to: "apps", label: "SSO extension" },
    ],
  },
  {
    id: "jamf-policy-workflow",
    title: "Jamf Policy Workflow",
    description: "Smart Group → Policy → exécution sur les devices",
    path: `${BASE}/diagrams/jamf-policy-workflow.svg`,
    nodes: [
      { id: "sg", label: "Smart Group", icon: "jamf" },
      { id: "policy", label: "Policy", icon: "certificate" },
      { id: "payload", label: "Script/Profile", icon: "cloud" },
      { id: "device", label: "Device", icon: "apple-device" },
    ],
    connections: [
      { from: "sg", to: "policy", label: "Scope" },
      { from: "policy", to: "payload", label: "Payload" },
      { from: "payload", to: "device", label: "Check-in" },
    ],
  },
  {
    id: "filevault-key-escrow",
    title: "FileVault Key Escrow",
    description: "Chiffrement disque et récupération de clé via MDM",
    path: `${BASE}/diagrams/filevault-key-escrow.svg`,
    nodes: [
      { id: "mac", label: "Mac", icon: "apple-device" },
      { id: "fv", label: "FileVault", icon: "security" },
      { id: "mdm", label: "MDM", icon: "intune" },
      { id: "escrow", label: "Escrow Key", icon: "certificate" },
    ],
    connections: [
      { from: "mac", to: "fv", label: "Enable FV" },
      { from: "fv", to: "mdm", label: "Personal recovery key" },
      { from: "mdm", to: "escrow", label: "Escrow" },
    ],
  },
  {
    id: "apps-books-workflow",
    title: "Apps & Books Workflow",
    description: "Distribution d'apps VPP depuis ABM vers les devices",
    path: `${BASE}/diagrams/apps-books-workflow.svg`,
    nodes: [
      { id: "abm", label: "ABM", icon: "abm" },
      { id: "vpp", label: "Apps & Books", icon: "cloud" },
      { id: "mdm", label: "MDM", icon: "intune" },
      { id: "device", label: "Device", icon: "apple-device" },
    ],
    connections: [
      { from: "abm", to: "vpp", label: "Token VPP" },
      { from: "vpp", to: "mdm", label: "App assignment" },
      { from: "mdm", to: "device", label: "Install" },
    ],
  },
];

export const LOWER_THIRDS: LowerThirdAsset[] = [
  { id: "module", label: "Nom du module", path: `${BASE}/lower-thirds/module.svg`, usage: "Intro de chaque vidéo" },
  { id: "objective", label: "Objectif pédagogique", path: `${BASE}/lower-thirds/objective.svg`, usage: "Scène 1 — problème / concept" },
  { id: "step", label: "Étape en cours", path: `${BASE}/lower-thirds/step.svg`, usage: "Scène 3 — démonstration" },
  { id: "recap", label: "Résumé final", path: `${BASE}/lower-thirds/recap.svg`, usage: "Scène 5 — passage au lab" },
];

/** Mapping slug vidéo → pack d'assets production */
export const VIDEO_ASSET_PACKS: Record<string, VideoAssetPack> = {
  "apple-business-manager": {
    slug: "apple-business-manager",
    icon: "abm",
    background: "apple-light",
    icons: ["abm", "admin", "user", "cloud"],
    thumbnailPath: `${BASE}/thumbnails/apple-business-manager.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "abm-intune": {
    slug: "abm-intune",
    icon: "intune",
    background: "microsoft-learn",
    diagram: "abm-intune-apns-device",
    icons: ["abm", "intune", "apns", "certificate"],
    thumbnailPath: `${BASE}/thumbnails/abm-intune.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "ade-iphone": {
    slug: "ade-iphone",
    icon: "iphone",
    background: "apple-light",
    diagram: "ade-workflow",
    icons: ["ade", "abm", "iphone", "cloud"],
    thumbnailPath: `${BASE}/thumbnails/ade-iphone.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "ade-mac": {
    slug: "ade-mac",
    icon: "mac",
    background: "apple-light",
    diagram: "ade-workflow",
    icons: ["ade", "abm", "mac", "cloud"],
    thumbnailPath: `${BASE}/thumbnails/ade-mac.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  apns: {
    slug: "apns",
    icon: "apns",
    background: "microsoft-learn",
    diagram: "apns-workflow",
    icons: ["apns", "certificate", "intune", "cloud"],
    thumbnailPath: `${BASE}/thumbnails/apns.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "apps-books": {
    slug: "apps-books",
    icon: "apps-books",
    background: "apple-light",
    diagram: "apps-books-workflow",
    icons: ["apps-books", "abm", "intune", "iphone"],
    thumbnailPath: `${BASE}/thumbnails/apps-books.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "managed-apple-ids": {
    slug: "managed-apple-ids",
    icon: "managed-apple-id",
    background: "apple-light",
    icons: ["managed-apple-id", "abm", "user", "admin"],
    thumbnailPath: `${BASE}/thumbnails/managed-apple-ids.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "platform-sso": {
    slug: "platform-sso",
    icon: "platform-sso",
    background: "microsoft-learn",
    diagram: "platform-sso-workflow",
    icons: ["platform-sso", "intune", "mac", "user"],
    thumbnailPath: `${BASE}/thumbnails/platform-sso.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "ios-ipados-profiles": {
    slug: "ios-ipados-profiles",
    icon: "ipad",
    background: "microsoft-learn",
    icons: ["iphone", "ipad", "intune", "certificate"],
    thumbnailPath: `${BASE}/thumbnails/ios-ipados-profiles.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "macos-profiles": {
    slug: "macos-profiles",
    icon: "mac",
    background: "microsoft-learn",
    icons: ["mac", "intune", "certificate", "cloud"],
    thumbnailPath: `${BASE}/thumbnails/macos-profiles.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  filevault: {
    slug: "filevault",
    icon: "filevault",
    background: "macos-security",
    diagram: "filevault-key-escrow",
    icons: ["filevault", "mac", "intune", "security-shield"],
    thumbnailPath: `${BASE}/thumbnails/filevault.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "gatekeeper-xprotect-sip": {
    slug: "gatekeeper-xprotect-sip",
    icon: "gatekeeper",
    background: "macos-security",
    icons: ["gatekeeper", "xprotect", "sip", "security-shield", "mac"],
    thumbnailPath: `${BASE}/thumbnails/gatekeeper-xprotect-sip.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "jamf-pro-fundamentals": {
    slug: "jamf-pro-fundamentals",
    icon: "jamf",
    background: "jamf-training",
    diagram: "abm-jamf-apns-device",
    icons: ["jamf", "abm", "apns", "mac"],
    thumbnailPath: `${BASE}/thumbnails/jamf-pro-fundamentals.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "jamf-smart-groups": {
    slug: "jamf-smart-groups",
    icon: "jamf",
    background: "jamf-training",
    diagram: "jamf-policy-workflow",
    icons: ["jamf", "mac", "iphone", "user"],
    thumbnailPath: `${BASE}/thumbnails/jamf-smart-groups.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "jamf-policies": {
    slug: "jamf-policies",
    icon: "jamf",
    background: "jamf-training",
    diagram: "jamf-policy-workflow",
    icons: ["jamf", "mac", "certificate", "cloud"],
    thumbnailPath: `${BASE}/thumbnails/jamf-policies.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "jamf-scripts": {
    slug: "jamf-scripts",
    icon: "jamf",
    background: "jamf-training",
    diagram: "jamf-policy-workflow",
    icons: ["jamf", "mac", "admin", "cloud"],
    thumbnailPath: `${BASE}/thumbnails/jamf-scripts.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "jamf-patch-management": {
    slug: "jamf-patch-management",
    icon: "jamf",
    background: "jamf-training",
    diagram: "jamf-policy-workflow",
    icons: ["jamf", "mac", "cloud", "security-shield"],
    thumbnailPath: `${BASE}/thumbnails/jamf-patch-management.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
  "jamf-protect": {
    slug: "jamf-protect",
    icon: "security-shield",
    background: "jamf-training",
    icons: ["security-shield", "jamf", "mac", "xprotect"],
    thumbnailPath: `${BASE}/thumbnails/jamf-protect.svg`,
    lowerThirds: ["module", "objective", "step", "recap"],
  },
};

export function getVideoIcon(id: VideoIconId): VideoIconAsset {
  return VIDEO_ICONS.find((i) => i.id === id) ?? VIDEO_ICONS[0];
}

export function getVideoBackground(id: VideoBackgroundId): VideoBackgroundAsset {
  return VIDEO_BACKGROUNDS.find((b) => b.id === id) ?? VIDEO_BACKGROUNDS[0];
}

export function getVideoDiagram(id: VideoDiagramId): VideoDiagramAsset {
  return VIDEO_DIAGRAMS.find((d) => d.id === id)!;
}

export function getVideoAssets(slug: string): VideoAssetPack | undefined {
  return VIDEO_ASSET_PACKS[slug];
}

export function getThumbnailPath(slug: string): string {
  return VIDEO_ASSET_PACKS[slug]?.thumbnailPath ?? `${BASE}/thumbnails/${slug}.svg`;
}

export function getDiagramForVideo(slug: string): VideoDiagramAsset | undefined {
  const pack = VIDEO_ASSET_PACKS[slug];
  if (!pack?.diagram) return undefined;
  return getVideoDiagram(pack.diagram);
}

export function resolveAssetPaths(pack: VideoAssetPack): string[] {
  const paths: string[] = [
    pack.thumbnailPath,
    getVideoBackground(pack.background).path,
    getVideoIcon(pack.icon).path,
    ...pack.icons.map((id) => getVideoIcon(id).path),
    ...pack.lowerThirds.map((id) => LOWER_THIRDS.find((l) => l.id === id)!.path),
  ];
  if (pack.diagram) paths.push(getVideoDiagram(pack.diagram).path);
  return [...new Set(paths)];
}

/** Export pack complet pour montage (HeyGen, Screen Studio, Canva, CapCut) */
export function exportVideoProductionPack(
  storyboard: VideoStoryboard,
  options?: { presentScreenshotFiles?: string[] }
): string {
  const pack = getVideoAssets(storyboard.slug);
  const diagram = pack?.diagram ? getVideoDiagram(pack.diagram) : undefined;
  const assetPaths = pack ? resolveAssetPaths(pack) : [];
  const catalogShots = getScreenshotsForVideo(storyboard.slug);
  const presentSet = new Set(options?.presentScreenshotFiles ?? []);
  const publish = resolveVideoPublishStatus(storyboard.slug, {
    presentScreenshotFiles: options?.presentScreenshotFiles
      ? new Set(options.presentScreenshotFiles)
      : undefined,
    validScreenshotFiles: options?.presentScreenshotFiles
      ? new Set(options.presentScreenshotFiles)
      : undefined,
  });

  const lines = [
    `# Production Pack — ${storyboard.title}`,
    "",
    "## Métadonnées",
    "",
    `- **Slug :** ${storyboard.slug}`,
    `- **Module :** ${storyboard.module}`,
    `- **Niveau :** ${storyboard.level}`,
    `- **Durée :** ${storyboard.duration}`,
    `- **Statut :** ${getVideoPublishLabel(publish.status)}`,
    `- **Vidéo finale :** ${publish.videoUrl ?? storyboard.videoUrl ?? "(non publiée)"}`,
    `- **Cours :** /cours/${storyboard.courseSlug}`,
    `- **Lab :** /labs/${storyboard.labSlug}`,
    `- **Quiz :** /quiz/${storyboard.quizSlug}`,
    "",
    "## Script HeyGen",
    "",
    storyboard.narration,
    "",
    "## Miniature",
    "",
    pack ? `- ${pack.thumbnailPath}` : "- (non définie)",
    "",
    "## Diagramme associé",
    "",
    diagram
      ? [`- **${diagram.title}**`, `- Fichier : ${diagram.path}`, `- ${diagram.description}`, ""].join("\n")
      : "- Aucun diagramme workflow dédié",
    "",
    "## Assets SVG",
    "",
    ...(assetPaths.length ? assetPaths.map((p) => `- ${p}`) : ["- (pack non configuré)"]),
    "",
    "## Captures nécessaires (storyboard)",
    "",
    ...storyboard.allScreenshots.map((s) => `- [ ] ${s}`),
    "",
    "## Captures fichiers (.webp 1920×1080)",
    "",
    "### Présentes",
    "",
    ...(catalogShots.filter((s) => presentSet.has(s.file)).length
      ? catalogShots.filter((s) => presentSet.has(s.file)).map((s) => `- [x] ${getScreenshotPublicPath(s.file)} — ${s.label}`)
      : ["- (aucune — exécuter node scripts/check-video-screenshots.mjs)"]),
    "",
    "### Manquantes",
    "",
    ...(catalogShots.filter((s) => !presentSet.has(s.file)).length
      ? catalogShots.filter((s) => !presentSet.has(s.file)).map((s) => `- [ ] ${getScreenshotPublicPath(s.file)} — ${s.label}`)
      : ["- Toutes les captures cataloguées sont présentes"]),
    "",
    "## Checklist montage",
    "",
    "- [ ] Enregistrer captures Screen Studio (1920×1080 · .webp · flouter données sensibles)",
    "- [ ] Générer narration HeyGen (16:9 · sous-titres FR)",
    "- [ ] Importer assets SVG + lower-thirds Canva",
    "- [ ] Monter dans CapCut (transitions 200 ms · musique -18 dB)",
    "- [ ] Exporter MP4 → `/public/videos/" + storyboard.slug + ".mp4`",
    "- [ ] Mettre statut `published` dans video-publish-status.ts",
    "- [ ] Valider lab + quiz associés",
    "",
    "## Instructions montage",
    "",
    "### HeyGen",
    "- Avatar : " + storyboard.heygen.avatar,
    "- Voix : " + storyboard.heygen.voice,
    "- Format : " + storyboard.heygen.format,
    "- Une prise par scène, fond clair, sous-titres FR",
    "",
    "### Screen Studio",
    "- Enregistrer les captures listées ci-dessus",
    "- Zoom 120 % sur les actions clés",
    "- Curseur visible, transitions 200 ms",
    "- Flouter emails, serial numbers, tenant IDs",
    "",
    "### Canva",
    "- Importer backgrounds depuis `/public/video-assets/backgrounds/`",
    "- Lower thirds depuis `/public/video-assets/lower-thirds/`",
    "- Icônes SVG depuis `/public/video-assets/icons/`",
    "",
    "### CapCut",
    "- Assembler HeyGen + captures + diagrammes",
    "- Musique corporate -18 dB sous la voix",
    "- Export 1920×1080 · H.264 · `/public/videos/" + storyboard.slug + ".mp4`",
    "",
    "Guide captures : /resources/guide-captures-video",
    "Guide montage : /resources/video-production-guide",
    "",
    "---",
    "",
    exportStoryboardToMarkdown(storyboard),
  ];

  return lines.join("\n");
}

export function getVideoProductionStatus(options?: {
  presentScreenshotFiles?: Set<string>;
}): {
  videos: VideoProductionStatus[];
  totalVideos: number;
  withStoryboard: number;
  withThumbnail: number;
  withDiagram: number;
  screenshotsPresent: number;
  screenshotsRequired: number;
  productionReadyPercent: number;
} {
  const storyboards = getIllustratedVideoLessons();
  const presentSet = options?.presentScreenshotFiles ?? new Set<string>();
  const totalCatalogShots = SCREENSHOT_CATALOG.categories.reduce((n, c) => n + c.items.length, 0);

  const videos: VideoProductionStatus[] = storyboards.map((sb) => {
    const pack = getVideoAssets(sb.slug);
    const publish = resolveVideoPublishStatus(sb.slug, {
      validScreenshotFiles: presentSet,
      presentScreenshotFiles: presentSet,
    });
    const hasStoryboard = sb.scenes.length >= 5 && sb.narration.length > 100;
    const hasThumbnail = Boolean(pack?.thumbnailPath);
    const hasDiagram = Boolean(pack?.diagram);
    const hasScript = sb.narration.length > 200;
    const assetPaths = pack ? resolveAssetPaths(pack) : [];
    const missingAssets = pack ? [] : [`Pack assets manquant pour ${sb.slug}`];
    const catalogShots = getScreenshotsForVideo(sb.slug);
    const missingScreenshotFiles = catalogShots.filter((s) => !presentSet.has(s.file)).map((s) => s.file);
    const screenshotFilesPresent = catalogShots.filter((s) => presentSet.has(s.file)).length;
    const missingScreenshots =
      sb.allScreenshots.length === 0 ? ["Aucune capture listée dans le storyboard"] : [];

    const checks = [
      hasStoryboard,
      hasThumbnail,
      hasScript,
      assetPaths.length >= 5,
      sb.allScreenshots.length > 0,
      catalogShots.length === 0 || screenshotFilesPresent === catalogShots.length,
      publish.status === "screenshots-ready" ||
        publish.status === "published" ||
        publish.status === "ready-to-publish" ||
        publish.status === "editing",
    ];
    const readyScore = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    const productionReady = readyScore >= 75;

    return {
      slug: sb.slug,
      title: sb.title,
      module: sb.module,
      level: sb.level,
      status: publish.status,
      statusLabel: getVideoPublishLabel(publish.status),
      hasStoryboard,
      hasThumbnail,
      hasDiagram,
      hasScript,
      screenshotCount: sb.allScreenshots.length,
      screenshotFilesRequired: catalogShots.length,
      screenshotFilesPresent,
      assetCount: assetPaths.length,
      missingAssets,
      missingScreenshotFiles,
      missingScreenshots,
      videoUrl: publish.videoUrl ?? sb.videoUrl,
      productionReady,
      readyScore,
    };
  });

  const totalVideos = videos.length;
  const withStoryboard = videos.filter((v) => v.hasStoryboard).length;
  const withThumbnail = videos.filter((v) => v.hasThumbnail).length;
  const withDiagram = videos.filter((v) => v.hasDiagram).length;
  const screenshotsPresent = presentSet.size;
  const productionReadyPercent =
    totalVideos === 0 ? 0 : Math.round(videos.reduce((s, v) => s + v.readyScore, 0) / totalVideos);

  return {
    videos,
    totalVideos,
    withStoryboard,
    withThumbnail,
    withDiagram,
    screenshotsPresent,
    screenshotsRequired: totalCatalogShots,
    productionReadyPercent,
  };
}
