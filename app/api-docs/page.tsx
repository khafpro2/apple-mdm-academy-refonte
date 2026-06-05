import Link from "next/link";
import { PageShell } from "@/components/layout";
import { SectionHeading, Card, ButtonLink } from "@/components/ui";
import { openApiSpec } from "@/lib/api/openapi-spec";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Documentation API",
  description: "Documentation OpenAPI de l'API publique Apple MDM Academy v1.",
  path: "/api-docs",
});

export default function ApiDocsPage() {
  const paths = Object.entries(openApiSpec.paths);

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          label="API"
          title="Documentation API v1"
          description={`${openApiSpec.info.description} Spec OpenAPI 3.1.`}
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/api/openapi" variant="secondary" size="sm">
            Télécharger OpenAPI JSON
          </ButtonLink>
          <ButtonLink href="/api/v1/courses" variant="secondary" size="sm">
            Tester /courses
          </ButtonLink>
        </div>
        <Card className="mt-10">
          <h3 className="font-bold text-ink">Base URL</h3>
          <code className="mt-2 block rounded-lg bg-surface px-4 py-3 text-sm text-ink-secondary">
            {openApiSpec.servers[0].url}
          </code>
        </Card>
        <div className="mt-8 space-y-4">
          {paths.map(([path, methods]) => {
            const get = methods.get;
            if (!get) return null;
            return (
              <Card key={path}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-800">GET</span>
                  <code className="text-sm font-semibold text-ink">{path}</code>
                  <span className="text-xs text-ink-tertiary">{get.tags?.[0]}</span>
                </div>
                <p className="mt-2 text-sm text-ink-secondary">{get.summary}</p>
                <Link href={`/api/v1${path.replace(/^\//, "")}`} className="mt-3 inline-block text-sm text-accent hover:underline">
                  Essayer →
                </Link>
              </Card>
            );
          })}
        </div>
        <p className="mt-10 text-sm text-ink-tertiary">
          Authentification Bearer JWT requise en production. Mode démo : endpoints publics en lecture seule.
        </p>
      </div>
    </PageShell>
  );
}
