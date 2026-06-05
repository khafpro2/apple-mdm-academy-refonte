import type { LeaderboardEntry } from "@/lib/types";

type LeaderboardTabsProps = {
  entries: LeaderboardEntry[];
};

export function LeaderboardPanel({ entries }: LeaderboardTabsProps) {
  if (entries.length === 0) {
    return (
      <p className="mt-4 text-sm text-ink-secondary">
        Le classement se remplit au fur et à mesure des examens passés.
      </p>
    );
  }

  const byScore = [...entries].sort((a, b) => b.bestScore - a.bestScore);
  const bySpeed = [...entries]
    .filter((e) => e.fastestMinutes != null)
    .sort((a, b) => (a.fastestMinutes ?? 999) - (b.fastestMinutes ?? 999));
  const byModules = [...entries].sort((a, b) => b.modulesCompleted - a.modulesCompleted);
  const byCerts = [...entries].sort((a, b) => (b.certsEarned ?? 0) - (a.certsEarned ?? 0));
  const byLabs = [...entries].sort((a, b) => (b.labsCompleted ?? 0) - (a.labsCompleted ?? 0));

  return (
    <div className="mt-4 space-y-6">
      <LeaderboardList title="Meilleur score" entries={byScore} metric={(e) => `${e.bestScore}%`} />
      <LeaderboardList
        title="Plus de certifications"
        entries={byCerts.slice(0, 5)}
        metric={(e) => `${e.certsEarned ?? 0} cert.`}
      />
      <LeaderboardList
        title="Plus de labs"
        entries={byLabs.slice(0, 5)}
        metric={(e) => `${e.labsCompleted ?? 0} lab${(e.labsCompleted ?? 0) > 1 ? "s" : ""}`}
      />
      <LeaderboardList
        title="Plus rapide"
        entries={bySpeed.slice(0, 5)}
        metric={(e) => (e.fastestMinutes != null ? `${e.fastestMinutes} min` : "—")}
      />
      <LeaderboardList
        title="Plus de modules"
        entries={byModules.slice(0, 5)}
        metric={(e) => `${e.modulesCompleted} module${e.modulesCompleted > 1 ? "s" : ""}`}
      />
    </div>
  );
}

function LeaderboardList({
  title,
  entries,
  metric,
}: {
  title: string;
  entries: LeaderboardEntry[];
  metric: (e: LeaderboardEntry) => string;
}) {
  if (entries.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">{title}</p>
      <ol className="mt-2 space-y-1">
        {entries.slice(0, 5).map((entry, i) => (
          <li
            key={`${title}-${entry.userId}`}
            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
              entry.highlight ? "bg-ink text-white" : "bg-surface"
            }`}
          >
            <span className="w-5 font-bold">{i + 1}</span>
            <span className="flex-1 truncate font-medium">{entry.name}</span>
            <span className="text-xs opacity-80">{metric(entry)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
