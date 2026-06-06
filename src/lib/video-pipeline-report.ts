import type { VideoProductionRecord } from "@/src/lib/video-production";
import { getProductionStatusLabel, getNextPipelineAction } from "@/src/lib/video-production";
import { getScreenshotsForVideo } from "@/src/lib/video-screenshots";

export function exportPipelineReportMarkdown(
  records: VideoProductionRecord[],
  options?: { presentScreenshotFiles?: Set<string> }
): string {
  const date = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines: string[] = [
    "# Rapport pipeline vidéo — Apple MDM Academy",
    "",
    `Généré le ${date}`,
    "",
    `Vidéos officielles : ${records.length}`,
    `Progression moyenne : ${Math.round(records.reduce((s, r) => s + r.pipelinePercent, 0) / Math.max(records.length, 1))} %`,
    "",
    "---",
    "",
  ];

  for (const r of records) {
    const blockers = r.publishBlockers;
    const requiredShots = getScreenshotsForVideo(r.slug);
    const missingCaptures = requiredShots
      .filter((s) => !options?.presentScreenshotFiles?.has(s.file))
      .map((s) => s.file);

    lines.push(`## ${r.title}`);
    lines.push("");
    lines.push(`- **Slug :** \`${r.slug}\``);
    lines.push(`- **Statut :** ${getProductionStatusLabel(r.status)}`);
    lines.push(`- **Progression :** ${r.pipelinePercent} %`);
    lines.push(`- **Score détaillé :** storyboard ${r.score.storyboard ? "✓" : "✗"} · script ${r.score.script ? "✓" : "✗"} · ressource ${r.score.resource ? "✓" : "✗"} · captures ${r.score.captures ? "✓" : "✗"} · narration ${r.score.narration ? "✓" : "✗"} · montage ${r.score.montage ? "✓" : "✗"} · MP4 ${r.score.mp4 ? "✓" : "✗"}`);
    lines.push("");

    if (missingCaptures.length > 0) {
      lines.push("### Captures manquantes");
      missingCaptures.forEach((f) => lines.push(`- \`${f}\``));
      lines.push("");
    }

    if (!r.score.resource) {
      lines.push("### Ressource manquante");
      lines.push(`- resourceSlug : \`${r.resourceSlug ?? "non défini"}\``);
      lines.push("");
    }

    if (!r.score.mp4) {
      lines.push("### MP4 manquant");
      r.mp4Candidates.forEach((c) => lines.push(`- \`${c}\``));
      lines.push("");
    }

    if (blockers.length > 0) {
      lines.push("### Bloquants publication");
      blockers.forEach((b) => lines.push(`- ${b.label}`));
      lines.push("");
    }

    lines.push(`### Prochaine action`);
    lines.push(getNextPipelineAction(r, { presentScreenshotFiles: options?.presentScreenshotFiles }));
    lines.push("");
    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}
