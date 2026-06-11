import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Card, ProgressBar, Badge } from "@/components/ui";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { runCertificationAudit } from "@/lib/audit/certification-audit";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: "Audit certification",
  description: "Couverture programmes Apple, Jamf et Intune.",
  path: "/admin/certification-audit",
  noIndex: true,
});

export default function CertificationAuditPage() {
  const audit = runCertificationAudit();

  return (
    <PageShell>
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Admin"
          title="Audit certification"
          description={`Généré le ${new Date(audit.generatedAt).toLocaleString("fr-FR")}`}
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/admin/lms-audit" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            Audit LMS
          </Link>
          <Link href="/admin" className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink">
            ← Admin
          </Link>
        </div>

        <Card className="mt-8 p-6">
          <p className="text-sm text-ink-tertiary">Couverture globale programmes</p>
          <p className="text-4xl font-bold text-accent">{audit.globalCoverage} %</p>
          <p className="mt-2 text-sm text-ink-secondary">
            ACITP : {audit.acitpModulesCovered}/{audit.acitpModulesTotal} modules complets · Examen{" "}
            {audit.examQuestionCount} Q ({audit.examBaseUnique} uniques base)
          </p>
          <ProgressBar value={audit.globalCoverage} className="mt-4" />
        </Card>

        <div className="mt-10 space-y-6">
          {audit.programs.map((prog) => (
            <Card key={prog.slug} className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-ink">{prog.program}</h3>
                <span className="font-semibold text-accent">{prog.coveragePercent} %</span>
              </div>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {prog.items.map((item) => (
                  <li key={item.label} className="flex items-center gap-2 text-sm">
                    <Badge variant={item.status === "ok" ? "dark" : item.status === "partial" ? "accent" : "default"}>
                      {item.status}
                    </Badge>
                    {item.label}
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
