"use client";

import { useState } from "react";
import { SectionHeading, Card } from "@/components/ui";
import {
  testimonials,
  testimonialCategoryLabels,
  type TestimonialCategory,
} from "@/lib/data/testimonials";

const categories: TestimonialCategory[] = ["learner", "apple-admin", "jamf-consultant", "it-manager"];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-amber-400" : "text-border"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [active, setActive] = useState<TestimonialCategory>("learner");
  const filtered = testimonials.filter((t) => t.category === active);

  return (
    <section className="bg-surface-elevated py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <SectionHeading
          label="Témoignages"
          title="Ils nous font confiance"
          description="Apprenants, administrateurs Apple, consultants Jamf et responsables IT."
          align="center"
        />
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                active === cat
                  ? "bg-ink text-white"
                  : "border border-border-light bg-surface text-ink-secondary hover:text-ink"
              }`}
            >
              {testimonialCategoryLabels[cat]}
            </button>
          ))}
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <Card key={t.id}>
              <Stars rating={t.rating} />
              <p className="mt-4 text-sm leading-relaxed text-ink-secondary">&ldquo;{t.comment}&rdquo;</p>
              <div className="mt-6 border-t border-border-light pt-4">
                <p className="font-semibold text-ink">{t.author}</p>
                <p className="text-sm text-ink-tertiary">
                  {t.role} · {t.company}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
