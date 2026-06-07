import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, ButtonLink } from "@/components/ui";
import { SupabaseSetupGuide } from "@/components/status/supabase-setup-guide";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getSupabaseEnv } from "@/lib/env";
import { stripeConfig } from "@/lib/pricing/stripe-config";

export const metadata = buildPageMetadata({
  title: "Statut des services",
  description: "Disponibilité en temps réel des services Apple MDM Academy.",
  path: "/status",
});

/** Pas de cache statique — relit process.env à chaque requête (NEXT_PUBLIC_* reste figé au build). */
export const dynamic = "force-dynamic";

type ServiceStatus = {
  name: string;
  status: "operational" | "degraded" | "maintenance";
  description: string;
};

function getServices(): ServiceStatus[] {
  const supabase = getSupabaseEnv();

  return [
    {
      name: "Application",
      status: "operational",
      description: "Site web et dashboard accessibles",
    },
    {
      name: "Authentification",
      status: supabase.configured ? "operational" : "degraded",
      description: supabase.configured
        ? "Supabase Auth opérationnel"
        : "Variables Supabase invalides ou placeholders détectés",
    },
    {
      name: "Base de données",
      status: supabase.configured ? "operational" : "degraded",
      description: supabase.configured
        ? "Supabase PostgreSQL connecté"
        : "Variables Supabase invalides ou placeholders détectés",
    },
    {
      name: "Paiement",
      status: stripeConfig.enabled ? "operational" : "maintenance",
      description: stripeConfig.enabled ? "Stripe Checkout actif" : "Stripe en préparation — mode démo",
    },
    {
      name: "Vidéos",
      status: "operational",
      description: "Lecteur vidéo et contenus pédagogiques disponibles",
    },
  ];
}

const statusStyles = {
  operational: { label: "Opérationnel", className: "bg-green-100 text-green-800" },
  degraded: { label: "Dégradé", className: "bg-amber-100 text-amber-800" },
  maintenance: { label: "Maintenance", className: "bg-blue-100 text-blue-800" },
};

export default function StatusPage() {
  const supabase = getSupabaseEnv();
  const services = getServices();
  const allOperational = services.every((s) => s.status === "operational");

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Statut"
          title="État des services"
          description="Surveillance de la disponibilité des composants de la plateforme."
          align="center"
        />

        <div
          className={`mt-8 rounded-2xl p-5 text-center ${allOperational ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}
          role="status"
          aria-live="polite"
        >
          <p className="text-lg font-bold text-ink">
            {allOperational ? "Tous les systèmes sont opérationnels" : "Certains services nécessitent votre attention"}
          </p>
          <p className="mt-1 text-sm text-ink-secondary">
            Dernière vérification : {new Date().toLocaleString("fr-FR")}
          </p>
        </div>

        {!supabase.configured && <SupabaseSetupGuide />}

        <ul className="mt-8 space-y-3" aria-label="Liste des services">
          {services.map((service) => {
            const style = statusStyles[service.status];
            return (
              <li
                key={service.name}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border-light bg-surface-elevated p-5"
              >
                <div>
                  <h2 className="font-bold text-ink">{service.name}</h2>
                  <p className="mt-1 text-sm text-ink-secondary">{service.description}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${style.className}`}>
                  {style.label}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-center text-xs text-ink-tertiary">
          Statuts placeholder — connectez un service de monitoring (Better Stack, UptimeRobot) pour la production.
        </p>

        <div className="mt-8 text-center">
          <ButtonLink href="/support" variant="secondary">Centre d&apos;aide</ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}
