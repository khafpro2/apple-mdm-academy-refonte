"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui";

const STATS = [
  { value: "2 400+", label: "Apprenants actifs", icon: "👥" },
  { value: "93%",    label: "Taux de réussite",  icon: "🎯" },
  { value: "9",      label: "Parcours certifiants", icon: "📚" },
  { value: "40+",    label: "Labs pratiques",    icon: "🔧" },
  { value: "120+",   label: "Heures de contenu", icon: "⏱️" },
  { value: "4.9/5",  label: "Satisfaction",      icon: "⭐" },
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
        <SectionHeading label="Impact" title="Des résultats mesurables" align="center" />
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
