import { identityMdmAudioLessons } from "@/lib/data/audio/lessons/identity-mdm";
import { iosAudioLessons } from "@/lib/data/audio/lessons/ios";
import { ipadosAudioLessons } from "@/lib/data/audio/lessons/ipados";
import { macosAudioLessons } from "@/lib/data/audio/lessons/macos";
import {
  audioDownloadName,
  audioSrcForSlug,
  buildSpokenScript,
  toQuestion,
  type AudioLesson,
  type AudioLessonPublic,
} from "@/lib/data/audio/types";
import type { Question } from "@/lib/types";

export const APPLE_DEVICE_SUPPORT_AUDIO_PACK = {
  slug: "apple-device-support",
  title: "Audio — Apple Device Support",
  examTitle: "Apple Device Support",
  description:
    "Dix-neuf pistes MP3 pour la recertification Apple Device Support. Une piste claire par leçon, sans liens, chaque piste se termine par un QCM.",
  zipSrc: "/audio/apple-device-support/apple-device-support-recertification.zip",
  zipName: "apple-device-support-recertification.zip",
} as const;

export const appleDeviceSupportAudioLessons: AudioLesson[] = [
  ...macosAudioLessons,
  ...iosAudioLessons,
  ...ipadosAudioLessons,
  ...identityMdmAudioLessons,
].sort((a, b) => a.trackNumber - b.trackNumber);

export function getAppleDeviceSupportAudioLesson(slug: string): AudioLesson | undefined {
  return appleDeviceSupportAudioLessons.find((lesson) => lesson.slug === slug);
}

export function getAppleDeviceSupportAudioLessonByCourseSlug(lessonSlug: string): AudioLesson | undefined {
  return getAppleDeviceSupportAudioLesson(lessonSlug);
}

export function toPublicAudioLesson(lesson: AudioLesson): AudioLessonPublic {
  return {
    slug: lesson.slug,
    trackNumber: lesson.trackNumber,
    title: lesson.title,
    module: lesson.module,
    courseSlug: lesson.courseSlug,
    durationLabel: lesson.durationLabel,
    officialFocus: lesson.officialFocus,
    summary: lesson.summary,
    quiz: lesson.quiz,
    audioSrc: audioSrcForSlug(lesson.slug),
    downloadName: audioDownloadName(lesson.trackNumber, lesson.slug),
    transcript: buildSpokenScript(lesson),
  };
}

export function getPublicAppleDeviceSupportAudioLessons(): AudioLessonPublic[] {
  return appleDeviceSupportAudioLessons.map(toPublicAudioLesson);
}

export function getPublicAppleDeviceSupportAudioLesson(slug: string): AudioLessonPublic | undefined {
  const lesson = getAppleDeviceSupportAudioLesson(slug);
  return lesson ? toPublicAudioLesson(lesson) : undefined;
}

export function getAppleDeviceSupportAudioQuestions(): Question[] {
  return appleDeviceSupportAudioLessons.flatMap((lesson) => lesson.quiz.map((item) => toQuestion(lesson, item)));
}

export function getSpokenScriptBySlug(slug: string): string | undefined {
  const lesson = getAppleDeviceSupportAudioLesson(slug);
  return lesson ? buildSpokenScript(lesson) : undefined;
}

export function getAudioModules(): { title: string; lessons: AudioLessonPublic[] }[] {
  const groups = new Map<string, AudioLessonPublic[]>();
  for (const lesson of getPublicAppleDeviceSupportAudioLessons()) {
    const list = groups.get(lesson.module) ?? [];
    list.push(lesson);
    groups.set(lesson.module, list);
  }
  return Array.from(groups.entries()).map(([title, lessons]) => ({ title, lessons }));
}
