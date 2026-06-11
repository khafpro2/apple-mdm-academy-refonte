import { Suspense } from "react";
import { PageShell } from "@/components/layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata = {
  title: "Mot de passe oublié",
  description: "Réinitialisez votre mot de passe Apple MDM Academy.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <PageShell>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-ink">Mot de passe oublié</h1>
          <p className="mt-2 text-ink-secondary">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>
        </div>
        <div className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
          <Suspense fallback={<p className="text-center text-sm text-ink-tertiary">Chargement…</p>}>
            <ForgotPasswordForm />
          </Suspense>
        </div>
      </div>
    </PageShell>
  );
}
