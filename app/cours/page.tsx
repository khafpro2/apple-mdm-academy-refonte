import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Badge, Card } from "@/components/ui";
import { courses } from "@/lib/data/courses";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Catalogue des cours",
  description: "Tous les cours Apple MDM Academy — Apple, Jamf Pro, Intune et certifications.",
  path: "/cours",
});

export default function CoursIndexPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Formation"
          title="Catalogue des cours"
          description="Parcourez l'ensemble des modules structurés par certification et technologie."
        />

        <section className="mt-8 rounded-2xl border border-border-light bg-surface-elevated p-5">
          <p className="text-sm font-semibold text-ink">Conseil de lecture</p>
          <p className="mt-1 text-sm text-ink-secondary">
            Chaque leçon propose un mode lecture (colonne étroite, raccourci{" "}
            <kbd className="rounded border border-border-light bg-surface px-1.5 py-0.5 text-xs font-semibold">R</kbd>
            ), un sommaire avec sections actives et des raccourcis vers lab, quiz et ressources PDF.
          </p>
        </section>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const lessonCount = course.modules.reduce((n, m) => n + m.lessons.length, 0);
            return (
              <Link key={course.slug} href={`/cours/${course.slug}`} className="group block">
                <Card hover className="flex h-full flex-col">
                  <Badge variant="accent">{course.duration}</Badge>
                  <h2 className="mt-4 text-xl font-bold text-ink group-hover:text-accent">{course.title}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-secondary">{course.description}</p>
                  <p className="mt-4 text-xs text-ink-tertiary">
                    {course.modules.length} modules · {lessonCount} leçons
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
