import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import {
  runMediaReadinessAudit,
  type MediaEcosystem,
  type MediaEcosystemSummary,
  type MediaReadinessRow,
} from "@/lib/audit/media-readiness.server";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Préparation médias LMS",
  description: "Tableau de readiness média — storyboards, transcripts, scripts HeyGen, captures, MP4 et publication (Jamf, Intune, Apple).",
  path: "/admin/media-readiness",
  noIndex: true,
});

function ReadyBadge({ ready }: { ready: boolean }) {
  return <Badge variant={ready ? "dark" : "default"}>{ready ? "Prêt" : "À faire"}</Badge>;
}

function EcosystemSection({ ecosystem }: { ecosystem: MediaEcosystemSummary }) {
  if (!ecosystem.total) {
    return (
      <Card className="mt-8 p-6 text-sm text-ink-secondary">
        <p className="font-semibold text-ink">{ecosystem.label}</p>
        <p className="mt-2">Aucune vidéo cataloguée pour cet écosystème.</p>
      </Card>
    );
  }

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-xl font-bold text-ink">{ecosystem.label}</h2>
        <p className="text-sm text-ink-tertiary">
          {ecosystem.published}/{ecosystem.total} publiées · {ecosystem.mp4Present}/{ecosystem.total} MP4 ·{" "}
          {ecosystem.capturesReady}/{ecosystem.total} captures
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="p-4">
          <p className="text-xs text-ink-tertiary">Storyboard</p>
          <p className="text-lg font-bold text-accent">
            {ecosystem.storyboardReady}/{ecosystem.total}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink-tertiary">Transcript</p>
          <p className="text-lg font-bold text-accent">
            {ecosystem.transcriptReady}/{ecosystem.total}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink-tertiary">Script HeyGen</p>
          <p className="text-lg font-bold text-accent">
            {ecosystem.heygenScriptReady}/{ecosystem.total}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink-tertiary">Captures</p>
          <p className="text-lg font-bold text-accent">
            {ecosystem.capturesReady}/{ecosystem.total}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink-tertiary">MP4</p>
          <p className="text-lg font-bold text-accent">
            {ecosystem.mp4Present}/{ecosystem.total}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-ink-tertiary">Publié</p>
          <p className="text-lg font-bold text-accent">
            {ecosystem.published}/{ecosystem.total}
          </p>
        </Card>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border-light">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase text-ink-tertiary">
            <tr>
              <th className="px-3 py-3">Vidéo</th>
              <th className="px-3 py-3">Storyboard</th>
              <th className="px-3 py-3">Transcript</th>
              <th className="px-3 py-3">Script HeyGen</th>
              <th className="px-3 py-3">Captures</th>
              <th className="px-3 py-3">MP4</th>
              <th className="px-3 py-3">Publié</th>
              <th className="px-3 py-3">Manifest</th>
            </tr>
          </thead>
          <tbody>
            {ecosystem.rows.map((row: MediaReadinessRow) => (
              <tr key={row.slug} className="border-t border-border-light align-top">
                <td className="px-3 py-3">
                  <Link href={`/videos/${row.slug}`} className="font-semibold text-accent hover:underline">
                    {row.title}
                  </Link>
                  <p className="mt-1 text-xs text-ink-tertiary">{row.slug}</p>
                  {row.blockers.length > 0 && row.blockers.length < 6 ? (
                    <p className="mt-2 text-xs text-amber-800">{row.blockers.join(" · ")}</p>
                  ) : null}
                </td>
                <td className="px-3 py-3">
                  <ReadyBadge ready={row.storyboardReady} />
                </td>
                <td className="px-3 py-3">
                  <ReadyBadge ready={row.transcriptReady} />
                </td>
                <td className="px-3 py-3">
                  <ReadyBadge ready={row.heygenScriptReady} />
                </td>
                <td className="px-3 py-3">
                  <ReadyBadge ready={row.capturesReady} />
                  {row.capturesTotal > 0 ? (
                    <p className="mt-1 text-xs text-ink-tertiary">
                      {row.capturesPresent}/{row.capturesTotal}
                    </p>
                  ) : null}
                </td>
                <td className="px-3 py-3">
                  <ReadyBadge ready={row.mp4Present} />
                </td>
                <td className="px-3 py-3">
                  <ReadyBadge ready={row.published} />
                </td>
                <td className="px-3 py-3">
                  <Badge variant={row.inPilotManifest ? "accent" : "default"}>
                    {row.inPilotManifest ? "Pilote" : "—"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MediaReadinessPage() {
  const report = runMediaReadinessAudit();
  const order: MediaEcosystem[] = ["jamf", "intune", "apple"];
  const totalVideos = order.reduce((acc, key) => acc + report.ecosystems[key].total, 0);
  const totalPublished = order.reduce((acc, key) => acc + report.ecosystems[key].published, 0);
  const totalMp4 = order.reduce((acc, key) => acc + report.ecosystems[key].mp4Present, 0);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Admin — Gel fonctionnel LMS"
          title="Préparation médias"
          description={`Storyboards · Transcripts · Scripts HeyGen · Captures · MP4 · Publication · Généré le ${new Date(report.generatedAt).toLocaleString("fr-FR")}`}
        />

        <Card className="mt-6 border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">LMS gelé — aucune nouvelle fonctionnalité</p>
          <p className="mt-2">
            Objectif unique : produire les médias réels. Manifest pilote : {report.pilotManifestCount} vidéos · Catalogue
            captures : {report.catalogCaptureCount} fichiers attendus.
          </p>
        </Card>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/media-production-plan"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Plan production médias
          </Link>
          <Link
            href="/admin/video-library"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Bibliothèque vidéo
          </Link>
          <Link
            href="/admin/video-production-checklist"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Checklist production
          </Link>
          <Link href="/admin" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            ← Admin
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Vidéos (Jamf · Intune · Apple)</p>
            <p className="text-3xl font-bold text-accent">{totalVideos}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">MP4 présents</p>
            <p className="text-3xl font-bold text-accent">
              {totalMp4}/{totalVideos}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Publiées LMS</p>
            <p className="text-3xl font-bold text-accent">
              {totalPublished}/{totalVideos}
            </p>
          </Card>
        </div>

        {order.map((key) => (
          <EcosystemSection key={key} ecosystem={report.ecosystems[key]} />
        ))}

        <Card className="mt-10 p-6 text-sm text-ink-secondary">
          <p className="font-semibold text-ink">Bloquants production média</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            {report.globalBlockers.map((blocker) => (
              <li key={blocker}>{blocker}</li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-tertiary">
            Vérifications : scripts <code>/videos/[slug]</code> · transcripts <code>/transcripts</code> · captures{" "}
            <code>public/video-assets/screenshots/</code> · MP4 <code>public/videos/</code> · manifest{" "}
            <code>data/video-pilot-mp4.json</code>
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
