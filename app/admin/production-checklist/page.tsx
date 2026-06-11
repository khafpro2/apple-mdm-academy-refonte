import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { requireAdmin } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { getProductionChecklist } from "@/lib/production/checklist";

export const dynamic = "force-dynamic";

export const metadata = { title: "Checklist production", robots: { index: false, follow: false } };

export default async function ProductionChecklistPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect(auth.reason === "unauthenticated" ? "/auth/login?redirect=/admin/production-checklist" : "/dashboard");

  const items = getProductionChecklist();
  const doneCount = items.filter((i) => i.done).length;
  const allDone = doneCount === items.length;

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Production"
            title="Checklist de lancement"
            description={`${doneCount}/${items.length} éléments validés`}
          />
          <Link href="/admin" className="text-sm font-semibold text-accent hover:underline">
            ← Admin
          </Link>
        </div>

        <div
          className={`mb-8 rounded-2xl p-5 ${allDone ? "border border-green-200 bg-green-50" : "border border-amber-200 bg-amber-50"}`}
          role="status"
        >
          <p className="font-bold text-ink">
            {allDone ? "Prêt pour le lancement officiel" : "Configuration en cours"}
          </p>
          <p className="mt-1 text-sm text-ink-secondary">
            Vérifiez chaque point avant la mise en production sur Vercel.
          </p>
        </div>

        <ul className="space-y-3" aria-label="Checklist production">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-4 rounded-2xl border border-border-light bg-surface-elevated p-5"
            >
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sm font-bold ${item.done ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}
                aria-hidden="true"
              >
                {item.done ? "✓" : "□"}
              </span>
              <div>
                <p className="font-semibold text-ink">{item.label}</p>
                {item.detail && (
                  <p className="mt-1 text-sm text-ink-secondary">{item.detail}</p>
                )}
              </div>
            </li>
          ))}
        </ul>

        <section className="mt-10 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <h2 className="font-bold text-ink">Variables Vercel attendues</h2>
          <ul className="mt-3 space-y-1 font-mono text-xs text-ink-secondary">
            <li>NEXT_PUBLIC_SUPABASE_URL</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>NEXT_PUBLIC_SITE_URL</li>
            <li>ADMIN_EMAILS</li>
            <li>STRIPE_SECRET_KEY (optionnel)</li>
            <li>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (optionnel)</li>
            <li>STRIPE_WEBHOOK_SECRET (optionnel)</li>
          </ul>
        </section>
      </div>
    </PageShell>
  );
}
