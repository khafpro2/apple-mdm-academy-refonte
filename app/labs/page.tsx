import { Nav, Footer } from "@/components/nav";
import { LabCard, PageHeader } from "@/components/cards";
import { labs } from "@/lib/data";

export default function LabsPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f7] text-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <Nav />
        <div className="py-12">
          <PageHeader
            label="Pratique"
            title="Labs pratiques"
            description="Exercices guidés pas à pas pour maîtriser Jamf Pro, Intune et la gestion Apple en conditions réelles."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab, index) => (
              <LabCard key={lab.slug} slug={lab.slug} title={lab.title} index={index} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
