import Link from "next/link";
import type {
  VideoCaptureRequirement,
  VideoMediaAsset,
  VideoProductionEntry,
  VideoStoryboardPlan,
  VideoValidationIssue,
} from "@/lib/video/production-types";
import { VideoProductionStatusBadge } from "@/components/video-production/video-production-status";

export function VideoProductionCard({ entry }: { entry: VideoProductionEntry }) {
  const missingMedia = entry.media.assets.filter((asset) => !asset.path).length;
  const missingCaptures = entry.captures.filter((capture) => capture.required && capture.status === "missing").length;

  return (
    <article className="rounded-lg border border-border-light bg-surface-elevated p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-ink-tertiary">{entry.id}</p>
          <h2 className="mt-1 text-lg font-bold text-ink">
            <Link href={`/video-production/${entry.slug}`} className="hover:text-accent">
              {entry.title}
            </Link>
          </h2>
        </div>
        <VideoProductionStatusBadge status={entry.status} />
      </div>
      <p className="mt-3 text-sm text-ink-secondary">
        {entry.platform} · {entry.level} · {entry.priority} · cible {entry.durationTarget}
      </p>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <Metric label="Captures manquantes" value={String(missingCaptures)} />
        <Metric label="Medias manquants" value={String(missingMedia)} />
        <Metric label="Storyboard" value={`${entry.storyboard.at(-1)?.endSeconds ?? 0}s`} />
      </div>
    </article>
  );
}

export function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border-light bg-surface p-3">
      <p className="text-xs font-semibold text-ink-tertiary">{label}</p>
      <p className="mt-1 text-lg font-bold text-ink">{value}</p>
    </div>
  );
}

export function CaptureRequirementCard({ capture }: { capture: VideoCaptureRequirement }) {
  return (
    <article className="rounded-lg border border-border-light bg-surface-elevated p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-ink-tertiary">{capture.id}</p>
          <h3 className="mt-1 text-sm font-bold text-ink">{capture.objective}</h3>
        </div>
        <VideoProductionStatusBadge status={capture.status === "missing" ? "missing" : "ready"} />
      </div>
      <p className="mt-3 text-sm text-ink-secondary">{capture.action}</p>
      <p className="mt-2 text-xs text-ink-tertiary">{capture.expectedResult}</p>
      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        {capture.maskingRequired ? "Masquage obligatoire" : "Pas de masquage requis"} ·{" "}
        {capture.sensitiveFields.join(", ")}
      </div>
      {!capture.sourceMediaPath && (
        <p className="mt-3 text-xs font-semibold text-red-700">Capture non encore realisee</p>
      )}
    </article>
  );
}

export function StoryboardPlanCard({ plan }: { plan: VideoStoryboardPlan }) {
  return (
    <article className="rounded-lg border border-border-light bg-surface-elevated p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-ink-tertiary">
            {plan.id} · {formatTime(plan.startSeconds)}-{formatTime(plan.endSeconds)}
          </p>
          <h3 className="mt-1 text-sm font-bold text-ink">{plan.objective}</h3>
        </div>
        <span className="rounded-full border border-border-light bg-surface px-2.5 py-1 text-xs font-semibold text-ink-secondary">
          {plan.durationSeconds}s
        </span>
      </div>
      <p className="mt-3 text-sm text-ink-secondary">{plan.narrationSummary}</p>
      <p className="mt-2 text-xs text-ink-tertiary">Captures : {plan.captureIds.join(", ") || "aucune"}</p>
    </article>
  );
}

export function MediaRequirementRow({ asset }: { asset: VideoMediaAsset }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border-light bg-surface-elevated p-3">
      <div>
        <p className="text-sm font-semibold text-ink">{asset.expectedFilename}</p>
        <p className="mt-1 text-xs text-ink-tertiary">
          {asset.kind} · {asset.format.container}
        </p>
      </div>
      <VideoProductionStatusBadge status={asset.status === "missing" ? "missing" : "ready"} />
    </li>
  );
}

export function VideoValidationSummary({ issues }: { issues: VideoValidationIssue[] }) {
  const errors = issues.filter((issue) => issue.severity === "error");
  const warnings = issues.filter((issue) => issue.severity === "warning");
  return (
    <section className="rounded-lg border border-border-light bg-surface-elevated p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-ink">Validation technique</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            {errors.length} erreur · {warnings.length} avertissement
          </p>
        </div>
        <code className="rounded-lg bg-surface px-3 py-2 text-xs text-ink-secondary">
          npm run video:audit
        </code>
      </div>
      {issues.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {issues.slice(0, 12).map((issue, index) => (
            <li
              key={`${issue.code}-${index}`}
              className={`rounded-lg border p-3 text-sm ${
                issue.severity === "error"
                  ? "border-red-200 bg-red-50 text-red-900"
                  : "border-amber-200 bg-amber-50 text-amber-900"
              }`}
            >
              <p className="font-semibold">{issue.code}</p>
              <p className="mt-1">{issue.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          Aucun probleme detecte.
        </p>
      )}
    </section>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}
