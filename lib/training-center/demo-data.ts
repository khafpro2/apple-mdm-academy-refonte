export type TrainingGroup = {
  id: string;
  name: string;
  learnersCount: number;
  avgProgress: number;
  certificationsEarned: number;
  startDate: string;
};

export type TrainingLearner = {
  id: string;
  name: string;
  email: string;
  groupId: string;
  progress: number;
  examsPassed: number;
  lastActive: string;
};

export const demoGroups: TrainingGroup[] = [
  { id: "g1", name: "Jamf 100 — Mars 2026", learnersCount: 12, avgProgress: 68, certificationsEarned: 4, startDate: "2026-03-01" },
  { id: "g2", name: "Apple IT Pro — Entreprise", learnersCount: 8, avgProgress: 45, certificationsEarned: 1, startDate: "2026-02-15" },
  { id: "g3", name: "Intune Apple — MSP", learnersCount: 15, avgProgress: 72, certificationsEarned: 6, startDate: "2026-01-10" },
];

export const demoLearners: TrainingLearner[] = [
  { id: "l1", name: "Sophie Martin", email: "s.martin@neotech.fr", groupId: "g1", progress: 92, examsPassed: 1, lastActive: "2026-06-04" },
  { id: "l2", name: "Thomas Leroy", email: "t.leroy@horizon.fr", groupId: "g2", progress: 58, examsPassed: 0, lastActive: "2026-06-03" },
  { id: "l3", name: "Marc Dubois", email: "m.dubois@mdmpartners.fr", groupId: "g3", progress: 100, examsPassed: 2, lastActive: "2026-06-05" },
  { id: "l4", name: "Claire Bernard", email: "c.bernard@innovacorp.fr", groupId: "g1", progress: 74, examsPassed: 1, lastActive: "2026-06-02" },
];

export function learnersToCsv(learners: TrainingLearner[]): string {
  const header = "id,name,email,groupId,progress,examsPassed,lastActive";
  const rows = learners.map((l) =>
    [l.id, l.name, l.email, l.groupId, l.progress, l.examsPassed, l.lastActive].join(",")
  );
  return [header, ...rows].join("\n");
}
