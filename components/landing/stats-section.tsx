"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui";
import { courses, getExams, getQuizList, getVisibleTracks, isTrackVisible, labs } from "@/lib/data";

const visibleTracks = getVisibleTracks();
const visibleCourses = courses.filter((course) => isTrackVisible(course.trackSlug));
const visibleLabs = labs.filter((lab) => isTrackVisible(lab.trackSlug));
const visibleQuizzes = getQuizList().filter((quiz) => isTrackVisible(quiz.trackSlug));
const visibleExams = getExams().filter((quiz) => isTrackVisible(quiz.trackSlug));
const moduleCount = visibleCourses.reduce((total, course) => total + course.modules.length, 0);
const lessonCount = visibleCourses.reduce(
  (total, course) => total + course.modules.reduce((courseTotal, module) => courseTotal + module.lessons.length, 0),
  0,
);

const STATS = [
  { value: String(visibleTracks.length), label: "Parcours publics", icon: "📚" },
  { value: String(visibleCourses.length), label: "Cours", icon: "🧭" },
  { value: String(moduleCount), label: "Modules", icon: "🧩" },
  { value: String(lessonCount), label: "Leçons", icon: "📖" },
  { value: String(visibleQuizzes.length), label: "Quiz", icon: "✅" },
  { value: String(visibleLabs.length + visibleExams.length), label: "Labs / examens", icon: "🔧" },
];

export function StatsSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-y border-border-light bg-surface-elevated py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading label="Catalogue" title="Contenu disponible" align="center" />
        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="text-center transition-all duration-700"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <span className="text-2xl" aria-hidden="true">{s.icon}</span>
              <p className="mt-1 text-3xl font-bold tracking-tight text-ink md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-ink-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
