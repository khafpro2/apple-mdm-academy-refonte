import { writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { getVideoProductionEntries } from "@/lib/video/data/video-production-registry";
import { validateVideoProductionEntries } from "@/lib/video/validation/validate-video-entry";

function main() {
  const jsonMode = process.argv.includes("--json");
  const repoRoot = process.cwd();
  const videos = getVideoProductionEntries();
  const result = validateVideoProductionEntries(videos, { repoRoot });
  const pilot = videos.find((video) => video.id === "video-jamf-smart-groups-filevault-escrow-v1");

  const missingMedia = videos.flatMap((video) =>
    video.media.assets
      .filter((asset) => !asset.path || asset.status === "missing")
      .map((asset) => `${video.id}:${asset.kind}:${asset.expectedFilename}`)
  );
  const missingCaptures = videos.flatMap((video) =>
    video.captures
      .filter((capture) => capture.required && capture.status === "missing")
      .map((capture) => `${video.id}:${capture.id}`)
  );
  const pendingTechnicalClaims = videos.flatMap((video) =>
    video.technicalClaims
      .filter((claim) => claim.status === "pending-verification")
      .map((claim) => `${video.id}:${claim.id}`)
  );
  const pendingSecurityReview = videos
    .filter((video) => video.securityReviewStatus !== "approved")
    .map((video) => video.id);
  const storyboardIssues = [...result.errors, ...result.warnings]
    .filter((issue) => issue.code.startsWith("storyboard-"))
    .map((issue) => issue.message);

  const report = {
    videoCount: videos.length,
    validVideos: result.valid ? videos.length : 0,
    invalidVideos: result.valid ? 0 : videos.length,
    pilotStatus: pilot?.status ?? "missing",
    missingMedia,
    missingCaptures,
    pendingTechnicalClaims,
    pendingSecurityReview,
    storyboardIssues,
    errors: result.errors,
    warnings: result.warnings,
    generatedAt: new Date().toISOString(),
  };

  if (jsonMode) {
    const outputPath = path.join(os.tmpdir(), "apple-mdm-video-production-audit.json");
    writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(outputPath);
    process.exit(result.valid ? 0 : 1);
  }

  console.log("=== Audit Video Production ===\n");
  console.log(`Videos : ${report.videoCount}`);
  console.log(`Valides : ${report.validVideos}`);
  console.log(`Invalides : ${report.invalidVideos}`);
  console.log(`Pilote Jamf : ${report.pilotStatus}`);
  console.log(`Medias manquants : ${report.missingMedia.length}`);
  console.log(`Captures manquantes : ${report.missingCaptures.length}`);
  console.log(`Claims techniques en attente : ${report.pendingTechnicalClaims.length}`);
  console.log(`Revues securite en attente : ${report.pendingSecurityReview.length}`);
  console.log(`Errors : ${result.errors.length} · Warnings : ${result.warnings.length}\n`);

  for (const issue of result.errors) {
    console.log(`[ERROR] ${issue.code} ${issue.videoId ? `(${issue.videoId})` : ""}`);
    console.log(`  ${issue.message}`);
  }
  for (const issue of result.warnings) {
    console.log(`[WARNING] ${issue.code} ${issue.videoId ? `(${issue.videoId})` : ""}`);
    console.log(`  ${issue.message}`);
  }

  if (result.valid) {
    console.log("\nAudit video production termine — 0 erreur bloquante");
    process.exit(0);
  }

  console.log("\nAudit video production echoue");
  process.exit(1);
}

main();
