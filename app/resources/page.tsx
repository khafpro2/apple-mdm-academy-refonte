import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { ResourcesCatalog } from "@/components/resources/resources-catalog";
import { getVisibleResources } from "@/src/lib/resources";

import { buildPageMetadata } from "@/lib/seo/metadata";

const visibleResources = getVisibleResources();

export const metadata = buildPageMetadata({
  title: "Ressources",
  description: "Checklists, commandes Terminal et modèles pratiques pour Apple MDM, Intune et Jamf Pro — export PDF, copie rapide, liens labs.",
  path: "/resources",
});

export default function ResourcesPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Documentation pratique"
          title="Ressources téléchargeables"
          description="Checklists, commandes Terminal et modèles de procédures — export PDF, copie rapide, liens cours et labs."
        />

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-ink-secondary">
          <span className="rounded-full border border-border-light bg-surface-elevated px-4 py-1.5">
            {visibleResources.length} ressources
          </span>
          <span className="rounded-full border border-border-light bg-surface-elevated px-4 py-1.5">
            Export PDF disponible
          </span>
        </div>

        <div className="mt-10">
          <ResourcesCatalog />
        </div>
      </div>
    </PageShell>
  );
}
