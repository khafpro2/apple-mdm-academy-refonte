import { PageShell } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import { LabCatalogGrid } from "@/components/labs/lab-catalog-grid";
import { labs } from "@/lib/labs";

export const metadata = { title: "Labs pratiques" };

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
