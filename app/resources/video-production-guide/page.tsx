import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge } from "@/components/ui";
import { SCREENSHOT_CATALOG } from "@/src/lib/video-screenshots";

export const metadata = {
  title: "Guide de production vidéo",
  description:
    "Enregistrer avec Screen Studio, générer avec HeyGen, monter dans CapCut et publier sur Apple MDM Academy.",
};

export default function VideoProductionGuidePage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <Link href="/resources" className="text-sm font-semibold text-accent hover:underline">
          ← Ressources
        </Link>

        <div className="mt-6">
          <SectionHeading
            label="Production"
            title="Guide de production vidéo Apple MDM Academy"
            description="De la capture d'écran à la vidéo publiée sur le site."
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>Screen Studio</Badge>
          <Badge>HeyGen</Badge>
          <Badge>CapCut</Badge>
          <Badge variant="accent">1080p</Badge>
        </div>

        <article className="prose prose-zinc mt-10 max-w-none">
          <section className="rounded-2xl border border-border-light bg-surface-elevated p-6 not-prose">
            <h2 className="text-lg font-bold text-ink">1. Préparer les assets</h2>
            <ul className="mt-3 space-y-2 text-sm text-ink-secondary">
              <li>Storyboard + script : page <code className="rounded bg-surface px-1">/videos/[slug]</code></li>
              <li>SVG : <code className="rounded bg-surface px-1">/public/video-assets/</code></li>
              <li>Exporter le pack : bouton <strong>Pack production</strong></li>
              <li>Admin : <Link href="/admin/video-production" className="text-accent hover:underline">/admin/video-production</Link></li>
            </ul>
          </section>

          <section className="mt-8 rounded-2xl border border-border-light bg-surface-elevated p-6 not-prose">
            <h2 className="text-lg font-bold text-ink">2. Enregistrer avec Screen Studio</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
              <li>Ouvrir ABM, Intune, Jamf ou macOS en résolution 1920×1080.</li>
              <li>Flouter emails, noms, serial numbers et tenant IDs.</li>
              <li>Enregistrer chaque écran de la checklist admin.</li>
              <li>Exporter en <strong>.webp</strong> 1920×1080.</li>
              <li>Nommer : <code className="rounded bg-surface px-1">abm-dashboard.webp</code>, <code className="rounded bg-surface px-1">intune-apns.webp</code>, etc.</li>
              <li>Déposer dans <code className="rounded bg-surface px-1">/public/video-assets/screenshots/</code></li>
            </ol>
            <p className="mt-4 text-sm text-ink-secondary">
              Vérifier : <code className="rounded bg-surface px-1">node scripts/check-video-screenshots.mjs</code>
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-border-light bg-surface-elevated p-6 not-prose">
            <h2 className="text-lg font-bold text-ink">3. Générer l&apos;avatar HeyGen</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
              <li>Copier le script depuis la page vidéo (bouton <strong>Copier script HeyGen</strong>).</li>
              <li>Format 16:9 · voix fr-FR · fond clair Apple Training Premium.</li>
              <li>Une prise par scène (Intro, Architecture, Démo, Erreurs, Résumé).</li>
              <li>Activer les sous-titres français.</li>
            </ol>
          </section>

          <section className="mt-8 rounded-2xl border border-border-light bg-surface-elevated p-6 not-prose">
            <h2 className="text-lg font-bold text-ink">4. Monter dans CapCut</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
              <li>Importer clips HeyGen + captures .webp + diagrammes SVG.</li>
              <li>Lower thirds depuis <code className="rounded bg-surface px-1">/public/video-assets/lower-thirds/</code></li>
              <li>Transitions 200 ms · zooms Screen Studio sur actions clés.</li>
              <li>Musique corporate à -18 dB sous la voix.</li>
              <li>Exporter <strong>1920×1080 · H.264 · MP4</strong>.</li>
            </ol>
          </section>

          <section className="mt-8 rounded-2xl border border-border-light bg-surface-elevated p-6 not-prose">
            <h2 className="text-lg font-bold text-ink">5. Nommer et intégrer</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
              <li>Placer le MP4 : <code className="rounded bg-surface px-1">/public/videos/{"{slug}"}.mp4</code></li>
              <li>Mettre à jour <code className="rounded bg-surface px-1">src/lib/video-publish-status.ts</code> → statut <code className="rounded bg-surface px-1">published</code></li>
              <li>La vidéo apparaît sur <code className="rounded bg-surface px-1">/videos/[slug]</code></li>
            </ol>
          </section>

          <section className="mt-8 rounded-2xl border border-border-light bg-surface-elevated p-6 not-prose">
            <h2 className="text-lg font-bold text-ink">Checklist captures ({SCREENSHOT_CATALOG.categories.reduce((n, c) => n + c.items.length, 0)} fichiers)</h2>
            <div className="mt-4 space-y-6">
              {SCREENSHOT_CATALOG.categories.map((cat) => (
                <div key={cat.id}>
                  <h3 className="font-semibold text-ink">{cat.label}</h3>
                  <ul className="mt-2 space-y-1 text-sm text-ink-secondary">
                    {cat.items.map((item) => (
                      <li key={item.id}>
                        <code className="rounded bg-surface px-1">{item.file}</code> — {item.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </article>
      </div>
    </PageShell>
  );
}
