"use client";

import { useState } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui";

export function SupportContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <h3 className="font-bold text-ink">Message envoyé</h3>
        <p className="mt-2 text-sm text-ink-secondary">Notre équipe vous répondra sous 48 h ouvrées.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border-light bg-surface-elevated p-6">
      <div>
        <label htmlFor="support-email" className="block text-sm font-medium text-ink">Email</label>
        <input id="support-email" name="email" type="email" required className="mt-1 w-full rounded-xl border border-border-light px-4 py-2.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" />
      </div>
      <div>
        <label htmlFor="support-topic" className="block text-sm font-medium text-ink">Sujet</label>
        <select id="support-topic" name="topic" className="mt-1 w-full rounded-xl border border-border-light px-4 py-2.5 text-sm">
          <option value="auth">Connexion / Supabase Auth</option>
          <option value="payment">Paiement / Abonnement</option>
          <option value="certificate">Certificat PDF</option>
          <option value="course">Cours / Labs</option>
          <option value="other">Autre</option>
        </select>
      </div>
      <div>
        <label htmlFor="support-message" className="block text-sm font-medium text-ink">Message</label>
        <textarea id="support-message" name="message" rows={4} required className="mt-1 w-full rounded-xl border border-border-light px-4 py-2.5 text-sm" placeholder="Décrivez votre problème…" />
      </div>
      <button type="submit" className="w-full rounded-full bg-accent py-3 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        Envoyer
      </button>
    </form>
  );
}

export function SupportFaq() {
  const faqs = [
    {
      q: "Je ne reçois pas l'email de confirmation",
      a: "Vérifiez vos spams. Si la confirmation email est activée dans Supabase, cliquez sur le lien reçu. Sinon, connectez-vous directement.",
    },
    {
      q: "Mon abonnement Pro n'est pas actif",
      a: "Vérifiez /account/billing. En mode démo, l'activation est locale. Avec Stripe, attendez la confirmation du webhook.",
    },
    {
      q: "Comment télécharger mon certificat ?",
      a: "Passez l'examen blanc avec succès (score ≥ seuil), puis téléchargez le PDF depuis votre dashboard ou la page de résultats.",
    },
    {
      q: "Un lab ne se valide pas",
      a: "Cochez tous les prérequis, validez chaque étape, puis cliquez sur « Terminer le lab ». Connectez-vous pour sauvegarder.",
    },
    {
      q: "Contenu réservé aux membres Pro",
      a: <>Consultez <Link href="/pricing" className="text-accent hover:underline">/pricing</Link> pour passer à Pro.</>,
    },
  ];

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <details key={faq.q} className="group rounded-2xl border border-border-light bg-surface-elevated p-5">
          <summary className="cursor-pointer list-none font-semibold text-ink marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
            {faq.q}
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
