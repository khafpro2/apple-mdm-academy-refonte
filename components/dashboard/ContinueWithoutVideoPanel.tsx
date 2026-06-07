"use client";

import Link from "next/link";
import { getRecommendedVideoLessons } from "@/src/lib/video-storyboards";
import { getCourse } from "@/lib/data";
import { COURSE_PILOT_VIDEOS } from "@/src/lib/course-pilot-videos";

export function ContinueWithoutVideoPanel() {
  const pilotCourses = [...new Set(COURSE_PILOT_VIDEOS.map((v) => v.courseSlug))];
  const courseRecs = pilotCourses
    .map((slug) => getCourse(slug))
    .filter(Boolean)
    .slice(0, 3);

  const labRecs = COURSE_PILOT_VIDEOS.slice(0, 4);
  const videoModules = getRecommendedVideoLessons(3);

  return (
    <section className="rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-ink-tertiary">Sans vidéo MP4</p>
        <h2 className="text-lg font-bold text-ink">Continuer sans vidéo</h2>
        <p className="mt-1 text-sm text-ink-secondary">
          Les cours, labs, quiz et ressources sont prêts pendant la production des vidéos.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-bold text-ink">Cours à lire</h3>
          <ul className="mt-3 space-y-2">
            {courseRecs.map((course) =>
              course ? (
                <li key={course.slug}>
                  <Link href={`/cours/${course.slug}`} className="block rounded-xl bg-surface p-3 text-sm font-medium text-ink hover:text-accent">
                    {course.title}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink">Labs à faire</h3>
          <ul className="mt-3 space-y-2">
            {labRecs.map((v) => (
              <li key={v.slug}>
                <Link href={`/labs/${v.labSlug}`} className="block rounded-xl bg-surface p-3 text-sm font-medium text-ink hover:text-accent">
                  Lab · {v.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink">Quiz disponibles</h3>
          <ul className="mt-3 space-y-2">
            {[...new Set(COURSE_PILOT_VIDEOS.map((v) => v.quizSlug))].slice(0, 4).map((quizSlug) => (
              <li key={quizSlug}>
                <Link href={`/quiz/${quizSlug}`} className="block rounded-xl bg-surface p-3 text-sm font-medium text-ink hover:text-accent">
                  {quizSlug.replace(/-/g, " ")}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-ink">Ressources à télécharger</h3>
          <ul className="mt-3 space-y-2">
            {COURSE_PILOT_VIDEOS.slice(0, 4).map((v) => (
              <li key={v.resourceSlug}>
                <Link
                  href={`/resources/${v.resourceSlug}`}
                  className="block rounded-xl bg-surface p-3 text-sm font-medium text-ink hover:text-accent"
                >
                  {v.resourceSlug.replace(/-/g, " ")}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-bold text-ink">Modules vidéo (storyboard + script)</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {videoModules.map((m) => (
            <Link key={m.slug} href={`/videos/${m.slug}`} className="rounded-xl border border-border-light bg-surface p-3 text-xs font-medium text-ink hover:border-accent/30">
              {m.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
