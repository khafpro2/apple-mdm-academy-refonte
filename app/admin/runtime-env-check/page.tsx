import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge } from "@/components/ui";
import { requireAdmin } from "@/lib/supabase/admin";
import { getRuntimeEnvCheckReport } from "@/lib/supabase/runtime-env-check.server";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Runtime env check",
  robots: { index: false, follow: false },
};

function PresenceRow({ name, present }: { name: string; present: boolean }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-light bg-surface-elevated p-5">
      <code className="text-sm font-semibold text-ink">{name}</code>
      <Badge variant={present ? "accent" : "default"}>présente : {present ? "oui" : "non"}</Badge>
    </li>
  );
}

export default async function RuntimeEnvCheckPage() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    redirect(auth.reason === "unauthenticated" ? "/auth/login?redirect=/admin/runtime-env-check" : "/dashboard");
  }

  const report = getRuntimeEnvCheckReport();

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Administration · temporaire"
          title="Runtime env check"
          description="Vérifie que les variables d'environnement ont été rechargées après un redéploiement. Aucune valeur complète n'est affichée."
        />

        <div className="mt-8 rounded-2xl border border-border-light bg-surface-elevated p-5">
          <p className="text-sm font-semibold text-ink-tertiary">Environnement Vercel</p>
          <p className="mt-1 text-xl font-bold text-ink">{report.runtimeMode}</p>
          <p className="mt-3 text-sm font-semibold text-ink-tertiary">Build timestamp</p>
          <p className="mt-1 font-mono text-sm text-ink">{report.buildTimestamp}</p>
          <p className="mt-2 text-xs text-ink-tertiary">
            Vérification serveur : {new Date(report.checkedAt).toLocaleString("fr-FR")}
          </p>
        </div>

        <ul className="mt-8 space-y-3" aria-label="Variables d'environnement">
          {report.variables.map((variable) => (
            <PresenceRow key={variable.name} name={variable.name} present={variable.present} />
          ))}
        </ul>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-semibold">Note redéploiement</p>
          <p className="mt-2 leading-relaxed">{report.redeployNote}</p>
          <p className="mt-3">
            Supabase configuré (/status) :{" "}
            <strong>{report.supabaseConfigured ? "oui" : "non"}</strong>
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/status" className="text-accent hover:underline">
            Voir /status →
          </Link>
          <Link href="/admin/supabase-diagnostics" className="text-accent hover:underline">
            Diagnostics Supabase →
          </Link>
          <Link href="/admin" className="text-ink-secondary hover:text-ink">
            ← Admin
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
