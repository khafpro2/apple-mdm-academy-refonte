import assert from "node:assert/strict";
import test from "node:test";
import { scoreAttemptByLabels, uniqueQuestionCount } from "../../lib/quiz/score-attempt.ts";
import type { Question } from "../../lib/types.ts";

const bank: Question[] = [
  {
    id: "q1",
    text: "Outil de logs macOS ?",
    options: ["Activity Monitor", "Console", "Disk Utility", "Keychain Access"],
    correctIndex: 1,
    explanation: "Console.",
  },
  {
    id: "q2",
    text: "ADE signifie ?",
    options: ["Apple Device Enrollment", "Azure Directory Engine", "App Delivery Endpoint", "Automatic Disk Encrypt"],
    correctIndex: 0,
    explanation: "Automated / Apple Device Enrollment.",
  },
  {
    id: "q3",
    text: "FileVault chiffre ?",
    options: ["La RAM", "Le volume de démarrage", "iCloud", "APNs"],
    correctIndex: 1,
    explanation: "Volume de démarrage.",
    selectMultiple: true,
    correctIndices: [1],
  },
];

test("scoreAttemptByLabels — 100 % via libellés même si les index client sont faux", () => {
  const result = scoreAttemptByLabels(
    bank,
    {
      q1: "Console",
      q2: "Apple Device Enrollment",
      q3: ["Le volume de démarrage"],
    },
    3,
    80
  );
  assert.equal(result.correct, 3);
  assert.equal(result.percent, 100);
  assert.equal(result.passed, true);
});

test("scoreAttemptByLabels — ignore un index numérique ; seul le libellé compte", () => {
  const result = scoreAttemptByLabels(
    bank,
    { q1: "Activity Monitor", q2: "Apple Device Enrollment", q3: ["Le volume de démarrage"] },
    3,
    80
  );
  assert.equal(result.correct, 2);
  assert.equal(result.percent, 67);
  assert.equal(result.passed, false);
});

test("scoreAttemptByLabels — questions inconnues ignorées, omissions fausses", () => {
  const result = scoreAttemptByLabels(bank, { "exam-abc-0-q1": "Console" }, 3, 75);
  assert.equal(result.correct, 1);
  assert.equal(result.percent, 33);
  assert.equal(result.passed, false);
  assert.equal(result.reviews.length, 1);
});

test("scoreAttemptByLabels — ids préfixés d'examen résolus", () => {
  const result = scoreAttemptByLabels(bank, { "exam-seed01-0-q2": "Apple Device Enrollment" }, 1, 80);
  assert.equal(result.correct, 1);
  assert.equal(result.percent, 100);
});

test("uniqueQuestionCount — déduplique les variantes", () => {
  const withVariants: Question[] = [
    { ...bank[0], id: "q1" },
    { ...bank[0], id: "q1-v1" },
    { ...bank[1], id: "q2" },
  ];
  assert.equal(uniqueQuestionCount(withVariants), 2);
});
