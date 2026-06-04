"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="py-12 text-center">
        <span className="text-4xl" aria-hidden="true">✅</span>
        <h2 className="mt-4 text-xl font-bold text-ink">Message envoyé !</h2>
        <p className="mt-2 text-ink-secondary">Nous vous répondrons dans les plus brefs délais.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink">Nom complet</label>
        <input id="name" name="name" required className="mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder="Jean Dupont" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">Email</label>
        <input id="email" name="email" type="email" required className="mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder="jean@entreprise.fr" />
      </div>
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-ink">Sujet</label>
        <select id="subject" name="subject" className="mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20">
          <option>Question générale</option>
          <option>Plan Entreprise</option>
          <option>Support technique</option>
          <option>Partenariat</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink">Message</label>
        <textarea id="message" name="message" required rows={5} className="mt-2 w-full resize-none rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20" placeholder="Décrivez votre besoin..." />
      </div>
      <Button type="submit" className="w-full">Envoyer le message</Button>
      <p className="text-center text-xs text-ink-tertiary">Intégration Supabase / email — formulaire mockup</p>
    </form>
  );
}
