import type { ReactNode } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge } from "@/components/ui";
import { SCREENSHOT_CATALOG } from "@/src/lib/video-screenshots";

export const metadata = {
  title: "Guide de production des captures vidéo",
  description:
    "Enregistrer ABM, Intune, Jamf et macOS avec Screen Studio — floutage, export WebP et validation.",
};

export default function GuideCapturesVideoPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <Link href="/resources" className="text-sm font-semibold text-accent hover:underline">
          ← Ressources
        </Link>

        <div className="mt-6">
          <SectionHeading
            label="Captures vidéo"
            title="Guide de production des captures vidéo"
            description="Screen Studio → WebP 1920×1080 → validation automatique."
          />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Badge>Screen Studio</Badge>
          <Badge variant="accent">1920×1080</Badge>
          <Badge>.webp</Badge>
        </div>

        <div className="mt-8 space-y-8">
          <Section title="Consignes générales">
            <ul className="list-disc space-y-2 pl-5 text-sm text-ink-secondary">
              <li>Résolution <strong>1920×1080</strong>, format final <strong>.webp</strong></li>
              <li>Utiliser un environnement de <strong>test ou démo</strong></li>
              <li>Style propre, interface sans bruit visuel</li>
              <li>Éviter les onglets navigateur visibles si possible</li>
              <li>Flouter : emails, noms, tenant IDs, serial numbers, identifiants entreprise</li>
            </ul>
          </Section>

          <Section title="Apple Business Manager">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
              <li>Connexion sur <code className="rounded bg-surface px-1">business.apple.com</code> (compte démo)</li>
              <li>Enregistrer Dashboard, Devices, MDM Servers, Apps & Books, Users, Managed Apple IDs, Federation</li>
              <li>Exporter depuis Screen Studio, convertir si besoin</li>
            </ol>
            <FileList categoryId="abm" />
          </Section>

          <Section title="Microsoft Intune">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
              <li>Portail <code className="rounded bg-surface px-1">intune.microsoft.com</code> — tenant de lab</li>
              <li>Devices, Apple Enrollment, APNs, Enrollment Program Tokens, Profiles, Compliance, Platform SSO</li>
              <li>Masquer le nom du tenant dans la barre supérieure</li>
            </ol>
            <FileList categoryId="intune" />
          </Section>

          <Section title="Jamf Pro">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
              <li>Connexion Jamf Pro (instance de formation ou sandbox)</li>
              <li>Dashboard, Computers, Smart Groups, Policies, Scripts, Patch Management, Self Service, Jamf Protect</li>
            </ol>
            <FileList categoryId="jamf" />
          </Section>

          <Section title="macOS">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
              <li>Mac de lab avec profils MDM de test</li>
              <li>System Settings, FileVault, Privacy & Security, Profiles, Terminal, Gatekeeper, Activation Lock</li>
              <li>Flouter le nom d&apos;utilisateur et le hostname</li>
            </ol>
            <FileList categoryId="macos" />
          </Section>

          <Section title="Flouter les données sensibles">
            <ul className="list-disc space-y-2 pl-5 text-sm text-ink-secondary">
              <li>Screen Studio : outil blur intégré sur les zones sensibles</li>
              <li>Alternative : rectangle flou dans CapCut avant export WebP</li>
              <li>Vérifier emails, serial numbers, UDID, domaines entreprise, noms réels</li>
            </ul>
          </Section>

          <Section title="Exporter en .webp">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
              <li>Déposer les exports bruts (.png / .jpg) dans <code className="rounded bg-surface px-1">public/video-assets/screenshots/raw/</code></li>
              <li>Renommer selon le catalogue : <code className="rounded bg-surface px-1">abm-dashboard.png</code>, etc.</li>
              <li>Lancer : <code className="rounded bg-surface px-1">node scripts/convert-screenshots-to-webp.mjs</code></li>
              <li>Qualité 85 · redimensionnement 1920×1080 automatique</li>
            </ol>
          </Section>

          <Section title="Valider avec le script">
            <pre className="mt-3 overflow-x-auto rounded-xl bg-surface p-4 text-xs text-ink-secondary">
{`node scripts/check-video-screenshots.mjs

✅ OK             abm-dashboard.webp
⚠️  Manquant      intune-apns.webp
❌ Format incorrect macos-filevault.webp — dimensions 1280×720`}
            </pre>
            <p className="mt-3 text-sm text-ink-secondary">
              Admin : <Link href="/admin/video-production" className="text-accent hover:underline">/admin/video-production</Link>
            </p>
          </Section>

          <Section title="Suite : publication vidéo">
            <ol className="list-decimal space-y-2 pl-5 text-sm text-ink-secondary">
              <li>Toutes les captures présentes → statut <strong>screenshots-ready</strong></li>
              <li>Script HeyGen + narration enregistrée</li>
              <li>Montage CapCut / Screen Studio → MP4 1080p</li>
              <li>Fichier dans <code className="rounded bg-surface px-1">/public/videos/{"{slug}"}.mp4</code></li>
              <li>Statut <strong>published</strong> dans video-publish-status.ts</li>
            </ol>
            <Link href="/resources/video-production-guide" className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
              Guide montage complet →
            </Link>
          </Section>
        </div>
      </div>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-border-light bg-surface-elevated p-6">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function FileList({ categoryId }: { categoryId: string }) {
  const cat = SCREENSHOT_CATALOG.categories.find((c) => c.id === categoryId);
  if (!cat) return null;
  return (
    <ul className="mt-3 space-y-1 text-sm text-ink-secondary">
      {cat.items.map((item) => (
        <li key={item.id}>
          <code className="rounded bg-surface px-1 text-accent">{item.file}</code>
        </li>
      ))}
    </ul>
  );
}
