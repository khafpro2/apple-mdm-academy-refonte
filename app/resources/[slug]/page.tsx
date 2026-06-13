import { notFound } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { PageShell } from "@/components/layout/page-shell";
import { ResourceDetail } from "@/components/resources/resource-detail";
import { SubscriptionGate } from "@/components/subscription/subscription-gate";
import { getRequiredTierForResource } from "@/lib/pricing/access-control";
import { getResource, getResourceSlugs } from "@/src/lib/resources";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getResourceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) {
    return buildPageMetadata({
      title: "Ressource introuvable",
      description: "Cette ressource n'existe pas ou a été déplacée.",
      path: `/resources/${slug}`,
      noIndex: true,
    });
  }
  return buildPageMetadata({
    title: resource.title,
    description: resource.description,
    path: `/resources/${slug}`,
  });
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  const requiredTier = getRequiredTierForResource(slug);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <SubscriptionGate requiredTier={requiredTier} featureLabel="ressources premium">
          <ResourceDetail resource={resource} />
        </SubscriptionGate>
      </div>
    </PageShell>
  );
}
