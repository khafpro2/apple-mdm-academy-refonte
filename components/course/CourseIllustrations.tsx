import { getIllustrationsForCourse, getIllustration } from "@/lib/assets/illustration-registry";

type Props = {
  courseSlug: string;
  illustrationIds?: string[];
};

export function CourseIllustrations({ courseSlug, illustrationIds }: Props) {
  const assets = illustrationIds?.length
    ? illustrationIds.map((id) => getIllustration(id)).filter(Boolean)
    : getIllustrationsForCourse(courseSlug);

  if (!assets.length) return null;

  return (
    <section className="mt-10" aria-labelledby="course-illustrations-heading">
      <h2 id="course-illustrations-heading" className="text-lg font-bold text-ink">
        Schémas pédagogiques
      </h2>
      <p className="mt-1 text-sm text-ink-secondary">
        Illustrations originales Apple MDM Academy — non issues de contenus Apple Sales Coach.
      </p>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {assets.map((asset) =>
          asset ? (
            <figure
              key={asset.id}
              className="overflow-hidden rounded-2xl border border-border-light bg-surface-elevated p-4 shadow-sm"
            >
              {/* SVG locaux : balise img pour éviter les contraintes next/image sur SVG */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset.src}
                alt={asset.alt}
                className="mx-auto h-auto w-full max-w-full"
                loading="lazy"
              />
              <figcaption className="mt-3 text-sm text-ink-secondary">{asset.alt}</figcaption>
            </figure>
          ) : null,
        )}
      </div>
    </section>
  );
}
