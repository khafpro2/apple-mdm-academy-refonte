import { PageShell } from "@/components/layout";
import { Breadcrumb } from "@/components/ui";
import { PreparationReportClient } from "@/components/exams/preparation-report-client";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Rapport de préparation ACITP",
  description: "Forces, faiblesses et recommandations après examen blanc Apple Certified IT Professional.",
  path: "/examens/preparation-report",
});

export default function PreparationReportPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <Breadcrumb
          items={[
            { label: "Examens", href: "/examens" },
            { label: "Rapport de préparation" },
          ]}
        />

        <h1 className="mt-6 text-3xl font-bold text-ink">Rapport de préparation ACITP</h1>
        <p className="mt-2 text-ink-secondary">
          Analyse par domaine après votre dernier examen blanc Apple Certified IT Professional.
        </p>

        <PreparationReportClient />
      </div>
    </PageShell>
  );
}
