import { existsSync } from "fs";
import { join } from "path";
import {
  enrichStoryboardWithPublishMeta,
  resolveVideoPublishStatus,
  type ResolvePublishContext,
} from "@/src/lib/video-publish-status";

export function videoFileExistsOnDisk(slug: string): boolean {
  return existsSync(join(process.cwd(), "public/videos", `${slug}.mp4`));
}

export function resolveVideoPublishStatusOnServer(slug: string, context?: ResolvePublishContext) {
  const meta = resolveVideoPublishStatus(slug, context);
  if (meta.status === "ready-to-publish" && !meta.videoUrl && videoFileExistsOnDisk(slug)) {
    return { ...meta, videoUrl: `/videos/${slug}.mp4` };
  }
  if (meta.status === "published" && videoFileExistsOnDisk(slug)) {
    return { ...meta, videoUrl: meta.videoUrl ?? `/videos/${slug}.mp4` };
  }
  return meta;
}

export { enrichStoryboardWithPublishMeta };
