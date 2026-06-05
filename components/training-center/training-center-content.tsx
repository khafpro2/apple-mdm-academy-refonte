"use client";

import { useState } from "react";
import { Card, ProgressBar, Button, SectionHeading } from "@/components/ui";
import { demoGroups, demoLearners, learnersToCsv } from "@/lib/training-center/demo-data";

export function TrainingCenterContent() {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const filtered = selectedGroup
    ? demoLearners.filter((l) => l.groupId === selectedGroup)
    : demoLearners;

  function exportCsv() {
    const csv = learnersToCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "apprenants-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalCerts = demoGroups.reduce((s, g) => s + g.certificationsEarned, 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <SectionHeading
        label="Centre de formation"
        title="Gérez vos groupes et apprenants"
        description="Suivi progression, rapports, certifications et export CSV — données démo remplaçables."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Groupes actifs", value: demoGroups.length },
          { label: "Apprenants", value: demoLearners.length },
          { label: "Certifications", value: totalCerts },
          { label: "Progression moy.", value: `${Math.round(demoGroups.reduce((s, g) => s + g.avgProgress, 0) / demoGroups.length)}%` },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-ink-secondary">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-ink">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex items-center justify-between">
        <h2 className="text-xl font-bold text-ink">Groupes</h2>
        <Button variant="secondary" size="sm" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {demoGroups.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setSelectedGroup(selectedGroup === g.id ? null : g.id)}
            className={`rounded-2xl border p-6 text-left transition ${
              selectedGroup === g.id ? "border-accent bg-accent/5" : "border-border-light bg-surface-elevated hover:border-accent/30"
            }`}
          >
            <h3 className="font-bold text-ink">{g.name}</h3>
            <p className="mt-1 text-sm text-ink-secondary">{g.learnersCount} apprenants · {g.certificationsEarned} certifs</p>
            <ProgressBar value={g.avgProgress} className="mt-4" />
          </button>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold text-ink">Apprenants {selectedGroup ? "(filtré)" : ""}</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-border-light">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border-light bg-surface-elevated">
            <tr>
              <th className="px-4 py-3 font-semibold text-ink">Nom</th>
              <th className="px-4 py-3 font-semibold text-ink">Email</th>
              <th className="px-4 py-3 font-semibold text-ink">Progression</th>
              <th className="px-4 py-3 font-semibold text-ink">Examens</th>
              <th className="px-4 py-3 font-semibold text-ink">Dernière activité</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-border-light last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{l.name}</td>
                <td className="px-4 py-3 text-ink-secondary">{l.email}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ProgressBar value={l.progress} className="w-24" />
                    <span>{l.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">{l.examsPassed}</td>
                <td className="px-4 py-3 text-ink-tertiary">{l.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
