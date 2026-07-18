import { examPools } from "@/lib/data/exams/pools";
import { getQuiz } from "@/lib/data/quizzes";
import { runExamAudit } from "@/lib/exam/exam-audit";
import { getExamAvailability, getExamDisplayMetadata } from "@/lib/exams/exam-config";
import { examFormats } from "@/lib/exams/exam-formats";

type Severity = "error" | "warning" | "info";

type Finding = {
  severity: Severity;
  routeSlug: string;
  id: string;
  detail: string;
};

const OFFICIAL_HOSTS = ["it-training.apple.com", "training.jamf.com", "support.jamf.com", "learn.microsoft.com"];

const audit = runExamAudit();
const findings: Finding[] = [];

function add(severity: Severity, routeSlug: string, id: string, detail: string) {
  findings.push({ severity, routeSlug, id, detail });
}

for (const row of audit.rows) {
  const format = examFormats[row.routeSlug];
  const pool = examPools[row.quizSlug] ?? getQuiz(row.quizSlug)?.questions ?? [];

  if (!row.title || row.title === "Quiz introuvable") add("error", row.routeSlug, "exam-name-missing", "Nom ou quiz introuvable.");
  if (!row.vendor || row.vendor === "—") add("error", row.routeSlug, "exam-vendor-missing", "Fournisseur absent.");
  if (!row.routeOk) add("error", row.routeSlug, "exam-route-invalid", "Route sans quiz enregistré.");
  if (!row.poolOk) add("error", row.routeSlug, "exam-bank-empty", "Banque de questions vide.");
  if (row.durationMinutes <= 0 || !Number.isFinite(row.durationMinutes)) add("error", row.routeSlug, "exam-duration-invalid", "Durée interne invalide.");
  if (row.passingScore <= 0 || !Number.isFinite(row.passingScore)) add("error", row.routeSlug, "exam-score-invalid", "Seuil interne invalide.");

  if (!row.bankComplete) {
    add("warning", row.routeSlug, "exam-bank-insufficient", `Banque insuffisante ${row.baseQuestions}/${row.targetQuestions}; la sélection réduit la tentative aux questions uniques.`);
  }

  const duplicateIds = pool
    .map((question) => question.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    add("warning", row.routeSlug, "exam-bank-duplicate-ids", `Identifiants dupliqués en banque source: ${[...new Set(duplicateIds)].join(", ")}. Le sélecteur déduplique avant tentative.`);
  }

  if (!format) {
    add("warning", row.routeSlug, "exam-format-missing", "Format avancé absent; fallback legacy utilisé.");
    continue;
  }

  if (format.verificationStatus === "official-verified") {
    if (!format.durationMinutes) add("error", row.routeSlug, "verified-duration-missing", "Format verified sans durée officielle confirmée.");
    if (!format.questionCount) add("error", row.routeSlug, "verified-question-count-missing", "Format verified sans nombre de questions confirmé.");
    if (!format.passingScore) add("error", row.routeSlug, "verified-score-missing", "Format verified sans seuil confirmé.");
    if (format.sources.length === 0) add("error", row.routeSlug, "verified-source-missing", "Format verified sans source officielle.");
  }

  if (format.verificationStatus !== "official-verified") {
    add("info", row.routeSlug, "format-not-fully-verified", `Format ${format.verificationStatus}; ne pas présenter comme officiel.`);
  }

  const availability = getExamAvailability(row.routeSlug, row.baseQuestions);
  if (availability && !availability.fullSimulationAvailable) {
    add("warning", row.routeSlug, "simulation-unavailable", availability.reason ?? "Simulation complète indisponible.");
  }
  const displayMetadata = getExamDisplayMetadata(row.routeSlug, row.baseQuestions);
  if (!displayMetadata?.disclaimer) add("warning", row.routeSlug, "disclaimer-missing", "Disclaimer de simulation absent.");

  if (format.durationMinutes === null && format.modes.simulation.durationMinutes) {
    add("info", row.routeSlug, "internal-duration", "Durée de simulation interne utilisée car la durée officielle n'est pas confirmée.");
  }
  if (format.questionCount === null && format.modes.simulation.questionCount) {
    add("info", row.routeSlug, "internal-question-count", "Nombre de questions de simulation interne utilisé car le nombre officiel n'est pas confirmé.");
  }
  if (format.passingScore === null && format.scoring.passingScore) {
    add("info", row.routeSlug, "internal-score", "Seuil de simulation interne utilisé car le seuil officiel n'est pas confirmé.");
  }

  if (format.sources.length === 0) add("warning", row.routeSlug, "source-missing", "Aucune source attachée au format.");
  for (const source of format.sources) {
    if (!source.checkedAt) add("warning", row.routeSlug, "source-date-missing", `${source.title}: date de vérification absente.`);
    try {
      const url = new URL(source.url);
      if (!OFFICIAL_HOSTS.includes(url.hostname)) add("warning", row.routeSlug, "source-host-unofficial", `${source.title}: domaine non allowlisté (${url.hostname}).`);
    } catch {
      add("error", row.routeSlug, "source-url-invalid", `${source.title}: URL invalide.`);
    }
  }

  const internalPresentedAsOfficial =
    format.verificationStatus !== "official-verified" &&
    format.verificationStatus !== "internal" &&
    !format.officialName.toLowerCase().includes("simulation") &&
    !format.notes?.some((note) => /simulation|not asserted|non entièrement|not a microsoft certification/i.test(note));
  if (internalPresentedAsOfficial) {
    add("warning", row.routeSlug, "internal-presented-official", "Format interne ou non vérifié insuffisamment distingué d'un examen officiel.");
  }
}

const errors = findings.filter((finding) => finding.severity === "error");
const warnings = findings.filter((finding) => finding.severity === "warning");
const infos = findings.filter((finding) => finding.severity === "info");

console.log("=== Audit examens Apple MDM Academy ===\n");
console.log(`Examens analysés : ${audit.totalExams}`);
console.log(`Routes OK : ${audit.routesOk}/${audit.totalExams}`);
console.log(`Timers OK : ${audit.timersOk}/${audit.totalExams}`);
console.log(`Corrections OK : ${audit.correctionsOk}/${audit.totalExams}`);
console.log(`Banques complètes : ${audit.poolsComplete}/${audit.totalExams}`);
console.log(`Findings : ${findings.length} (errors=${errors.length}, warnings=${warnings.length}, info=${infos.length})\n`);

for (const row of audit.rows) {
  console.log(`[${row.bankComplete ? "OK" : "WARN"}] ${row.routeSlug}`);
  console.log(`  quiz        : ${row.quizSlug}`);
  console.log(`  fournisseur : ${row.vendor}`);
  console.log(`  format      : ${row.verificationStatus}`);
  console.log(`  questions   : ${row.baseQuestions}/${row.targetQuestions}`);
  console.log(`  durée       : ${row.durationMinutes} min`);
  console.log(`  seuil       : ${row.passingScore}`);
  if (row.poolWarning) console.log(`  remarque    : ${row.poolWarning}`);
  for (const finding of findings.filter((item) => item.routeSlug === row.routeSlug)) {
    console.log(`  ${finding.severity.toUpperCase()} ${finding.id}: ${finding.detail}`);
  }
  console.log("");
}

if (errors.length > 0) {
  process.exitCode = 1;
}
