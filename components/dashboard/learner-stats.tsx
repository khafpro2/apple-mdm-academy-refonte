import type { LearnerStats } from "@/lib/types";

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-border-light bg-surface p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">{label}</p>
      <p className="mt-2 text-3xl font-bold tabular-nums text-ink">{value}</p>
      {sub && <p className="mt-1 text-xs text-ink-secondary">{sub}</p>}
    </div>
  );
}

export function LearnerStatsGrid({ stats }: { stats: LearnerStats }) {
  const hours = Math.floor(stats.timeSpentMinutes / 60);
  const mins = stats.timeSpentMinutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${mins}min` : `${mins} min`;

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Progression globale" value={`${stats.globalPercent}%`} />
      <StatCard label="Temps passé" value={timeLabel} sub="Quiz + modules" />
      <StatCard label="Modules terminés" value={String(stats.modulesCompleted)} sub="Leçons premium" />
      <StatCard label="Score moyen" value={`${stats.averageScore}%`} sub="Tous quiz" />
      <StatCard
        label="Dernière activité"
        value={stats.lastActivity ? stats.lastActivity.date : "—"}
        sub={stats.lastActivity?.label}
      />
      <StatCard label="Certificats" value={String(stats.certificatesCount)} sub="PDF disponibles" />
    </section>
  );
}
