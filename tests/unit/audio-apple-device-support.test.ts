import assert from "node:assert/strict";
import test from "node:test";
import {
  appleDeviceSupportAudioLessons,
  getAppleDeviceSupportAudioQuestions,
  getSpokenScriptBySlug,
} from "@/lib/data/audio/apple-device-support";
import { appleDeviceSupportPool } from "@/lib/data/exams/pools/apple-device-support";
import { courses } from "@/lib/data/courses";
import { examPools } from "@/lib/data/exams/pools";

test("le pack audio a une piste par leçon du cours Apple Device Support", () => {
  const course = courses.find((item) => item.slug === "apple-device-support");
  assert.ok(course);
  const lessonSlugs = course.modules.flatMap((module) => module.lessons.map((lesson) => lesson.slug));
  assert.equal(appleDeviceSupportAudioLessons.length, lessonSlugs.length);
  assert.deepEqual(
    appleDeviceSupportAudioLessons.map((lesson) => lesson.slug),
    lessonSlugs,
  );
});

test("chaque piste se termine par un QCM de 4 questions sans lien", () => {
  for (const lesson of appleDeviceSupportAudioLessons) {
    assert.equal(lesson.quiz.length, 4, lesson.slug);
    const script = getSpokenScriptBySlug(lesson.slug);
    assert.ok(script);
    assert.match(script, /Nous terminons par le questionnaire de la leçon/);
    assert.match(script, /Voici le corrigé/);
    assert.doesNotMatch(script, /https?:\/\//);
    assert.doesNotMatch(script, /www\./);
    assert.doesNotMatch(script, /it-training\.apple\.com/);
    for (const item of lesson.quiz) {
      assert.equal(item.options.length, 4);
      assert.ok(item.correctIndex >= 0 && item.correctIndex <= 3);
      assert.ok(item.explanation.length > 12);
    }
  }
});

test("la banque Apple Device Support inclut les QCM audio", () => {
  const audioQuestions = getAppleDeviceSupportAudioQuestions();
  assert.equal(audioQuestions.length, 76);
  assert.ok(appleDeviceSupportPool.length >= 80);
  assert.equal(examPools["examen-apple-device-support"], appleDeviceSupportPool);
  const ids = appleDeviceSupportPool.map((question) => question.id);
  assert.equal(new Set(ids).size, ids.length);
});
