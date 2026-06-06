import { HEYGEN_VIDEO_DEFAULTS } from "@/src/lib/video-scripts";

/** Types de scènes visuelles pour les vidéos illustrées */
export type VideoSceneVisualType =
  | "diagram"
  | "screenshot"
  | "avatar"
  | "comparison"
  | "checklist"
  | "process"
  | "architecture"
  | "recap";

export type IllustrationName =
  | "apple-device"
  | "abm"
  | "intune"
  | "jamf"
  | "apns"
  | "security"
  | "certificate"
  | "cloud";

export type ArchitectureNode = {
  id: string;
  label: string;
  icon?: IllustrationName;
};

export type ArchitectureConnection = {
  from: string;
  to: string;
  label?: string;
};

export type VideoScene = {
  id: string;
  title: string;
  visualType: VideoSceneVisualType;
  narration: string;
  durationSeconds: number;
  /** Indication visuelle pour production HeyGen / captures */
  visualHint: string;
  nodes?: ArchitectureNode[];
  connections?: ArchitectureConnection[];
  checklistItems?: string[];
  comparison?: { left: string; right: string };
  screenshotTarget?: string;
};

export type VideoStoryboard = {
  slug: string;
  title: string;
  module: string;
  duration: string;
  durationSeconds: number;
  objective: string;
  /** Type visuel dominant de la vidéo */
  visualType: VideoSceneVisualType;
  scenes: VideoScene[];
  /** Script narrateur complet (HeyGen) */
  narration: string;
  relatedCourse: string;
  relatedLab: string;
  heygen: {
    avatar: string;
    voice: string;
    language: string;
    format: string;
    style: string;
  };
};

export type VideoLesson = VideoStoryboard;

export function buildNarrationFromScenes(scenes: VideoScene[]): string {
  return scenes.map((s) => s.narration).join("\n\n");
}

export function estimateDurationSeconds(scenes: VideoScene[]): number {
  return scenes.reduce((sum, s) => sum + s.durationSeconds, 0);
}

export function formatDuration(seconds: number): string {
  const m = Math.round(seconds / 60);
  return `${m} min`;
}

export function defaultHeygenMeta() {
  return {
    avatar: HEYGEN_VIDEO_DEFAULTS.avatar,
    voice: HEYGEN_VIDEO_DEFAULTS.voice,
    language: HEYGEN_VIDEO_DEFAULTS.language,
    format: HEYGEN_VIDEO_DEFAULTS.format,
    style: HEYGEN_VIDEO_DEFAULTS.style,
  };
}

export function exportStoryboardMarkdown(storyboard: VideoStoryboard): string {
  const lines = [
    `# ${storyboard.title}`,
    "",
    `- **Module :** ${storyboard.module}`,
    `- **Durée estimée :** ${storyboard.duration}`,
    `- **Objectif :** ${storyboard.objective}`,
    `- **Cours associé :** \`${storyboard.relatedCourse}\``,
    `- **Lab associé :** \`${storyboard.relatedLab}\``,
    "",
    "## Configuration HeyGen",
    "",
    `- Avatar : ${storyboard.heygen.avatar}`,
    `- Voix : ${storyboard.heygen.voice}`,
    `- Langue : ${storyboard.heygen.language}`,
    `- Format : ${storyboard.heygen.format}`,
    `- Style : ${storyboard.heygen.style}`,
    "",
    "## Script narrateur complet",
    "",
    storyboard.narration,
    "",
    "## Scènes",
    "",
  ];

  storyboard.scenes.forEach((scene, index) => {
    lines.push(
      `### Scène ${index + 1} — ${scene.title}`,
      "",
      `- **Type visuel :** ${scene.visualType}`,
      `- **Durée :** ${scene.durationSeconds}s`,
      `- **Visuel à produire :** ${scene.visualHint}`,
      scene.screenshotTarget ? `- **Capture :** ${scene.screenshotTarget}` : "",
      "",
      "**Narration :**",
      "",
      scene.narration,
      ""
    );
    if (scene.checklistItems?.length) {
      lines.push("**Checklist :**", "", ...scene.checklistItems.map((i) => `- ${i}`), "");
    }
    if (scene.comparison) {
      lines.push(`**Comparaison :** ${scene.comparison.left} ↔ ${scene.comparison.right}`, "");
    }
    if (scene.nodes?.length) {
      lines.push(
        "**Architecture :**",
        "",
        ...scene.nodes.map((n) => `- ${n.label}${n.icon ? ` (${n.icon})` : ""}`),
        ""
      );
    }
  });

  lines.push("## Captures nécessaires", "");
  const captures = storyboard.scenes
    .filter((s) => s.screenshotTarget || s.visualType === "screenshot")
    .map((s) => `- ${s.screenshotTarget ?? s.visualHint}`);
  lines.push(...(captures.length ? captures : ["- Aucune capture obligatoire — animations diagrammes suffisantes"]), "");

  return lines.filter(Boolean).join("\n");
}
