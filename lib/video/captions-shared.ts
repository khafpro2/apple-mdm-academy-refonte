import type { VideoTranscript } from "@/src/lib/video-transcripts";

/** URL publique si un fichier WebVTT statique existe. */
export function getStaticCaptionsPublicPath(slug: string, locale = "fr"): string {
  return `/videos/captions/${slug}.${locale}.vtt`;
}

/** Formate un offset en secondes vers le timestamp WebVTT. */
export function formatWebVttTimestamp(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = Math.floor(safe % 60);
  const millis = Math.round((safe % 1) * 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
}

/**
 * Génère un document WebVTT à partir des scènes de transcript (narration).
 * Utilisé tant qu’aucun fichier `.vtt` produit n’est déposé sous public/videos/captions/.
 */
export function buildWebVttFromTranscript(transcript: VideoTranscript, locale = "fr"): string {
  const lines: string[] = ["WEBVTT", `Kind: captions`, `Language: ${locale}`, ""];

  let cursor = 0;
  for (const [index, scene] of transcript.scenes.entries()) {
    const start = cursor;
    const end = cursor + Math.max(scene.durationSeconds, 1);
    cursor = end;
    const text = scene.text.trim() || scene.title;
    lines.push(String(index + 1));
    lines.push(`${formatWebVttTimestamp(start)} --> ${formatWebVttTimestamp(end)}`);
    lines.push(text);
    lines.push("");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}
