import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import { VisualAssetGallery } from "@/components/visual-assets/VisualAssetGallery";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { visualAssetStats } from "@/lib/visual-assets/asset-registry";

export const metadata = buildPageMetadata({
  title: "Bibliothèque visuelle — Enterprise Icon System",
  description:
    "Galerie interne des pictogrammes, composants Freeform et assets SVG Apple MDM Academy.",
  path: "/studio-visuel/assets",
  noIndex: true,
});

export default function StudioVisuelAssetsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Studio visuel"
          title="Enterprise Icon System"
          description={`Bibliothèque SVG cohérente — ${visualAssetStats.total} assets enregistrés (${visualAssetStats.freeformReady} compatibles Freeform).`}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/brand-assets"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            Audit marques
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
          >
            ← Admin
          </Link>
        </div>

        <div className="mt-10">
          <VisualAssetGallery />
        </div>
      </div>
    </PageShell>
  );
}
