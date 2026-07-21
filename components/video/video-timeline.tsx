"use client";

export type VideoTimelineScene = {
  id?: string;
  title: string;
  durationSeconds: number;
};

export function VideoTimeline({
  scenes,
  activeIndex = 0,
  currentSeconds = 0,
  onSeek,
  className = "",
}: {
  scenes: VideoTimelineScene[];
  activeIndex?: number;
  currentSeconds?: number;
  onSeek?: (seconds: number) => void;
  className?: string;
}) {
  if (!scenes.length) return null;

  const total = scenes.reduce((sum, scene) => sum + Math.max(scene.durationSeconds, 1), 0);
  const segments = scenes.reduce<
    Array<VideoTimelineScene & { index: number; start: number; duration: number; end: number }>
  >((acc, scene, index) => {
    const start = acc.length ? acc[acc.length - 1].end : 0;
    const duration = Math.max(scene.durationSeconds, 1);
    acc.push({ ...scene, index, start, duration, end: start + duration });
    return acc;
  }, []);

  return (
    <div className={`rounded-2xl border border-border-light bg-surface-elevated p-5 ${className}`}>
      <h2 className="font-bold text-ink">Timeline</h2>
      <p className="mt-1 text-xs text-ink-tertiary">
        {scenes.length} scènes · {Math.round(total / 60)} min approx.
      </p>

      <div
        className="mt-4 flex h-3 overflow-hidden rounded-full bg-surface"
        role="img"
        aria-label="Répartition des scènes sur la timeline"
      >
        {segments.map((segment) => (
          <button
            key={segment.id ?? `${segment.index}-${segment.title}`}
            type="button"
            title={segment.title}
            aria-label={`Aller à la scène ${segment.index + 1} : ${segment.title}`}
            aria-current={segment.index === activeIndex ? "true" : undefined}
            className={`h-full border-r border-white/40 last:border-r-0 ${
              segment.index === activeIndex ? "bg-accent" : "bg-accent/30 hover:bg-accent/50"
            }`}
            style={{ width: `${(segment.duration / total) * 100}%` }}
            onClick={() => onSeek?.(segment.start)}
          />
        ))}
      </div>

      <ol className="mt-4 space-y-2">
        {segments.map((segment) => {
          const isActive =
            segment.index === activeIndex ||
            (currentSeconds >= segment.start && currentSeconds < segment.end);
          return (
            <li key={segment.id ?? `${segment.index}-${segment.title}`}>
              <button
                type="button"
                onClick={() => onSeek?.(segment.start)}
                className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition ${
                  isActive ? "bg-accent/10 text-ink" : "text-ink-secondary hover:bg-surface"
                }`}
              >
                <span>
                  <span className="font-semibold">
                    {segment.index + 1}. {segment.title}
                  </span>
                </span>
                <span className="shrink-0 text-xs text-ink-tertiary">{segment.duration}s</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
