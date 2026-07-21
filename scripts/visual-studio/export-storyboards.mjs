/**
 * Export Playwright des scènes Studio visuel.
 *
 * Usage :
 *   1. Terminal A : npm run dev
 *   2. Terminal B : npm run export:storyboards
 *
 * Options :
 *   BASE_URL=http://127.0.0.1:3000 COURSE_ID=ade-enrollment npm run export:storyboards
 */

import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const outDir = path.join(root, "public/visual-studio/exports");

const BASE_URL = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const COURSE_ID = process.env.COURSE_ID ?? "ade-enrollment";

/** Scènes ADE (ordre storyboard) — miroir de lib/visual-studio/course-storyboards.ts */
const ADE_SCENES = [
  { id: "ade-s1-problem", order: 1 },
  { id: "ade-s2-definition", order: 2 },
  { id: "ade-s3-components", order: 3 },
  { id: "ade-s4-abm-assignment", order: 4 },
  { id: "ade-s5-first-boot", order: 5 },
  { id: "ade-s6-auto-config", order: 6 },
  { id: "ade-s7-best-practice", order: 7 },
  { id: "ade-s8-recap", order: 8 },
];

const LINEAR_FLOW = [
  "Achat",
  "Apple Business Manager",
  "Attribution MDM",
  "Activation",
  "Inscription",
  "Configuration",
  "Utilisateur",
];

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildLinearSvg(title, linearFlow) {
  const width = 1600;
  const height = 320;
  const pad = 40;
  const boxW = Math.min(160, (width - pad * 2) / linearFlow.length - 24);
  const boxH = 72;
  const gap = (width - pad * 2 - boxW * linearFlow.length) / Math.max(linearFlow.length - 1, 1);
  const y = height / 2 - boxH / 2;

  const boxes = linearFlow
    .map((label, i) => {
      const x = pad + i * (boxW + gap);
      const arrow =
        i < linearFlow.length - 1
          ? `<line x1="${x + boxW}" y1="${y + boxH / 2}" x2="${x + boxW + gap}" y2="${y + boxH / 2}" stroke="#2563EB" stroke-width="2" marker-end="url(#arrow)" />`
          : "";
      return `<g>
        <rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="12" fill="#FFFFFF" stroke="#DCE3ED" stroke-width="1.5"/>
        <text x="${x + boxW / 2}" y="${y + boxH / 2 + 4}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="#0F172A">${escapeXml(label)}</text>
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

async function main() {
  await mkdir(outDir, { recursive: true });
  await mkdir(path.join(root, "public/visual-studio/diagrams"), { recursive: true });

  const svg = buildLinearSvg("Flux Automated Device Enrollment", LINEAR_FLOW);
  const svgName = `${COURSE_ID}-ade-main-architecture.svg`;
  await writeFile(path.join(root, "public/visual-studio/diagrams", svgName), svg, "utf8");
  await writeFile(path.join(outDir, svgName), svg, "utf8");
  console.log(`SVG écrit : public/visual-studio/diagrams/${svgName}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  for (const scene of ADE_SCENES) {
    const url = `${BASE_URL}/studio-visuel/${COURSE_ID}/export?scene=${scene.id}`;
    console.log(`Capture ${scene.order}/8 → ${url}`);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
      await page.evaluate(async () => {
        if (document.fonts?.ready) await document.fonts.ready;
      });
      await page.waitForTimeout(400);
      const frame = page.locator("[data-export-frame]").first();
      await frame.waitFor({ state: "visible", timeout: 15_000 });
      const filename = `${COURSE_ID}-scene-${String(scene.order).padStart(2, "0")}.png`;
      await frame.screenshot({
        path: path.join(outDir, filename),
        type: "png",
      });
      console.log(`  ✓ ${filename}`);
    } catch (err) {
      console.error(`  ✗ Scène ${scene.id}:`, err instanceof Error ? err.message : err);
      console.error("  Astuce : démarrez `npm run dev` puis relancez l’export.");
    }
  }

  await browser.close();
  console.log(`Terminé. Fichiers dans public/visual-studio/exports/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
