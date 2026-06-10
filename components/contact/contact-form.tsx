"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

type FormState = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      subject: (form.elements.namedItem("subject") as HTMLSelectElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      // Send to Supabase or email service
      // For now: simulate async send (replace with real endpoint)
      await new Promise((res) => setTimeout(res, 800));
      
      // If you have a Supabase table "contact_requests":
      // const { error } = await supabase.from("contact_requests").insert([data]);
      // if (error) throw error;
      
      setState("success");
    } catch (err) {
      setState("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Une erreur est survenue. Réessayez."
      );
    }
  }

  if (state === "success") {
    return (
      <div className="py-12 text-center">
        <span className="text-5xl" aria-hidden="true">✅</span>
        <h2 className="mt-4 text-xl font-bold text-ink">Message envoyé !</h2>
        <p className="mt-2 text-ink-secondary">
          Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 text-sm text-accent hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {state === "error" && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMsg || "Une erreur est survenue. Veuillez réessayer."}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink">
          Nom complet <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          required
          disabled={state === "loading"}
          className={inputClass}
          placeholder="Jean Dupont"
          autoComplete="name"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={state === "loading"}
          className={inputClass}
          placeholder="jean@entreprise.fr"
          autoComplete="email"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-ink">
          Sujet
        </label>
        <select
          id="subject"
          name="subject"
          disabled={state === "loading"}
          className={inputClass}
        >
          <option>Question générale</option>
          <option>Plan Entreprise</option>
          <option>Support technique</option>
          <option>Partenariat</option>
          <option>Autre</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink">
          Message <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          disabled={state === "loading"}
          className={`${inputClass} resize-none`}
          placeholder="Décrivez votre besoin..."
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={state === "loading"}
        aria-busy={state === "loading"}
      >
        {state === "loading" ? "Envoi en cours…" : "Envoyer le message"}
      </Button>

      <p className="text-center text-xs text-ink-tertiary">
        Nous répondons généralement sous 24 h ouvrées.
      </p>
    </form>
  );
}
