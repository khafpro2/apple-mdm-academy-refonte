import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { CheckoutContent } from "@/components/checkout/checkout-content";
import { isFreePlatformMode } from "@/lib/pricing/platform-access";

export const metadata = {
  title: "Paiement",
  description: "Souscrire à un plan Apple MDM Academy.",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  if (isFreePlatformMode()) {
    redirect("/pricing");
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading label="Checkout" title="Finaliser votre abonnement" align="center" />
        <div className="mt-10">
          <Suspense fallback={<p className="text-center text-ink-secondary">Chargement…</p>}>
            <CheckoutContent />
          </Suspense>
        </div>
      </div>
    </PageShell>
  );
}
