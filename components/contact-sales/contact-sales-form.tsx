"use client";

import { useState } from "react";
import Link from "next/link";
import { SectionHeading, ButtonLink } from "@/components/ui";

export function ContactSalesForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await new Promise((res) => setTimeout(res, 600));
      setSubmitted(true);
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8 lg:py-16">
      <SectionHeading
        label="Ventes"
        title="Contact commercial"
        description="Demandez un devis Entreprise pour votre équipe IT."
        align="center"
      />

      {submitted ? (
        <div className="mt-10 rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
          <h2 className="text-lg font-bold text-ink">Demande envoyée</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Notre équipe vous contactera sous 48 h ouvrées.
          </p>
          <ButtonLink href="/enterprise" className="mt-6">Retour Entreprise</ButtonLink>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-5 rounded-3xl border border-border-light bg-surface-elevated p-8">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-ink">Entreprise</label>
            <input id="company" name="company" required className="mt-1 w-full rounded-xl border border-border-light px-4 py-2.5 text-sm" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink">Nom</label>
              <input id="name" name="name" required className="mt-1 w-full rounded-xl border border-border-light px-4 py-2.5 text-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">Email pro</label>
              <input id="email" name="email" type="email" required className="mt-1 w-full rounded-xl border border-border-light px-4 py-2.5 text-sm" />
            </div>
          </div>
          <div>
            <label htmlFor="learners" className="block text-sm font-medium text-ink">Nombre d&apos;apprenants estimé</label>
            <select id="learners" name="learners" className="mt-1 w-full rounded-xl border border-border-light px-4 py-2.5 text-sm">
              <option value="5-10">5 – 10</option>
              <option value="11-25">11 – 25</option>
              <option value="26-50">26 – 50</option>
              <option value="50+">50+</option>
            </select>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink">Message</label>
            <textarea id="message" name="message" rows={4} className="mt-1 w-full rounded-xl border border-border-light px-4 py-2.5 text-sm" placeholder="Parlez-nous de votre projet MDM…" />
          </div>
          <button type="submit" className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white hover:opacity-90">
            Envoyer la demande
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-ink-secondary">
        <Link href="/pricing" className="text-accent hover:underline">Voir les offres individuelles</Link>
      </p>
    </div>
  );
}
