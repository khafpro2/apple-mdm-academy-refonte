import { PageShell } from "@/components/layout";
import { SectionHeading } from "@/components/ui";
import { LabCard } from "@/components/cards";
import { labs } from "@/lib/data";

export const metadata = { title: "Labs pratiques" };

export default function LabsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Pratique"
          title="Labs pratiques"
          description="Exercices guidés pas à pas pour maîtriser Jamf Pro, Intune et la gestion Apple en conditions réelles."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab, index) => (
            <LabCard
              key={lab.slug}
              slug={lab.slug}
              title={lab.title}
              duration={lab.duration}
              difficulty={lab.difficulty}
              index={index}
            />
          ))}
        </div>
      </div>
    </PageShell>
  );
}
