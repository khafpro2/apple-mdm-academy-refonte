import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { ResourcesCatalog } from "@/components/resources/resources-catalog";
import { academyResources } from "@/src/lib/resources";

export const metadata = {
  title: "Ressources",
  description: "Checklists, commandes Terminal et modèles pratiques pour Apple MDM, Intune et Jamf Pro.",
};

export default function ResourcesPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Documentation pratique"
          title="Ressources téléchargeables"
          description="Checklists, commandes Terminal et modèles de procédures — export PDF, copie rapide, liens cours et labs."
        />

        <section className="mt-6 rounded-2xl border border-border-light bg-gradient-to-br from-surface-elevated to-blue-50/40 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Apple Training Premium</p>
          <p className="mt-2 text-sm text-ink-secondary">
            Checklists et guides alignés sur les parcours Apple MDM, Jamf et Intune — export PDF, liens cours et labs
            associés sur chaque fiche.
          </p>
        </section>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-ink-secondary">
          <span className="rounded-full border border-border-light bg-surface-elevated px-4 py-1.5">
            {academyResources.length} ressources
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
