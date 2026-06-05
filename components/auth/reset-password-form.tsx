"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { Button } from "@/components/ui";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-amber-800">Supabase non configuré.</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      setError("Minimum 6 caractères.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.updateUser({ password });
      if (authError) throw authError;
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de mettre à jour le mot de passe.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-900">
        Mot de passe mis à jour. Redirection vers le dashboard…
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-ink">Nouveau mot de passe</label>
        <input
          id="new-password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border-light px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-ink">Confirmer</label>
        <input
          id="confirm-password"
          type="password"
          required
          minLength={6}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border-light px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Mise à jour…" : "Enregistrer"}
      </Button>
      <p className="text-center text-sm text-ink-secondary">
        <Link href="/auth/login" className="text-accent hover:underline">Connexion</Link>
      </p>
    </form>
  );
}
