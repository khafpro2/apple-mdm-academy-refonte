"use client";

import { useState } from "react";
import Link from "next/link";
import { LabLessonLink } from "@/components/labs/lab-lesson-link";
import { LessonStatusBadge, LessonStatusIcon } from "@/components/course/course-ui";
import type { LessonStatus } from "@/lib/types";

type CourseUnitLesson = {
  slug: string;
  title: string;
  duration: string;
  points: number;
  status: LessonStatus;
  labSlug?: string;
};

type CourseUnitModule = {
  title: string;
  lessons: CourseUnitLesson[];
};

type CourseUnitsPanelProps = {
  courseSlug: string;
  modules: CourseUnitModule[];
};

export function CourseUnitsPanel({ courseSlug, modules }: CourseUnitsPanelProps) {
  const [open, setOpen] = useState(false);
  const lessonCount = modules.reduce((count, mod) => count + mod.lessons.length, 0);

  function closeOnMobile() {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      setOpen(false);
    }
  }

  return (
    <section className="mt-12 rounded-[2rem] border border-border-light bg-surface-elevated shadow-sm md:border-0 md:bg-transparent md:shadow-none">
      <div className="flex items-center justify-between gap-3 px-4 py-4 md:px-0 md:py-0">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-ink">Unités du parcours</h2>
          <p className="mt-1 text-xs text-ink-tertiary">
            {modules.length} modules · {lessonCount} leçons
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-border-light bg-white px-4 py-2 text-sm font-semibold text-ink-secondary shadow-sm transition hover:border-accent/30 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
          aria-expanded={open}
          aria-controls="course-units-panel"
        >
          {open ? "Masquer les unités" : "Afficher les unités"}
        </button>
      </div>

      <div
        id="course-units-panel"
        className={[
          "border-t border-border-light md:block md:border-0",
          open ? "block" : "hidden",
        ].join(" ")}
      >
        <div className="max-h-[58vh] overflow-y-auto overscroll-contain px-4 pb-4 pt-2 md:max-h-none md:overflow-visible md:px-0 md:pb-0 md:pt-8">
          <div className="space-y-5 md:space-y-8">
            {modules.map((mod, moduleIndex) => (
              <section
                key={mod.title}
                className="rounded-3xl border border-border-light bg-surface-elevated p-4 shadow-sm md:rounded-[2rem] md:p-8"
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
                      Module {moduleIndex + 1}
                    </p>
                    <h3 className="mt-1 text-base font-bold text-ink md:text-2xl">{mod.title}</h3>
                  </div>
                </div>

                <ul className="mt-4 space-y-3 md:mt-6">
                  {mod.lessons.map((lesson) => {
                    const href = `/cours/${courseSlug}/${lesson.slug}`;

                    return (
                      <li key={lesson.slug}>
                        <div className="rounded-2xl border border-border-light bg-surface px-3 py-3 transition hover:border-accent/30 hover:shadow-md md:px-4 md:py-4">
                          <Link
                            href={href}
                            onClick={closeOnMobile}
                            className="group flex items-center gap-3 md:gap-4"
                          >
                            <LessonStatusIcon status={lesson.status} />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-ink group-hover:text-accent md:text-base">
                                  {lesson.title}
                                </span>
                                <LessonStatusBadge status={lesson.status} />
                              </div>
                              <p className="mt-1 text-xs text-ink-tertiary">
                                {lesson.duration} · {lesson.points} points
                              </p>
                            </div>
                            <span className="hidden text-accent sm:inline" aria-hidden="true">
                              →
                            </span>
                          </Link>
                          {lesson.labSlug && <LabLessonLink labSlug={lesson.labSlug} compact />}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
