import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { runBrandAssetsAudit, type BrandAssetStatus } from "@/lib/audit/brand-assets.server";
import { JamfLogo } from "@/components/brands/JamfLogo";
import { MicrosoftLogo } from "@/components/brands/MicrosoftLogo";
import { IntuneLogo } from "@/components/brands/IntuneLogo";
import { EntraLogo } from "@/components/brands/EntraLogo";
import { MicrosoftLearnLogo } from "@/components/brands/MicrosoftLearnLogo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Audit marques & logos",
  description: "Inventaire des logos Apple, Jamf, Microsoft, Intune, Entra ID et Microsoft Learn.",
  path: "/admin/brand-assets",
  noIndex: true,
});

const STATUS_LABEL: Record<BrandAssetStatus, string> = {
  ok: "OK",
  review: "À vérifier",
};

const STATUS_VARIANT: Record<BrandAssetStatus, "default" | "accent" | "dark"> = {
  ok: "dark",
  review: "accent",
};

function BrandPreview({ id }: { id: string }) {
  switch (id) {
    case "jamf":
      return <JamfLogo variant="mark" size={28} alt="Jamf" />;
    case "microsoft":
      return <MicrosoftLogo size={28} />;
    case "intune":
      return <IntuneLogo size={28} />;
    case "entra":
      return <EntraLogo size={28} />;
    case "microsoft-learn":
      return <MicrosoftLearnLogo size={28} />;
    default:
      return <span className="text-xs text-ink-tertiary">—</span>;
  }
}

export default function BrandAssetsAdminPage() {
  const report = runBrandAssetsAudit();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Admin — Marques"
          title="Audit logos & mentions légales"
          description={`Généré le ${new Date(report.generatedAt).toLocaleString("fr-FR")}`}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/jamf-content-status" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            Statut Jamf
          </Link>
          <Link href="/admin/media-readiness" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            Préparation médias
          </Link>
          <Link href="/admin" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            ← Admin
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Marques</p>
            <p className="text-3xl font-bold text-accent">{report.summary.total}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">OK</p>
            <p className="text-3xl font-bold text-accent">{report.summary.ok}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">À vérifier</p>
            <p className="text-3xl font-bold text-amber-700">{report.summary.review}</p>
          </Card>
          <Card className="p-5">
            <p className="text-sm text-ink-tertiary">Placeholders</p>
            <p className="text-3xl font-bold text-ink-secondary">{report.summary.placeholders}</p>
          </Card>
        </div>

        <div className="mt-10 overflow-x-auto rounded-3xl border border-border-light bg-surface-elevated shadow-sm">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border-light text-left text-ink-tertiary">
                <th className="px-5 py-3">Aperçu</th>
                <th className="px-5 py-3">Marque</th>
                <th className="px-5 py-3">Logo</th>
                <th className="px-5 py-3">SVG</th>
                <th className="px-5 py-3">CDN</th>
                <th className="px-5 py-3">Composant</th>
                <th className="px-5 py-3">Mention légale</th>
                <th className="px-5 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {report.rows.map((row) => (
                <tr key={row.id} className="border-b border-border-light align-top">
                  <td className="px-5 py-4">
                    <BrandPreview id={row.id} />
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{row.name}</p>
                    {row.isPlaceholder && (
                      <p className="mt-1 text-xs text-amber-800">Placeholder — remplacer par logo officiel</p>
                    )}
                    {row.replacementTodo && (
                      <p className="mt-1 text-xs text-ink-tertiary">{row.replacementTodo}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">{row.logoPresent ? "Oui" : "Non"}</td>
                  <td className="px-5 py-4">{row.svgValid ? "Valide" : "Cassé"}</td>
                  <td className="px-5 py-4">{row.externalReferenceFree ? "Aucun" : "À vérifier"}</td>
                  <td className="px-5 py-4">{row.componentPresent ? "Oui" : "Non"}</td>
                  <td className="px-5 py-4">{row.legalNoticePresent ? "Oui" : "—"}</td>
                  <td className="px-5 py-4">
                    <Badge variant={STATUS_VARIANT[row.status]}>{STATUS_LABEL[row.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-6">
          {report.rows.map((row) => (
            <Card key={`pages-${row.id}`} className="p-5">
              <p className="font-semibold text-ink">{row.name} — pages concernées</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {row.pages.map((p) => (
                  <li key={p}>
                    <code className="rounded bg-surface px-2 py-0.5 text-xs text-ink-secondary">{p}</code>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
