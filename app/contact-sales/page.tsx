import { PageShell } from "@/components/layout/page-shell";
import { ContactSalesForm } from "@/components/contact-sales/contact-sales-form";

export const metadata = {
  title: "Contact commercial",
  description: "Demandez un devis Entreprise pour votre équipe IT.",
};

export default function ContactSalesPage() {
  return (
    <PageShell>
      <ContactSalesForm />
    </PageShell>
  );
}
