import assert from "node:assert/strict";
import type { Question } from "@/lib/types";
import { selectExamQuestions } from "@/lib/exams/selection";
import { calculateExamScore } from "@/lib/exams/scoring";
import { buildExamFinalReport } from "@/lib/exams/report";
import {
  createExamTimer,
  pauseExamTimer,
  restoreExamTimer,
  restoreExamTimerForAttempt,
  resumeExamTimer,
  serializeExamTimer,
  submitExamTimer,
  tickExamTimer,
} from "@/lib/exams/timer";
import {
  createExamAttempt,
  getExamAvailability,
  getExamConfig,
  getExamDurationMinutes,
  getExamFormat,
  getExamOfficialFormat,
  getExamSimulationConfig,
  scoreExamAttempt,
  shouldShowExplanations,
} from "@/lib/exams/exam-config";
import { getExamDisplayMetadata } from "@/lib/exams/ui-metadata-adapter";

const questions: Question[] = [
  q("q1", "domain-a", "easy", 0),
  q("q2", "domain-a", "medium", 1),
  q("q3", "domain-b", "medium", 2),
  q("q4", "domain-b", "hard", 3),
  q("q5", "domain-c", "hard", 0),
  {
    ...q("q6", "domain-c", "medium", 0),
    selectMultiple: true,
    correctIndices: [0, 2],
  },
];

const selected = selectExamQuestions(questions, { seed: "test-seed", count: 6 });
assert.equal(selected.selected.length, 6);
assert.equal(new Set(selected.selected.map((question) => question.id)).size, 6);
assert.ok(Object.keys(selected.domainCounts).length >= 3);

const insufficient = selectExamQuestions(questions.slice(0, 3), { seed: "short-bank", count: 6 });
assert.equal(insufficient.selected.length, 3);
assert.equal(insufficient.effectiveCount, 3);
assert.ok(insufficient.warnings.some((warning) => warning.includes("réduite")));

const duplicated = selectExamQuestions([questions[0], questions[0], questions[1]], { seed: "dupes", count: 3 });
assert.equal(duplicated.selected.length, 2);
assert.equal(new Set(duplicated.selected.map((question) => question.id)).size, 2);

const weighted = selectExamQuestions(questions, {
  seed: "weighted",
  count: 4,
  domainWeights: { "domain-a": 3, "domain-b": 1, "domain-c": 1 },
});
assert.ok((weighted.domainCounts["domain-a"] ?? 0) >= (weighted.domainCounts["domain-b"] ?? 0));

const filtered = selectExamQuestions([
  { ...questions[0], disabled: true } as Question,
  { ...questions[1], verificationStatus: "needs-review" } as Question,
  questions[2],
], { seed: "filtered", count: 3 });
assert.equal(filtered.selected.length, 2);
assert.equal(filtered.needsReviewCount, 1);

assert.deepEqual(
  selectExamQuestions(questions, { seed: "same-seed", count: 4 }).selected.map((question) => question.id),
  selectExamQuestions(questions, { seed: "same-seed", count: 4 }).selected.map((question) => question.id),
);
assert.notDeepEqual(
  selectExamQuestions(questions, { seed: "seed-a", count: 4 }).selected.map((question) => question.id),
  selectExamQuestions(questions, { seed: "seed-b", count: 4 }).selected.map((question) => question.id),
);

const score = calculateExamScore({
  questions,
  answers: { q1: 0, q2: 0, q3: 2, q4: 3, q5: 1, q6: [0, 2] },
  passingScore: 70,
  elapsedSeconds: 360,
});
assert.equal(score.rawScore, 4);
assert.equal(score.percent, 67);
assert.equal(score.passed, false);
assert.equal(score.averageSecondsPerQuestion, 60);
assert.equal(score.byDomain.find((domain) => domain.domain === "domain-b")?.percent, 100);
assert.equal(calculateExamScore({ questions, answers: { q6: [0] }, passingScore: Number.NaN, elapsedSeconds: 0 }).passingScore, 70);
assert.equal(calculateExamScore({ questions: [], answers: {}, passingScore: 70, elapsedSeconds: 0 }).percent, 0);

const report = buildExamFinalReport({
  questions,
  answers: { q1: 0, q2: 0, q3: 2, q4: 3, q5: 1, q6: [0, 2] },
  passingScore: 70,
  elapsedSeconds: 360,
});
assert.ok(report.strongDomains.some((domain) => domain.domain === "domain-b"));
assert.ok(report.weakDomains.some((domain) => domain.domain === "domain-a"));

const timer = createExamTimer("simulation", 1, 1_000);
const ticked = tickExamTimer(timer, 31_000);
assert.equal(ticked.secondsLeft, 30);
assert.equal(ticked.expired, false);
assert.equal(tickExamTimer(ticked, 61_000).expired, true);
const submitted = submitExamTimer(ticked, 45_000);
assert.equal(submitted.submitted, true);
assert.equal(submitExamTimer(submitted, 50_000).endedAt, submitted.endedAt);

const trainingTimer = createExamTimer("training", 10, 1_000);
const paused = pauseExamTimer(trainingTimer, 2_000);
assert.equal(paused.paused, true);
assert.equal(tickExamTimer(paused, 20_000).secondsLeft, paused.secondsLeft);
const resumed = resumeExamTimer(paused, 21_000);
assert.equal(resumed.paused, false);
assert.equal(restoreExamTimer(serializeExamTimer(resumed), 22_000)?.secondsLeft, resumed.secondsLeft - 1);
const attemptTimer = createExamTimer("simulation", 5, 1_000, { attemptId: "attempt-a", examId: "exam-a" });
assert.equal(restoreExamTimerForAttempt(serializeExamTimer(attemptTimer), { attemptId: "attempt-a", examId: "exam-a" }, 2_000)?.examId, "exam-a");
assert.equal(restoreExamTimerForAttempt(serializeExamTimer(attemptTimer), { attemptId: "attempt-b", examId: "exam-a" }, 2_000), null);
assert.equal(restoreExamTimerForAttempt(serializeExamTimer(attemptTimer), { attemptId: "attempt-a", examId: "exam-b" }, 2_000), null);

assert.equal(shouldShowExplanations("training", false, true), true);
assert.equal(shouldShowExplanations("simulation", false, true), false);
assert.equal(shouldShowExplanations("simulation", true, true), true);

assert.equal(getExamFormat("jamf-100")?.questionCount, 50);
assert.equal(getExamConfig("jamf-100")?.id, "jamf-100");
assert.equal(getExamDurationMinutes("jamf-100"), 60);
assert.equal(getExamFormat("apple-deployment")?.passingScore, 75);
assert.equal(getExamOfficialFormat("jamf-100")?.verificationStatus, "official-verified");
assert.equal(getExamSimulationConfig("jamf-100")?.questionCount, 50);
assert.equal(getExamAvailability("apple-device-support", 10)?.deficit, 70);
assert.equal(getExamAvailability("apple-device-support", 10)?.trainingAvailable, true);

const completeMetadata = getExamDisplayMetadata("jamf-100", 100);
assert.equal(completeMetadata?.official.verificationStatus, "official-verified");
assert.equal(completeMetadata?.simulation.fullSimulationAvailable, true);
assert.equal(completeMetadata?.simulation.bankStatus, "complete");
assert.equal(completeMetadata?.officialPanel?.provider, "Jamf");
assert.equal(completeMetadata?.simulationPanel.availableQuestions, 100);
assert.ok(completeMetadata?.disclaimer.includes("Simulation"));

const incompleteMetadata = getExamDisplayMetadata("apple-device-support", 10);
assert.equal(incompleteMetadata?.simulation.fullSimulationAvailable, false);
assert.equal(incompleteMetadata?.simulation.bankStatus, "incomplete");
assert.equal(incompleteMetadata?.simulation.effectiveQuestionCount, 10);
assert.ok(incompleteMetadata?.simulation.warning?.includes("10 questions uniques"));
assert.equal(incompleteMetadata?.simulationPanel.fullSimulationAvailable, false);

const internalMetadata = getExamDisplayMetadata("intune-apple", 35);
assert.equal(internalMetadata?.official.verificationStatus, "internal");
assert.equal(internalMetadata?.official.officialName, "Évaluation interne Intune pour appareils Apple");
assert.equal(internalMetadata?.officialPanel, null);
assert.equal(getExamDisplayMetadata("apple-enterprise-expert", 65)?.official.certification, "Examen interne Apple MDM Academy");

const publicTrainingAttempt = createExamAttempt("apple-device-support", "training", {
  questions: questions as never,
  seed: "public-training",
  now: 1_000,
});
assert.equal(publicTrainingAttempt.mode, "training");
assert.equal(publicTrainingAttempt.status, "in_progress");
assert.throws(() =>
  createExamAttempt("apple-device-support", "simulation", {
    questions: questions as never,
    seed: "public-simulation",
    now: 1_000,
  }),
);
const scoredAttempt = {
  ...publicTrainingAttempt,
  answers: { q1: 0, q2: 1, q3: 1 },
  elapsedSeconds: 120,
};
assert.equal(scoreExamAttempt(scoredAttempt).total, publicTrainingAttempt.questions.length);

console.log("Exam engine tests passed.");

function q(id: string, domain: string, difficulty: Question["difficulty"], correctIndex: number): Question {
  return {
    id,
    text: `Question ${id}`,
    options: ["A", "B", "C", "D"],
    correctIndex,
    explanation: `Explanation ${id}`,
    domain,
    difficulty,
    moduleHref: `/cours/demo/${domain}`,
    moduleLabel: `Module ${domain}`,
  };
}
