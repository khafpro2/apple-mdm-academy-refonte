"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { getAuthCallbackUrl, sanitizeRedirectPath } from "@/lib/auth/url";
import { Button } from "@/components/ui";
import { DemoLoginButton } from "@/components/auth/demo-login-button";
import { trackEvent } from "@/lib/analytics/events";

type AuthMode = "login" | "signup";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirectPath(searchParams.get("redirect"));
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => {
    if (urlError === "auth_callback_failed") return "Échec de la connexion. Réessayez.";
    if (urlError === "supabase_not_configured") return "Supabase non configuré sur le serveur.";
    return null;
  });
  const [message, setMessage] = useState<string | null>(null);

  const configured = isSupabaseConfigured();
  const isLogin = mode === "login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) {
      setError("Supabase non configuré. Ajoutez vos clés dans .env.local");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();

      if (isLogin) {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        trackEvent("connexion");
        router.push(redirect);
        router.refresh();
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: getAuthCallbackUrl(redirect),
          },
        });
        if (authError) throw authError;

        if (data.session) {
          trackEvent("inscription");
          router.push(redirect);
          router.refresh();
          return;
        }

        trackEvent("inscription");

        setMessage(
          "Compte créé ! Vérifiez votre email de confirmation, ou connectez-vous si la confirmation est désactivée dans Supabase."
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  if (!configured) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-semibold">Configuration Supabase requise</p>
        <p className="mt-2">
          Copiez <code className="rounded bg-amber-100 px-1">.env.example</code> vers{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code> et renseignez vos clés Supabase.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isLogin && (
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-ink">
            Nom complet
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Jean Dupont"
          />
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="vous@entreprise.fr"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="••••••••"
        />
      </div>

      {isLogin && (
        <p className="text-right text-sm">
          <Link href="/auth/forgot-password" className="font-medium text-accent hover:underline">
            Mot de passe oublié ?
          </Link>
        </p>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      {message && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Chargement…" : isLogin ? "Se connecter" : "Créer mon compte"}
      </Button>

      {isLogin && <DemoLoginButton />}

      <p className="text-center text-sm text-ink-secondary">
        {isLogin ? (
          <>
            Pas encore de compte ?{" "}
            <Link href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-accent hover:underline">
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <>
            Déjà inscrit ?{" "}
            <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="font-semibold text-accent hover:underline">
              Se connecter
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
