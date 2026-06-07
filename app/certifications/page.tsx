import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Card, ButtonLink } from "@/components/ui";
import { TrackLogo } from "@/components/ui/track-logo";
import { commercialCertificationPaths } from "@/lib/data/commercial-certification-paths";
import { appleTrainingResources } from "@/lib/data/official-cert-links";
import { JAMF_CERTIFICATION_COVERAGE } from "@/lib/data/jamf/jamf-pro-11-16-content";
import { INTUNE_CERTIFICATION_COVERAGE } from "@/lib/data/intune/microsoft-learn-content";
import { APPLE_TRAINING_COVERAGE } from "@/lib/data/apple-training/coverage";
import { runAppleTrainingAudit } from "@/lib/data/apple-training/audit";
import { buildPageMetadata } from "@/lib/seo/metadata";

const appleAudit = runAppleTrainingAudit();

export const metadata = buildPageMetadata({
  title: "Certifications",
  description: "Parcours de certification Apple IT Professional, Jamf et Intune Apple.",
  path: "/certifications",
});

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

            return (
              <Link
                key={path.slug}
                href={href}
                className="group rounded-2xl border border-border-light bg-surface-elevated p-6 transition hover:border-accent/40 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <TrackLogo logo={path.logo} size={24} alt={path.title} />
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
          <h2 className="text-lg font-bold text-ink">Couverture Jamf Pro 11.16</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Modules, labs et pondération examen alignés sur la documentation officielle Jamf Pro{" "}
            {JAMF_CERTIFICATION_COVERAGE.jamf100.docVersion}.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {(["jamf100", "jamf200"] as const).map((key) => {
              const cov = JAMF_CERTIFICATION_COVERAGE[key];
              return (
                <div key={key} className="rounded-2xl border border-border-light bg-surface p-5">
                  <h3 className="font-bold text-ink">{cov.label}</h3>
                  <p className="mt-1 text-xs text-ink-tertiary">
                    {cov.totalExamQuestions} questions examen · seuil {cov.passingScore}%
                  </p>
                  <ul className="mt-4 space-y-2">
                    {cov.modules.map((m) => (
                      <li key={m.id} className="flex justify-between text-sm">
                        <span className="text-ink-secondary">
                          {m.title} · lab <code className="text-xs">{m.lab}</code>
                        </span>
                        <span className="font-semibold text-accent">{m.examWeight}%</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={key === "jamf100" ? "/examens/jamf-100" : "/examens/jamf-200"}
                    className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
                  >
                    Examen blanc →
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="mt-10 p-6">
          <h2 className="text-lg font-bold text-ink">Couverture Microsoft Intune Apple</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Modules, labs et pondération alignés sur Microsoft Learn — parcours Intune Apple Administrator.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {(["appleItProfessional", "intuneAppleAdministrator", "endpointAdministrator"] as const).map((key) => {
              const cov = INTUNE_CERTIFICATION_COVERAGE[key];
              return (
                <div key={key} className="rounded-2xl border border-border-light bg-surface p-5">
                  <h3 className="font-bold text-ink">{cov.label}</h3>
                  <p className="mt-1 text-xs text-ink-tertiary">
                    Couverture {cov.coveragePercent}% · {cov.totalExamQuestions} questions · seuil {cov.passingScore}%
                  </p>
                  <ul className="mt-4 space-y-2">
                    {cov.modules.map((m) => (
                      <li key={m.id} className="flex justify-between text-sm">
                        <span className="text-ink-secondary">
                          {m.title} · lab <code className="text-xs">{m.lab}</code>
                        </span>
                        <span className="font-semibold text-accent">{m.examWeight}%</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={key === "intuneAppleAdministrator" ? "/examens/intune-apple" : "/parcours/intune-mac"}
                    className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
                  >
                    {key === "intuneAppleAdministrator" ? "Examen blanc →" : "Parcours Intune →"}
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="mt-10 p-6">
          <h2 className="text-lg font-bold text-ink">Couverture Apple Training</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Audit qualité {appleAudit.globalQualityScore}/100 · ACITP {appleAudit.acitpCoveragePercent}% ·
            Déploiement {appleAudit.deploymentCoveragePercent}% · Sécurité {appleAudit.securityCoveragePercent}%
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {(["acitp", "deployment", "security", "enterprise"] as const).map((key) => {
              const cov = APPLE_TRAINING_COVERAGE[key];
              return (
                <div key={key} className="rounded-2xl border border-border-light bg-surface p-5">
                  <h3 className="font-bold text-ink">{cov.label}</h3>
                  <p className="mt-1 text-xs text-ink-tertiary">
                    Couverture {cov.coveragePercent}% · {cov.totalExamQuestions} questions · seuil {cov.passingScore}%
                  </p>
                  <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto">
                    {cov.modules.slice(0, 8).map((m) => (
                      <li key={m.id} className="flex justify-between text-sm">
                        <span className="text-ink-secondary">
                          {m.title}
                          {m.lab !== "—" && (
                            <>
                              {" "}
                              · lab <code className="text-xs">{m.lab}</code>
                            </>
                          )}
                        </span>
                        <span className="font-semibold text-accent">{m.coveragePercent ?? m.examWeight}%</span>
                      </li>
                    ))}
                  </ul>
                  {cov.examRoute && (
                    <Link
                      href={
                        key === "acitp"
                          ? "/certifications/apple-certified-it-professional"
                          : `/examens/${cov.examRoute}`
                      }
                      className="mt-4 inline-block text-sm font-semibold text-accent hover:underline"
                    >
                      {key === "acitp" ? "Parcours ACITP →" : "Examen blanc →"}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <Link href="/resources/apple-it-professional-guide" className="font-semibold text-accent hover:underline">
              Guide IT Professional
            </Link>
            <Link href="/resources/apple-business-manager-guide" className="font-semibold text-accent hover:underline">
              Guide ABM
            </Link>
            <Link href="/resources/apple-deployment-guide" className="font-semibold text-accent hover:underline">
              Guide Déploiement
            </Link>
            <Link href="/resources/apple-security-guide" className="font-semibold text-accent hover:underline">
              Guide Sécurité
            </Link>
            <Link href="/resources/platform-sso-guide" className="font-semibold text-accent hover:underline">
              Guide Platform SSO
            </Link>
            <Link href="/resources/ddm-guide" className="font-semibold text-accent hover:underline">
              Guide DDM
            </Link>
            <Link href="/resources/device-attestation-guide" className="font-semibold text-accent hover:underline">
              Guide Attestation
            </Link>
          </div>
        </Card>

        <Card className="mt-10 p-6">
          <h2 className="text-lg font-bold text-ink">Apple Certified IT Professional</h2>
          <p className="mt-2 text-sm text-ink-secondary">
            Parcours complet francophone — 200 questions, 10 labs, certificat Apple IT Professional Ready.
          </p>
          <ButtonLink href="/certifications/apple-certified-it-professional" className="mt-4">
            Voir le parcours ACITP
          </ButtonLink>
        </Card>

        <section className="mt-10 rounded-2xl border border-border-light bg-surface-elevated p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">Référence officielle Apple</p>
          <h2 className="mt-2 text-lg font-bold text-ink">Examens, badges et politiques Apple</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
            Apple indique que ses examens de certification sont principalement délivrés via Pearson VUE / OnVUE,
            que les examens blancs Apple durent {appleTrainingResources.practiceExamDuration}, qu&apos;un nouvel
            essai est possible après {appleTrainingResources.retakeDelayDays} jours, avec{" "}
            {appleTrainingResources.maxAttempts} tentatives maximum. Les badges numériques Apple sont gérés via
            Credly et leur validité est {appleTrainingResources.badgeValidity}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <a href={appleTrainingResources.resourcesUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Ressources Apple Training
            </a>
            <a href={appleTrainingResources.pearsonVueUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Pearson VUE Apple
            </a>
            <a href={appleTrainingResources.credlyDirectoryUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              Annuaire Credly Apple
            </a>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
