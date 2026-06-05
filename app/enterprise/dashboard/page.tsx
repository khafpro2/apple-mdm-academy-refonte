import { PageShell } from "@/components/layout";
import { EnterpriseDashboardContent } from "@/components/enterprise/enterprise-dashboard-content";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Dashboard entreprise",
  description: "Reporting équipes IT — progression, certifications, examens et exports.",
  path: "/enterprise/dashboard",
});

export default function EnterpriseDashboardPage() {
  return (
    <PageShell>
      <EnterpriseDashboardContent />
    </PageShell>
  );
}
