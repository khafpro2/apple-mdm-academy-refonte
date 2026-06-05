"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/auth/url";
import { Button } from "@/components/ui";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-amber-800">
        Supabase non configuré — réinitialisation indisponible en local sans clés.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const redirectTo = getAuthCallbackUrl("/auth/reset-password");
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (authError) throw authError;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-900">
        <p className="font-semibold">Email envoyé</p>
        <p className="mt-2">
          Si un compte existe pour {email}, vous recevrez un lien de réinitialisation.
        </p>
        <Link href="/auth/login" className="mt-4 inline-block font-semibold text-accent hover:underline">
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="reset-email" className="block text-sm font-medium text-ink">Email</label>
        <input
          id="reset-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border-light px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Envoi…" : "Envoyer le lien"}
      </Button>
      <p className="text-center text-sm text-ink-secondary">
        <Link href="/auth/login" className="text-accent hover:underline">← Connexion</Link>
      </p>
    </form>
  );
}
