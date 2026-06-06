import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const inputPath = path.join(root, "exports/heygen/video-results.json");
const outputPath = path.join(root, "lib/data/heygen-video-results.ts");

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return [];
}

function cleanResult(item) {
  if (!item || typeof item !== "object" || typeof item.slug !== "string") return null;
  const status = item.status ?? (item.videoUrl ? "ready" : "queued");
  return {
    slug: item.slug,
    status,
    videoUrl: item.videoUrl,
    sessionUrl: item.sessionUrl,
    heygenVideoId: item.heygenVideoId ?? item.videoId,
    updatedAt: item.updatedAt ?? new Date().toISOString(),
  };
}

function serializeValue(value) {
  return JSON.stringify(value, null, 2).replace(/"([^"]+)":/g, "$1:");
}

async function main() {
  const raw = await readFile(inputPath, "utf8");
  const parsed = JSON.parse(raw);
  const results = asArray(parsed).map(cleanResult).filter(Boolean);

  const map = Object.fromEntries(results.map((result) => [result.slug, result]));

  const source = `import type { HeyGenGenerationStatus } from "@/lib/types";

export type HeyGenVideoResult = {
  slug: string;
  status: HeyGenGenerationStatus;
  videoUrl?: string;
  sessionUrl?: string;
  heygenVideoId?: string;
  updatedAt: string;
};

export const heygenVideoResults: Record<string, HeyGenVideoResult> = ${serializeValue(map)};

export function getHeyGenVideoResult(slug: string): HeyGenVideoResult | undefined {
  return heygenVideoResults[slug];
}
`;

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, source, "utf8");
  console.log(`Imported ${results.length} HeyGen video result(s) into ${path.relative(root, outputPath)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
