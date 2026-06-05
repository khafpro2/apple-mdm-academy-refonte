import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { videoScripts, toHeyGenPayload } from "../src/lib/video-scripts.ts";

const outDir = path.resolve("exports/heygen");
const outFile = path.join(outDir, "video-payloads.fr-FR.json");

await mkdir(outDir, { recursive: true });

const payloads = videoScripts.map((video) => ({
  slug: video.slug,
  relatedCourseSlug: video.relatedCourseSlug,
  relatedLabSlug: video.relatedLabSlug,
  payload: toHeyGenPayload(video),
}));

await writeFile(outFile, `${JSON.stringify(payloads, null, 2)}\n`);

console.log(`Exported ${payloads.length} HeyGen payloads to ${outFile}`);
