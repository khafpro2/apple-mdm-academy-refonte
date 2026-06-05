"use client";

import { Card, ProgressBar, Button, SectionHeading } from "@/components/ui";
import { demoEnterpriseMetrics, enterpriseToCsv, enterpriseToPdfText } from "@/lib/enterprise/demo-dashboard";

export function EnterpriseDashboardContent() {
  function exportCsv() {
    const csv = enterpriseToCsv(demoEnterpriseMetrics);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enterprise-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    const text = enterpriseToPdfText(demoEnterpriseMetrics);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "enterprise-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  const m = demoEnterpriseMetrics;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <SectionHeading
        label="Entreprise"
        title="Dashboard équipes"
        description="Vue centralisée utilisateurs, progression, certifications et examens — export PDF/CSV."
      />
      <div className="mt-8 flex flex-wrap gap-3">
        <Button variant="secondary" size="sm" onClick={exportCsv}>Export CSV</Button>
        <Button variant="secondary" size="sm" onClick={exportPdf}>Export rapport</Button>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Utilisateurs", value: m.totalUsers },
          { label: "Actifs", value: m.activeUsers },
          { label: "Progression moy.", value: `${m.avgProgress}%` },
          { label: "Certifications", value: m.certificationsEarned },
          { label: "Examens réussis", value: m.examsPassed },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-ink-secondary">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-ink">{s.value}</p>
          </Card>
        ))}
      </div>
      <h2 className="mt-12 text-xl font-bold text-ink">Progression par équipe</h2>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {m.teams.map((t) => (
          <Card key={t.id}>
            <h3 className="font-bold text-ink">{t.name}</h3>
            <p className="mt-1 text-sm text-ink-secondary">{t.members} membres</p>
            <ProgressBar value={t.avgProgress} className="mt-4" />
            <div className="mt-4 flex gap-4 text-sm text-ink-tertiary">
              <span>{t.certifications} certifs</span>
              <span>{t.examsPassed} examens</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
