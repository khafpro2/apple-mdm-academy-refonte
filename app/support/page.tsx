import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading, ButtonLink } from "@/components/ui";
import { SupportContactForm, SupportFaq } from "@/components/support/support-content";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

export const metadata = buildPageMetadata({
  title: "Centre d'aide",
  description: "FAQ, support technique, aide connexion, paiement et certificats — Apple MDM Academy.",
  path: "/support",
});

const helpTopics = [
  { icon: "🔐", title: "Connexion & Auth", desc: "Supabase Auth, email de confirmation, mot de passe oublié", href: "#faq" },
  { icon: "💳", title: "Paiement & Abonnement", desc: "Pro, facturation, annulation, Stripe", href: "/account/billing" },
  { icon: "📜", title: "Certificats PDF", desc: "Téléchargement, vérification, examens blancs", href: "/certificat/verify" },
  { icon: "🧪", title: "Labs & Cours", desc: "Progression, validation d'étapes, contenu Pro", href: "/labs" },
  { icon: "📊", title: "Statut des services", desc: "Disponibilité application, auth, paiement", href: "/status" },
];

export default function SupportPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Support"
          title="Centre d'aide"
          description="Trouvez des réponses aux questions fréquentes ou contactez notre équipe."
          align="center"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {helpTopics.map((topic) => (
            <Link
              key={topic.title}
              href={topic.href}
              className="rounded-2xl border border-border-light bg-surface-elevated p-5 transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="text-2xl" aria-hidden="true">{topic.icon}</span>
              <h2 className="mt-2 font-bold text-ink">{topic.title}</h2>
              <p className="mt-1 text-sm text-ink-secondary">{topic.desc}</p>
            </Link>
          ))}
        </div>

        <section id="faq" className="mt-16">
          <h2 className="text-2xl font-bold text-ink">Questions fréquentes</h2>
          <div className="mt-6">
            <SupportFaq />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-ink">Nous contacter</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Besoin d&apos;aide personnalisée ? Remplissez le formulaire ci-dessous.
          </p>
          <div className="mt-6">
            <SupportContactForm />
          </div>
        </section>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/status" variant="secondary">Statut des services</ButtonLink>
          <ButtonLink href="/contact-sales">Contact commercial</ButtonLink>
        </div>
      </div>
    </PageShell>
  );
}
