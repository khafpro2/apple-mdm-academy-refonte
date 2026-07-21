"use client";

import Link from "next/link";
import { VideoPlayer } from "@/components/video-experience/video-player";
import { VideoTimeline } from "@/components/video-experience/video-timeline";
import { VideoTranscript } from "@/components/video-experience/video-transcript";
import { VideoChapters } from "@/components/video-experience/video-chapters";
import { VideoSidebar } from "@/components/video-experience/video-sidebar";
import { VideoResources } from "@/components/video-experience/video-resources";
import { VideoPlaylist } from "@/components/video-experience/video-playlist";
import { VideoBookmark } from "@/components/video-experience/video-bookmark";
import { VideoCompletion } from "@/components/video-experience/video-completion";
import { useVideo } from "@/hooks/use-video";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useProgress } from "@/hooks/use-progress";
import type { VideoExperienceModel } from "@/components/video-experience/types";

/**
 * Fiche détail UX — props-only, sans appel API.
 */
export function VideoDetailExperience({
  experience,
}: {
  experience?: VideoExperienceModel | null;
}) {
  const model = useVideo({ experience });
  const progress = useProgress(model.slug, model.durationSeconds);
  const bookmarks = useBookmarks(model.slug);

  return (
    <div className="video-experience-detail grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="min-w-0 space-y-6">
        <header>
          <p className="text-sm font-semibold text-accent">Formation vidéo</p>
          <h1 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">{model.title}</h1>
          {model.description && (
            <p className="mt-3 text-ink-secondary">{model.description}</p>
          )}
        </header>

        <VideoPlayer experience={experience} />

        <div className="grid gap-4 md:grid-cols-2">
          <VideoTimeline chapters={model.chapters} durationSeconds={model.durationSeconds} />
          <VideoChapters chapters={model.chapters} />
        </div>

        <VideoTranscript transcript={model.transcript} />

        <VideoCompletion
          completed={progress.completed}
          percent={progress.percent}
          onComplete={progress.complete}
        />
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <VideoSidebar
          availability={model.availability}
          module={experience?.module}
          level={experience?.level}
          durationLabel={model.durationLabel}
          footer={
            <Link
              href="/videos"
              className="block text-sm font-semibold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              ← Toutes les vidéos
            </Link>
          }
        />
        <VideoResources resources={model.resources} />
        <VideoPlaylist title="Vidéos liées" items={model.related} currentSlug={model.slug} />
        <VideoPlaylist title="Playlist" items={model.playlist} currentSlug={model.slug} />
        <VideoBookmark
          bookmarks={bookmarks.bookmarks}
          onRemove={bookmarks.removeBookmark}
          onAdd={() => bookmarks.addBookmark(0, "Début")}
        />
      </div>
    </div>
  );
}
