import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Card, ButtonLink } from "@/components/ui";
import { LogoIcon } from "@/components/ui/logo-icon";
import { commercialCertificationPaths } from "@/lib/data/commercial-certification-paths";
import type { LogoName } from "@/lib/navigation/logo-names";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Certifications",
  description: "Parcours de certification Apple IT Professional, Jamf et Intune Apple.",
  path: "/certifications",
});

const certIcons: Record<string, LogoName> = {
  "apple-certified-it-professional": "apple",
  "jamf-100": "jamf",
  "jamf-200": "jamf",
  "intune-apple-specialist": "microsoft",
  "apple-security-expert": "shield",
};

export default function CertificationsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="Certifications"
          title="Préparez vos certifications"
          description="Examens blancs, labs et parcours alignés sur les compétences Apple, Jamf et Microsoft."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {commercialCertificationPaths.map((path) => {
            const href =
              path.slug === "apple-certified-it-professional"
                ? `/certifications/${path.slug}`
                : path.examRouteSlug
                  ? `/examens/${path.examRouteSlug}`
                  : `/parcours/${path.trackSlug}`;
            const icon = certIcons[path.slug] ?? "certificate";

            return (
              <Link
                key={path.slug}
                href={href}
                className="group rounded-2xl border border-border-light bg-surface-elevated p-6 transition hover:border-accent/40 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <LogoIcon name={icon} size={24} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent">{path.level}</p>
                    <h2 className="text-lg font-bold text-ink group-hover:text-accent">{path.title}</h2>
                  </div>
                </div>
                <p className="mt-3 text-sm text-ink-secondary">{path.description}</p>
                <p className="mt-3 text-xs text-ink-tertiary">
                  {path.modulesCount} modules · {path.labsCount} labs · {path.examsCount} examen
                </p>
              </Link>
            );
          })}
        </div>

        <Card className="mt-10 p-6">
          <h2 className="text-lg font-bold text-ink">Apple Certified IT Professional</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Parcours complet francophone — 200 questions, 10 labs, certificat Apple IT Professional Ready.
          </p>
          <ButtonLink href="/certifications/apple-certified-it-professional" className="mt-4">
            Voir le parcours ACITP
          </ButtonLink>
        </Card>
      </div>
    </PageShell>
  );
}
