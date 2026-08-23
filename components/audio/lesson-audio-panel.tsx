import Link from "next/link";
import { AudioLessonPlayer } from "@/components/audio/audio-lesson-player";
import { AudioLessonQuiz } from "@/components/audio/audio-lesson-quiz";
import type { AudioLessonPublic } from "@/lib/data/audio/types";

type LessonAudioPanelProps = {
  lesson: AudioLessonPublic;
  showQuiz?: boolean;
};

export function LessonAudioPanel({ lesson, showQuiz = true }: LessonAudioPanelProps) {
  return (
    <div className="mt-6 space-y-6">
      <AudioLessonPlayer lesson={lesson} />
      <p className="text-sm leading-relaxed text-ink-secondary">{lesson.summary}</p>
      {showQuiz && <AudioLessonQuiz quiz={lesson.quiz} />}
      <p className="text-sm text-ink-tertiary">
        Piste {String(lesson.trackNumber).padStart(2, "0")} du pack{" "}
        <Link href="/audio/apple-device-support" className="font-semibold text-accent hover:underline">
          audio Apple Device Support
        </Link>
        .
      </p>
    </div>
  );
}
