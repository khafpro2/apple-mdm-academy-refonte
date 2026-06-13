import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              label="Contact"
              title="Parlons de votre projet"
              description="Une question sur les parcours, un devis Entreprise ou un partenariat ? Écrivez-nous."
            />
            <div className="mt-8 space-y-6">
              {[
                { icon: "✉️", label: "Email", value: "kthiam@harmytech.com" },
                { icon: "💬", label: "Support", value: "Réponse sous 24 h ouvrées" },
                { icon: "🏢", label: "Entreprise", value: "Plans équipe et formation sur site" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <span className="text-2xl" aria-hidden="true">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-ink">{item.label}</p>
                    <p className="text-sm text-ink-secondary">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-border-light bg-surface-elevated p-8 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </div>
    </PageShell>
  );
}
