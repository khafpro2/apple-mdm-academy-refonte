"use client";

import { useActionState, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { sanitizeRedirectPath } from "@/lib/auth/url";
import { mapAuthCallbackError } from "@/lib/auth/errors";
import { PASSWORD_RULES, validatePassword } from "@/lib/auth/password-policy";
import { signInAction, signUpAction, type AuthActionState } from "@/app/actions/auth";
import { Button } from "@/components/ui";
import { trackEvent } from "@/lib/analytics/events";
import { DemoLoginButton } from "@/components/auth/demo-login-button";

type AuthMode = "login" | "signup";

const initialState: AuthActionState = { ok: true };

export function AuthForm({ mode }: { mode: AuthMode }) {
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirectPath(searchParams.get("redirect"));
  const urlError = searchParams.get("error");

  const action = mode === "login" ? signInAction : signUpAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(() => mapAuthCallbackError(urlError));

  const configured = isSupabaseConfigured();
  const isLogin = mode === "login";
  const passwordCheck = validatePassword(password);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientError(null);

    const formData = new FormData(event.currentTarget);

    if (!isLogin) {
      const pwd = String(formData.get("password") ?? "");
      const confirm = String(formData.get("confirmPassword") ?? "");
      const terms = formData.get("acceptTerms") === "on";

      const check = validatePassword(pwd);
      if (!check.valid) {
        setClientError(
          `Mot de passe invalide : ${check.failedRules.map((r) => r.label.toLowerCase()).join(", ")}.`
        );
        return;
      }

      if (pwd !== confirm) {
        setClientError("Les mots de passe ne correspondent pas.");
        return;
      }

      if (!terms) {
        setClientError("Vous devez accepter les conditions d'utilisation.");
        return;
      }

      trackEvent("inscription");
    } else {
      trackEvent("connexion");
    }

    formAction(formData);
  }

  const displayError = clientError ?? state?.error ?? null;

  if (!configured) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <p className="font-semibold">Configuration Supabase requise</p>
        <p className="mt-2">
          Copiez <code className="rounded bg-amber-100 px-1">.env.example</code> vers{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code> et renseignez{" "}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> et{" "}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
        </p>
        <p className="mt-3 text-xs text-amber-800/90">
          Consultez <code className="rounded bg-amber-100 px-1">docs/AUTH-SETUP.md</code> ou la{" "}
          <Link href="/status" className="font-semibold underline">page d&apos;état des services</Link>.
        </p>
      </div>
    );
  }

  const submitLabel = isLogin
    ? pending
      ? "Connexion en cours…"
      : "Se connecter"
    : pending
      ? "Création en cours…"
      : "Créer mon compte";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="redirect" value={redirect} />

      {!isLogin && (
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-ink">
            Nom complet
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            disabled={pending}
            className="mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
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
          name="email"
          type="email"
          required
          autoComplete="email"
          disabled={pending}
          className="mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
          placeholder="vous@entreprise.fr"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-ink">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete={isLogin ? "current-password" : "new-password"}
          disabled={pending}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
          placeholder="••••••••"
          aria-describedby={!isLogin ? "password-rules" : undefined}
        />
        {!isLogin && (
          <ul id="password-rules" className="mt-3 space-y-1.5 text-xs text-ink-secondary">
            {PASSWORD_RULES.map((rule) => {
              const passed = password.length > 0 && rule.test(password);
              return (
                <li key={rule.id} className={passed ? "text-emerald-700" : ""}>
                  <span aria-hidden="true">{passed ? "✓" : "○"}</span> {rule.label}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {!isLogin && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-ink">
            Confirmer le mot de passe
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            disabled={pending}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
            placeholder="••••••••"
          />
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <p className="mt-2 text-xs text-red-600">Les mots de passe ne correspondent pas.</p>
          )}
        </div>
      )}

      {!isLogin && (
        <label className="flex items-start gap-3 text-sm text-ink-secondary">
          <input
            type="checkbox"
            name="acceptTerms"
            required
            disabled={pending}
            className="mt-1 h-4 w-4 rounded border-border-light text-accent focus:ring-accent"
          />
          <span>
            J&apos;accepte les{" "}
            <Link href="/terms" className="font-semibold text-accent hover:underline" target="_blank">
              conditions d&apos;utilisation
            </Link>{" "}
            et la{" "}
            <Link href="/privacy" className="font-semibold text-accent hover:underline" target="_blank">
              politique de confidentialité
            </Link>
            .
          </span>
        </label>
      )}

      {isLogin && (
        <p className="text-right text-sm">
          <Link href="/auth/forgot-password" className="font-medium text-accent hover:underline">
            Mot de passe oublié ?
          </Link>
        </p>
      )}

      {displayError && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {displayError}
        </div>
      )}

      <Button type="submit" disabled={pending || (!isLogin && password.length > 0 && !passwordCheck.valid)} className="w-full" aria-busy={pending}>
        {submitLabel}
      </Button>

      {isLogin && <DemoLoginButton />}

      <p className="text-center text-sm text-ink-secondary">
        {isLogin ? (
          <>
            Pas encore de compte ?{" "}
            <Link
              href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`}
              className="font-semibold text-accent hover:underline"
            >
              S&apos;inscrire
            </Link>
          </>
        ) : (
          <>
            Déjà inscrit ?{" "}
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(redirect)}`}
              className="font-semibold text-accent hover:underline"
            >
              Se connecter
            </Link>
          </>
        )}
      </p>

      <p className="text-center text-xs text-ink-tertiary">
        <Link href="/" className="hover:text-accent hover:underline">
          ← Retour à l&apos;accueil
        </Link>
      </p>
    </form>
  );
}
