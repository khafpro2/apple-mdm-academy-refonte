import { redirect } from "next/navigation";
import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui";
import { isFreePlatformMode } from "@/lib/pricing/platform-access";

export const metadata = { title: "Abonnement confirmé" };

export default function CheckoutSuccessPage() {
  if (isFreePlatformMode()) {
    redirect("/dashboard");
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <span className="text-5xl" aria-hidden="true">✓</span>
        <h1 className="mt-4 text-2xl font-bold text-ink">Bienvenue dans Pro !</h1>
        <p className="mt-2 text-ink-secondary">
          Votre abonnement est actif. Accédez à tous les cours, labs, examens et certificats.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/dashboard">Mon dashboard</ButtonLink>
          <ButtonLink href="/account/billing" variant="secondary">Facturation</ButtonLink>
        </div>
        <Link href="/parcours" className="mt-4 inline-block text-sm text-accent hover:underline">
          Commencer un parcours →
        </Link>
      </div>
    </PageShell>
  );
}
