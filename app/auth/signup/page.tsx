import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout";
import { AuthForm } from "@/components/auth/auth-form";
import { getUser } from "@/lib/supabase/server";
import { sanitizeRedirectPath } from "@/lib/auth/url";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = {
  ...buildPageMetadata({
    title: "Inscription",
    description: "Créez votre compte Apple MDM Academy — accès gratuit immédiat à Jamf 100, Apple IT Pro et Intune.",
    path: "/auth/signup",
  }),
  robots: { index: true, follow: true },
};

type PageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function SignupPage({ searchParams }: PageProps) {
  const user = await getUser();
  const params = await searchParams;
  const redirectTo = sanitizeRedirectPath(params.redirect ?? null);

  if (user) {
    redirect(redirectTo);
  }

  return (
    <PageShell>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-ink">Créer un compte</h1>
          <p className="mt-2 text-ink-secondary">
            Rejoignez Apple MDM Academy et commencez votre formation gratuitement.
          </p>
        </div>
        <div className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
          <Suspense fallback={<p className="text-center text-sm text-ink-tertiary">Chargement…</p>}>
            <AuthForm mode="signup" />
          </Suspense>
        </div>
      </div>
    </PageShell>
  );
}
