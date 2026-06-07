"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import type { LessonStatus } from "@/lib/types";
import { LessonStatusBadge, LessonStatusIcon } from "@/components/course/course-ui";
import { LabLessonLink } from "@/components/labs/lab-lesson-link";
import { isLessonRead, subscribeReadingProgress } from "@/lib/course/reading-progress-storage";

type Props = {
  courseSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  href: string;
  duration: string;
  points: number;
  status: LessonStatus;
  labSlug?: string;
};

export function CourseLessonListItem({
  courseSlug,
  lessonSlug,
  lessonTitle,
  href,
  duration,
  points,
  status,
  labSlug,
}: Props) {
  const revision = useSyncExternalStore(subscribeReadingProgress, () => Date.now(), () => 0);
  void revision;

  const read = typeof window !== "undefined" ? isLessonRead(courseSlug, lessonSlug) : false;
  const displayStatus: LessonStatus = read ? "termine" : status;

  return (
    <li>
      <div className="rounded-2xl border border-border-light bg-surface px-4 py-4 transition hover:border-accent/30 hover:shadow-md">
        <Link href={href} className="group flex items-center gap-4">
          <LessonStatusIcon status={displayStatus} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-ink group-hover:text-accent">{lessonTitle}</span>
              <LessonStatusBadge status={displayStatus} />
              {read && (
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-800">
                  Lu
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-ink-tertiary">
              {duration} · {points} points
            </p>
          </div>
          <span className="hidden text-accent sm:inline" aria-hidden="true">
            →
          </span>
        </Link>
        {labSlug && <LabLessonLink labSlug={labSlug} compact />}
      </div>
    </li>
  );
}
