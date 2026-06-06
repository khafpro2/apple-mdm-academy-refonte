import { HEYGEN_VIDEO_DEFAULTS } from "@/src/lib/video-scripts";
import type { VideoLevel } from "@/src/lib/video-scripts";
import type { VideoProductionPhase } from "@/src/lib/video-publish-status";

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
  durationSeconds: number;
  narration: string;
  /** Visuel attendu (Canva / Screen Studio) */
  visual: string;
  /** Animation recommandée (CSS, CapCut, Screen Studio) */
  animation: string;
  visualType: VideoSceneVisualType;
  requiredScreenshots: string[];
  onScreenText: string[];
  nodes?: ArchitectureNode[];
  connections?: ArchitectureConnection[];
  checklistItems?: string[];
  comparison?: { left: string; right: string };
  /** @deprecated alias de visual */
  visualHint?: string;
  screenshotTarget?: string;
};

export type VideoStoryboard = {
  slug: string;
  title: string;
  module: string;
  duration: string;
  durationSeconds: number;
  level: VideoLevel;
  objective: string;
  visualType: VideoSceneVisualType;
  scenes: VideoScene[];
  narration: string;
  courseSlug: string;
  labSlug: string;
  quizSlug: string;
  /** Captures agrégées pour la production */
  allScreenshots: string[];
  /** Statut pipeline production vidéo */
  status: VideoProductionPhase;
  /** URL MP4 finale (si publiée) */
  videoUrl?: string;
  heygen: {
    avatar: string;
    voice: string;
    language: string;
    format: string;
    style: string;
  };
  /** @deprecated */
  relatedCourse?: string;
  /** @deprecated */
  relatedLab?: string;
};

export type VideoLesson = VideoStoryboard;

export function buildNarrationFromScenes(scenes: VideoScene[]): string {
  return scenes.map((s) => s.narration).join("\n\n");
}

export function estimateDurationSeconds(scenes: VideoScene[]): number {
  return scenes.reduce((sum, s) => sum + s.durationSeconds, 0);
}

export function formatDuration(seconds: number): string {
  const m = Math.max(1, Math.round(seconds / 60));
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

export function collectAllScreenshots(scenes: VideoScene[]): string[] {
  const set = new Set<string>();
  for (const scene of scenes) {
    scene.requiredScreenshots.forEach((s) => set.add(s));
    if (scene.screenshotTarget) set.add(scene.screenshotTarget);
  }
  return [...set];
}

/** Alias demandé par la spec */
export function exportStoryboardToMarkdown(storyboard: VideoStoryboard): string {
  return exportStoryboardMarkdown(storyboard);
}

export function exportStoryboardMarkdown(storyboard: VideoStoryboard): string {
  const lines = [
    `# ${storyboard.title}`,
    "",
    "## Métadonnées",
    "",
    `- **Module :** ${storyboard.module}`,
    `- **Niveau :** ${storyboard.level}`,
    `- **Durée estimée :** ${storyboard.duration} (${storyboard.durationSeconds}s)`,
    `- **Objectif pédagogique :** ${storyboard.objective}`,
    `- **Cours :** \`/cours/${storyboard.courseSlug}\``,
    `- **Lab :** \`/labs/${storyboard.labSlug}\``,
    `- **Quiz :** \`/quiz/${storyboard.quizSlug}\``,
    "",
    "## Instructions HeyGen",
    "",
    `- Avatar : **${storyboard.heygen.avatar}**`,
    `- Voix : **${storyboard.heygen.voice}**`,
    `- Langue : ${storyboard.heygen.language}`,
    `- Format : ${storyboard.heygen.format}`,
    `- Style : ${storyboard.heygen.style}`,
    "- Sous-titres : français, texte court à l'écran",
    "- Découpage : une prise par scène, fond clair Apple Training Premium",
    "",
    "## Instructions montage",
    "",
    "- **Screen Studio** : zooms sur captures ABM / Intune / Jamf / macOS",
    "- **Canva** : slides intro + récap, icônes SVG `/public/illustrations/`",
    "- **CapCut** : transitions 200ms, flèches animées entre scènes architecture",
    "- Musique : discrète, corporate, -18 dB sous la voix",
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
      `- **Durée :** ${scene.durationSeconds}s`,
      `- **Type :** ${scene.visualType}`,
      `- **Visuel :** ${scene.visual}`,
      `- **Animation :** ${scene.animation}`,
      "",
      "**Texte à l'écran :**",
      "",
      ...(scene.onScreenText.length ? scene.onScreenText.map((t) => `- ${t}`) : ["- (narration seule)"]),
      "",
      "**Narration :**",
      "",
      scene.narration,
      ""
    );
    if (scene.requiredScreenshots.length) {
      lines.push("**Captures scène :**", "", ...scene.requiredScreenshots.map((s) => `- ${s}`), "");
    }
    if (scene.checklistItems?.length) {
      lines.push("**Points clés :**", "", ...scene.checklistItems.map((i) => `- ${i}`), "");
    }
  });

  lines.push(
    "## Captures nécessaires (liste complète)",
    "",
    ...storyboard.allScreenshots.map((s) => `- ${s}`),
    "",
    "## Checklist production",
    "",
    "- [ ] Enregistrer narration HeyGen (16:9)",
    "- [ ] Capturer écrans listés ci-dessus",
    "- [ ] Monter scènes dans CapCut / Screen Studio",
    "- [ ] Ajouter sous-titres FR",
    "- [ ] Publier sur `/videos/" + storyboard.slug + "`",
    "- [ ] Valider lab + quiz associés",
    ""
  );

  return lines.join("\n");
}
