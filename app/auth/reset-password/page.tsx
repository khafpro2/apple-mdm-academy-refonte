import { PageShell } from "@/components/layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata = { title: "Nouveau mot de passe" };

export default function ResetPasswordPage() {
  return (
    <PageShell>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-ink">Nouveau mot de passe</h1>
          <p className="mt-2 text-ink-secondary">Choisissez un mot de passe sécurisé pour votre compte.</p>
        </div>
        <div className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
          <ResetPasswordForm />
        </div>
      </div>
    </PageShell>
  );
}
