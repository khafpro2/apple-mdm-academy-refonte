import type { Question } from "@/lib/types";

export type AudioLessonQuizItem = {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
};

export type AudioLesson = {
  slug: string;
  trackNumber: number;
  title: string;
  module: string;
  courseSlug: "apple-device-support";
  durationLabel: string;
  officialFocus: string;
  summary: string;
  narration: string[];
  quiz: AudioLessonQuizItem[];
};

export type AudioLessonPublic = Omit<AudioLesson, "narration"> & {
  audioSrc: string;
  downloadName: string;
  transcript: string;
};

export function audioSrcForSlug(slug: string): string {
  return `/audio/apple-device-support/${slug}.mp3`;
}

export function audioDownloadName(trackNumber: number, slug: string): string {
  const n = String(trackNumber).padStart(2, "0");
  return `${n}-${slug}.mp3`;
}

export function toQuestion(lesson: AudioLesson, item: AudioLessonQuizItem): Question {
  return {
    id: item.id,
    text: item.text,
    options: [...item.options],
    correctIndex: item.correctIndex,
    explanation: item.explanation,
    difficulty: "medium",
    domain: lesson.module,
    relatedModuleSlug: lesson.slug,
    moduleHref: `/cours/${lesson.courseSlug}/${lesson.slug}`,
    moduleLabel: lesson.title,
  };
}

function letterFor(index: number): string {
  return ["A", "B", "C", "D"][index] ?? "?";
}

export function buildSpokenScript(lesson: AudioLesson): string {
  const intro = [
    `Piste ${lesson.trackNumber}. ${lesson.title}.`,
    "Préparation à la recertification Apple Device Support.",
    "Support de niveau un et deux, sur iPhone, iPad et Mac.",
    "Cette piste est claire, sans lien, et se termine par un questionnaire.",
  ];

  const quizIntro = [
    "Nous terminons par le questionnaire de la leçon.",
    "Quatre questions. Notez A, B, C ou D pour chacune.",
    "Les corrigés arrivent après la dernière question.",
  ];

  const questions = lesson.quiz.flatMap((item, index) => [
    `Question ${index + 1}. ${item.text}`,
    ...item.options.map((option, optionIndex) => `${letterFor(optionIndex)}. ${option}.`),
  ]);

  const answers = [
    "Voici le corrigé.",
    ...lesson.quiz.map((item, index) => {
      const letter = letterFor(item.correctIndex);
      return `Question ${index + 1}. La bonne réponse est ${letter}. ${item.explanation}`;
    }),
  ];

  const outro = [
    `Fin de la piste ${lesson.trackNumber}, ${lesson.title}.`,
    "Passez à la leçon suivante quand vous êtes prêt.",
  ];

  return [...intro, ...lesson.narration, ...quizIntro, ...questions, ...answers, ...outro]
    .map((part) => part.trim())
    .filter(Boolean)
    .join("\n\n");
}
