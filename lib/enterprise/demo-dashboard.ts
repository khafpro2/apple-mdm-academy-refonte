export type EnterpriseTeam = {
  id: string;
  name: string;
  members: number;
  avgProgress: number;
  certifications: number;
  examsPassed: number;
};

export type EnterpriseMetrics = {
  totalUsers: number;
  activeUsers: number;
  avgProgress: number;
  certificationsEarned: number;
  examsPassed: number;
  teams: EnterpriseTeam[];
};

export const demoEnterpriseMetrics: EnterpriseMetrics = {
  totalUsers: 47,
  activeUsers: 38,
  avgProgress: 61,
  certificationsEarned: 12,
  examsPassed: 28,
  teams: [
    { id: "t1", name: "IT Infrastructure", members: 18, avgProgress: 68, certifications: 5, examsPassed: 11 },
    { id: "t2", name: "Support Mac", members: 14, avgProgress: 55, certifications: 4, examsPassed: 9 },
    { id: "t3", name: "Security & Compliance", members: 15, avgProgress: 72, certifications: 3, examsPassed: 8 },
  ],
};

export function enterpriseToCsv(metrics: EnterpriseMetrics): string {
  const header = "team,members,avgProgress,certifications,examsPassed";
  const rows = metrics.teams.map((t) =>
    [t.name, t.members, t.avgProgress, t.certifications, t.examsPassed].join(",")
  );
  return [header, ...rows].join("\n");
}

export function enterpriseToPdfText(metrics: EnterpriseMetrics): string {
  return [
    "Apple MDM Academy — Rapport Entreprise",
    `Utilisateurs: ${metrics.totalUsers} (${metrics.activeUsers} actifs)`,
    `Progression moyenne: ${metrics.avgProgress}%`,
    `Certifications: ${metrics.certificationsEarned}`,
    `Examens réussis: ${metrics.examsPassed}`,
    "",
    "Équipes:",
    ...metrics.teams.map(
      (t) => `- ${t.name}: ${t.members} membres, ${t.avgProgress}% progression, ${t.certifications} certifs`
    ),
  ].join("\n");
}
