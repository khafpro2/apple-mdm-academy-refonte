import Link from "next/link";
import { Badge } from "@/components/ui";
import { MEDIA_REQUIRED_MESSAGE } from "@/src/lib/media-production-status.server";

type Props = {
  mp4Present: number;
  mp4Total: number;
  capturesPresent: number;
  capturesTotal: number;
};

export function MediaRequiredBanner({ mp4Present, mp4Total, capturesPresent, capturesTotal }: Props) {
  const mediaRequired = mp4Present === 0 && capturesPresent === 0;

  if (!mediaRequired) return null;

  return (
    <section className="mb-8 rounded-2xl border-2 border-amber-400 bg-amber-50 p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Badge variant="default">MEDIA REQUIRED</Badge>
          <h2 className="mt-3 text-xl font-bold text-ink">Production médias en attente</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-secondary">{MEDIA_REQUIRED_MESSAGE}</p>
          <p className="mt-3 text-xs text-ink-tertiary">
            MP4 : {mp4Present}/{mp4Total} · Captures : {capturesPresent}/{capturesTotal}
          </p>
        </div>
        <Link
          href="/admin/media-production-plan"
          className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Voir le plan d&apos;action →
        </Link>
      </div>
    </section>
  );
}
