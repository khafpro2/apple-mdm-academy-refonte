import { PageShell } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import { LabCatalogGrid } from "@/components/labs/lab-catalog-grid";
import { labs } from "@/lib/labs";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Labs pratiques",
  description: `${labs.length} labs guidés — Jamf Pro, Apple MDM, Microsoft Intune. Validez chaque étape, suivez votre progression et obtenez des badges.`,
  path: "/labs",
});

export default function LabsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Pratique"
          title="Labs pratiques"
          description="Exercices guidés pas à pas — validez chaque étape, suivez votre progression et obtenez des badges."
        />
        <LabCatalogGrid labs={labs} />
      </div>
    </PageShell>
  );
}
