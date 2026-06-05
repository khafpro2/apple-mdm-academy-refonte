import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, ButtonLink } from "@/components/ui";

export const metadata = {
  title: "Entreprise",
  description: "Formation Apple MDM pour équipes IT — reporting, multi-utilisateurs et support prioritaire.",
};

const BENEFITS = [
  { title: "Multi-utilisateurs", desc: "Jusqu'à 25 apprenants ou plus selon votre contrat." },
  { title: "Dashboard admin", desc: "Vue centralisée progression, scores et conformité par équipe." },
  { title: "Reporting RH", desc: "Export progression pour managers et responsables formation." },
  { title: "Support prioritaire", desc: "SLA dédié et sessions live mensuelles pour votre équipe IT." },
  { title: "Personnalisation", desc: "Parcours adaptés à vos outils : Jamf, Intune ou hybride." },
];

const USE_CASES = [
  "Équipes IT déployant iPhone et Mac en entreprise",
  "MSP gérant plusieurs clients Apple MDM",
  "Organisations préparant certifications Jamf 100 / 200",
  "DSI modernisant le déploiement avec ABM + Intune",
];

export default function EnterprisePage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Entreprise"
          title="Formez vos équipes Apple MDM à l'échelle"
          description="Accès multi-utilisateurs, reporting progression, dashboard admin et support prioritaire."
          align="center"
        />

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-border-light bg-surface-elevated p-6 shadow-sm">
              <h3 className="font-bold text-ink">{b.title}</h3>
              <p className="mt-2 text-sm text-ink-secondary">{b.desc}</p>
            </div>
          ))}
        </div>

        <section className="mx-auto mt-16 max-w-3xl">
          <h2 className="text-xl font-bold text-ink">Cas d&apos;usage</h2>
          <ul className="mt-4 space-y-3">
            {USE_CASES.map((u) => (
              <li key={u} className="flex gap-3 text-sm text-ink-secondary">
                <span className="text-accent" aria-hidden="true">→</span>
                {u}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-16 max-w-3xl rounded-3xl bg-ink p-10 text-white">
          <h2 className="text-xl font-bold">Suivi progression équipe</h2>
          <p className="mt-3 text-zinc-300">
            Visualisez la progression par parcours, identifiez les modules en retard et exportez des rapports pour vos managers RH et IT.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-zinc-400">
            <li>• Taux de complétion par apprenant</li>
            <li>• Scores examens blancs agrégés</li>
            <li>• Labs terminés vs assignés</li>
            <li>• Certificats obtenus par équipe</li>
          </ul>
          <ButtonLink href="/contact-sales" className="mt-8 bg-white text-ink hover:bg-zinc-100">
            Demander une démo
          </ButtonLink>
        </section>

        <p className="mx-auto mt-12 max-w-xl text-center text-sm text-ink-secondary">
          Déjà client ?{" "}
          <Link href="/account/billing" className="font-semibold text-accent hover:underline">
            Gérer votre contrat
          </Link>
        </p>
      </div>
    </PageShell>
  );
}
