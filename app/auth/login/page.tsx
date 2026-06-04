import { Suspense } from "react";
import { PageShell } from "@/components/layout";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <PageShell>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-ink">Connexion</h1>
          <p className="mt-2 text-ink-secondary">Accédez à votre dashboard et suivez votre progression.</p>
        </div>
        <div className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
          <Suspense fallback={<p className="text-center text-sm text-ink-tertiary">Chargement…</p>}>
            <AuthForm mode="login" />
          </Suspense>
        </div>
      </div>
    </PageShell>
  );
}
