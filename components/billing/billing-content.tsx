"use client";

import Link from "next/link";
import { SectionHeading, ButtonLink } from "@/components/ui";
import { useSubscription } from "@/lib/pricing/use-subscription";
import { TierBadge } from "@/components/subscription/tier-badge";
import { stripeConfig, stripeApiRoutes } from "@/lib/pricing/stripe-config";
import type { InvoicePlaceholder } from "@/lib/pricing/types";

const PLACEHOLDER_INVOICES: InvoicePlaceholder[] = [
  { id: "inv_demo_001", date: "2026-05-01", amount: "29,00 €", status: "paid" },
  { id: "inv_demo_002", date: "2026-04-01", amount: "29,00 €", status: "paid" },
];

export function BillingContent() {
  const { tier, status, plan, currentPeriodEnd, cancelAtPeriodEnd, downgradeToFree, isPro } = useSubscription();

  const handleManage = async () => {
    if (stripeConfig.enabled) {
      const res = await fetch(stripeApiRoutes.portal, { method: "POST" });
      const data = (await res.json()) as { url?: string };
      if (data.url) window.location.href = data.url;
      return;
    }
    alert("Portail Stripe non configuré — utilisez les boutons ci-dessous en mode démo.");
  };

  const periodEndLabel = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString("fr-FR")
    : "—";

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
      <SectionHeading label="Mon compte" title="Facturation & abonnement" />

      <div className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-ink-tertiary">Plan actuel</p>
            <div className="mt-1 flex items-center gap-3">
              <h2 className="text-2xl font-bold text-ink">{plan.name}</h2>
              <TierBadge tier={tier} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-ink-tertiary">Statut</p>
            <p className="font-semibold capitalize text-ink">{status === "none" ? "Gratuit" : status}</p>
          </div>
        </div>

        {isPro && (
          <p className="mt-4 text-sm text-ink-secondary">
            Prochain renouvellement : {periodEndLabel}
            {cancelAtPeriodEnd && " (annulation programmée)"}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {!isPro && (
            <ButtonLink href="/checkout?plan=pro">Upgrade Pro</ButtonLink>
          )}
          {isPro && (
            <>
              <button
                type="button"
                onClick={handleManage}
                className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Gérer l&apos;abonnement
              </button>
              <button
                type="button"
                onClick={downgradeToFree}
                className="rounded-full border border-border-light px-5 py-2 text-sm font-semibold text-ink-secondary hover:text-ink"
              >
                Repasser en gratuit (démo)
              </button>
            </>
          )}
          <ButtonLink href="/pricing" variant="secondary">Voir les offres</ButtonLink>
        </div>
      </div>

      <section className="mt-8 rounded-3xl border border-border-light bg-surface-elevated p-6 shadow-sm">
        <h3 className="font-bold text-ink">Historique des factures</h3>
        {isPro ? (
          <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[280px] text-sm">
            <thead>
              <tr className="border-b border-border-light text-left text-ink-tertiary">
                <th className="py-2">Date</th>
                <th className="py-2">Montant</th>
                <th className="py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {PLACEHOLDER_INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-border-light">
                  <td className="py-3">{new Date(inv.date).toLocaleDateString("fr-FR")}</td>
                  <td className="py-3">{inv.amount}</td>
                  <td className="py-3 capitalize">{inv.status === "paid" ? "Payée" : "En attente"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-secondary">Aucune facture — abonnez-vous à Pro pour voir l&apos;historique.</p>
        )}
        <p className="mt-4 text-xs text-ink-tertiary">Factures placeholder — connectez Stripe Billing pour les factures réelles.</p>
      </section>

      <Link href="/dashboard" className="mt-6 inline-block text-sm font-semibold text-accent hover:underline">
        ← Retour au dashboard
      </Link>
    </div>
  );
}
