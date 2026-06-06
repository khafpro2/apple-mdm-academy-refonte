#!/usr/bin/env node
/**
 * Generates SVG assets for illustrated video production.
 * Run: node scripts/generate-video-assets.mjs
 */
import { mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "public", "video-assets");

const DIRS = ["icons", "backgrounds", "diagrams", "screenshots", "lower-thirds", "thumbnails"];
for (const d of DIRS) mkdirSync(join(ROOT, d), { recursive: true });

function write(rel, content) {
  writeFileSync(join(ROOT, rel), content.trim() + "\n", "utf8");
}

// ── Icons (48×48, minimalist) ──────────────────────────────────────────────
const icons = {
  abm: `<rect x="8" y="8" width="32" height="8" rx="2" fill="#48484A"/><rect x="8" y="20" width="20" height="8" rx="2" fill="#48484A"/><rect x="8" y="32" width="32" height="8" rx="2" fill="#48484A"/><rect x="32" y="20" width="8" height="8" rx="2" fill="#007AFF"/>`,
  intune: `<circle cx="24" cy="24" r="16" fill="none" stroke="#0078D4" stroke-width="3"/><path d="M24 12v24M12 24h24" stroke="#0078D4" stroke-width="2"/>`,
  jamf: `<rect x="10" y="14" width="28" height="20" rx="4" fill="#1B365D"/><circle cx="24" cy="24" r="6" fill="#00A4EF"/>`,
  apns: `<path d="M24 8 L40 20 L32 20 L32 40 L16 40 L16 20 L8 20 Z" fill="#FF9500"/><circle cx="24" cy="28" r="4" fill="white"/>`,
  ade: `<rect x="10" y="12" width="28" height="24" rx="3" fill="none" stroke="#34C759" stroke-width="2.5"/><path d="M18 24 L22 28 L30 18" stroke="#34C759" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  "apps-books": `<rect x="10" y="10" width="14" height="18" rx="2" fill="#5856D6"/><rect x="24" y="14" width="14" height="18" rx="2" fill="#AF52DE"/><circle cx="17" cy="19" r="3" fill="white"/>`,
  "managed-apple-id": `<circle cx="24" cy="16" r="8" fill="#48484A"/><path d="M10 40 Q10 28 24 28 Q38 28 38 40" fill="#48484A"/><circle cx="34" cy="14" r="6" fill="#007AFF"/>`,
  "platform-sso": `<rect x="8" y="16" width="12" height="16" rx="2" fill="#0078D4"/><path d="M22 24 L28 24" stroke="#48484A" stroke-width="2"/><rect x="28" y="16" width="12" height="16" rx="2" fill="#34C759"/>`,
  filevault: `<rect x="12" y="20" width="24" height="20" rx="3" fill="#48484A"/><path d="M16 20 L16 16 Q16 10 24 10 Q32 10 32 16 L32 20" fill="none" stroke="#48484A" stroke-width="3"/><circle cx="24" cy="30" r="3" fill="#FF9500"/>`,
  gatekeeper: `<path d="M24 8 L38 14 L38 28 Q38 38 24 42 Q10 38 10 28 L10 14 Z" fill="none" stroke="#FF3B30" stroke-width="2.5"/><path d="M18 24 L22 28 L30 20" stroke="#34C759" stroke-width="2.5" fill="none"/>`,
  xprotect: `<circle cx="24" cy="24" r="14" fill="none" stroke="#FF3B30" stroke-width="2.5"/><path d="M24 14 L24 24 L32 28" stroke="#FF3B30" stroke-width="2.5" fill="none" stroke-linecap="round"/>`,
  sip: `<rect x="10" y="10" width="28" height="28" rx="4" fill="none" stroke="#48484A" stroke-width="2.5"/><path d="M16 24 L22 30 L32 18" stroke="#34C759" stroke-width="2.5" fill="none"/>`,
  certificate: `<rect x="12" y="8" width="24" height="32" rx="2" fill="none" stroke="#5856D6" stroke-width="2"/><circle cx="24" cy="22" r="6" fill="#5856D6"/><path d="M20 30 L24 36 L28 30" fill="#5856D6"/>`,
  cloud: `<ellipse cx="24" cy="28" rx="16" ry="10" fill="#007AFF" opacity="0.85"/><ellipse cx="18" cy="24" rx="10" ry="8" fill="#007AFF"/><ellipse cx="30" cy="22" rx="8" ry="6" fill="#007AFF"/>`,
  mac: `<rect x="8" y="12" width="32" height="22" rx="3" fill="#48484A"/><rect x="6" y="34" width="36" height="4" rx="1" fill="#86868B"/>`,
  iphone: `<rect x="16" y="6" width="16" height="36" rx="3" fill="#48484A"/><rect x="20" y="10" width="8" height="24" rx="1" fill="#007AFF" opacity="0.3"/>`,
  ipad: `<rect x="10" y="10" width="28" height="28" rx="3" fill="#48484A"/><rect x="14" y="14" width="20" height="20" rx="1" fill="#007AFF" opacity="0.3"/>`,
  user: `<circle cx="24" cy="16" r="8" fill="#48484A"/><path d="M8 42 Q8 30 24 30 Q40 30 40 42" fill="#48484A"/>`,
  admin: `<circle cx="24" cy="14" r="7" fill="#48484A"/><path d="M10 40 Q10 28 24 28 Q38 28 38 40" fill="#48484A"/><rect x="30" y="8" width="10" height="10" rx="2" fill="#FF9500"/>`,
  "security-shield": `<path d="M24 6 L40 12 L40 26 Q40 38 24 44 Q8 38 8 26 L8 12 Z" fill="#34C759" opacity="0.9"/><path d="M18 24 L22 28 L30 20" stroke="white" stroke-width="2.5" fill="none"/>`,
};

for (const [name, inner] of Object.entries(icons)) {
  write(
    `icons/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true">${inner}</svg>`
  );
}

// ── Backgrounds (16:9) ───────────────────────────────────────────────────────
const backgrounds = {
  "apple-light": `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F5F5F7"/><stop offset="100%" stop-color="#E8E8ED"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#g)"/><circle cx="1600" cy="200" r="300" fill="#007AFF" opacity="0.06"/><circle cx="300" cy="900" r="250" fill="#48484A" opacity="0.04"/>`,
  "microsoft-learn": `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F3F2F1"/><stop offset="100%" stop-color="#DEECF9"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#g)"/><rect x="0" y="0" width="8" height="1080" fill="#0078D4"/>`,
  "jamf-training": `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F0F4F8"/><stop offset="100%" stop-color="#D6E4F0"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#g)"/><rect x="0" y="1020" width="1920" height="60" fill="#1B365D" opacity="0.9"/>`,
  "macos-security": `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1C1C1E"/><stop offset="100%" stop-color="#2C2C2E"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#g)"/><circle cx="960" cy="540" r="400" fill="#FF3B30" opacity="0.08"/>`,
  certification: `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#FFF9E6"/><stop offset="100%" stop-color="#F5F5F7"/></linearGradient></defs><rect width="1920" height="1080" fill="url(#g)"/><circle cx="960" cy="400" r="120" fill="none" stroke="#FF9500" stroke-width="4"/><path d="M920 400 L950 430 L1000 370" stroke="#34C759" stroke-width="6" fill="none"/>`,
};

for (const [name, inner] of Object.entries(backgrounds)) {
  write(
    `backgrounds/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" aria-hidden="true">${inner}</svg>`
  );
}

// ── Diagrams (workflow boxes + arrows) ───────────────────────────────────────
function diagram(title, nodes) {
  const boxW = 180;
  const boxH = 70;
  const gap = 60;
  const startX = 120;
  const y = 200;
  let svg = `<text x="960" y="80" text-anchor="middle" font-family="system-ui,sans-serif" font-size="28" font-weight="600" fill="#48484A">${title}</text>`;
  nodes.forEach((label, i) => {
    const x = startX + i * (boxW + gap);
    svg += `<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="12" fill="white" stroke="#007AFF" stroke-width="2" filter="url(#shadow)"/>`;
    svg += `<text x="${x + boxW / 2}" y="${y + boxH / 2 + 6}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" fill="#48484A">${label}</text>`;
    if (i < nodes.length - 1) {
      const ax = x + boxW + 8;
      const bx = x + boxW + gap - 8;
      svg += `<path d="M${ax} ${y + boxH / 2} L${bx} ${y + boxH / 2}" stroke="#007AFF" stroke-width="2" marker-end="url(#arrow)"/>`;
    }
  });
  return `<defs><filter id="shadow"><feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.12"/></filter><marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto"><path d="M0,0 L10,3 L0,6" fill="#007AFF"/></marker></defs>${svg}`;
}

const diagrams = {
  "abm-intune-apns-device": diagram("ABM → Intune → APNs → Device", ["ABM", "Intune", "APNs", "Device"]),
  "abm-jamf-apns-device": diagram("ABM → Jamf → APNs → Device", ["ABM", "Jamf Pro", "APNs", "Device"]),
  "ade-workflow": diagram("Automated Device Enrollment", ["Achat", "ABM", "MDM Server", "Setup Assistant"]),
  "apns-workflow": diagram("Apple Push Notification Service", ["MDM", "APNs", "Apple", "Device"]),
  "platform-sso-workflow": diagram("Platform SSO", ["IdP", "Entra ID", "macOS", "Apps"]),
  "jamf-policy-workflow": diagram("Jamf Policy", ["Smart Group", "Policy", "Script/Profile", "Device"]),
  "filevault-key-escrow": diagram("FileVault Key Escrow", ["Mac", "FileVault", "MDM", "Escrow Key"]),
  "apps-books-workflow": diagram("Apps & Books", ["ABM", "Apps & Books", "MDM", "Device"]),
};

for (const [name, inner] of Object.entries(diagrams)) {
  write(
    `diagrams/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400" aria-hidden="true">${inner}</svg>`
  );
}

// ── Lower thirds ─────────────────────────────────────────────────────────────
const lowerThirds = {
  module: `<rect x="40" y="900" width="600" height="80" rx="8" fill="#1B365D" opacity="0.92"/><rect x="40" y="900" width="6" height="80" rx="3" fill="#007AFF"/><text x="60" y="948" font-family="system-ui,sans-serif" font-size="32" font-weight="600" fill="white">Nom du module</text>`,
  objective: `<rect x="40" y="880" width="800" height="100" rx="8" fill="white" opacity="0.95" filter="url(#s)"/><text x="60" y="920" font-family="system-ui,sans-serif" font-size="22" font-weight="600" fill="#48484A">Objectif</text><text x="60" y="958" font-family="system-ui,sans-serif" font-size="18" fill="#86868B">Objectif pédagogique de la vidéo</text>`,
  step: `<rect x="40" y="920" width="400" height="60" rx="8" fill="#007AFF" opacity="0.9"/><text x="60" y="958" font-family="system-ui,sans-serif" font-size="24" font-weight="600" fill="white">Étape en cours</text>`,
  recap: `<rect x="40" y="880" width="500" height="80" rx="8" fill="#34C759" opacity="0.92"/><text x="60" y="930" font-family="system-ui,sans-serif" font-size="28" font-weight="600" fill="white">Résumé · Passer au lab</text>`,
};

for (const [name, inner] of Object.entries(lowerThirds)) {
  write(
    `lower-thirds/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" aria-hidden="true"><defs><filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="6" flood-opacity="0.15"/></filter></defs>${inner}</svg>`
  );
}

// Placeholder for screenshots folder
write("screenshots/.gitkeep", "");

// ── Thumbnails (16:9, one per illustrated video) ───────────────────────────
const THUMB_META = {
  "apple-business-manager": { title: "Apple Business Manager", icon: "abm", bg: "#F5F5F7", accent: "#48484A" },
  "abm-intune": { title: "ABM + Intune", icon: "intune", bg: "#DEECF9", accent: "#0078D4" },
  "ade-iphone": { title: "ADE iPhone", icon: "iphone", bg: "#F5F5F7", accent: "#34C759" },
  "ade-mac": { title: "ADE Mac", icon: "mac", bg: "#F5F5F7", accent: "#34C759" },
  apns: { title: "APNs", icon: "apns", bg: "#FFF4E6", accent: "#FF9500" },
  "apps-books": { title: "Apps & Books", icon: "apps-books", bg: "#F5F0FF", accent: "#5856D6" },
  "managed-apple-ids": { title: "Managed Apple IDs", icon: "managed-apple-id", bg: "#F5F5F7", accent: "#007AFF" },
  "platform-sso": { title: "Platform SSO", icon: "platform-sso", bg: "#DEECF9", accent: "#0078D4" },
  "ios-ipados-profiles": { title: "Profils iOS/iPadOS", icon: "ipad", bg: "#DEECF9", accent: "#0078D4" },
  "macos-profiles": { title: "Profils macOS", icon: "mac", bg: "#DEECF9", accent: "#0078D4" },
  filevault: { title: "FileVault", icon: "filevault", bg: "#2C2C2E", accent: "#FF9500", dark: true },
  "gatekeeper-xprotect-sip": { title: "Gatekeeper · XProtect · SIP", icon: "gatekeeper", bg: "#2C2C2E", accent: "#FF3B30", dark: true },
  "jamf-pro-fundamentals": { title: "Jamf Pro", icon: "jamf", bg: "#D6E4F0", accent: "#1B365D" },
  "jamf-smart-groups": { title: "Smart Groups", icon: "jamf", bg: "#D6E4F0", accent: "#00A4EF" },
  "jamf-policies": { title: "Policies Jamf", icon: "jamf", bg: "#D6E4F0", accent: "#1B365D" },
  "jamf-scripts": { title: "Scripts Jamf", icon: "jamf", bg: "#D6E4F0", accent: "#00A4EF" },
  "jamf-patch-management": { title: "Patch Management", icon: "jamf", bg: "#D6E4F0", accent: "#1B365D" },
  "jamf-protect": { title: "Jamf Protect", icon: "security-shield", bg: "#D6E4F0", accent: "#34C759" },
};

for (const [slug, meta] of Object.entries(THUMB_META)) {
  const textColor = meta.dark ? "#F5F5F7" : "#48484A";
  const subColor = meta.dark ? "#AEAEB2" : "#86868B";
  write(
    `thumbnails/${slug}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" aria-hidden="true">
  <rect width="640" height="360" fill="${meta.bg}"/>
  <circle cx="520" cy="80" r="120" fill="${meta.accent}" opacity="0.08"/>
  <image href="/video-assets/icons/${meta.icon}.svg" x="40" y="40" width="64" height="64"/>
  <text x="40" y="150" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="${textColor}">${meta.title}</text>
  <text x="40" y="180" font-family="system-ui,sans-serif" font-size="14" fill="${subColor}">Apple MDM Academy</text>
  <rect x="40" y="300" width="120" height="28" rx="14" fill="${meta.accent}" opacity="0.15"/>
  <text x="100" y="319" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="${meta.accent}">Vidéo illustrée</text>
</svg>`
  );
}

console.log("✓ Video assets generated in public/video-assets/");
