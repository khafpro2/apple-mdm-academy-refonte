import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { jamfVideoPilot } from "../../lib/video/data/jamf-video-pilot";
import { getVideoProductionEntryBySlug } from "../../lib/video/data/video-production-registry";
import {
  ALLOWED_SENSITIVE_PLACEHOLDERS,
  validateVideoProductionEntries,
  validateVideoProductionEntry,
} from "../../lib/video/validation/validate-video-entry";
import type { VideoProductionEntry } from "../../lib/video/production-types";

function cloneEntry(overrides: Partial<VideoProductionEntry> = {}): VideoProductionEntry {
  return {
    ...(structuredClone(jamfVideoPilot) as VideoProductionEntry),
    ...overrides,
  };
}

function codes(entry: VideoProductionEntry): Set<string> {
  return new Set(validateVideoProductionEntry(entry, { repoRoot: process.cwd() }).map((issue) => issue.code));
}

// 1. entree Jamf valide au statut brief
{
  const result = validateVideoProductionEntry(jamfVideoPilot, { repoRoot: process.cwd() });
  assert.equal(result.filter((issue) => issue.severity === "error").length, 0, JSON.stringify(result, null, 2));
}

// 2. lastValidatedAt absent autorise pour brief
{
  assert.equal(codes(cloneEntry({ lastValidatedAt: null })).has("video-last-validated-required"), false);
}

// 3. lastValidatedAt obligatoire pour approved
{
  assert.ok(codes(cloneEntry({ status: "approved", lastValidatedAt: null })).has("video-last-validated-required"));
}

// 4. media absent autorise pour brief
{
  assert.equal(codes(jamfVideoPilot).has("approved-video-missing"), false);
}

// 5. media absent interdit pour approved
{
  assert.ok(codes(cloneEntry({ status: "approved" })).has("approved-video-missing"));
}

// 6. storyboard de 10 minutes
{
  assert.equal(jamfVideoPilot.storyboard.at(-1)?.endSeconds, 600);
  assert.equal(codes(jamfVideoPilot).has("storyboard-target-duration"), false);
}

// 7. chevauchement detecte
{
  const entry = cloneEntry();
  entry.storyboard[1].startSeconds = 10;
  assert.ok(codes(entry).has("storyboard-overlap"));
}

// 8. trou detecte
{
  const entry = cloneEntry();
  entry.storyboard[1].startSeconds = 20;
  assert.ok(codes(entry).has("storyboard-gap"));
}

// 9. duree incoherente detectee
{
  const entry = cloneEntry();
  entry.storyboard[0].durationSeconds = 14;
  assert.ok(codes(entry).has("storyboard-duration-mismatch"));
}

// 10. capture requise absente
{
  const entry = cloneEntry();
  entry.storyboard[2].captureIds = ["SG-404"];
  assert.ok(codes(entry).has("storyboard-capture-missing"));
}

// 11. point technique pending
{
  assert.ok(codes(jamfVideoPilot).has("claim-pending-verification"));
}

// 12. approval bloque par verification technique
{
  assert.ok(codes(cloneEntry({ status: "approved" })).has("approval-blocked-pending-claim"));
}

// 13. approval bloque par securite
{
  assert.ok(codes(cloneEntry({ status: "approved", securityReviewStatus: "pending" })).has("approval-security-review"));
}

// 14. courseIds sous forme de tableau
{
  assert.ok(codes(cloneEntry({ courseIds: "jamf-100" as unknown as string[] })).has("video-courseids"));
}

// 15. slug unique
{
  const result = validateVideoProductionEntries([jamfVideoPilot, cloneEntry({ id: "video-copy-v1" })], {
    repoRoot: process.cwd(),
  });
  assert.ok(result.errors.some((issue) => issue.code === "video-slug-duplicate"));
}

// 16. id unique
{
  const result = validateVideoProductionEntries([jamfVideoPilot, cloneEntry({ slug: "copy" })], {
    repoRoot: process.cwd(),
  });
  assert.ok(result.errors.some((issue) => issue.code === "video-id-duplicate"));
}

// 17. statut invalide
{
  assert.ok(codes(cloneEntry({ status: "done" as VideoProductionEntry["status"] })).has("video-status"));
}

// 18. chemin declare avec fichier absent
{
  const entry = cloneEntry();
  entry.media.assets[0].path = "/public/videos/video-jamf-smart-groups-filevault-escrow-v1.mp4";
  assert.ok(codes(entry).has("path-missing-file"));
}

// 19. VTT absent pour approved
{
  assert.ok(codes(cloneEntry({ status: "approved" })).has("approved-subtitles-missing"));
}

// 20. poster absent pour approved
{
  assert.ok(codes(cloneEntry({ status: "approved" })).has("approved-poster-missing"));
}

// 21. transcript absent pour approved
{
  assert.ok(codes(cloneEntry({ status: "approved" })).has("approved-transcript-missing"));
}

// 22. published sans approved
{
  assert.ok(codes(cloneEntry({ status: "published" })).has("video-published-without-approved-state"));
}

// 23. placeholders de donnees sensibles
{
  assert.ok(ALLOWED_SENSITIVE_PLACEHOLDERS.includes("[CLÉ MASQUÉE]"));
  assert.equal(codes(jamfVideoPilot).has("capture-sensitive-placeholder"), false);
}

// 24. page interne du pilote
{
  const entry = getVideoProductionEntryBySlug("jamf-smart-groups-filevault-escrow");
  assert.equal(entry?.id, "video-jamf-smart-groups-filevault-escrow-v1");
}

// 25. rapport JSON
{
  const result = spawnSync("npx", ["--yes", "tsx", "scripts/audit-video-production.ts", "--json"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  const outputPath = result.stdout.trim();
  assert.ok(existsSync(outputPath), outputPath);
  const report = JSON.parse(readFileSync(outputPath, "utf8")) as { videoCount: number; pilotStatus: string };
  assert.equal(report.videoCount, 1);
  assert.equal(report.pilotStatus, "brief");
}

// 26. code de sortie non nul en cas d'erreur bloquante
{
  const result = validateVideoProductionEntries([cloneEntry({ status: "approved" })], { repoRoot: process.cwd() });
  assert.equal(result.valid, false);
}

console.log("video-production-validate: all assertions passed");
