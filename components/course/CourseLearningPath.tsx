"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { CoursePilotVideo } from "@/src/lib/course-pilot-videos";
import { loadVideoProgress, subscribeVideoProgress } from "@/lib/video/progress-storage";
import { getLabProgress } from "@/lib/labs/progress";
import {
  isCoursePathStepDone,
  isLessonRead,
  subscribeReadingProgress,
} from "@/lib/course/reading-progress-storage";

export type PathStepStatus = "not-started" | "in-progress" | "completed" | "in-production";

type Props = {
  video: CoursePilotVideo;
  hasMp4: boolean;
};

const STEPS = [
  {
    id: "course",
    label: "Lire le cours",
    href: (video: CoursePilotVideo) =>
      video.relatedLessonSlug
        ? `/cours/${video.relatedLessonCourseSlug ?? video.courseSlug}/${video.relatedLessonSlug}`
        : `/cours/${video.courseSlug}`,
  },
  { id: "lab", label: "Faire le lab", href: (video: CoursePilotVideo) => `/labs/${video.labSlug}` },
  { id: "quiz", label: "Répondre au quiz", href: (video: CoursePilotVideo) => `/quiz/${video.quizSlug}` },
  { id: "video", label: "Voir la vidéo", href: (video: CoursePilotVideo) => `/videos/${video.slug}` },
] as const;

function statusLabel(status: PathStepStatus): string {
  switch (status) {
    case "completed":
      return "Terminé";
    case "in-progress":
      return "En cours";
    case "in-production":
      return "En production";
    default:
      return "Non commencé";
  }
}

function statusClass(status: PathStepStatus): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "in-production":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-surface text-ink-tertiary";
  }
}

export function CourseLearningPath({ video, hasMp4 }: Props) {
  const revision = useSyncExternalStore(
    (cb) => {
      const u1 = subscribeReadingProgress(cb);
      const u2 = subscribeVideoProgress(cb);
      return () => {
        u1();
        u2();
      };
    },
    () => Date.now(),
    () => 0
  );

  void revision;

  const lessonCourse = video.relatedLessonCourseSlug ?? video.courseSlug;
  const lessonSlug = video.relatedLessonSlug ?? video.slug;
  const courseRead = isLessonRead(lessonCourse, lessonSlug) || isCoursePathStepDone(video.slug, "course");
  const labProgress = typeof window !== "undefined" ? getLabProgress(video.labSlug) : null;
  const videoProgress = typeof window !== "undefined" ? loadVideoProgress(video.slug) : null;

  const statuses: PathStepStatus[] = [
    courseRead ? "completed" : "not-started",
    labProgress?.completed ? "completed" : labProgress?.started ? "in-progress" : "not-started",
    isCoursePathStepDone(video.slug, "quiz") ? "completed" : "not-started",
    hasMp4
      ? videoProgress?.completed
        ? "completed"
        : videoProgress?.currentSeconds
          ? "in-progress"
          : "not-started"
      : "in-production",
  ];

  return (
    <section className="rounded-[2rem] border border-border-light bg-surface p-6 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wide text-ink-tertiary">Parcours recommandé</h3>
      <p className="mt-1 text-base font-semibold text-ink">{video.title}</p>
      <ol className="mt-5 space-y-3">
        {STEPS.map((step, index) => {
          const status = statuses[index];
          return (
            <li key={step.id}>
              <Link
                href={step.href(video)}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border-light bg-surface-elevated px-4 py-3 transition hover:border-accent/30"
              >
                <span className="text-sm font-medium text-ink">
                  Étape {index + 1} · {step.label}
                </span>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(status)}`}>
                  {statusLabel(status)}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
