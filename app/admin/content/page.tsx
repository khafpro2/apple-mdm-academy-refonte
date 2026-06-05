import { PageShell } from "@/components/layout/page-shell";
import { SectionHeading } from "@/components/ui";
import { AdminContentManagement } from "@/components/admin/content-management";

export const metadata = { title: "Admin — Contenu" };

export default function AdminContentPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Administration"
          title="Gestion du contenu"
          description="Modules, vidéos HeyGen, examens et aperçu progression."
        />
        <AdminContentManagement />
      </div>
    </PageShell>
  );
}
