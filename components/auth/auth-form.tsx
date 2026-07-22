"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
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
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

type AuthMode = "login" | "signup";

const initialState: AuthActionState = { ok: true };

const FIELD_IDS = {
  fullName: "fullName",
  email: "email",
  password: "password",
  confirmPassword: "confirmPassword",
} as const;

export function AuthForm({ mode }: { mode: AuthMode }) {
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirectPath(searchParams.get("redirect"));
  const urlError = searchParams.get("error");

  const action = mode === "login" ? signInAction : signUpAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(() => mapAuthCallbackError(urlError));
  const [clientField, setClientField] = useState<string | undefined>();
  const formRef = useRef<HTMLFormElement>(null);
  const trackedRef = useRef(false);

  const configured = isSupabaseConfigured();
  const isLogin = mode === "login";
  const passwordCheck = validatePassword(password);

  const displayError = clientError ?? state?.error ?? null;
  const errorField = clientField ?? state?.field;

  useEffect(() => {
    if (!displayError || !formRef.current) return;
    const fieldId = errorField && errorField in FIELD_IDS ? FIELD_IDS[errorField as keyof typeof FIELD_IDS] : null;
    const target = fieldId ? formRef.current.querySelector<HTMLElement>(`#${fieldId}`) : null;
    (target ?? formRef.current.querySelector<HTMLElement>("[role=alert]"))?.focus();
  }, [displayError, errorField]);

  useEffect(() => {
    if (pending) trackedRef.current = false;
  }, [pending]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setClientError(null);
    setClientField(undefined);

    const formData = new FormData(event.currentTarget);

    if (!isLogin) {
      const pwd = String(formData.get("password") ?? "");
      const confirm = String(formData.get("confirmPassword") ?? "");
      const terms = formData.get("acceptTerms") === "on";

      const check = validatePassword(pwd);
      if (!check.valid) {
        event.preventDefault();
        setClientError(
          `Mot de passe invalide : ${check.failedRules.map((r) => r.label.toLowerCase()).join(", ")}.`
        );
        setClientField("password");
        return;
      }

      if (pwd !== confirm) {
        event.preventDefault();
        setClientError("Les mots de passe ne correspondent pas.");
        setClientField("confirmPassword");
        return;
      }

      if (!terms) {
        event.preventDefault();
        setClientError("Vous devez accepter les conditions d'utilisation.");
        setClientField("acceptTerms");
        return;
      }
    }

    if (!trackedRef.current) {
      trackEvent(isLogin ? "connexion" : "inscription");
      trackedRef.current = true;
    }
  }

  if (!configured) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900" role="alert">
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
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
    >
      <input type="hidden" name="redirect" value={redirect} />

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {pending ? (isLogin ? "Connexion en cours" : "Création du compte en cours") : ""}
      </div>

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
            aria-invalid={errorField === "fullName"}
            aria-describedby={errorField === "fullName" ? "form-error" : undefined}
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
          aria-invalid={errorField === "email"}
          aria-describedby={errorField === "email" ? "form-error" : undefined}
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
          onInput={(e) => setPassword(e.currentTarget.value)}
          aria-invalid={errorField === "password"}
          aria-describedby={!isLogin ? "password-rules" : errorField === "password" ? "form-error" : undefined}
          className="mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
          placeholder="••••••••"
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
            onInput={(e) => setConfirmPassword(e.currentTarget.value)}
            aria-invalid={
              errorField === "confirmPassword" || (confirmPassword.length > 0 && password !== confirmPassword)
            }
            aria-describedby={
              confirmPassword.length > 0 && password !== confirmPassword
                ? "confirm-password-hint"
                : errorField === "confirmPassword"
                  ? "form-error"
                  : undefined
            }
            className="mt-2 w-full rounded-xl border border-border-light bg-surface px-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
            placeholder="••••••••"
          />
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <p id="confirm-password-hint" className="mt-2 text-xs text-red-600">
              Les mots de passe ne correspondent pas.
            </p>
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
            aria-invalid={errorField === "acceptTerms"}
            aria-describedby={errorField === "acceptTerms" ? "form-error" : undefined}
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
        <div
          id="form-error"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
          tabIndex={-1}
        >
          {displayError}
        </div>
      )}

      <Button
        type="submit"
        disabled={pending || (!isLogin && password.length > 0 && !passwordCheck.valid)}
        className="w-full"
        aria-busy={pending}
      >
        {submitLabel}
      </Button>

      <div className="relative py-1" aria-hidden="true">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-light" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-wide">
          <span className="bg-surface-elevated px-3 text-ink-tertiary">ou</span>
        </div>
      </div>

      <GoogleAuthButton redirect={redirect} mode={isLogin ? "login" : "signup"} disabled={pending} />

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
