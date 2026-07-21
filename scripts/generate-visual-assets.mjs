#!/usr/bin/env node
/**
 * Generates the Apple MDM Academy Enterprise Icon System SVG library.
 * Run: node scripts/generate-visual-assets.mjs
 *
 * Outputs to public/visual-assets/ and lib/visual-assets/generated-manifest.json
 */
import { mkdirSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC_ROOT = join(ROOT, "public", "visual-assets");
const MANIFEST_PATH = join(ROOT, "lib", "visual-assets", "generated-manifest.json");

const COLORS = {
  navy: "#0B102B",
  blue: "#2563EB",
  purple: "#6D4AFF",
  cyan: "#13B8D3",
  microsoftBlue: "#0078D4",
  microsoftGreen: "#16A34A",
  jamfBlue: "#0074C8",
  jamfCyan: "#18B6D9",
  green: "#22C55E",
  orange: "#F59E0B",
  red: "#EF4444",
  gray900: "#0F172A",
  gray600: "#475569",
  gray400: "#94A3B8",
  gray200: "#E2E8F0",
  gray100: "#F1F5F9",
  white: "#FFFFFF",
};

const manifest = [];

function ensureDir(rel) {
  mkdirSync(join(PUBLIC_ROOT, rel), { recursive: true });
}

function writeAsset(rel, content, meta) {
  const full = join(PUBLIC_ROOT, rel);
  ensureDir(dirname(rel));
  const existed = existsSync(full);
  writeFileSync(full, content.trim() + "\n", "utf8");
  manifest.push({ ...meta, path: `/visual-assets/${rel.replace(/\\/g, "/")}` });
  if (existed) console.warn(`OVERWRITE: ${rel}`);
  return true;
}

function iconSvg(title, desc, inner, color = "currentColor") {
  const fillAttr = color === "currentColor" ? 'fill="none" stroke="currentColor"' : `fill="none" stroke="${color}"`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-labelledby="title desc">
  <title id="title">${title}</title>
  <desc id="desc">${desc}</desc>
  <g ${fillAttr} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    ${inner}
  </g>
</svg>`;
}

function registerIcon(file, title, desc, shapes, meta) {
  writeAsset(
    file,
    iconSvg(title, desc, shapes, meta.color),
    {
      id: meta.id,
      name: title,
      category: meta.category,
      ecosystem: meta.ecosystem,
      type: "icon",
      tags: meta.tags ?? [],
      description: desc,
      freeformReady: true,
      verificationStatus: "original",
    }
  );
}

// ── Shared shape primitives ───────────────────────────────────────────────────
const SHAPES = {
  building: `<rect x="14" y="18" width="36" height="34" rx="6"/><path d="M22 18V14a10 10 0 0 1 20 0v4"/><line x1="14" y1="30" x2="50" y2="30"/><line x1="26" y1="30" x2="26" y2="52"/><line x1="38" y1="30" x2="38" y2="52"/>`,
  checkCircle: `<circle cx="32" cy="32" r="20"/><path d="M22 32l7 7 13-14"/>`,
  bell: `<path d="M32 12v4"/><path d="M20 44h24"/><path d="M24 44a8 8 0 0 1 16 0"/><path d="M18 38c0-8 6-14 6-22h16c0 8 6 14 6 22"/>`,
  docSliders: `<rect x="16" y="12" width="32" height="40" rx="6"/><line x1="22" y1="24" x2="42" y2="24"/><line x1="22" y1="32" x2="38" y2="32"/><line x1="22" y1="40" x2="34" y2="40"/><circle cx="40" cy="32" r="3" fill="currentColor" stroke="none"/><circle cx="36" cy="40" r="3" fill="currentColor" stroke="none"/>`,
  appGrid: `<rect x="14" y="14" width="16" height="16" rx="4"/><rect x="34" y="14" width="16" height="16" rx="4"/><rect x="14" y="34" width="16" height="16" rx="4"/><rect x="34" y="34" width="16" height="16" rx="4"/>`,
  lockDisk: `<rect x="18" y="26" width="28" height="24" rx="6"/><path d="M24 26v-6a8 8 0 0 1 16 0v6"/><circle cx="32" cy="38" r="4"/>`,
  keychain: `<circle cx="24" cy="24" r="8"/><path d="M30 28l14 14"/><circle cx="44" cy="44" r="6"/><path d="M44 38v-4"/>`,
  token: `<rect x="14" y="22" width="36" height="20" rx="10"/><circle cx="24" cy="32" r="4" fill="currentColor" stroke="none"/><line x1="32" y1="32" x2="46" y2="32"/>`,
  lockLink: `<rect x="12" y="28" width="20" height="18" rx="4"/><rect x="32" y="28" width="20" height="18" rx="4"/><path d="M22 28v-6a10 10 0 0 1 20 0v6"/>`,
  user: `<circle cx="32" cy="22" r="8"/><path d="M14 52c0-10 8-16 18-16s18 6 18 16"/>`,
  admin: `<circle cx="28" cy="20" r="7"/><path d="M12 50c0-9 7-15 16-15"/><rect x="38" y="12" width="14" height="14" rx="3"/><path d="M41 19h8M45 15v8"/>`,
  macbook: `<rect x="12" y="18" width="40" height="26" rx="4"/><path d="M8 48h48" stroke-width="3"/>`,
  iphone: `<rect x="22" y="10" width="20" height="44" rx="5"/><line x1="28" y1="16" x2="36" y2="16"/>`,
  ipad: `<rect x="14" y="12" width="36" height="40" rx="5"/><circle cx="32" cy="46" r="2" fill="currentColor" stroke="none"/>`,
  winLaptop: `<rect x="10" y="18" width="44" height="28" rx="3"/><path d="M6 50h52" stroke-width="3"/><rect x="26" y="46" width="12" height="2" rx="1" fill="currentColor" stroke="none"/>`,
  android: `<rect x="20" y="12" width="24" height="40" rx="5"/><circle cx="26" cy="18" r="1.5" fill="currentColor" stroke="none"/><circle cx="38" cy="18" r="1.5" fill="currentColor" stroke="none"/>`,
  cloud: `<path d="M20 44h28a10 10 0 0 0 2-20 12 12 0 0 0-23-4 8 8 0 0 0-7 24z"/>`,
  server: `<rect x="16" y="14" width="32" height="12" rx="4"/><rect x="16" y="30" width="32" height="12" rx="4"/><rect x="16" y="46" width="32" height="8" rx="3"/><circle cx="22" cy="20" r="2" fill="currentColor" stroke="none"/><circle cx="22" cy="36" r="2" fill="currentColor" stroke="none"/>`,
  cert: `<rect x="18" y="12" width="28" height="36" rx="4"/><circle cx="32" cy="28" r="6"/><path d="M26 38l6 8 6-8"/>`,
  shieldOk: `<path d="M32 10l18 8v14c0 12-8 20-18 24-10-4-18-12-18-24V18z"/><path d="M24 32l6 6 12-12"/>`,
  shieldBad: `<path d="M32 10l18 8v14c0 12-8 20-18 24-10-4-18-12-18-24V18z"/><path d="M26 28l12 12M38 28l-12 12"/>`,
  sync: `<path d="M44 24a12 12 0 0 0-20-9"/><polyline points="16,20 24,15 24,25"/><path d="M20 40a12 12 0 0 0 20 9"/><polyline points="48,44 40,49 40,39"/>`,
  secureTunnel: `<rect x="12" y="28" width="16" height="16" rx="4"/><rect x="36" y="28" width="16" height="16" rx="4"/><path d="M28 36h8"/><path d="M32 32v8" stroke-dasharray="3 3"/>`,
  warning: `<path d="M32 12l18 34H14z"/><line x1="32" y1="26" x2="32" y2="34"/><circle cx="32" cy="40" r="1.5" fill="currentColor" stroke="none"/>`,
  groupSmart: `<circle cx="24" cy="24" r="6"/><circle cx="40" cy="24" r="6"/><circle cx="32" cy="40" r="6"/><path d="M28 28l4 8M36 28l-4 8"/>`,
  policy: `<rect x="14" y="12" width="36" height="40" rx="6"/><path d="M22 24h20M22 32h16M22 40h12"/><circle cx="44" cy="40" r="6"/><path d="M41 40l2 2 4-4"/>`,
  package: `<path d="M14 22l18-10 18 10v24l-18 10-18-10z"/><path d="M32 12v44M14 22l18 10 18-10"/>`,
  script: `<rect x="14" y="14" width="36" height="36" rx="6"/><path d="M22 24l-4 4 4 4M34 32l4-4-4-4M28 36l8-16"/>`,
  inventory: `<rect x="14" y="18" width="36" height="32" rx="6"/><line x1="20" y1="28" x2="44" y2="28"/><line x1="20" y1="36" x2="40" y2="36"/><line x1="20" y1="44" x2="36" y2="44"/>`,
  selfService: `<rect x="16" y="16" width="32" height="32" rx="8"/><path d="M32 24v16M24 32h16"/>`,
  connect: `<circle cx="20" cy="32" r="8"/><circle cx="44" cy="32" r="8"/><path d="M28 32h8"/><path d="M32 26v12" stroke-dasharray="2 3"/>`,
  protect: `<path d="M32 12l16 6v12c0 10-7 18-16 22-9-4-16-12-16-22V18z"/><path d="M32 22v12M28 28h8"/>`,
  settings: `<circle cx="32" cy="32" r="6"/><path d="M32 14v6M32 44v6M14 32h6M44 32h6M20 20l4 4M40 40l4 4M44 20l-4 4M24 40l-4 4"/>`,
  portal: `<rect x="14" y="16" width="36" height="32" rx="6"/><path d="M14 26h36"/><circle cx="32" cy="38" r="4"/>`,
  dynamicGroup: `<circle cx="22" cy="28" r="6"/><circle cx="42" cy="28" r="6"/><circle cx="32" cy="44" r="6"/><path d="M27 31l5 10M37 31l-5 10"/>`,
  remote: `<rect x="18" y="20" width="28" height="20" rx="4"/><path d="M32 40v8M24 48h16"/><path d="M28 30l4 4 8-8"/>`,
  conditional: `<rect x="12" y="16" width="18" height="32" rx="4"/><rect x="34" y="16" width="18" height="32" rx="4"/><path d="M30 32h4"/>`,
  compliance: `<rect x="14" y="14" width="36" height="36" rx="6"/><path d="M22 32l6 6 14-14"/>`,
  enrollment: `<rect x="18" y="16" width="28" height="36" rx="5"/><path d="M26 36l6 6 12-14"/>`,
  ddm: `<circle cx="32" cy="32" r="18"/><path d="M32 14v6M32 44v6M14 32h6M44 32h6"/><circle cx="32" cy="32" r="6"/>`,
  apns: `<path d="M32 12v4"/><path d="M20 44h24"/><path d="M24 44a8 8 0 0 1 16 0"/><path d="M18 38c0-8 6-14 6-22h16c0 8 6 14 6 22"/>`,
  bootstrap: `<circle cx="32" cy="20" r="8"/><path d="M20 48c0-8 5-14 12-14s12 6 12 14"/><rect x="38" y="34" width="14" height="10" rx="3"/>`,
  activationLock: `<rect x="20" y="24" width="24" height="22" rx="5"/><path d="M26 24v-6a6 6 0 0 1 12 0v6"/><circle cx="32" cy="36" r="3"/>`,
  federation: `<circle cx="20" cy="32" r="8"/><circle cx="44" cy="32" r="8"/><path d="M28 32h8"/><path d="M24 26l16 12M24 38l16-12"/>`,
  scim: `<rect x="12" y="20" width="16" height="24" rx="4"/><rect x="36" y="20" width="16" height="24" rx="4"/><path d="M28 28h8M28 36h8"/>`,
  supervision: `<rect x="18" y="14" width="28" height="36" rx="5"/><path d="M26 14v-4h12v4"/><circle cx="32" cy="36" r="6"/><path d="M29 36l2 2 4-4"/>`,
  mdmCmd: `<rect x="14" y="14" width="36" height="36" rx="6"/><path d="M22 32h20M32 22v20"/>`,
  managedApp: `<rect x="16" y="16" width="32" height="32" rx="8"/><path d="M24 32l4 4 8-10"/>`,
  secureToken: `<circle cx="32" cy="32" r="18"/><path d="M32 20v12l8 4"/>`,
  passcode: `<circle cx="32" cy="32" r="16"/><circle cx="32" cy="32" r="4" fill="currentColor" stroke="none"/><path d="M32 16v4M32 44v4M16 32h4M44 32h4"/>`,
  update: `<path d="M32 14v10"/><path d="M24 18a14 14 0 0 1 16 0"/><path d="M32 50v-10"/><path d="M40 46a14 14 0 0 1-16 0"/>`,
  lostMode: `<circle cx="32" cy="32" r="18"/><circle cx="32" cy="32" r="6"/><path d="M32 14v6M32 44v6M14 32h6M44 32h6"/>`,
  attestation: `<path d="M32 10l18 8v14c0 12-8 20-18 24"/><path d="M28 32l4 4 8-8"/>`,
  webhook: `<circle cx="20" cy="44" r="6"/><path d="M26 40l12-12"/><circle cx="44" cy="20" r="6"/>`,
  api: `<rect x="12" y="20" width="40" height="24" rx="6"/><path d="M20 32h8M28 28v8M36 28l6 8M36 36l6-8"/>`,
  wifi: `<path d="M32 44l-8-8"/><path d="M24 36a12 12 0 0 1 16 0"/><path d="M18 30a20 20 0 0 1 28 0"/><circle cx="32" cy="46" r="2" fill="currentColor" stroke="none"/>`,
  vpn: `<rect x="14" y="22" width="36" height="24" rx="6"/><path d="M22 32h20"/><circle cx="32" cy="32" r="4"/>`,
  firewall: `<rect x="14" y="16" width="36" height="32" rx="6"/><path d="M14 28h36M14 36h36"/><path d="M26 22v24M38 22v24"/>`,
  add: `<circle cx="32" cy="32" r="18"/><path d="M32 22v20M22 32h20"/>`,
  remove: `<circle cx="32" cy="32" r="18"/><path d="M22 32h20"/>`,
  deploy: `<path d="M32 12l18 10v16l-18 10-18-10V22z"/><path d="M32 32l18-10M32 32v20M32 32L14 22"/>`,
  statusOk: `<circle cx="32" cy="32" r="18"/><path d="M22 32l7 7 13-14"/>`,
  statusErr: `<circle cx="32" cy="32" r="18"/><path d="M24 24l16 16M40 24l-16 16"/>`,
  statusWarn: `<circle cx="32" cy="32" r="18"/><line x1="32" y1="22" x2="32" y2="36"/><circle cx="32" cy="42" r="1.5" fill="currentColor" stroke="none"/>`,
  statusPending: `<circle cx="32" cy="32" r="18"/><path d="M32 18v14l10 6"/>`,
  encrypted: `<rect x="18" y="26" width="28" height="22" rx="5"/><path d="M24 26v-6a8 8 0 0 1 16 0v6"/><path d="M28 36h8"/>`,
  managed: `<rect x="16" y="18" width="32" height="28" rx="5"/><path d="M24 32l4 4 8-8"/>`,
};

// ── Apple Enterprise icons (≥15) ──────────────────────────────────────────────
const appleIcons = [
  ["icons/apple-enterprise/apple-business-manager.svg", "Apple Business Manager", "Building portal representing Apple Business Manager administration.", SHAPES.building, { id: "apple-business-manager", tags: ["abm", "enrollment"] }],
  ["icons/apple-enterprise/automated-device-enrollment.svg", "Automated Device Enrollment", "Device with checkmark for ADE zero-touch enrollment.", SHAPES.enrollment, { id: "automated-device-enrollment", tags: ["ade", "enrollment"] }],
  ["icons/apple-enterprise/device-enrollment.svg", "Device Enrollment", "Manual device enrollment profile download.", `<rect x="20" y="14" width="24" height="36" rx="5"/><path d="M28 40h8"/>`, { id: "device-enrollment", tags: ["enrollment"] }],
  ["icons/apple-enterprise/user-enrollment.svg", "User Enrollment", "User-owned device with BYOD enrollment.", `<circle cx="32" cy="20" r="7"/><path d="M16 48c0-9 7-14 16-14"/><rect x="38" y="34" width="12" height="18" rx="3"/>`, { id: "user-enrollment", tags: ["byod"] }],
  ["icons/apple-enterprise/apple-school-manager.svg", "Apple School Manager", "Education building with graduation cap motif.", `<rect x="14" y="22" width="36" height="30" rx="6"/><path d="M32 14l16 8-16 8-16-8z"/>`, { id: "apple-school-manager", tags: ["asm", "education"] }],
  ["icons/apple-enterprise/managed-apple-account.svg", "Managed Apple Account", "User with managed account badge.", `<circle cx="28" cy="22" r="7"/><path d="M12 50c0-9 7-14 16-14"/><circle cx="44" cy="20" r="6"/><path d="M41 20h6"/>`, { id: "managed-apple-account", tags: ["account"] }],
  ["icons/apple-enterprise/apps-and-books.svg", "Apps and Books", "Application grid for volume content.", SHAPES.appGrid, { id: "apps-and-books", tags: ["vpp"] }],
  ["icons/apple-enterprise/volume-content.svg", "Volume Content", "Stack of licensed content packages.", `<rect x="18" y="28" width="28" height="8" rx="2"/><rect x="20" y="20" width="24" height="8" rx="2"/><rect x="22" y="12" width="20" height="8" rx="2"/>`, { id: "volume-content", tags: ["vpp"] }],
  ["icons/apple-enterprise/locations.svg", "Locations", "Map pin for ABM location hierarchy.", `<path d="M32 12c-8 0-14 6-14 14 0 10 14 22 14 22s14-12 14-22c0-8-6-14-14-14z"/><circle cx="32" cy="26" r="5"/>`, { id: "locations", tags: ["abm"] }],
  ["icons/apple-enterprise/roles-privileges.svg", "Roles and Privileges", "Key and shield for administrative roles.", `<path d="M32 12l14 6v10c0 8-6 14-14 18"/><circle cx="32" cy="28" r="4"/><path d="M18 44l8-8"/>`, { id: "roles-privileges", tags: ["admin"] }],
  ["icons/apple-enterprise/managed-distribution.svg", "Managed Distribution", "Distribution arrow to devices.", `<rect x="14" y="20" width="20" height="24" rx="4"/><path d="M38 32h10M44 26l6 6-6 6"/>`, { id: "managed-distribution", tags: ["distribution"] }],
  ["icons/apple-enterprise/federation.svg", "Federation", "Linked identity providers.", SHAPES.federation, { id: "federation", tags: ["identity"] }],
  ["icons/apple-enterprise/domain-verification.svg", "Domain Verification", "Globe with verification check.", `<circle cx="32" cy="32" r="18"/><path d="M14 32h36M32 14c-6 6-6 28 0 36M32 14c6 6 6 28 0 36"/><path d="M24 38l4 4 8-8"/>`, { id: "domain-verification", tags: ["domain"] }],
  ["icons/apple-enterprise/scim.svg", "SCIM", "Directory sync between systems.", SHAPES.scim, { id: "scim", tags: ["identity", "sync"] }],
  ["icons/apple-enterprise/apple-push-notification-service.svg", "Apple Push Notification Service", "Notification bell for APNs push channel.", SHAPES.apns, { id: "apple-push-notification-service", tags: ["apns", "push"] }],
  ["icons/apple-enterprise/push-certificate.svg", "Push Certificate", "Certificate for APNs authentication.", `<rect x="16" y="12" width="32" height="40" rx="5"/><circle cx="32" cy="26" r="5"/><path d="M26 36h12"/>`, { id: "push-certificate", tags: ["apns", "certificate"] }],
  ["icons/apple-enterprise/activation.svg", "Activation", "Device activation during setup.", `<rect x="22" y="14" width="20" height="36" rx="5"/><path d="M28 32l4 4 8-8"/>`, { id: "activation", tags: ["setup"] }],
  ["icons/apple-enterprise/setup-assistant.svg", "Setup Assistant", "Setup wizard screens.", `<rect x="16" y="14" width="32" height="36" rx="6"/><circle cx="32" cy="26" r="6"/><line x1="24" y1="38" x2="40" y2="38"/>`, { id: "setup-assistant", tags: ["setup"] }],
  ["icons/apple-enterprise/supervision.svg", "Supervision", "Supervised device indicator.", SHAPES.supervision, { id: "supervision", tags: ["supervised"] }],
  ["icons/apple-enterprise/declarative-device-management.svg", "Declarative Device Management", "Declarative status sync loop.", SHAPES.ddm, { id: "declarative-device-management", tags: ["ddm"] }],
  ["icons/apple-enterprise/mdm-command.svg", "MDM Command", "Remote management command dispatch.", SHAPES.mdmCmd, { id: "mdm-command", tags: ["mdm"] }],
  ["icons/apple-enterprise/configuration-profile.svg", "Configuration Profile", "Settings profile document.", SHAPES.docSliders, { id: "configuration-profile", tags: ["profile"] }],
  ["icons/apple-enterprise/managed-application.svg", "Managed Application", "Managed app with compliance check.", SHAPES.managedApp, { id: "managed-application", tags: ["app"] }],
  ["icons/apple-enterprise/managed-configuration.svg", "Managed Configuration", "App config payload.", `<rect x="16" y="16" width="32" height="32" rx="6"/><path d="M22 28h20M22 36h14"/>`, { id: "managed-configuration", tags: ["app-config"] }],
  ["icons/apple-enterprise/bootstrap-token.svg", "Bootstrap Token", "Secure bootstrap token for macOS.", SHAPES.bootstrap, { id: "bootstrap-token", tags: ["macos", "token"] }],
  ["icons/apple-enterprise/secure-token.svg", "Secure Token", "Secure token escrow indicator.", SHAPES.secureToken, { id: "secure-token", tags: ["macos", "token"] }],
  ["icons/apple-enterprise/filevault.svg", "FileVault", "Full disk encryption lock.", SHAPES.lockDisk, { id: "filevault", tags: ["encryption"] }],
  ["icons/apple-enterprise/recovery-key.svg", "Recovery Key", "Institutional recovery key.", `<rect x="18" y="24" width="28" height="20" rx="5"/><path d="M24 24v-6a8 8 0 0 1 16 0v6"/><path d="M26 34h12"/>`, { id: "recovery-key", tags: ["filevault"] }],
  ["icons/apple-enterprise/platform-sso.svg", "Platform SSO", "Single sign-on bridge between IdP and device.", `<rect x="10" y="24" width="14" height="16" rx="3"/><rect x="40" y="24" width="14" height="16" rx="3"/><path d="M24 32h16"/><circle cx="32" cy="32" r="4"/>`, { id: "platform-sso", tags: ["sso"] }],
  ["icons/apple-enterprise/extensible-sso.svg", "Extensible SSO", "App extension SSO plugin.", `<rect x="14" y="20" width="36" height="24" rx="6"/><path d="M22 32h12M34 28l8 4-8 4"/>`, { id: "extensible-sso", tags: ["sso"] }],
  ["icons/apple-enterprise/passcode-policy.svg", "Passcode Policy", "Device passcode requirements.", SHAPES.passcode, { id: "passcode-policy", tags: ["compliance"] }],
  ["icons/apple-enterprise/software-update.svg", "Software Update", "Managed OS update cycle.", SHAPES.update, { id: "software-update", tags: ["update"] }],
  ["icons/apple-enterprise/rapid-security-response.svg", "Rapid Security Response", "Fast security patch delivery.", `<path d="M32 14l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8z"/>`, { id: "rapid-security-response", tags: ["security"] }],
  ["icons/apple-enterprise/compliance.svg", "Compliance", "Device compliance evaluation.", SHAPES.compliance, { id: "compliance", tags: ["compliance"] }],
  ["icons/apple-enterprise/restrictions.svg", "Restrictions", "Blocked action indicator.", `<circle cx="32" cy="32" r="18"/><path d="M20 20l24 24"/>`, { id: "restrictions", tags: ["policy"] }],
  ["icons/apple-enterprise/lost-mode.svg", "Lost Mode", "Locate and lock lost device.", SHAPES.lostMode, { id: "lost-mode", tags: ["security"] }],
  ["icons/apple-enterprise/activation-lock.svg", "Activation Lock", "Activation lock enabled device.", SHAPES.activationLock, { id: "activation-lock", tags: ["security"] }],
  ["icons/apple-enterprise/return-to-service.svg", "Return to Service", "Device wipe and re-enrollment.", `<rect x="18" y="18" width="28" height="28" rx="6"/><path d="M26 32h12M32 26v12"/>`, { id: "return-to-service", tags: ["lifecycle"] }],
  ["icons/apple-enterprise/managed-device-attestation.svg", "Managed Device Attestation", "Hardware attestation validation.", SHAPES.attestation, { id: "managed-device-attestation", tags: ["security"] }],
  ["icons/apple-enterprise/device-identity.svg", "Device Identity", "Unique device identifier.", `<rect x="16" y="20" width="32" height="24" rx="5"/><path d="M22 32h8M34 28v8"/>`, { id: "device-identity", tags: ["identity"] }],
  ["icons/apple-enterprise/user-identity.svg", "User Identity", "User identity binding.", `<circle cx="32" cy="22" r="8"/><path d="M16 48c0-10 8-16 16-16"/><path d="M40 18l4-4"/>`, { id: "user-identity", tags: ["identity"] }],
];

for (const [file, title, desc, shapes, extra] of appleIcons) {
  registerIcon(file, title, desc, shapes, { ...extra, category: "apple-enterprise", ecosystem: "apple" });
}

// ── Jamf icons (≥15) ──────────────────────────────────────────────────────────
const jamfIcons = [
  ["icons/jamf/jamf-pro-service.svg", "Jamf Pro", "Jamf Pro server management service.", `<rect x="14" y="16" width="36" height="32" rx="6"/><path d="M22 28h20M22 36h14"/><circle cx="44" cy="40" r="4"/>`, { id: "jamf-pro-service", tags: ["jamf-pro"] }],
  ["icons/jamf/jamf-connect-service.svg", "Jamf Connect", "Identity bridge for macOS login.", SHAPES.connect, { id: "jamf-connect-service", tags: ["connect"] }],
  ["icons/jamf/jamf-protect-service.svg", "Jamf Protect", "Endpoint security monitoring.", SHAPES.protect, { id: "jamf-protect-service", tags: ["protect"] }],
  ["icons/jamf/jamf-school-service.svg", "Jamf School", "Education device management.", `<rect x="14" y="20" width="36" height="28" rx="6"/><path d="M32 14l16 8-16 8-16-8z"/>`, { id: "jamf-school-service", tags: ["school"] }],
  ["icons/jamf/jamf-security-cloud.svg", "Jamf Security Cloud", "Cloud security platform.", `<path d="M20 40h24a8 8 0 0 0 1-16 10 10 0 0 0-19-2 6 6 0 0 0-6 8z"/><path d="M32 28v8M28 32h8"/>`, { id: "jamf-security-cloud", tags: ["security"] }],
  ["icons/jamf/prestage-enrollment.svg", "PreStage Enrollment", "Zero-touch PreStage configuration.", `<rect x="16" y="14" width="32" height="36" rx="6"/><path d="M24 32l6 6 14-14"/><path d="M38 18h6v6"/>`, { id: "prestage-enrollment", tags: ["enrollment"] }],
  ["icons/jamf/smart-group.svg", "Smart Group", "Dynamic criteria-based group.", SHAPES.groupSmart, { id: "smart-group", tags: ["group"] }],
  ["icons/jamf/static-group.svg", "Static Group", "Fixed membership device group.", `<circle cx="24" cy="28" r="6"/><circle cx="40" cy="28" r="6"/><rect x="18" y="40" width="28" height="8" rx="4"/>`, { id: "static-group", tags: ["group"] }],
  ["icons/jamf/policy.svg", "Policy", "Jamf Pro policy document.", SHAPES.policy, { id: "policy", tags: ["policy"] }],
  ["icons/jamf/configuration-profile.svg", "Configuration Profile", "Jamf configuration profile payload.", SHAPES.docSliders, { id: "jamf-configuration-profile", tags: ["profile"] }],
  ["icons/jamf/package.svg", "Package", "Composer or PKG deployment.", SHAPES.package, { id: "package", tags: ["deployment"] }],
  ["icons/jamf/script.svg", "Script", "Shell script automation.", SHAPES.script, { id: "script", tags: ["automation"] }],
  ["icons/jamf/extension-attribute.svg", "Extension Attribute", "Custom inventory attribute.", `<rect x="14" y="18" width="36" height="28" rx="6"/><path d="M22 28h12M22 36h20"/><circle cx="42" cy="28" r="4"/>`, { id: "extension-attribute", tags: ["inventory"] }],
  ["icons/jamf/inventory.svg", "Inventory", "Device inventory record.", SHAPES.inventory, { id: "inventory", tags: ["inventory"] }],
  ["icons/jamf/recon.svg", "Recon", "Enrollment reconnaissance data.", `<rect x="18" y="16" width="28" height="32" rx="5"/><path d="M24 28h16M24 36h12"/><circle cx="32" cy="22" r="4"/>`, { id: "recon", tags: ["enrollment"] }],
  ["icons/jamf/self-service.svg", "Self Service", "User self-service catalog.", SHAPES.selfService, { id: "self-service", tags: ["catalog"] }],
  ["icons/jamf/patch-management.svg", "Patch Management", "Software patch workflow.", `<rect x="14" y="20" width="36" height="24" rx="6"/><path d="M22 32h20M32 24v16"/>`, { id: "patch-management", tags: ["patch"] }],
  ["icons/jamf/app-installer.svg", "App Installer", "Automated app installation.", `<rect x="16" y="16" width="32" height="32" rx="8"/><path d="M32 24v16M24 32h16"/>`, { id: "app-installer", tags: ["app"] }],
  ["icons/jamf/enrollment-invitation.svg", "Enrollment Invitation", "User enrollment invitation link.", `<rect x="14" y="18" width="36" height="28" rx="6"/><path d="M22 32h12M34 28l8 4-8 4"/>`, { id: "enrollment-invitation", tags: ["enrollment"] }],
  ["icons/jamf/automated-device-enrollment.svg", "Automated Device Enrollment", "Jamf ADE integration.", SHAPES.enrollment, { id: "jamf-automated-device-enrollment", tags: ["ade"] }],
  ["icons/jamf/ldap.svg", "LDAP", "LDAP directory connection.", `<rect x="12" y="18" width="18" height="28" rx="4"/><path d="M30 26h10M30 34h10M30 42h6"/>`, { id: "ldap", tags: ["directory"] }],
  ["icons/jamf/cloud-identity-provider.svg", "Cloud Identity Provider", "Cloud IdP integration.", SHAPES.cloud, { id: "cloud-identity-provider", tags: ["identity"] }],
  ["icons/jamf/webhook.svg", "Webhook", "Event webhook notification.", SHAPES.webhook, { id: "webhook", tags: ["integration"] }],
  ["icons/jamf/api.svg", "API", "Jamf Pro API access.", SHAPES.api, { id: "jamf-api", tags: ["api"] }],
  ["icons/jamf/jamf-binary.svg", "Jamf Binary", "jamf binary agent on device.", `<rect x="16" y="20" width="32" height="24" rx="6"/><path d="M24 32h16"/><circle cx="32" cy="32" r="3" fill="currentColor" stroke="none"/>`, { id: "jamf-binary", tags: ["agent"] }],
  ["icons/jamf/threat-prevention.svg", "Threat Prevention", "Active threat blocking.", `<path d="M32 12l16 6v12c0 10-7 18-16 22"/><path d="M24 30l8 8 12-14"/>`, { id: "threat-prevention", tags: ["security"] }],
  ["icons/jamf/zero-trust-network-access.svg", "Zero Trust Network Access", "ZTNA secure access.", SHAPES.secureTunnel, { id: "zero-trust-network-access", tags: ["ztna"] }],
  ["icons/jamf/jamf-trust.svg", "Jamf Trust", "Trust score indicator.", `<circle cx="32" cy="32" r="18"/><path d="M24 32l6 6 14-14"/>`, { id: "jamf-trust", tags: ["trust"] }],
];

for (const [file, title, desc, shapes, extra] of jamfIcons) {
  registerIcon(file, title, desc, shapes, { ...extra, category: "jamf", ecosystem: "jamf" });
}

// ── Microsoft icons (≥15) ─────────────────────────────────────────────────────
const msIcons = [
  ["icons/microsoft/intune-service.svg", "Microsoft Intune", "Intune device management service.", `<rect x="14" y="16" width="36" height="32" rx="6"/><circle cx="32" cy="32" r="8"/><path d="M32 24v16M24 32h16"/>`, { id: "intune-service", tags: ["intune"] }],
  ["icons/microsoft/entra-id-service.svg", "Microsoft Entra ID", "Cloud identity directory service.", `<circle cx="32" cy="24" r="10"/><path d="M16 48c0-10 7-16 16-16s16 6 16 16"/><circle cx="44" cy="18" r="5"/>`, { id: "entra-id-service", tags: ["entra"] }],
  ["icons/microsoft/defender-endpoint.svg", "Defender for Endpoint", "Endpoint detection and response.", `<path d="M32 12l16 6v12c0 10-7 18-16 22"/><path d="M28 30h8v8h-8z"/>`, { id: "defender-endpoint", tags: ["defender"] }],
  ["icons/microsoft/conditional-access.svg", "Conditional Access", "Policy-based access control.", SHAPES.conditional, { id: "conditional-access", tags: ["access"] }],
  ["icons/microsoft/compliance-policy.svg", "Compliance Policy", "Device compliance rules.", SHAPES.compliance, { id: "compliance-policy", tags: ["compliance"] }],
  ["icons/microsoft/settings-catalog.svg", "Settings Catalog", "Granular settings catalog profile.", SHAPES.settings, { id: "settings-catalog", tags: ["profile"] }],
  ["icons/microsoft/device-configuration.svg", "Device Configuration", "Legacy device configuration profile.", SHAPES.docSliders, { id: "device-configuration", tags: ["profile"] }],
  ["icons/microsoft/enrollment-profile.svg", "Enrollment Profile", "Apple ADE enrollment profile.", `<rect x="16" y="14" width="32" height="36" rx="6"/><path d="M24 32l6 6 14-14"/>`, { id: "enrollment-profile", tags: ["enrollment"] }],
  ["icons/microsoft/apple-enrollment-token.svg", "Apple Enrollment Token", "ABM server token upload.", SHAPES.token, { id: "apple-enrollment-token", tags: ["ade", "token"] }],
  ["icons/microsoft/ade-token.svg", "ADE Token", "Automated Device Enrollment token.", SHAPES.token, { id: "ade-token", tags: ["ade"] }],
  ["icons/microsoft/vpp-token.svg", "VPP Token", "Volume Purchase Program token.", `<rect x="14" y="22" width="36" height="20" rx="10"/><path d="M22 32h8M34 28v8"/>`, { id: "vpp-token", tags: ["vpp"] }],
  ["icons/microsoft/app-protection-policy.svg", "App Protection Policy", "MAM app protection rules.", `<rect x="14" y="14" width="36" height="36" rx="8"/><path d="M22 32l6 6 14-14"/>`, { id: "app-protection-policy", tags: ["mam"] }],
  ["icons/microsoft/device-compliance.svg", "Device Compliance", "Compliance state evaluation.", SHAPES.shieldOk, { id: "device-compliance", tags: ["compliance"] }],
  ["icons/microsoft/endpoint-security.svg", "Endpoint Security", "Security baselines and EDR.", SHAPES.protect, { id: "endpoint-security", tags: ["security"] }],
  ["icons/microsoft/security-baseline.svg", "Security Baseline", "Microsoft security baseline.", `<rect x="14" y="14" width="36" height="36" rx="6"/><path d="M22 32h20M32 22v20"/>`, { id: "security-baseline", tags: ["baseline"] }],
  ["icons/microsoft/update-ring.svg", "Update Ring", "Staged update deployment ring.", `<circle cx="32" cy="32" r="18"/><circle cx="32" cy="32" r="10"/><circle cx="32" cy="32" r="4" fill="currentColor" stroke="none"/>`, { id: "update-ring", tags: ["update"] }],
  ["icons/microsoft/company-portal.svg", "Company Portal", "End-user company portal app.", SHAPES.portal, { id: "company-portal", tags: ["portal"] }],
  ["icons/microsoft/dynamic-group.svg", "Dynamic Group", "Rule-based dynamic group.", SHAPES.dynamicGroup, { id: "dynamic-group", tags: ["group"] }],
  ["icons/microsoft/assignment.svg", "Assignment", "Policy assignment targeting.", `<rect x="14" y="20" width="20" height="24" rx="4"/><path d="M38 32h12M44 26l6 6-6 6"/>`, { id: "assignment", tags: ["targeting"] }],
  ["icons/microsoft/scope-tag.svg", "Scope Tag", "Administrative scope tag.", `<rect x="16" y="22" width="32" height="20" rx="10"/><path d="M22 32h12"/><circle cx="42" cy="32" r="4"/>`, { id: "scope-tag", tags: ["rbac"] }],
  ["icons/microsoft/remote-action.svg", "Remote Action", "Remote device action command.", SHAPES.remote, { id: "remote-action", tags: ["action"] }],
  ["icons/microsoft/device-wipe.svg", "Device Wipe", "Full device wipe action.", `<rect x="18" y="18" width="28" height="28" rx="6"/><path d="M24 24l16 16M40 24l-16 16"/>`, { id: "device-wipe", tags: ["action"] }],
  ["icons/microsoft/single-sign-on.svg", "Single Sign-On", "Enterprise SSO configuration.", `<circle cx="20" cy="32" r="8"/><circle cx="44" cy="32" r="8"/><path d="M28 32h8"/>`, { id: "single-sign-on", tags: ["sso"] }],
  ["icons/microsoft/scep.svg", "SCEP", "SCEP certificate enrollment.", SHAPES.cert, { id: "scep", tags: ["certificate"] }],
  ["icons/microsoft/vpn.svg", "VPN", "VPN configuration profile.", SHAPES.vpn, { id: "vpn", tags: ["network"] }],
  ["icons/microsoft/wifi-profile.svg", "Wi-Fi Profile", "Wireless network profile.", SHAPES.wifi, { id: "wifi-profile", tags: ["network"] }],
];

for (const [file, title, desc, shapes, extra] of msIcons) {
  registerIcon(file, title, desc, shapes, { ...extra, category: "microsoft", ecosystem: "microsoft" });
}

// ── Common icons: devices, users, security, network, states, actions ──────────
const commonIcons = [
  ["icons/users/administrator.svg", "Administrator", "IT administrator user role.", SHAPES.admin, { id: "administrator", category: "users", ecosystem: "neutral", tags: ["role"] }],
  ["icons/users/user.svg", "User", "Standard end user.", SHAPES.user, { id: "user", category: "users", ecosystem: "neutral", tags: ["role"] }],
  ["icons/devices/mac-laptop.svg", "MacBook", "Generic Mac laptop silhouette.", SHAPES.macbook, { id: "mac-laptop", category: "devices", ecosystem: "apple", tags: ["mac"] }],
  ["icons/devices/iphone-device.svg", "iPhone", "Generic iPhone silhouette.", SHAPES.iphone, { id: "iphone-device", category: "devices", ecosystem: "apple", tags: ["ios"] }],
  ["icons/devices/ipad-device.svg", "iPad", "Generic iPad silhouette.", SHAPES.ipad, { id: "ipad-device", category: "devices", ecosystem: "apple", tags: ["ipados"] }],
  ["icons/devices/windows-laptop.svg", "Windows Laptop", "Generic Windows laptop.", SHAPES.winLaptop, { id: "windows-laptop", category: "devices", ecosystem: "microsoft", tags: ["windows"] }],
  ["icons/devices/android-phone.svg", "Android Phone", "Generic Android phone.", SHAPES.android, { id: "android-phone", category: "devices", ecosystem: "neutral", tags: ["android"] }],
  ["icons/devices/imac-device.svg", "iMac", "Generic iMac silhouette.", `<rect x="12" y="14" width="40" height="28" rx="4"/><path d="M24 48h16" stroke-width="3"/><path d="M20 48h24" stroke-width="2"/>`, { id: "imac-device", category: "devices", ecosystem: "apple", tags: ["mac"] }],
  ["icons/devices/mac-mini.svg", "Mac mini", "Generic Mac mini.", `<rect x="16" y="24" width="32" height="20" rx="4"/><circle cx="32" cy="34" r="3"/>`, { id: "mac-mini", category: "devices", ecosystem: "apple", tags: ["mac"] }],
  ["icons/devices/server.svg", "Server", "Generic server hardware.", SHAPES.server, { id: "server", category: "devices", ecosystem: "neutral", tags: ["infrastructure"] }],
  ["icons/networking/cloud-service.svg", "Cloud Service", "Cloud-hosted service.", SHAPES.cloud, { id: "cloud-service", category: "networking", ecosystem: "neutral", tags: ["cloud"] }],
  ["icons/mdm/mdm-server.svg", "MDM Server", "Mobile device management server.", SHAPES.server, { id: "mdm-server", category: "mdm", ecosystem: "neutral", tags: ["mdm"] }],
  ["icons/security/certificate.svg", "Certificate", "Digital certificate document.", SHAPES.cert, { id: "certificate", category: "security", ecosystem: "neutral", tags: ["certificate"] }],
  ["icons/security/shield-compliant.svg", "Compliant", "Compliant security status.", SHAPES.shieldOk, { id: "shield-compliant", category: "security", ecosystem: "neutral", tags: ["compliance"] }],
  ["icons/security/shield-non-compliant.svg", "Non-Compliant", "Non-compliant security status.", SHAPES.shieldBad, { id: "shield-non-compliant", category: "security", ecosystem: "neutral", tags: ["compliance"] }],
  ["icons/networking/sync.svg", "Synchronization", "Bidirectional sync.", SHAPES.sync, { id: "sync", category: "networking", ecosystem: "neutral", tags: ["sync"] }],
  ["icons/networking/secure-connection.svg", "Secure Connection", "Encrypted tunnel connection.", SHAPES.secureTunnel, { id: "secure-connection", category: "networking", ecosystem: "neutral", tags: ["security"] }],
  ["icons/states/warning.svg", "Warning", "Warning alert state.", SHAPES.warning, { id: "warning", category: "states", ecosystem: "neutral", tags: ["alert"] }],
  ["icons/states/status-success.svg", "Success", "Successful operation state.", SHAPES.statusOk, { id: "status-success", category: "states", ecosystem: "neutral", tags: ["status"] }],
  ["icons/states/status-error.svg", "Error", "Error state indicator.", SHAPES.statusErr, { id: "status-error", category: "states", ecosystem: "neutral", tags: ["status"] }],
  ["icons/states/status-pending.svg", "Pending", "Pending operation state.", SHAPES.statusPending, { id: "status-pending", category: "states", ecosystem: "neutral", tags: ["status"] }],
  ["icons/states/encrypted.svg", "Encrypted", "Encryption enabled.", SHAPES.encrypted, { id: "encrypted", category: "states", ecosystem: "neutral", tags: ["encryption"] }],
  ["icons/states/managed.svg", "Managed", "MDM managed device.", SHAPES.managed, { id: "managed", category: "states", ecosystem: "neutral", tags: ["mdm"] }],
  ["icons/actions/add.svg", "Add", "Add or create action.", SHAPES.add, { id: "add", category: "actions", ecosystem: "neutral", tags: ["action"] }],
  ["icons/actions/remove.svg", "Remove", "Remove or delete action.", SHAPES.remove, { id: "remove", category: "actions", ecosystem: "neutral", tags: ["action"] }],
  ["icons/actions/deploy.svg", "Deploy", "Deploy content action.", SHAPES.deploy, { id: "deploy", category: "actions", ecosystem: "neutral", tags: ["action"] }],
  ["icons/identity/federation.svg", "Identity Federation", "Federated identity link.", SHAPES.federation, { id: "identity-federation", category: "identity", ecosystem: "neutral", tags: ["identity"] }],
  ["icons/identity/mfa.svg", "Multi-Factor Authentication", "MFA second factor.", `<rect x="18" y="26" width="28" height="22" rx="5"/><path d="M24 26v-6a8 8 0 0 1 16 0v6"/><circle cx="32" cy="38" r="3"/><path d="M42 22l4-4"/>`, { id: "mfa", category: "identity", ecosystem: "neutral", tags: ["auth"] }],
  ["icons/security/zero-trust.svg", "Zero Trust", "Zero trust security model.", `<circle cx="32" cy="32" r="18"/><path d="M32 18v14l10 6"/><circle cx="32" cy="32" r="6"/>`, { id: "zero-trust", category: "security", ecosystem: "neutral", tags: ["security"] }],
  ["icons/networking/firewall.svg", "Firewall", "Network firewall.", SHAPES.firewall, { id: "firewall", category: "networking", ecosystem: "neutral", tags: ["network"] }],
  ["icons/networking/api.svg", "API Endpoint", "REST API endpoint.", SHAPES.api, { id: "api-endpoint", category: "networking", ecosystem: "neutral", tags: ["api"] }],
];

for (const [file, title, desc, shapes, extra] of commonIcons) {
  registerIcon(file, title, desc, shapes, extra);
}

// ── Connectors (10) ───────────────────────────────────────────────────────────
function connectorSvg(w, h, title, desc, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
  <title id="title">${title}</title>
  <desc id="desc">${desc}</desc>
  <g fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    ${inner}
  </g>
</svg>`;
}

const connectors = [
  ["components/connectors/connector-arrow-right.svg", 120, 32, "Arrow Right", "Horizontal arrow connector pointing right.", `<circle cx="8" cy="16" r="4" fill="currentColor" stroke="none"/><path d="M16 16h88"/><path d="M96 10l14 6-14 6"/><circle cx="112" cy="16" r="4" fill="currentColor" stroke="none"/>`],
  ["components/connectors/connector-arrow-left.svg", 120, 32, "Arrow Left", "Horizontal arrow connector pointing left.", `<circle cx="8" cy="16" r="4" fill="currentColor" stroke="none"/><path d="M22 10l-14 6 14 6"/><path d="M22 16h88"/><circle cx="112" cy="16" r="4" fill="currentColor" stroke="none"/>`],
  ["components/connectors/connector-arrow-vertical.svg", 32, 120, "Arrow Vertical", "Vertical arrow connector.", `<circle cx="16" cy="8" r="4" fill="currentColor" stroke="none"/><path d="M16 16v88"/><path d="M10 96l6 14 6-14"/><circle cx="16" cy="112" r="4" fill="currentColor" stroke="none"/>`],
  ["components/connectors/connector-curved.svg", 120, 64, "Curved Connector", "Curved flow connector.", `<circle cx="8" cy="32" r="4" fill="currentColor" stroke="none"/><path d="M16 32C40 32 40 16 64 16"/><path d="M58 10l10 6-6 10"/><circle cx="112" cy="16" r="4" fill="currentColor" stroke="none"/>`],
  ["components/connectors/connector-double-arrow.svg", 120, 32, "Double Arrow", "Bidirectional sync connector.", `<circle cx="8" cy="16" r="4" fill="currentColor" stroke="none"/><path d="M22 10l-8 6 8 6M98 10l8 6-8 6"/><path d="M22 16h76"/><circle cx="112" cy="16" r="4" fill="currentColor" stroke="none"/>`],
  ["components/connectors/connector-dashed.svg", 120, 32, "Dashed Connector", "Optional or async dashed connector.", `<circle cx="8" cy="16" r="4" fill="currentColor" stroke="none"/><path d="M16 16h88" stroke-dasharray="6 4"/><path d="M96 10l14 6-14 6"/><circle cx="112" cy="16" r="4" fill="currentColor" stroke="none"/>`],
  ["components/connectors/connector-sync.svg", 120, 32, "Sync Connector", "Synchronization connector with arrows.", `<circle cx="8" cy="16" r="4" fill="currentColor" stroke="none"/><path d="M24 12a16 16 0 0 1 28 4"/><path d="M96 20a16 16 0 0 1-28-4"/><path d="M40 16h40"/><circle cx="112" cy="16" r="4" fill="currentColor" stroke="none"/>`],
  ["components/connectors/connector-secure.svg", 120, 32, "Secure Connector", "Encrypted secure tunnel connector.", `<circle cx="8" cy="16" r="4" fill="currentColor" stroke="none"/><path d="M16 16h72"/><rect x="52" y="10" width="12" height="12" rx="3"/><path d="M88 16h16"/><path d="M96 10l14 6-14 6"/><circle cx="112" cy="16" r="4" fill="currentColor" stroke="none"/>`],
  ["components/connectors/connector-validation.svg", 120, 32, "Validation Connector", "Validated flow connector with check.", `<circle cx="8" cy="16" r="4" fill="currentColor" stroke="none"/><path d="M16 16h60"/><circle cx="82" cy="16" r="8"/><path d="M78 16l3 3 6-6"/><path d="M94 16h12"/><circle cx="112" cy="16" r="4" fill="currentColor" stroke="none"/>`],
  ["components/connectors/connector-error.svg", 120, 32, "Error Connector", "Failed flow connector.", `<circle cx="8" cy="16" r="4" fill="currentColor" stroke="none"/><path d="M16 16h60"/><circle cx="82" cy="16" r="8"/><path d="M78 12l8 8M86 12l-8 8"/><path d="M94 16h12"/><circle cx="112" cy="16" r="4" fill="currentColor" stroke="none"/>`],
];

for (const [file, w, h, title, desc, inner] of connectors) {
  writeAsset(file, connectorSvg(w, h, title, desc, inner), {
    id: file.split("/").pop().replace(".svg", ""),
    name: title,
    category: "connectors",
    ecosystem: "neutral",
    type: "connector",
    tags: ["connector", "freeform"],
    description: desc,
    freeformReady: true,
    verificationStatus: "original",
  });
}

// ── Cards (8 types) ───────────────────────────────────────────────────────────
function serviceCard(ecosystem, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 128" role="img" aria-labelledby="title desc">
  <title id="title">${ecosystem} Service Card</title>
  <desc id="desc">Freeform service card for ${ecosystem} ecosystem with status indicator and connector anchors.</desc>
  <rect width="240" height="128" rx="12" fill="${COLORS.gray100}" stroke="${accent}" stroke-width="2"/>
  <rect x="16" y="16" width="48" height="48" rx="10" fill="${accent}" opacity="0.15"/>
  <circle cx="40" cy="40" r="16" fill="none" stroke="${accent}" stroke-width="2.5"/>
  <rect x="80" y="20" width="100" height="10" rx="5" fill="${COLORS.gray600}"/>
  <rect x="80" y="38" width="72" height="8" rx="4" fill="${COLORS.gray400}"/>
  <circle cx="200" cy="24" r="6" fill="${COLORS.green}"/>
  <circle cx="8" cy="64" r="4" fill="${accent}"/>
  <circle cx="232" cy="64" r="4" fill="${accent}"/>
</svg>`;
}

const cards = [
  ["components/cards/card-service-apple.svg", serviceCard("Apple", COLORS.blue), "card-service-apple", "Apple Service Card", "apple"],
  ["components/cards/card-service-jamf.svg", serviceCard("Jamf", COLORS.jamfBlue), "card-service-jamf", "Jamf Service Card", "jamf"],
  ["components/cards/card-service-microsoft.svg", serviceCard("Microsoft", COLORS.microsoftBlue), "card-service-microsoft", "Microsoft Service Card", "microsoft"],
  ["components/cards/card-service-neutral.svg", serviceCard("Neutral", COLORS.gray600), "card-service-neutral", "Neutral Service Card", "neutral"],
  ["components/cards/card-device.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 140" role="img" aria-labelledby="title desc">
  <title id="title">Device Card</title>
  <desc id="desc">Device card with OS, MDM state, user and compliance indicators.</desc>
  <rect width="180" height="140" rx="12" fill="${COLORS.gray100}" stroke="${COLORS.gray400}" stroke-width="2"/>
  <rect x="16" y="20" width="48" height="32" rx="4" fill="none" stroke="${COLORS.gray900}" stroke-width="2"/>
  <rect x="72" y="18" width="80" height="10" rx="5" fill="${COLORS.gray600}"/>
  <rect x="72" y="36" width="56" height="8" rx="4" fill="${COLORS.gray400}"/>
  <rect x="16" y="68" width="60" height="8" rx="4" fill="${COLORS.blue}"/>
  <rect x="16" y="84" width="48" height="8" rx="4" fill="${COLORS.gray400}"/>
  <circle cx="148" cy="76" r="8" fill="${COLORS.green}"/>
  <text x="132" y="80" font-family="system-ui,sans-serif" font-size="8" fill="${COLORS.white}">OK</text>
</svg>`, "card-device", "Device Card", "neutral"],
  ["components/cards/card-user.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 120" role="img" aria-labelledby="title desc">
  <title id="title">User Card</title>
  <desc id="desc">User card with role, identity and MFA status.</desc>
  <rect width="180" height="120" rx="12" fill="${COLORS.gray100}" stroke="${COLORS.gray400}" stroke-width="2"/>
  <circle cx="40" cy="44" r="18" fill="none" stroke="${COLORS.gray900}" stroke-width="2.5"/>
  <path d="M16 92c0-14 11-22 24-22s24 8 24 22" fill="none" stroke="${COLORS.gray900}" stroke-width="2.5"/>
  <rect x="72" y="28" width="80" height="10" rx="5" fill="${COLORS.gray600}"/>
  <rect x="72" y="46" width="60" height="8" rx="4" fill="${COLORS.gray400}"/>
  <rect x="72" y="66" width="40" height="16" rx="8" fill="${COLORS.green}" opacity="0.2" stroke="${COLORS.green}" stroke-width="1.5"/>
  <text x="78" y="77" font-family="system-ui,sans-serif" font-size="8" fill="${COLORS.green}">MFA</text>
</svg>`, "card-user", "User Card", "neutral"],
  ["components/cards/card-policy.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" role="img" aria-labelledby="title desc">
  <title id="title">Policy Card</title>
  <desc id="desc">Policy card with type, target, state and priority.</desc>
  <rect width="220" height="140" rx="12" fill="${COLORS.gray100}" stroke="${COLORS.purple}" stroke-width="2"/>
  <rect x="16" y="16" width="48" height="56" rx="6" fill="none" stroke="${COLORS.purple}" stroke-width="2"/>
  <line x1="24" y1="32" x2="56" y2="32" stroke="${COLORS.purple}" stroke-width="2"/>
  <line x1="24" y1="44" x2="48" y2="44" stroke="${COLORS.purple}" stroke-width="2"/>
  <rect x="76" y="20" width="100" height="10" rx="5" fill="${COLORS.gray600}"/>
  <rect x="76" y="38" width="72" height="8" rx="4" fill="${COLORS.gray400}"/>
  <rect x="76" y="56" width="48" height="16" rx="8" fill="${COLORS.orange}" opacity="0.2" stroke="${COLORS.orange}" stroke-width="1.5"/>
  <circle cx="188" cy="28" r="8" fill="${COLORS.green}"/>
</svg>`, "card-policy", "Policy Card", "neutral"],
  ["components/cards/card-compliance.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 140" role="img" aria-labelledby="title desc">
  <title id="title">Compliance Card</title>
  <desc id="desc">Compliance status card with conform/warning/non-conform states.</desc>
  <rect width="220" height="140" rx="12" fill="${COLORS.gray100}" stroke="${COLORS.gray400}" stroke-width="2"/>
  <path d="M110 24l28 10v16c0 14-10 24-28 28-18-4-28-14-28-28V34z" fill="none" stroke="${COLORS.green}" stroke-width="2.5"/>
  <path d="M98 44l8 8 16-16" stroke="${COLORS.green}" stroke-width="2.5" fill="none"/>
  <rect x="24" y="80" width="48" height="40" rx="8" fill="${COLORS.green}" opacity="0.15" stroke="${COLORS.green}" stroke-width="1.5"/>
  <rect x="86" y="80" width="48" height="40" rx="8" fill="${COLORS.orange}" opacity="0.15" stroke="${COLORS.orange}" stroke-width="1.5"/>
  <rect x="148" y="80" width="48" height="40" rx="8" fill="${COLORS.red}" opacity="0.15" stroke="${COLORS.red}" stroke-width="1.5"/>
</svg>`, "card-compliance", "Compliance Card", "neutral"],
];

for (const [file, content, id, name, ecosystem] of cards) {
  writeAsset(file, content, {
    id,
    name,
    category: "cards",
    ecosystem,
    type: "component",
    tags: ["card", "freeform"],
    description: `${name} for Freeform diagrams.`,
    freeformReady: true,
    verificationStatus: "original",
  });
}

// Step cards 1-8
for (let i = 1; i <= 8; i++) {
  const file = `components/cards/card-step-${i}.svg`;
  writeAsset(
    file,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 128" role="img" aria-labelledby="title desc">
  <title id="title">Step ${i}</title>
  <desc id="desc">Numbered workflow step card ${i} with connectors.</desc>
  <rect width="220" height="128" rx="12" fill="${COLORS.gray100}" stroke="${COLORS.blue}" stroke-width="2"/>
  <circle cx="36" cy="36" r="20" fill="${COLORS.blue}"/>
  <text x="36" y="41" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="700" fill="${COLORS.white}">${i}</text>
  <rect x="68" y="24" width="120" height="12" rx="6" fill="${COLORS.gray600}"/>
  <rect x="68" y="44" width="96" height="8" rx="4" fill="${COLORS.gray400}"/>
  <circle cx="8" cy="64" r="4" fill="${COLORS.blue}"/>
  <circle cx="212" cy="64" r="4" fill="${COLORS.blue}"/>
</svg>`,
    {
      id: `card-step-${i}`,
      name: `Step Card ${i}`,
      category: "cards",
      ecosystem: "neutral",
      type: "component",
      tags: ["step", "workflow", "freeform"],
      description: `Numbered step ${i} for video storyboards.`,
      freeformReady: true,
      verificationStatus: "original",
    }
  );
}

// ── Badges (8+) ─────────────────────────────────────────────────────────────────
const badges = [
  ["verified-source", "Verified Source", COLORS.green],
  ["tech-reviewed", "Technically Reviewed", COLORS.blue],
  ["draft", "Draft", COLORS.gray400],
  ["to-verify", "To Verify", COLORS.orange],
  ["beginner", "Beginner", COLORS.cyan],
  ["intermediate", "Intermediate", COLORS.purple],
  ["advanced", "Advanced", COLORS.navy],
  ["certification", "Certification", COLORS.orange],
  ["lab", "Lab", COLORS.jamfCyan],
  ["video", "Video", COLORS.microsoftBlue],
];

for (const [slug, label, color] of badges) {
  writeAsset(
    `components/badges/badge-${slug}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40" role="img" aria-labelledby="title desc">
  <title id="title">${label}</title>
  <desc id="desc">${label} badge for content labeling.</desc>
  <rect width="160" height="40" rx="20" fill="${color}" opacity="0.15" stroke="${color}" stroke-width="2"/>
  <text x="80" y="25" text-anchor="middle" font-family="system-ui,sans-serif" font-size="12" font-weight="600" fill="${color}">${label}</text>
</svg>`,
    {
      id: `badge-${slug}`,
      name: label,
      category: "badges",
      ecosystem: "neutral",
      type: "badge",
      tags: ["badge", "label"],
      description: `${label} content badge.`,
      freeformReady: true,
      verificationStatus: "original",
    }
  );
}

// ── Logo proposals A/B/C ────────────────────────────────────────────────────────
function logoProposal(title, desc, inner, variant, w, h, bg = "#0B102B") {
  const scaled =
    variant === "horizontal"
      ? `<rect width="${w}" height="${h}" rx="24" fill="${bg}"/><g transform="translate(24,24) scale(0.28)">${inner.replace(/width="512" height="512" rx="96" fill="[^"]*"/, "")}</g><text x="200" y="110" font-family="system-ui,sans-serif" font-size="28" font-weight="700" fill="${bg === "#F1F5F9" ? "#0F172A" : "#F1F5F9"}">Apple MDM Academy</text>`
      : variant === "vertical"
        ? `<rect width="${w}" height="${h}" rx="24" fill="${bg}"/><g transform="translate(20,40) scale(0.28)">${inner.replace(/width="512" height="512" rx="96" fill="[^"]*"/, "")}</g><text x="100" y="520" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" font-weight="700" fill="${bg === "#F1F5F9" ? "#0F172A" : "#F1F5F9"}">AMA</text>`
        : variant === "monochrome"
          ? `<rect width="${w}" height="${h}" rx="${Math.min(w, h) * 0.12}" fill="${bg}"/><g fill="none" stroke="${bg === "#FFFFFF" ? "#0F172A" : "#FFFFFF"}" stroke-width="8">${inner.replace(/fill="[^"]*"/g, "").replace(/stroke="[^"]*"/g, "")}</g>`
          : inner.replace(/fill="#0B102B"/, `fill="${bg}"`).replace(/fill="#F1F5F9"/, `fill="${bg}"`);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
  <title id="title">${title} — ${variant}</title>
  <desc id="desc">${desc}</desc>
  ${variant === "favicon" ? `<g transform="scale(0.125)">${scaled}</g>` : scaled}
</svg>`;
}

const proposalA = `<rect width="512" height="512" rx="96" fill="#0B102B"/>
  <path d="M128 320c0-80 64-128 128-128s128 48 128 128" fill="none" stroke="#2563EB" stroke-width="12"/>
  <path d="M192 192h128" stroke="#2563EB" stroke-width="8"/>
  <circle cx="192" cy="192" r="24" fill="#13B8D3"/>
  <circle cx="320" cy="192" r="24" fill="#6D4AFF"/>
  <circle cx="256" cy="320" r="24" fill="#22C55E"/>
  <path d="M216 216l40 40M296 216l-40 40" stroke="#2563EB" stroke-width="4"/>
  <path d="M256 128v-32" stroke="#94A3B8" stroke-width="6"/>
  <path d="M224 352l32 48 32-48" fill="none" stroke="#2563EB" stroke-width="10" stroke-linejoin="round"/>
  <path d="M208 368h96" stroke="#2563EB" stroke-width="8"/>
  <path d="M360 140l24-16v32z" fill="#22C55E" opacity="0.6"/>`;

const proposalB = `<rect width="512" height="512" rx="96" fill="#F1F5F9"/>
  <path d="M96 384 Q256 128 416 384" fill="none" stroke="#2563EB" stroke-width="14" stroke-linecap="round"/>
  <rect x="216" y="200" width="80" height="56" rx="12" fill="none" stroke="#0F172A" stroke-width="8"/>
  <circle cx="296" cy="128" r="32" fill="#22C55E"/>
  <path d="M284 128l8 8 16-16" stroke="#fff" stroke-width="6" fill="none"/>`;

const proposalC = `<rect width="512" height="512" rx="96" fill="#0B102B"/>
  <path d="M160 160h80v80h-80z M272 160h80v80h-80z M216 272h80v80h-80z" fill="none" stroke="#2563EB" stroke-width="10" stroke-linejoin="round"/>
  <path d="M240 200h32M272 240v32M200 240h32" stroke="#13B8D3" stroke-width="6"/>
  <circle cx="256" cy="256" r="120" fill="none" stroke="#6D4AFF" stroke-width="4" stroke-dasharray="8 12" opacity="0.5"/>`;

const proposalVariants = [
  ["symbol", 512, 512, "#0B102B"],
  ["horizontal", 640, 200, "#0B102B"],
  ["vertical", 200, 640, "#0B102B"],
  ["light", 512, 512, "#F1F5F9"],
  ["dark", 512, 512, "#0B102B"],
  ["monochrome", 512, 512, "#FFFFFF"],
  ["favicon", 64, 64, "#0B102B"],
  ["app-icon", 512, 512, "#0B102B"],
];

for (const [letter, inner] of [["a", proposalA], ["b", proposalB], ["c", proposalC]]) {
  for (const [variant, w, h, bg] of proposalVariants) {
    const bgAdjusted = letter === "b" && variant === "symbol" ? "#F1F5F9" : bg;
    writeAsset(
      `logo-proposals/proposal-${letter}-${variant}.svg`,
      logoProposal(
        `AMA Logo Proposal ${letter.toUpperCase()}`,
        `Original AMA logo proposal ${letter.toUpperCase()} — not for production use.`,
        inner,
        variant,
        w,
        h,
        bgAdjusted
      ),
      {
        id: `logo-proposal-${letter}-${variant}`,
        name: `Logo Proposal ${letter.toUpperCase()} (${variant})`,
        category: "logo-proposals",
        ecosystem: "neutral",
        type: "logo",
        tags: ["proposal", "ama", variant],
        description: `AMA logo proposal ${letter.toUpperCase()} — ${variant}. Does not replace current brand mark.`,
        freeformReady: false,
        verificationStatus: "to-verify",
      }
    );
  }
}

// ── Freeform boards (5 planches) ────────────────────────────────────────────────
function freeformBoard(id, title, items, cols = 6) {
  const cell = 80;
  const pad = 40;
  const rows = Math.ceil(items.length / cols);
  const w = pad * 2 + cols * cell;
  const h = pad * 2 + 60 + rows * cell;
  let icons = "";
  items.forEach((item, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = pad + col * cell;
    const y = pad + 60 + row * cell;
    icons += `<rect x="${x}" y="${y}" width="64" height="64" rx="8" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1"/>
    <text x="${x + 32}" y="${y + 78}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="7" fill="#475569">${item.slice(0, 12)}</text>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="title desc">
  <title id="title">${title}</title>
  <desc id="desc">Freeform starter board: ${title}</desc>
  <rect width="${w}" height="${h}" fill="#FFFFFF"/>
  <text x="${pad}" y="36" font-family="system-ui,sans-serif" font-size="20" font-weight="700" fill="#0F172A">${title}</text>
  <text x="${pad}" y="56" font-family="system-ui,sans-serif" font-size="11" fill="#94A3B8">Apple MDM Academy — Enterprise Icon System</text>
  ${icons}
</svg>`;
}

const boards = [
  ["freeform/apple/apple-enterprise-board.svg", "Apple Enterprise", ["ABM", "ADE", "APNs", "DDM", "Profile", "Cert", "Apps", "Device", "FileVault", "SSO", "Token", "Lock", "Supervised", "Compliance", "Update"]],
  ["freeform/jamf/jamf-board.svg", "Jamf Ecosystem", ["Jamf Pro", "Connect", "Protect", "PreStage", "Smart Grp", "Policy", "Package", "Script", "Self Svc", "Inventory", "Patch", "API", "Webhook", "LDAP", "ZTNA"]],
  ["freeform/microsoft/microsoft-board.svg", "Microsoft Intune", ["Intune", "Entra ID", "Defender", "Cond Access", "Compliance", "Settings", "App Protect", "Endpoint", "Portal", "Dynamic Grp", "Remote", "SCEP", "VPN", "Wi-Fi", "Token"]],
  ["freeform/complete-library/common-board.svg", "Common Library", ["User", "Admin", "MacBook", "iPhone", "iPad", "Windows", "Android", "Cloud", "MDM", "Cert", "Shield OK", "Shield NOK", "Sync", "Secure", "Warning"]],
  ["freeform/starter-kit/video-components-board.svg", "Video Components", ["Step 1", "Step 2", "Step 3", "Step 4", "Service", "Device", "User", "Policy", "Compliance", "Badge", "Connector", "Compare", "Summary", "Alert", "Quiz"]],
];

for (const [file, title, items] of boards) {
  writeAsset(file, freeformBoard(file, title, items), {
    id: file.split("/").pop().replace(".svg", ""),
    name: title,
    category: "freeform-boards",
    ecosystem: file.includes("apple") ? "apple" : file.includes("jamf") ? "jamf" : file.includes("microsoft") ? "microsoft" : "neutral",
    type: "freeform-board",
    tags: ["freeform", "board", "starter-kit"],
    description: `Freeform starter board: ${title}.`,
    freeformReady: true,
    verificationStatus: "original",
  });
}

// Write manifest
writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`Generated ${manifest.length} visual assets. Manifest: ${MANIFEST_PATH}`);
