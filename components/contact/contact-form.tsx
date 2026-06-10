"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";

// ── Types ──────────────────────────────────────────────────────────────────
type FormState = "idle" | "loading" | "success" | "error";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  global?: string;
}

// ── Validation frontend ────────────────────────────────────────────────────
function validateForm(name: string, email: string, message: string): FormErrors {
  const errors: FormErrors = {};
  if (!name.trim() || name.trim().length < 2)
    errors.name = "Nom requis (2 caractères minimum).";
  if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    errors.email = "Adresse email invalide.";
  if (!message.trim() || message.trim().length < 10)
    errors.message = "Message trop court (10 caractères minimum).";
  if (message.trim().length > 5000)
    errors.message = "Message trop long (5000 caractères maximum).";
  return errors;
}

// ── Composant ─────────────────────────────────────────────────────────────
export function ContactForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FormErrors>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const name    = (form.elements.namedItem("name")    as HTMLInputElement).value;
    const email   = (form.elements.namedItem("email")   as HTMLInputElement).value;
    const subject = (form.elements.namedItem("subject") as HTMLSelectElement).value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement).value;
    const honeypot= (form.elements.namedItem("website") as HTMLInputElement).value;

    // Validation frontend
    const validationErrors = validateForm(name, email, message);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setState("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message, honeypot }),
      });

      const data = await res.json() as { ok?: boolean; error?: string; message?: string };

      if (!res.ok || !data.ok) {
        setErrors({ global: data.error ?? "Une erreur est survenue. Réessayez." });
        setState("error");
        return;
      }

      setState("success");
      formRef.current?.reset();
    } catch {
      setErrors({ global: "Erreur réseau. Vérifiez votre connexion et réessayez." });
      setState("error");
    }
  }

  function handleRetry() {
    setState("idle");
    setErrors({});
  }

  // ── Succès ────────────────────────────────────────────────────────────────
  if (state === "success") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10 text-center">
        <span className="text-5xl" aria-hidden="true">✅</span>
        <h2 className="mt-4 text-xl font-bold text-ink">Message envoyé !</h2>
        <p className="mt-2 text-ink-secondary">
          Merci pour votre message. Nous vous répondons généralement sous 24 h ouvrées.
        </p>
        <button
          type="button"
          onClick={handleRetry}
          className="mt-6 text-sm font-medium text-accent hover:underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  // ── Classes réutilisables ─────────────────────────────────────────────────
  const inputClass = (hasError: boolean) =>
    `mt-1.5 w-full rounded-xl border ${
      hasError ? "border-red-400 bg-red-50" : "border-border-light bg-surface"
    } px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60`;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* ── Erreur globale ── */}
      {state === "error" && errors.global && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errors.global}
        </div>
      )}

      {/* ── Champ piège anti-spam (invisible) ── */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Ne pas remplir</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {/* ── Nom ── */}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-ink">
          Nom complet <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          disabled={state === "loading"}
          autoComplete="name"
          aria-describedby={errors.name ? "name-error" : undefined}
          aria-invalid={!!errors.name}
          className={inputClass(!!errors.name)}
          placeholder="Jean Dupont"
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      {/* ── Email ── */}
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-ink">
          Email <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          disabled={state === "loading"}
          autoComplete="email"
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={!!errors.email}
          className={inputClass(!!errors.email)}
          placeholder="jean@entreprise.fr"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* ── Sujet ── */}
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-ink">
          Sujet
        </label>
        <select
          id="contact-subject"
          name="subject"
          disabled={state === "loading"}
          className={inputClass(false)}
        >
          <option>Question générale</option>
          <option>Plan Entreprise</option>
          <option>Support technique</option>
          <option>Partenariat</option>
          <option>Autre</option>
        </select>
      </div>

      {/* ── Message ── */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-ink">
          Message <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          disabled={state === "loading"}
          aria-describedby={errors.message ? "message-error" : undefined}
          aria-invalid={!!errors.message}
          className={`${inputClass(!!errors.message)} resize-none`}
          placeholder="Décrivez votre besoin en quelques lignes…"
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1 text-xs text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      {/* ── Submit ── */}
      <Button
        type="submit"
        className="w-full"
        disabled={state === "loading"}
        aria-busy={state === "loading"}
      >
        {state === "loading" ? "Envoi en cours…" : "Envoyer le message"}
      </Button>

      <p className="text-center text-xs text-ink-tertiary">
        Réponse garantie sous 24 h ouvrées · Pas de spam
      </p>
    </form>
  );
}
