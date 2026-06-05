import { PageShell } from "@/components/layout";
import { TrainingCenterContent } from "@/components/training-center/training-center-content";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Centre de formation",
  description: "Gestion des groupes, suivi apprenants, rapports et certifications pour centres de formation.",
  path: "/training-center",
});

export default function TrainingCenterPage() {
  return (
    <PageShell>
      <TrainingCenterContent />
    </PageShell>
  );
}
