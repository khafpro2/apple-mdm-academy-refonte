import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outDir = path.resolve("audit/screenshots");
const tileW = 320;
const imageH = 180;
const labelH = 64;
const gap = 14;
const cols = 4;

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function readEntries() {
  const source = await readFile("lib/data/screenshot-prompts.ts", "utf8");
  const pattern =
    /entry\("([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)",\s*"([^"]+)"\)/g;
  return [...source.matchAll(pattern)].map((match) => ({
    id: match[1],
    category: match[2],
    filename: match[3],
    title: match[4],
    description: match[5],
    caption: match[6],
    scenePrompt: match[7],
  }));
}

async function readOfficialAssets() {
  const source = await readFile("lib/data/official-screenshots.ts", "utf8");
  const assets = new Map();
  const blocks = source.matchAll(/"([^"]+)":\s*\{([\s\S]*?)\n\s*\},/g);
  for (const [, id, block] of blocks) {
    const folder = block.match(/folder:\s*"([^"]+)"/)?.[1];
    const filename = block.match(/filename:\s*"([^"]+)"/)?.[1];
    if (folder && filename) assets.set(id, `/images/courses/${folder}/${filename}`);
  }
  return assets;
}

function sourcePath(entry, officialAssets) {
  const official = officialAssets.get(entry.id);
  const publicPath = official ?? `/images/courses/${entry.category}/${entry.filename}`;
  return path.resolve("public", publicPath.replace(/^\//, ""));
}

async function makeSheet(name, entries, officialAssets) {
  const rows = Math.ceil(entries.length / cols);
  const width = cols * tileW + (cols + 1) * gap;
  const height = rows * (imageH + labelH) + (rows + 1) * gap;
  const composites = [];

  for (const [index, entry] of entries.entries()) {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const left = gap + col * (tileW + gap);
    const top = gap + row * (imageH + labelH + gap);

    const image = await sharp(sourcePath(entry, officialAssets))
      .resize(tileW, imageH, { fit: "cover", position: "top" })
      .png()
      .toBuffer();

    const official = officialAssets.has(entry.id) ? " officiel" : "";
    const label = `${entry.id}${official} · ${entry.title}`;
    const caption = entry.caption.length > 74 ? `${entry.caption.slice(0, 71)}...` : entry.caption;
    const svg = Buffer.from(`
      <svg width="${tileW}" height="${labelH}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f8fafc"/>
        <text x="10" y="22" font-family="Arial" font-size="15" font-weight="700" fill="#111827">${escapeXml(label)}</text>
        <text x="10" y="45" font-family="Arial" font-size="11" fill="#475569">${escapeXml(caption)}</text>
      </svg>
    `);

    composites.push({ input: image, left, top });
    composites.push({ input: svg, left, top: top + imageH });
  }

  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: "#ffffff",
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(outDir, `${name}.png`));
}

await mkdir(outDir, { recursive: true });

const groups = new Map();
const SCREENSHOT_PROMPTS = await readEntries();
const officialAssets = await readOfficialAssets();
for (const entry of SCREENSHOT_PROMPTS) {
  const items = groups.get(entry.category) ?? [];
  items.push(entry);
  groups.set(entry.category, items);
}

for (const [category, entries] of groups.entries()) {
  await makeSheet(category, entries, officialAssets);
}

await writeFile(
  path.join(outDir, "index.txt"),
  [...groups.keys()].map((category) => `${category}.png`).join("\n") + "\n"
);

console.log(`Wrote ${groups.size} contact sheets to ${outDir}`);
