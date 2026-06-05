import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { ResourceDetail } from "@/components/resources/resource-detail";
import { getResource, getResourceSlugs } from "@/src/lib/resources";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getResourceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return { title: "Ressource introuvable" };
  return {
    title: resource.title,
    description: resource.description,
  };
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <ResourceDetail resource={resource} />
      </div>
    </PageShell>
  );
}
