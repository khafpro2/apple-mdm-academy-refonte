"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { DEMO_USER_EMAIL, DEMO_USER_PASSWORD } from "@/lib/demo/constants";
import { sanitizeRedirectPath } from "@/lib/auth/url";
import { Button } from "@/components/ui";
import { trackEvent } from "@/lib/analytics/events";

async function startLocalDemoSession(redirect: string, router: ReturnType<typeof useRouter>) {
  const res = await fetch("/api/auth/demo/session", { method: "POST" });
  if (!res.ok) throw new Error("Impossible d'activer le mode démo local.");
  trackEvent("connexion_demo");
  router.push(redirect);
  router.refresh();
}

export function DemoLoginButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = sanitizeRedirectPath(searchParams.get("redirect"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabaseConfigured = isSupabaseConfigured();

  async function handleDemoLogin() {
    setLoading(true);
    setError(null);

    try {
      if (!supabaseConfigured) {
        await startLocalDemoSession(redirect, router);
        return;
      }

      const supabase = createClient();
      let signIn = await supabase.auth.signInWithPassword({
        email: DEMO_USER_EMAIL,
        password: DEMO_USER_PASSWORD,
      });

      if (signIn.error) {
        const provision = await fetch("/api/auth/demo/provision", { method: "POST" });
        const body = (await provision.json()) as { ok?: boolean; error?: string; hint?: string };

        if (!provision.ok || !body.ok) {
          if (body.error === "service_role_missing" || body.error === "supabase_not_configured") {
            await startLocalDemoSession(redirect, router);
            return;
          }
          throw new Error(body.hint ?? "Compte démo indisponible.");
        }

        signIn = await supabase.auth.signInWithPassword({
          email: DEMO_USER_EMAIL,
          password: DEMO_USER_PASSWORD,
        });
        if (signIn.error) throw signIn.error;
      }

      trackEvent("connexion_demo");
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion démo impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3 border-t border-border-light pt-5">
      <p className="text-center text-xs text-ink-tertiary">
        Explorer le dashboard sans créer de compte — données fictives en lecture seule
        {!supabaseConfigured ? " (mode local, Supabase non configuré)" : ""}.
      </p>
      <Button
        type="button"
        variant="secondary"
        disabled={loading}
        className="w-full border-amber-200 bg-amber-50 text-amber-950 hover:bg-amber-100"
        onClick={handleDemoLogin}
      >
        {loading ? "Connexion démo…" : "Connexion démo"}
      </Button>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
