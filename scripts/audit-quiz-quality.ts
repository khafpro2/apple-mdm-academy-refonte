/**
 * Audit CLI des QCM — exécuter : npm run audit:quizzes
 * Charge le build TypeScript via tsx (npx).
 */
import { runQuizQualityAudit } from "../lib/quiz/run-audit";

const report = runQuizQualityAudit();

console.log("\n=== AUDIT QUALITÉ QCM ===\n");
console.log(`Score global (runtime) : ${report.runtime.qualityScore}/100`);
console.log(`Questions : ${report.runtime.totalQuestions} · Quiz : ${report.runtime.totalQuizzes}`);
console.log("\nRépartition positions (runtime) :");
for (let i = 0; i < 4; i++) {
  const n = report.runtime.globalPositionDistribution[i] ?? 0;
  const pct = report.runtime.totalQuestions
    ? ((n / report.runtime.totalQuestions) * 100).toFixed(1)
    : "0";
  console.log(`  ${String.fromCharCode(65 + i)} : ${n} (${pct} %)`);
}
console.log(`\nBiais position : ${report.runtime.positionBiasScore}/100`);
console.log(`Longueurs déséquilibrées : ${report.runtime.lengthImbalanceCount}`);
console.log(`Distracteurs faibles : ${report.runtime.weakDistractorCount}`);
console.log(`Questions trop faciles : ${report.runtime.tooEasyCount}`);

console.log("\n--- Source brute vs normalisé ---");
console.log(`Source — score ${report.source.qualityScore}/100 · biais B ${report.source.globalPositionDistribution[1] ?? 0}`);
console.log(`Runtime — score ${report.runtime.qualityScore}/100 · biais B ${report.runtime.globalPositionDistribution[1] ?? 0}`);

if (report.source.topIssues.length > 0) {
  console.log("\nTop issues (source) :");
  report.source.topIssues.slice(0, 10).forEach((issue) => {
    console.log(`  [${issue.severity}] ${issue.questionId}: ${issue.message}`);
  });
}

console.log("\n✅ Audit terminé\n");
