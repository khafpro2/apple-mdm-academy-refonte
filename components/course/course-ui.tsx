import Link from "next/link";
import type { ReactNode } from "react";
import type { LessonStatus } from "@/lib/types";
import { formatLessonStatus } from "@/lib/course/helpers";

const styles: Record<LessonStatus, string> = {
  "en-cours": "bg-blue-50 text-blue-700 ring-blue-100",
  termine: "bg-green-50 text-green-700 ring-green-100",
  verrouille: "bg-gray-100 text-ink-tertiary ring-gray-200",
};

export function LessonStatusBadge({ status }: { status: LessonStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}
    >
      {formatLessonStatus(status)}
    </span>
  );
}

export function LessonStatusIcon({ status }: { status: LessonStatus }) {
  const icon =
    status === "termine" ? "✓" : status === "en-cours" ? "●" : "🔒";

  return (
    <span
      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
        status === "termine"
          ? "bg-green-100 text-green-700"
          : status === "en-cours"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-ink-tertiary"
      }`}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}

type LessonNavProps = {
  courseSlug: string;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
  finalQuizHref?: string;
  isLastLesson: boolean;
};

export function LessonNavigation({
  courseSlug,
  prev,
  next,
  finalQuizHref,
  isLastLesson,
}: LessonNavProps) {
  return (
    <nav
      className="mt-12 flex flex-col gap-4 border-t border-border-light pt-8 sm:flex-row sm:items-center sm:justify-between"
      aria-label="Navigation entre les leçons"
    >
      {prev ? (
        <Link
          href={`/cours/${courseSlug}/${prev.slug}`}
          className="group flex max-w-md flex-col rounded-2xl border border-border-light bg-surface-elevated p-4 shadow-sm transition hover:border-accent/30 hover:shadow-md"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
            ← Leçon précédente
          </span>
          <span className="mt-1 text-sm font-semibold text-ink group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="hidden sm:block sm:flex-1" />
      )}

      {isLastLesson && finalQuizHref ? (
        <Link
          href={finalQuizHref}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-hover"
        >
          Quiz final →
        </Link>
      ) : next ? (
        <Link
          href={`/cours/${courseSlug}/${next.slug}`}
          className="group flex max-w-md flex-col rounded-2xl border border-border-light bg-surface-elevated p-4 text-right shadow-sm transition hover:border-accent/30 hover:shadow-md sm:ml-auto"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
            Leçon suivante →
          </span>
          <span className="mt-1 text-sm font-semibold text-ink group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}

export function CourseProgressBar({
  percent,
  label = "Progression du cours",
}: {
  percent: number;
  label?: string;
}) {
  const safe = Math.min(100, Math.max(0, percent));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-ink-secondary">{label}</span>
        <span className="font-semibold tabular-nums text-ink">{safe} %</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-border-light">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-blue-400 transition-all duration-700 ease-out"
          style={{ width: `${safe}%` }}
          role="progressbar"
          aria-valuenow={safe}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
}

export function CourseMetaGrid({
  duration,
  level,
  certification,
  points,
}: {
  duration: string;
  level: string;
  certification: string;
  points: number;
}) {
  const items = [
    { label: "Durée", value: duration, icon: "⏱" },
    { label: "Niveau", value: level, icon: "📈" },
    { label: "Certification", value: certification, icon: "🎓" },
    { label: "Points", value: `${points} pts`, icon: "⭐" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-border-light bg-surface-elevated p-4 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
            {item.icon} {item.label}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function ContentSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-bold tracking-tight text-ink md:text-2xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
