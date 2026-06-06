import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge, ProgressBar } from "@/components/ui";
import { requireAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { getVideoProductionStatus, getVideoAssets } from "@/src/lib/video-assets";
import {
  getScreenshotInventoryAsync,
  getValidScreenshotFiles,
  getScreenshotCompletionPercent,
} from "@/src/lib/video-screenshot-inventory.server";
import { SCREENSHOT_CATALOG } from "@/src/lib/video-screenshots";
import { POST_SCREENSHOTS_WORKFLOW } from "@/src/lib/video-publish-status";
import { VideoThumbnail } from "@/components/videos/VideoThumbnail";

export const metadata = { title: "Production vidéo", robots: { index: false, follow: false } };

export default async function VideoProductionAdminPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect(auth.reason === "unauthenticated" ? "/auth/login?redirect=/admin/video-production" : "/dashboard");

  const inventory = await getScreenshotInventoryAsync();
  const validFiles = getValidScreenshotFiles(inventory);
  const status = getVideoProductionStatus({ presentScreenshotFiles: validFiles });
  const screenshotPercent = getScreenshotCompletionPercent(inventory);
  const ready = status.videos.filter((v) => v.productionReady);
  const screenshotsReady = status.videos.filter((v) => v.status === "screenshots-ready");

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Production vidéo"
            title="Captures réelles & publication"
            description={`${status.screenshotsPresent}/${status.screenshotsRequired} captures OK · ${screenshotsReady.length} vidéos screenshots-ready`}
          />
          <div className="flex flex-wrap gap-3">
            <Link href="/resources/guide-captures-video" className="text-sm font-semibold text-accent hover:underline">
              Guide captures →
            </Link>
            <Link href="/resources/video-production-guide" className="text-sm font-semibold text-accent hover:underline">
              Guide montage →
            </Link>
            <Link href="/admin" className="text-sm font-semibold text-accent hover:underline">
              ← Admin
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Production Ready" value={`${status.productionReadyPercent} %`} highlight />
          <StatCard label="Captures OK" value={`${status.screenshotsPresent}/${status.screenshotsRequired}`} sub={`${screenshotPercent} % complétion`} />
          <StatCard label="Screenshots-ready" value={`${screenshotsReady.length}/${status.totalVideos}`} />
          <StatCard label="Scripts HeyGen" value={`${status.videos.filter((v) => v.hasScript).length}/${status.totalVideos}`} />
        </div>

        <div className={`mb-8 rounded-2xl p-6 ${status.productionReadyPercent >= 75 ? "border border-green-200 bg-green-50" : "border border-amber-200 bg-amber-50"}`}>
          <p className="text-sm font-semibold uppercase text-ink-tertiary">Score global</p>
          <ProgressBar value={status.productionReadyPercent} className="mt-3" />
        </div>

        <section className="mb-10 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-lg font-bold text-ink">Comment produire les captures</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink-secondary">
            <li>Utiliser <strong>Screen Studio</strong> en résolution <strong>1920×1080</strong></li>
            <li>Format final <strong>.webp</strong> (qualité 85)</li>
            <li>Flouter : emails, noms, tenant IDs, serial numbers, identifiants entreprise</li>
            <li>Style propre — environnement de test ou démo</li>
            <li>Éviter les onglets navigateur visibles si possible</li>
          </ul>
          <div className="mt-4 rounded-xl bg-white/80 p-4 text-sm text-ink-secondary">
            <p className="font-semibold text-ink">Workflow fichiers</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Exporter depuis Screen Studio → <code className="rounded bg-surface px-1">screenshots/raw/*.png</code></li>
              <li><code className="rounded bg-surface px-1">node scripts/convert-screenshots-to-webp.mjs</code></li>
              <li><code className="rounded bg-surface px-1">node scripts/check-video-screenshots.mjs</code></li>
            </ol>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-ink">Captures à produire</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Déposer dans <code className="rounded bg-surface px-1">/public/video-assets/screenshots/</code>
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {SCREENSHOT_CATALOG.categories.map((cat) => (
              <div key={cat.id} className="rounded-2xl border border-border-light bg-surface-elevated p-5">
                <h3 className="font-bold text-ink">{cat.label}</h3>
                <ul className="mt-3 space-y-2">
                  {cat.items.map((item) => {
                    const inv = inventory.find((i) => i.id === item.id);
                    const icon =
                      inv?.status === "present" ? "✅" : inv?.status === "missing" ? "⚠️" : "❌";
                    return (
                      <li key={item.id} className="flex items-start gap-2 text-sm">
                        <span aria-hidden="true">{icon}</span>
                        <div>
                          <code className="text-xs font-semibold text-accent">{item.file}</code>
                          {inv?.status === "present" && inv.sizeKb != null && (
                            <span className="ml-2 text-xs text-ink-tertiary">{inv.sizeKb} KB</span>
                          )}
                          {inv?.issues.length ? (
                            <p className="text-xs text-red-700">{inv.issues.join(", ")}</p>
                          ) : null}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {screenshotPercent === 100 && (
          <section className="mb-10 rounded-2xl border border-green-200 bg-green-50 p-6">
            <h2 className="font-bold text-ink">Prochaine étape — montage & publication</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
              {POST_SCREENSHOTS_WORKFLOW.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        )}

        <section>
          <h2 className="text-lg font-bold text-ink">Statut par vidéo</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border-light">
            <table className="w-full min-w-[960px] text-sm">
              <thead>
                <tr className="border-b border-border-light bg-surface text-left text-ink-tertiary">
                  <th className="px-4 py-3">Vidéo</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Script</th>
                  <th className="px-4 py-3">Assets</th>
                  <th className="px-4 py-3">Captures</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {status.videos.map((v) => {
                  const pack = getVideoAssets(v.slug);
                  return (
                    <tr key={v.slug} className="border-b border-border-light last:border-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-ink">{v.title}</p>
                        <p className="text-xs text-ink-tertiary">{v.module}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            v.status === "published" || v.status === "screenshots-ready"
                              ? "accent"
                              : "default"
                          }
                        >
                          {v.statusLabel}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">{v.hasScript ? "✓" : "—"}</td>
                      <td className="px-4 py-3">{v.hasThumbnail && v.assetCount > 0 ? "✓" : "—"}</td>
                      <td className="px-4 py-3">
                        {v.screenshotFilesRequired > 0
                          ? `${v.screenshotFilesPresent}/${v.screenshotFilesRequired}`
                          : "—"}
                        {v.missingScreenshotFiles.length > 0 && (
                          <p className="mt-1 max-w-[140px] truncate text-xs text-amber-700" title={v.missingScreenshotFiles.join(", ")}>
                            {v.missingScreenshotFiles.length} manquante(s)
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={v.productionReady ? "accent" : "default"}>{v.readyScore} %</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/videos/${v.slug}`} className="font-semibold text-accent hover:underline">
                          Ouvrir · Pack
                        </Link>
                        {pack && (
                          <div className="mt-2 w-24">
                            <VideoThumbnail
                              title={v.title}
                              module={v.module}
                              icon={pack.icon}
                              background={pack.background}
                              level={v.level}
                              thumbnailPath={pack.thumbnailPath}
                              compact
                            />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <h2 className="font-bold text-ink">Commandes production</h2>
          <ul className="mt-3 space-y-1 font-mono text-xs text-ink-secondary">
            <li>node scripts/convert-screenshots-to-webp.mjs</li>
            <li>node scripts/check-video-screenshots.mjs</li>
            <li>node scripts/generate-video-assets.mjs</li>
          </ul>
          <p className="mt-3 text-sm text-ink-secondary">
            Vidéos finales → <code className="rounded bg-surface px-1">/public/videos/{"{slug}"}.mp4</code>
          </p>
        </section>
      </div>
    </PageShell>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${highlight ? "border-accent/30 bg-accent/5" : "border-border-light bg-surface-elevated"}`}>
      <p className="text-xs font-semibold uppercase text-ink-tertiary">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? "text-accent" : "text-ink"}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-secondary">{sub}</p>}
    </div>
  );
}
