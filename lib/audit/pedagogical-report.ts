import type { PedagogicalAuditReport } from "@/lib/audit/pedagogical-audit";
import type { ContentCompleteness } from "@/lib/audit/content-status";

export type PedagogicalReport = {
  scores: PedagogicalAuditReport["scores"];
  strengths: string[];
  weaknesses: string[];
  incompleteLessons: { id: string; title: string; status: ContentCompleteness; score: number }[];
  incompleteLabs: { id: string; title: string; status: ContentCompleteness; score: number }[];
  recommendations: string[];
  blockers: string[];
  targets: { label: string; current: number; target: number; met: boolean }[];
};

export function buildPedagogicalReport(audit: PedagogicalAuditReport): PedagogicalReport {
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendations: string[] = [];
  const blockers: string[] = [];

  if (audit.scores.lessons >= 70) strengths.push("Base de leçons structurée avec objectifs, étapes et dépannage");
  else weaknesses.push("Qualité des leçons en dessous du seuil académie (templates trop génériques)");

  if (audit.scores.exams >= 60) strengths.push("Infrastructure QCM avec audit anti-patterns et randomisation");
  else weaknesses.push("Examens blancs — distracteurs et scénarios à renforcer");

  if (audit.lessons.filter((l) => l.meta?.source === "premium-custom").length >= 8) {
    strengths.push("Leçons premium Intune hand-crafted (composants React dédiés)");
  }

  if (audit.scores.certifications >= 75) strengths.push("Parcours certifications commerciales reliés aux tracks");
  else weaknesses.push("Cohérence certifications — écarts modules/labs/examens");

  if (audit.scores.screenshots < 50) {
    weaknesses.push(`${audit.screenshots.missing} captures manquantes sur ${audit.screenshots.total}`);
    blockers.push("Captures d'écran — placeholders silencieux sur de nombreuses leçons");
    recommendations.push("Prioriser les captures ABM, Jamf Pro, Intune et Apple Settings pour les leçons foundation");
  }

  if (audit.labStatusCounts.placeholder > 20) {
    weaknesses.push(`${audit.labStatusCounts.placeholder} labs auto-générés (alt MDM)`);
    recommendations.push("Enrichir les labs Kandji/Mosyle/Addigy nommés et remplacer les labs factory par scénarios entreprise");
  }

  if (audit.videos.filter((v) => v.issues.some((i) => i.includes("template"))).length > 30) {
    weaknesses.push("Scripts vidéo HeyGen majoritairement templatisés");
    recommendations.push("Rédiger scripts vidéo sur mesure avec objectifs, résumé et liens labs");
  }

  if (audit.scores.global < 95) {
    recommendations.push("Enrichir MODULE_THEORY advanced/alt pour chaque module expert (actuellement ~10 % hand-crafted)");
    recommendations.push("Étendre LESSON_TOPICS foundation avec cas Jamf/Intune/Apple Enterprise concrets");
    recommendations.push("Mapper LESSON_SCREENSHOT_IDS pour toutes les leçons sans capture dédiée");
  }

  const incompleteLessons = audit.lessons
    .filter((l) => l.status !== "complet")
    .sort((a, b) => a.score - b.score)
    .slice(0, 25)
    .map((l) => ({ id: l.id, title: l.title, status: l.status, score: l.score }));

  const incompleteLabs = audit.labs
    .filter((l) => l.status !== "complet")
    .sort((a, b) => a.score - b.score)
    .slice(0, 20)
    .map((l) => ({ id: l.id, title: l.title, status: l.status, score: l.score }));

  const targets = [
    { label: "Qualité pédagogique globale", current: audit.scores.global, target: 95, met: audit.scores.global >= 95 },
    { label: "Qualité examens", current: audit.scores.exams, target: 95, met: audit.scores.exams >= 95 },
    { label: "Qualité labs", current: audit.scores.labs, target: 95, met: audit.scores.labs >= 95 },
    { label: "Cohérence certifications", current: audit.scores.certifications, target: 95, met: audit.scores.certifications >= 95 },
  ];

  if (!targets.every((t) => t.met)) {
    blockers.push("Objectifs 95/100 non atteints — enrichissement contenu requis avant nouvelles fonctionnalités");
  }

  return {
    scores: audit.scores,
    strengths,
    weaknesses,
    incompleteLessons,
    incompleteLabs,
    recommendations,
    blockers,
    targets,
  };
}
