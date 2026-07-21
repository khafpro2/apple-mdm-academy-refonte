import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout";
import { ButtonLink } from "@/components/ui";
import { getUser } from "@/lib/supabase/server";
import { sanitizeRedirectPath } from "@/lib/auth/url";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Confirmez votre email",
  description: "Finalisez votre inscription Apple MDM Academy en confirmant votre adresse email.",
  path: "/auth/check-email",
});

type PageProps = {
  searchParams: Promise<{ email?: string; redirect?: string }>;
};

export default async function CheckEmailPage({ searchParams }: PageProps) {
  const user = await getUser();
  const params = await searchParams;
  const redirectTo = sanitizeRedirectPath(params.redirect ?? null);
  const email = params.email?.trim() ?? "";

  if (user) {
    redirect(redirectTo);
  }

  return (
    <PageShell>
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl" aria-hidden="true">
            ✉️
          </div>
          <h1 className="mt-6 text-3xl font-bold text-ink">Compte créé</h1>
          <p className="mt-2 text-ink-secondary">
            {email ? (
              <>
                Un email de confirmation a été envoyé à{" "}
                <strong className="text-ink">{email}</strong>.
              </>
            ) : (
              "Un email de confirmation vous a été envoyé."
            )}
          </p>
        </div>

        <div className="mt-8 space-y-4 rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm text-sm text-ink-secondary">
          <p>
            Cliquez sur le lien dans l&apos;email pour activer votre compte. Vous serez ensuite
            redirigé vers votre espace apprenant.
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Vérifiez votre dossier spam ou promotions.</li>
            <li>Le lien expire après quelques heures — reconnectez-vous pour en demander un nouveau si besoin.</li>
            <li>
              Si la confirmation email est désactivée dans Supabase, utilisez directement la{" "}
              <Link href={`/auth/login?redirect=${encodeURIComponent(redirectTo)}`} className="font-semibold text-accent hover:underline">
                page de connexion
              </Link>
              .
            </li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href={`/auth/login?redirect=${encodeURIComponent(redirectTo)}`}>
            Se connecter
          </ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Retour à l&apos;accueil
          </ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}
