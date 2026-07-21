import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import {
  CaptureRequirementCard,
  MediaRequirementRow,
  Metric,
  StoryboardPlanCard,
  VideoValidationSummary,
} from "@/components/video-production/video-production-cards";
import { VideoProductionStatusBadge } from "@/components/video-production/video-production-status";
import { getVideoProductionEntryBySlug } from "@/lib/video/data/video-production-registry";
import { validateVideoProductionEntry } from "@/lib/video/validation/validate-video-entry";

export const metadata = {
  title: "Pilote Jamf — Smart Groups et FileVault",
  robots: { index: false, follow: false },
};

export default function JamfVideoPilotPage() {
  const entry = getVideoProductionEntryBySlug("jamf-smart-groups-filevault-escrow");
  if (!entry) notFound();

  const issues = validateVideoProductionEntry(entry, { repoRoot: process.cwd() });
  const missingCaptures = entry.captures.filter((capture) => capture.required && capture.status === "missing");
  const missingMedia = entry.media.assets.filter((asset) => !asset.path);
  const pendingClaims = entry.technicalClaims.filter((claim) => claim.status === "pending-verification");

  return (
    <PageShell>
      <main className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <Link
          href="/video-production"
          className="inline-flex min-h-10 items-center text-sm font-semibold text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Retour video production
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-accent">{entry.id}</p>
            <h1 className="mt-2 text-3xl font-bold text-ink">{entry.title}</h1>
            <p className="mt-3 max-w-3xl text-ink-secondary">
              Video non encore produite. Medias manquants et validation technique requise avant publication.
            </p>
          </div>
          <VideoProductionStatusBadge status={entry.status} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Priorite" value={entry.priority} />
          <Metric label="Niveau" value={entry.level} />
          <Metric label="Duree cible" value={entry.durationTarget} />
          <Metric label="Storyboard" value={`${entry.storyboard.at(-1)?.endSeconds ?? 0}s`} />
        </div>

        <section className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <h2 className="text-lg font-bold">Medias manquants</h2>
          <p className="mt-2 text-sm">
            Aucun MP4, WebVTT, poster ou transcript n&apos;est declare comme existant. La page reste un outil interne de
            production, pas un cours publie.
          </p>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-ink">Recommandation de decoupage</h2>
              <p className="mt-3 rounded-lg border border-border-light bg-surface-elevated p-4 text-sm leading-relaxed text-ink-secondary">
                {entry.splitRecommendation}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ink">Storyboard</h2>
              <div className="mt-4 grid gap-4">
                {entry.storyboard.map((plan) => (
                  <StoryboardPlanCard key={plan.id} plan={plan} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-ink">Captures attendues</h2>
              <p className="mt-2 text-sm text-ink-secondary">
                {missingCaptures.length} captures requises manquantes. Aucun chemin source n&apos;est declare.
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {entry.captures.map((capture) => (
                  <CaptureRequirementCard key={capture.id} capture={capture} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <VideoValidationSummary issues={issues} />

            <section className="rounded-lg border border-border-light bg-surface-elevated p-5">
              <h2 className="text-lg font-bold text-ink">Statuts</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <VideoProductionStatusBadge status={entry.technicalReviewStatus} />
                <VideoProductionStatusBadge status={entry.labStatus} />
                <VideoProductionStatusBadge status={entry.captureStatus} />
                <VideoProductionStatusBadge status={entry.narrationStatus} />
                <VideoProductionStatusBadge status={entry.subtitleStatus} />
                <VideoProductionStatusBadge status={entry.mediaStatus} />
                <VideoProductionStatusBadge status={entry.securityReviewStatus} />
                <VideoProductionStatusBadge status={entry.courseIntegrationStatus} />
              </div>
            </section>

            <section className="rounded-lg border border-border-light bg-surface-elevated p-5">
              <h2 className="text-lg font-bold text-ink">Affirmations techniques</h2>
              <p className="mt-1 text-sm text-ink-secondary">{pendingClaims.length} affirmations a verifier.</p>
              <ul className="mt-4 space-y-3">
                {entry.technicalClaims.map((claim) => (
                  <li key={claim.id} className="rounded-lg border border-border-light bg-surface p-3 text-sm">
                    <p className="font-semibold text-ink">{claim.statement}</p>
                    <p className="mt-1 text-xs text-ink-tertiary">{claim.status}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-border-light bg-surface-elevated p-5">
              <h2 className="text-lg font-bold text-ink">Medias attendus</h2>
              <p className="mt-1 text-sm text-ink-secondary">{missingMedia.length} fichiers manquants.</p>
              <ul className="mt-4 space-y-3">
                {entry.media.assets.map((asset) => (
                  <MediaRequirementRow key={asset.kind} asset={asset} />
                ))}
              </ul>
            </section>

            <section className="rounded-lg border border-border-light bg-surface-elevated p-5">
              <h2 className="text-lg font-bold text-ink">Narration</h2>
              <p className="mt-2 text-sm text-ink-secondary">{entry.narration.hook}</p>
              <dl className="mt-4 space-y-2 text-sm">
                {Object.entries(entry.narration.pronunciations).map(([term, value]) => (
                  <div key={term} className="flex justify-between gap-3">
                    <dt className="font-semibold text-ink">{term}</dt>
                    <dd className="text-ink-secondary">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="rounded-lg border border-border-light bg-surface-elevated p-5">
              <h2 className="text-lg font-bold text-ink">Securite</h2>
              <ul className="mt-4 space-y-2 text-sm text-ink-secondary">
                {entry.securityRequirements.map((requirement) => (
                  <li key={requirement.id}>{requirement.placeholder} · {requirement.label}</li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </main>
    </PageShell>
  );
}
