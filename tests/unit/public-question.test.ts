import assert from "node:assert/strict";
import test from "node:test";
import { isPublicQuestion, toPublicQuestion, toPublicQuestions } from "../../lib/quiz/public-question.ts";
import type { Question } from "../../lib/types.ts";

const question: Question = {
  id: "ads-1",
  text: "Quel outil ?",
  options: ["A", "B", "C", "D"],
  correctIndex: 2,
  correctIndices: [2],
  explanation: "La bonne réponse est C.",
};

test("toPublicQuestion — retire l'indice et l'explication", () => {
  const publicQuestion = toPublicQuestion(question);
  assert.equal(publicQuestion.correctIndex, -1);
  assert.equal(publicQuestion.correctIndices, undefined);
  assert.equal(publicQuestion.explanation, "");
  assert.equal(publicQuestion.text, question.text);
  assert.deepEqual(publicQuestion.options, question.options);
  assert.equal(isPublicQuestion(publicQuestion), true);
  assert.equal(isPublicQuestion(question), false);
});

test("toPublicQuestions — conserve l'ordre", () => {
  const stripped = toPublicQuestions([question, { ...question, id: "ads-2", correctIndex: 0 }]);
  assert.equal(stripped.length, 2);
  assert.ok(stripped.every((item) => item.correctIndex === -1));
});
