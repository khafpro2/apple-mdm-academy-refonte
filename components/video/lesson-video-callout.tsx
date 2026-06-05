import Link from "next/link";
import { Badge } from "@/components/ui";
import type { VideoScript } from "@/src/lib/video-scripts";

type LessonVideoCalloutProps = {
  video: VideoScript;
};

export function LessonVideoCallout({ video }: LessonVideoCalloutProps) {
  return (
    <section className="mt-6 overflow-hidden rounded-3xl border border-accent/20 bg-surface-elevated shadow-sm">
      <div className="grid gap-0 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <Link
          href={`/videos/${video.slug}`}
          className="group relative flex aspect-video items-center justify-center bg-gradient-to-br from-ink to-zinc-800 text-white"
        >
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-3xl backdrop-blur transition group-hover:scale-105 group-hover:bg-white/20"
            aria-hidden="true"
          >
            ▶
          </span>
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
            {video.duration}
          </span>
        </Link>

        <div className="flex flex-col justify-center p-5 md:p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="accent">Vidéo du cours</Badge>
            <Badge variant="default">{video.language}</Badge>
            <Badge variant="default">{video.level}</Badge>
          </div>
          <h2 className="mt-3 text-xl font-bold text-ink">{video.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{video.description}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={`/videos/${video.slug}`}
              className="inline-flex rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Lancer la vidéo
            </Link>
            <Link
              href="/videos"
              className="inline-flex rounded-full border border-border-light bg-white px-4 py-2 text-sm font-semibold text-ink-secondary transition hover:text-ink"
            >
              Bibliothèque vidéos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
