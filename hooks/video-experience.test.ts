/**
 * Tests purs UX Video Experience — exécuter :
 * npx tsx hooks/video-experience.test.ts
 */
import assert from "node:assert/strict";
import { canMountMediaPlayer, formatVideoClock } from "../components/video-experience/utils";
import { VIDEO_AVAILABILITY_STATES } from "../components/video-experience/types";

{
  assert.equal(formatVideoClock(0), "0:00");
  assert.equal(formatVideoClock(65), "1:05");
  assert.equal(formatVideoClock(3661), "1:01:01");
}

{
  assert.equal(canMountMediaPlayer("available", "/videos/demo.mp4"), true);
  assert.equal(canMountMediaPlayer("available", undefined), false);
  assert.equal(canMountMediaPlayer("processing", "/videos/demo.mp4"), false);
  assert.equal(canMountMediaPlayer("missing"), false);
  assert.equal(canMountMediaPlayer("loading"), false);
  assert.equal(canMountMediaPlayer("deprecated", "/videos/demo.mp4"), false);
}

{
  assert.deepEqual(
    [...VIDEO_AVAILABILITY_STATES],
    ["loading", "processing", "available", "deprecated", "missing"]
  );
}

console.log("video-experience: all assertions passed");
