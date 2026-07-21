/**
 * Unit tests — video premium system (availability, captions, catalog, related, hooks pure helpers).
 * Run: npx tsx tests/unit/video-system.test.ts
 */
import assert from "node:assert/strict";
import {
  isVideoPlayable,
  resolveVideoAvailability,
} from "../../lib/video/availability";
import {
  buildWebVttFromTranscript,
  formatWebVttTimestamp,
} from "../../lib/video/captions-shared";
import { resolveCaptionsSrc } from "../../lib/video/captions";
import { buildVideoCatalog, filterVideoCatalog } from "../../lib/video/catalog";
import { getRelatedVideoEntries } from "../../lib/video/related";
import { formatVideoClock } from "../../hooks/use-video";
import type { VideoTranscript } from "../../src/lib/video-transcripts";

// availability states including missing
{
  assert.equal(resolveVideoAvailability({ loading: true }).state, "loading");
  assert.equal(resolveVideoAvailability({ missing: true }).state, "missing");
  assert.equal(resolveVideoAvailability({ missing: true }).canPlay, false);
  assert.equal(resolveVideoAvailability({ deprecated: true, hasMp4: true }).state, "deprecated");
  assert.equal(resolveVideoAvailability({ hasMp4: true, isPublishable: true }).state, "available");
  assert.equal(resolveVideoAvailability({ hasMp4: false }).state, "processing");
  assert.equal(isVideoPlayable({ hasMp4: true }), true);
  assert.equal(isVideoPlayable({ missing: true, hasMp4: true }), false);
}

// never play incomplete
{
  const incomplete = resolveVideoAvailability({ hasMp4: false });
  assert.equal(incomplete.canPlay, false);
  assert.notEqual(incomplete.state, "available");
}

// clocks
{
  assert.equal(formatVideoClock(0), "0:00");
  assert.equal(formatVideoClock(65), "1:05");
  assert.equal(formatVideoClock(3661), "1:01:01");
  assert.equal(formatWebVttTimestamp(65.5), "00:01:05.500");
}

// WebVTT from transcript
{
  const transcript: VideoTranscript = {
    slug: "filevault",
    title: "FileVault",
    module: "Sécurité",
    fullText: "Intro. Chiffrement.",
    wordCount: 2,
    scenes: [
      { title: "Intro", text: "Bienvenue.", durationSeconds: 10 },
      { title: "Chiffrement", text: "FileVault chiffre le volume.", durationSeconds: 20 },
    ],
  };
  const vtt = buildWebVttFromTranscript(transcript);
  assert.ok(vtt.startsWith("WEBVTT"));
  assert.ok(vtt.includes("Bienvenue."));
}

// captions src
{
  const src = resolveCaptionsSrc("filevault", {
    repoRoot: process.cwd(),
    hasTranscript: true,
  });
  assert.equal(src, "/api/videos/filevault/captions");
}

// catalog + related playlist
{
  const catalog = buildVideoCatalog({});
  assert.ok(catalog.length > 0);
  const seed = catalog[0];
  const related = getRelatedVideoEntries(catalog, seed, 5);
  assert.ok(related.every((e) => e.slug !== seed.slug));
  assert.ok(related.length <= 5);

  const availableOnly = filterVideoCatalog(catalog, { availability: "available" });
  assert.ok(availableOnly.every((e) => e.canPlay));

  const query = filterVideoCatalog(catalog, { query: "filevault" });
  assert.ok(query.every((e) => e.searchText.includes("filevault")));
}

console.log("video-system: all assertions passed");
