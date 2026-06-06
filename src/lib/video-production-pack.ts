import type { VideoStoryboard } from "@/src/lib/video-lessons";
import { getVideoStoryboard } from "@/src/lib/video-storyboards";
import { getVideoAssets, getDiagramForVideo, resolveAssetPaths } from "@/src/lib/video-assets";
import { getScreenshotsForVideo, getScreenshotPublicPath } from "@/src/lib/video-screenshots";
import {
  OFFICIAL_LMS_VIDEOS,
  OFFICIAL_MP4_FILENAMES,
  getOfficialMp4Path,
  getOfficialVideo,
  getProductionStatusLabel,
  buildVideoProductionRecord,
  type VideoProductionRecord,
} from "@/src/lib/video-production";
import { exportStoryboardToMarkdown } from "@/src/lib/video-lessons";


export type ScreenStudioCaptureStep = {
  order: number;
  file: string;
  label: string;
  publicPath: string;
  present: boolean;
  zoomAreas: string[];
  blurAreas: string[];
  transition: string;
};

export type ScreenStudioChecklist = {
  targetDuration: string;
  targetDurationSeconds: number;
  captures: ScreenStudioCaptureStep[];
  generalBlur: string[];
  recommendedTransitions: string[];
};

export type CapCutChecklistItem = {
  label: string;
  detail: string;
};

export const CAPCUT_EDIT_CHECKLIST: CapCutChecklistItem[] = [
  { label: "Intro 5 secondes", detail: "Logo Apple MDM Academy + titre module + fond apple-light.svg" },
  { label: "Logo Apple MDM Academy", detail: "Coin supérieur discret ou lower-third module" },
  { label: "Voix HeyGen", detail: "Piste audio principale · normaliser -3 dB · pas de clipping" },
  { label: "Captures animées", detail: "Screen Studio · zoom 120 % sur actions · transitions 200 ms" },
  { label: "Sous-titres français", detail: "Générés HeyGen ou CapCut auto · relire terminologie MDM" },
  { label: "Lower thirds", detail: "Fichiers /public/video-assets/lower-thirds/ · module + étape" },
  { label: "Outro 5 secondes", detail: "CTA lab + quiz + logo · fond certification.svg" },
  { label: "Export 1080p MP4", detail: "1920×1080 · H.264 · 30 fps · déposer dans /public/videos/" },
];

export type MontageChecklistItem = string;

export const DEFAULT_MONTAGE_CHECKLIST: MontageChecklistItem[] = [
  "Vérifier script HeyGen copié et narration générée",
  "Importer toutes les captures .webp 1920×1080",
  "Synchroniser voix et captures scène par scène",
  "Ajouter diagrammes SVG aux transitions clés",
  "Flouter données sensibles restantes",
  "Relire sous-titres et terminologie",
  "Export MP4 et déposer dans /public/videos/",
  "Vérifier pipeline admin → statut publié",
];

/** Nettoie le script pour HeyGen : sans markdown, phrases courtes, français naturel */
export function cleanHeyGenScript(raw: string): string {
  let text = raw
    .replace(/\*\*/g, "")
    .replace(/__/g, "")
    .replace(/^#+\s*/gm, "")
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const paragraphs = text.split(/\n\n+/);
  const cleaned = paragraphs.map((p) => {
    const sentences = p
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);
    return sentences.join("\n");
  });

  return cleaned.join("\n\n");
}

const DEFAULT_BLUR = [
  "Emails et noms utilisateurs",
  "Serial numbers et UDID",
  "Tenant ID et domaines internes",
  "Adresses IP internes",
];

const DEFAULT_TRANSITIONS = ["Cut 200 ms", "Zoom in 120 % sur action", "Fade 300 ms entre scènes"];

const VIDEO_SCREEN_STUDIO_OVERRIDES: Partial<
  Record<string, { zoomAreas?: string[]; blurAreas?: string[]; transitions?: string[] }>
> = {
  "apple-business-manager": {
    zoomAreas: ["Section Devices", "MDM Servers", "Users & rôles"],
  },
  "abm-intune": {
    zoomAreas: ["Upload token .p7m", "Sync devices", "Enrollment Program Tokens"],
  },
  "ade-iphone": {
    zoomAreas: ["Remote Management", "Setup Assistant", "Device assignment ABM"],
  },
  apns: {
    zoomAreas: ["Create CSR", "Upload certificate", "Expiration date"],
  },
  "managed-apple-ids": {
    zoomAreas: ["Federation Entra ID", "Managed Apple IDs list", "SSO test"],
  },
  "platform-sso": {
    zoomAreas: ["Platform SSO profile", "Extension Team ID", "System Settings PSSO"],
  },
  "jamf-pro-fundamentals": {
    zoomAreas: ["Jamf dashboard", "Computers inventory", "APNs settings"],
  },
  filevault: {
    zoomAreas: ["FileVault status", "Recovery key escrow", "Disk Encryption profile"],
  },
};

export function buildScreenStudioChecklist(
  slug: string,
  presentFiles?: Set<string>
): ScreenStudioChecklist | undefined {
  const storyboard = getVideoStoryboard(slug);
  if (!storyboard) return undefined;

  const catalogShots = getScreenshotsForVideo(slug);
  const override = VIDEO_SCREEN_STUDIO_OVERRIDES[slug];
  const sceneShots = storyboard.scenes.flatMap((s, i) =>
    (s.requiredScreenshots.length ? s.requiredScreenshots : [s.visual]).map((label, j) => ({
      sceneIndex: i,
      label,
    }))
  );

  const captures: ScreenStudioCaptureStep[] = catalogShots.map((shot, index) => ({
    order: index + 1,
    file: shot.file,
    label: shot.label,
    publicPath: getScreenshotPublicPath(shot.file),
    present: presentFiles?.has(shot.file) ?? false,
    zoomAreas: override?.zoomAreas?.slice(0, 2) ?? [`Action principale — ${shot.label}`],
    blurAreas: override?.blurAreas ?? DEFAULT_BLUR.slice(0, 3),
    transition: DEFAULT_TRANSITIONS[index % DEFAULT_TRANSITIONS.length] ?? "Cut 200 ms",
  }));

  if (captures.length === 0 && sceneShots.length > 0) {
    sceneShots.forEach((s, index) => {
      captures.push({
        order: index + 1,
        file: `${slug}-scene-${s.sceneIndex + 1}.webp`,
        label: s.label,
        publicPath: `/video-assets/screenshots/${slug}-scene-${s.sceneIndex + 1}.webp`,
        present: false,
        zoomAreas: override?.zoomAreas ?? ["Zone d'action principale"],
        blurAreas: DEFAULT_BLUR.slice(0, 3),
        transition: DEFAULT_TRANSITIONS[index % DEFAULT_TRANSITIONS.length] ?? "Cut 200 ms",
      });
    });
  }

  return {
    targetDuration: storyboard.duration,
    targetDurationSeconds: storyboard.durationSeconds,
    captures,
    generalBlur: override?.blurAreas ?? DEFAULT_BLUR,
    recommendedTransitions: override?.transitions ?? DEFAULT_TRANSITIONS,
  };
}

export type VideoProductionPack = {
  slug: string;
  title: string;
  objective: string;
  module: string;
  heygenScript: string;
  heygenScriptClean: string;
  scenes: VideoStoryboard["scenes"];
  assets: string[];
  assetPack?: ReturnType<typeof getVideoAssets>;
  diagram?: ReturnType<typeof getDiagramForVideo>;
  screenStudio: ScreenStudioChecklist;
  capCutChecklist: CapCutChecklistItem[];
  montageChecklist: MontageChecklistItem[];
  mp4Path: string;
  mp4Filename: string;
  record: VideoProductionRecord;
  storyboard: VideoStoryboard;
};

export function buildProductionPack(
  slug: string,
  options?: { presentScreenshotFiles?: Set<string>; mp4Available?: boolean; mp4Url?: string }
): VideoProductionPack | undefined {
  const meta = getOfficialVideo(slug);
  const storyboard = getVideoStoryboard(slug);
  if (!meta || !storyboard) return undefined;

  const screenStudio = buildScreenStudioChecklist(slug, options?.presentScreenshotFiles);
  if (!screenStudio) return undefined;

  const assetPack = getVideoAssets(slug);
  const assets = assetPack ? resolveAssetPaths(assetPack) : [];
  const record = buildVideoProductionRecord(meta, options);

  return {
    slug,
    title: storyboard.title,
    objective: storyboard.objective,
    module: storyboard.module,
    heygenScript: storyboard.narration,
    heygenScriptClean: cleanHeyGenScript(storyboard.narration),
    scenes: storyboard.scenes,
    assets,
    assetPack: assetPack ?? undefined,
    diagram: getDiagramForVideo(slug),
    screenStudio,
    capCutChecklist: CAPCUT_EDIT_CHECKLIST,
    montageChecklist: DEFAULT_MONTAGE_CHECKLIST,
    mp4Path: getOfficialMp4Path(slug),
    mp4Filename: OFFICIAL_MP4_FILENAMES[slug] ?? `${slug}.mp4`,
    record,
    storyboard,
  };
}

export function getAllProductionPacks(options?: {
  presentScreenshotFiles?: Set<string>;
  mp4AvailableBySlug?: Record<string, boolean>;
  mp4UrlBySlug?: Record<string, string | undefined>;
}): VideoProductionPack[] {
  return OFFICIAL_LMS_VIDEOS.map((meta) =>
    buildProductionPack(meta.slug, {
      presentScreenshotFiles: options?.presentScreenshotFiles,
      mp4Available: options?.mp4AvailableBySlug?.[meta.slug] ?? false,
      mp4Url: options?.mp4UrlBySlug?.[meta.slug],
    })
  ).filter(Boolean) as VideoProductionPack[];
}

export function exportProductionPackToMarkdown(pack: VideoProductionPack): string {
  const { record, storyboard, screenStudio } = pack;

  const lines = [
    `# Production Pack — ${pack.title}`,
    "",
    "## Métadonnées",
    "",
    `- **Objectif :** ${pack.objective}`,
    `- **Module :** ${pack.module}`,
    `- **Durée cible :** ${storyboard.duration}`,
    `- **Statut publication :** ${getProductionStatusLabel(record.status)} (${record.pipelinePercent} %)`,
    `- **MP4 attendu :** \`${pack.mp4Path}\` → \`/public/videos/${pack.mp4Filename}\``,
    `- **Ressource :** /resources/${record.resourceSlug ?? "—"}`,
    `- **Cours :** /cours/${storyboard.courseSlug}`,
    `- **Lab :** /labs/${storyboard.labSlug}`,
    `- **Quiz :** /quiz/${storyboard.quizSlug}`,
    "",
    "## Script HeyGen (nettoyé)",
    "",
    pack.heygenScriptClean,
    "",
    "## Storyboard — scènes",
    "",
    ...pack.scenes.map(
      (s, i) =>
        `### Scène ${i + 1} — ${s.title} (${s.durationSeconds}s)\n\n${s.narration}\n\n**Visuel :** ${s.visual}\n`
    ),
    "",
    "## Captures Screen Studio",
    "",
    `- **Durée cible :** ${screenStudio.targetDuration}`,
    `- **Transitions :** ${screenStudio.recommendedTransitions.join(" · ")}`,
    `- **Zones à flouter :** ${screenStudio.generalBlur.join(" · ")}`,
    "",
    ...screenStudio.captures.map(
      (c) =>
        `${c.order}. [${c.present ? "x" : " "}] **${c.label}** (\`${c.file}\`)\n   - Zoom : ${c.zoomAreas.join(", ")}\n   - Flouter : ${c.blurAreas.join(", ")}\n   - Transition : ${c.transition}`
    ),
    "",
    "## Assets utilisés",
    "",
    ...(pack.assets.length ? pack.assets.map((a) => `- ${a}`) : ["- (aucun pack configuré)"]),
    "",
    ...(pack.diagram
      ? ["## Diagramme", "", `- ${pack.diagram.title}`, `- ${pack.diagram.path}`, ""]
      : []),
    "",
    "## Checklist CapCut",
    "",
    ...pack.capCutChecklist.map((item) => `- [ ] **${item.label}** — ${item.detail}`),
    "",
    "## Checklist montage",
    "",
    ...pack.montageChecklist.map((item) => `- [ ] ${item}`),
    "",
    "## Checklist finale publication",
    "",
    "- [ ] Script HeyGen exporté",
    "- [ ] Captures produites (.webp 1920×1080)",
    "- [ ] Narration HeyGen générée",
    "- [ ] Montage CapCut terminé",
    `- [ ] MP4 déposé : /public/videos/${pack.mp4Filename}`,
    "- [ ] Pipeline admin → vidéo publiée",
    "",
    ...(record.publishBlockers.length
      ? [
          "## Bloquants publication actuels",
          "",
          ...record.publishBlockers.map((b) => `- ${b.label}`),
          "",
        ]
      : []),
    "---",
    "",
    exportStoryboardToMarkdown(storyboard),
  ];

  return lines.join("\n");
}
