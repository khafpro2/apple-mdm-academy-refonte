import Link from "next/link";
import { redirect } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, Badge } from "@/components/ui";
import { SupabaseSetupGuide } from "@/components/status/supabase-setup-guide";
import { requireAdmin } from "@/lib/supabase/admin";
import { runSupabaseDiagnostics, type CheckDiagnostic, type EnvVarDiagnostic } from "@/lib/supabase/diagnostics.server";

export const metadata = {
  title: "Diagnostics Supabase",
  robots: { index: false, follow: false },
};

const statusStyles = {
  ok: "bg-green-100 text-green-800",
  fail: "bg-red-100 text-red-800",
  warning: "bg-amber-100 text-amber-800",
  skipped: "bg-zinc-100 text-zinc-600",
};

function EnvVarRow({ item }: { item: EnvVarDiagnostic }) {
  return (
    <li className="rounded-2xl border border-border-light bg-surface-elevated p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <code className="text-sm font-semibold text-ink">{item.name}</code>
        <span className="text-sm font-semibold">{item.label}</span>
      </div>
      <p className="mt-2 text-sm text-ink-secondary">
        Valeur présente : <strong>{item.presence}</strong>
        {" · "}
        {item.note}
      </p>
    </li>
  );
}

function CheckRow({ item }: { item: CheckDiagnostic }) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-2xl border border-border-light bg-surface-elevated p-5">
      <div>
        <p className="font-semibold text-ink">{item.name}</p>
        <p className="mt-1 text-sm text-ink-secondary">{item.detail}</p>
      </div>
      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase ${statusStyles[item.status]}`}>
        {item.status}
      </span>
    </li>
  );
}

export default async function SupabaseDiagnosticsPage() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    redirect(auth.reason === "unauthenticated" ? "/auth/login?redirect=/admin/supabase-diagnostics" : "/dashboard");
  }

  const diagnostics = await runSupabaseDiagnostics();

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            label="Administration"
            title="Diagnostics Supabase"
            description="Lecture seule — aucune valeur secrète affichée."
          />
          <Link href="/admin" className="text-sm font-semibold text-accent hover:underline">
            ← Admin
          </Link>
        </div>

        <div className="mb-8 rounded-2xl border border-border-light bg-surface-elevated p-5">
          <p className="text-sm font-semibold text-ink-tertiary">Mode actuel</p>
          <p className="mt-1 text-2xl font-bold text-ink">{diagnostics.runtimeMode}</p>
          <p className="mt-2 text-xs text-ink-tertiary">
            Production · Preview · Development — détecté via VERCEL_ENV
          </p>
        </div>

        <div
          className={`mb-8 rounded-2xl p-5 ${diagnostics.configured ? "border border-green-200 bg-green-50" : "border border-amber-200 bg-amber-50"}`}
          role="status"
        >
          <p className="font-bold text-ink">Diagnostic page /status</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant={diagnostics.statusPageAuthDegraded ? "default" : "accent"}>
              Authentification : {diagnostics.statusPageAuthDegraded ? "Dégradé" : "Opérationnel"}
            </Badge>
            <Badge variant={diagnostics.statusPageDbDegraded ? "default" : "accent"}>
              Base de données : {diagnostics.statusPageDbDegraded ? "Dégradé" : "Opérationnel"}
            </Badge>
          </div>
          <p className="mt-3 text-sm text-ink-secondary">{diagnostics.rootCause}</p>
        </div>

        {diagnostics.hasInvalidEnv && (
          <div className="mb-8">
            <SupabaseSetupGuide />
          </div>
        )}

        <section className="mb-10">
          <h2 className="text-lg font-bold text-ink">Variables principales</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Statut : Présente / Absente / Invalide — jamais la valeur complète d&apos;une clé.
          </p>
          <ul className="mt-4 space-y-3">
            {diagnostics.primaryEnvVars.map((item) => (
              <EnvVarRow key={item.name} item={item} />
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-bold text-ink">Autres variables</h2>
          <ul className="mt-4 space-y-3">
            {diagnostics.envVars
              .filter((v) => !diagnostics.primaryEnvVars.some((p) => p.name === v.name))
              .map((item) => (
                <EnvVarRow key={item.name} item={item} />
              ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink">Vérifications runtime</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Auth / DB testés uniquement si URL et anon key sont valides.
          </p>
          <ul className="mt-4 space-y-3">
            {diagnostics.checks.map((item) => (
              <CheckRow key={item.name} item={item} />
            ))}
          </ul>
        </section>

        <div className="mt-10 rounded-2xl border border-border-light bg-surface p-5 text-sm text-ink-secondary">
          <p className="font-semibold text-ink">Placeholders détectés automatiquement</p>
          <p className="mt-2">
            Exemples : <code>your-project</code>, <code>your-anon-key</code>, <code>changeme</code>,{" "}
            <code>placeholder</code>, préfixe <code>your-</code>, valeur vide.
          </p>
          <Link href="/status" className="mt-4 inline-block font-semibold text-accent hover:underline">
            Voir la page État des services →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
