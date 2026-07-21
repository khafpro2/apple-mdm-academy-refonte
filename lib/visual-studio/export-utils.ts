import type { CourseStoryboard, StoryboardExportPlan } from "./types";
import { visualStudioMeta } from "./visual-tokens";

const EXPORT_DIR = "/visual-studio/exports";

export function buildExportPlan(storyboard: CourseStoryboard): StoryboardExportPlan {
  const { width, height } = visualStudioMeta.exportViewport;

  return {
    courseId: storyboard.courseId,
    scenes: storyboard.scenes.map((scene) => ({
      sceneId: scene.id,
      order: scene.order,
      pngFilename: `${storyboard.courseId}-scene-${String(scene.order).padStart(2, "0")}.png`,
      exportUrl: `/studio-visuel/${storyboard.courseId}/export?scene=${scene.id}`,
    })),
    svgDiagrams: [
      {
        diagramId: storyboard.architecture.id,
        svgFilename: `${storyboard.courseId}-${storyboard.architecture.id}.svg`,
      },
    ],
    printableUrl: `/studio-visuel/${storyboard.courseId}?view=print`,
    freeformUrl: `/studio-visuel/${storyboard.courseId}?view=freeform`,
    viewport: { width, height },
  };
}

export function sceneExportPath(courseId: string, order: number): string {
  return `${EXPORT_DIR}/${courseId}-scene-${String(order).padStart(2, "0")}.png`;
}

export function diagramExportPath(courseId: string, diagramId: string): string {
  return `${EXPORT_DIR}/${courseId}-${diagramId}.svg`;
}

/**
 * Génère un SVG minimal du flux linéaire (compatible Freeform / impression).
 * Les diagrammes interactifs React restent la source principale ; ce SVG sert d’export.
 */
export function architectureLinearFlowToSvg(
  title: string,
  linearFlow: string[],
  options?: { width?: number; height?: number },
): string {
  const width = options?.width ?? 1600;
  const height = options?.height ?? 320;
  const pad = 40;
  const boxW = Math.min(160, (width - pad * 2) / linearFlow.length - 24);
  const boxH = 72;
  const gap = (width - pad * 2 - boxW * linearFlow.length) / Math.max(linearFlow.length - 1, 1);
  const y = height / 2 - boxH / 2;

  const boxes = linearFlow
    .map((label, i) => {
      const x = pad + i * (boxW + gap);
      const text = escapeXml(label);
      const arrow =
        i < linearFlow.length - 1
          ? `<line x1="${x + boxW}" y1="${y + boxH / 2}" x2="${x + boxW + gap}" y2="${y + boxH / 2}" stroke="#2563EB" stroke-width="2" marker-end="url(#arrow)" />`
          : "";
      return `
      <g>
        <rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="12" fill="#FFFFFF" stroke="#DCE3ED" stroke-width="1.5"/>
        <text x="${x + boxW / 2}" y="${y + boxH / 2 + 4}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#0F172A">${text}</text>
        ${arrow}
      </g>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(title)}">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="#F4F6FA"/>
  <text x="${pad}" y="28" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#0B102B">${escapeXml(title)}</text>
  ${boxes}
</svg>`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Plan de montage Markdown pour Canva / Firefly / HeyGen.
 */
export function buildProductionMarkdown(storyboard: CourseStoryboard): string {
  const lines: string[] = [
    `# Plan de montage — ${storyboard.courseTitle}`,
    "",
    `> ${storyboard.disclaimer ?? "Apple MDM Academy est une plateforme indépendante."}`,
    "",
    `- Module : ${storyboard.moduleTitle}`,
    `- Objectif : ${storyboard.learningObjective}`,
    `- Message central : ${storyboard.centralMessage}`,
    `- Statut : ${storyboard.verificationStatus}`,
    "",
    "## Flux architecture",
    "",
    storyboard.architecture.linearFlow.join(" → "),
    "",
  ];

  for (const scene of storyboard.scenes) {
    lines.push(
      `## Scène ${scene.order} — ${scene.title}`,
      "",
      `- Durée : ${scene.durationSeconds}s`,
      `- Layout : ${scene.visualLayout}`,
      `- Transition : ${scene.transition}`,
      "",
      "### Narration",
      "",
      scene.narration,
      "",
      "### Texte à l’écran",
      "",
      ...scene.onScreenText.map((t) => `- ${t}`),
      "",
      "### Animations",
      "",
      ...scene.animationInstructions.map((t) => `- ${t}`),
      "",
    );
    if (scene.fireflyPrompt) {
      lines.push("### Adobe Firefly", "", "```", scene.fireflyPrompt, "```", "");
    }
    if (scene.canvaInstructions?.length) {
      lines.push("### Canva", "", ...scene.canvaInstructions.map((t) => `- ${t}`), "");
    }
    if (scene.heygenInstructions?.length) {
      lines.push("### HeyGen", "", ...scene.heygenInstructions.map((t) => `- ${t}`), "");
    }
  }

  lines.push("## Ressources de production", "");
  for (const resource of storyboard.productionResources) {
    lines.push(`### ${resource.title} (${resource.tool})`, "");
    lines.push(...resource.instructions.map((t) => `- ${t}`), "");
    if (resource.prompt) {
      lines.push("```", resource.prompt, "```", "");
    }
  }

  return lines.join("\n");
}

/**
 * Documentation de la méthode d’export Playwright (sans dépendance lourde runtime).
 * Voir `scripts/visual-studio/export-storyboards.mjs` et `npm run export:storyboards`.
 */
export const EXPORT_PLAYWRIGHT_GUIDE = `
# Export storyboards (Playwright)

1. Démarrer le serveur : \`npm run dev\`
2. Lancer : \`npm run export:storyboards\`
3. Le script :
   - ouvre chaque scène en mode export ;
   - force un viewport 1920×1080 ;
   - attend le chargement des polices ;
   - capture la zone \`[data-export-frame]\` ;
   - sauvegarde PNG dans \`public/visual-studio/exports/\` ;
   - écrit les SVG de diagrammes via \`architectureLinearFlowToSvg\`.
`.trim();
