/**
 * Unit assertions for Codex-shaped exam panels (no timer/scoring).
 * Run: npx tsx tests/unit/exam-format-panels-props.test.ts
 */
import assert from "node:assert/strict";
import { getExamDisplayMetadata } from "../../lib/exams/ui-metadata-adapter";
import type {
  ExamCursorOfficialPanel,
  ExamCursorSimulationPanel,
  ExamDisplayMetadata,
} from "../../lib/exams/ui-metadata-adapter";

function assertNoBadLabels(text: string) {
  assert.doesNotMatch(text, /\bundefined\b/i);
  assert.doesNotMatch(text, /\bnull\b/i);
  assert.doesNotMatch(text, /0\s*minute/i);
}

function renderOfficialSummary(
  panel: ExamCursorOfficialPanel | null,
  meta: ExamDisplayMetadata
): string {
  const parts = [
    meta.official.verificationStatus,
    meta.official.officialName,
    meta.official.certification,
    panel?.provider ?? "",
    panel?.duration != null && panel.duration > 0 ? `${panel.duration} min` : "",
    panel?.questionCount != null ? String(panel.questionCount) : "",
    panel?.passingScore != null && panel.passingScore > 0 ? `${panel.passingScore}%` : "",
    ...(panel?.sources.map((s) => s.title) ?? []),
  ];
  return parts.filter(Boolean).join(" | ");
}

function renderSimulationSummary(panel: ExamCursorSimulationPanel): string {
  return [
    panel.fullSimulationAvailable ? "full" : "blocked",
    `${panel.availableQuestions}/${panel.targetQuestions}`,
    panel.trainingAvailable ? "training" : "",
    panel.warning ?? "",
  ]
    .filter(Boolean)
    .join(" | ");
}

// 1. official verified
{
  const meta = getExamDisplayMetadata("jamf-100", 100);
  assert.ok(meta);
  assert.equal(meta.official.verificationStatus, "official-verified");
  assert.ok(meta.officialPanel);
  assert.equal(meta.officialPanel.provider, "Jamf");
  assert.equal(meta.simulationPanel.fullSimulationAvailable, true);
  assert.ok(meta.disclaimer.includes("indépendante"));
  assertNoBadLabels(renderOfficialSummary(meta.officialPanel, meta));
}

// 2–3. partial / needs-review
{
  const md102 = getExamDisplayMetadata("md-102", 80);
  assert.ok(md102);
  assert.equal(md102.official.verificationStatus, "official-partial");
  const jamf200 = getExamDisplayMetadata("jamf-200", 60);
  assert.ok(jamf200);
  assert.equal(jamf200.official.verificationStatus, "needs-review");
}

// 4. internal
{
  const intune = getExamDisplayMetadata("intune-apple", 35);
  assert.ok(intune);
  assert.equal(intune.official.verificationStatus, "internal");
  assert.equal(intune.officialPanel, null);
  assert.match(intune.official.officialName, /Évaluation interne/i);
  assert.doesNotMatch(intune.official.officialName, /Microsoft 365 Certified/i);

  const enterprise = getExamDisplayMetadata("apple-enterprise-expert", 65);
  assert.ok(enterprise);
  assert.equal(enterprise.official.verificationStatus, "internal");
  assert.equal(enterprise.official.certification, "Examen interne Apple MDM Academy");
  assert.doesNotMatch(enterprise.official.certification, /Certification officielle/i);
}

// 5–6. complete vs incomplete bank
{
  const complete = getExamDisplayMetadata("jamf-100", 100);
  assert.equal(complete?.simulation.bankStatus, "complete");
  const incomplete = getExamDisplayMetadata("apple-device-support", 10);
  assert.ok(incomplete);
  assert.equal(incomplete.simulation.bankStatus, "incomplete");
  assert.equal(incomplete.simulationPanel.availableQuestions, 10);
  assert.equal(incomplete.simulationPanel.targetQuestions, 80);
  assert.equal(incomplete.simulationPanel.fullSimulationAvailable, false);
  assert.equal(incomplete.simulationPanel.trainingAvailable, true);
  assertNoBadLabels(renderSimulationSummary(incomplete.simulationPanel));
}

// 7–10. null-safe official fields (internal has no officialPanel)
{
  const intune = getExamDisplayMetadata("intune-apple", 35);
  assert.equal(intune?.officialPanel, null);
  assert.ok(intune?.disclaimer);
}

// 11. disclaimer uniqueness source
{
  const meta = getExamDisplayMetadata("jamf-100", 50);
  assert.ok(meta?.disclaimer.includes("Apple, Jamf ou Microsoft"));
}

// 12–13. blocked simulation + training
{
  const device = getExamDisplayMetadata("apple-device-support", 10);
  assert.equal(device?.simulationPanel.fullSimulationAvailable, false);
  assert.equal(device?.simulationPanel.trainingAvailable, true);
  assert.ok(device?.simulationPanel.warning?.includes("10"));
}

// 16–18. no second source of truth
{
  assert.equal(getExamDisplayMetadata("missing-exam"), null);
}

console.log("exam-format-panels-props: all assertions passed");
