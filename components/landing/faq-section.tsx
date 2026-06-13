"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui";

const FAQ_ITEMS = [
  {
    q: "Puis-je commencer avec un premier parcours ?",
    a: "Oui. Le plan Free donne accès aux fondamentaux Apple MDM, aux premiers modules et à un aperçu des labs. Passez au plan Pro pour débloquer examens, labs avancés et certificats.",
  },
  {
    q: "Les examens blancs ressemblent-ils aux vraies certifications ?",
    a: "Nos examens sont calibrés sur les domaines officiels Apple, Jamf et Microsoft. Ils ne remplacent pas Pearson VUE ou Jamf Training, mais préparent efficacement.",
  },
  {
    q: "Proposez-vous des licences entreprise ?",
    a: "Oui. Le plan Enterprise inclut dashboard admin, reporting équipes, export CSV/PDF et support prioritaire. Contactez-nous pour un devis personnalisé.",
  },
  {
    q: "Les centres de formation peuvent-ils utiliser la plateforme ?",
    a: "Le centre de formation (/training-center) permet de gérer des groupes, suivre les apprenants et exporter les certifications obtenues.",
  },
  {
    q: "Une application mobile est-elle prévue ?",
    a: "Oui — roadmap V2 avec app Expo/React Native pour progression, vidéos, examens et notifications push. Consultez /mobile-roadmap.",
  },
  {
    q: "L'assistant IA est-il disponible ?",
    a: "Apple MDM Assistant (/assistant) répond aux questions, explique les concepts et recommande des labs. Architecture IA préparée pour intégration LLM.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto max-w-3xl px-6 py-20 lg:px-8 lg:py-28">
      <SectionHeading label="FAQ" title="Questions fréquentes" align="center" />
      <div className="mt-10 divide-y divide-border-light rounded-2xl border border-border-light bg-surface-elevated">
        {FAQ_ITEMS.map((item, i) => (
          <div key={item.q}>
            <button
              type="button"
              className="flex w-full items-center justify-between px-6 py-5 text-left"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              <span className="font-semibold text-ink">{item.q}</span>
              <span className="ml-4 shrink-0 text-xl text-ink-tertiary">{open === i ? "−" : "+"}</span>
            </button>
            {open === i && (
              <p className="px-6 pb-5 text-sm leading-relaxed text-ink-secondary">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
