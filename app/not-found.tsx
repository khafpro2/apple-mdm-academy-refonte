import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-24 text-center lg:py-32">
        <p className="text-sm font-semibold text-accent">Erreur 404</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-ink">Page introuvable</h1>
        <p className="mt-4 text-ink-secondary">
          Cette page n&apos;existe pas ou a été déplacée. Retournez à l&apos;accueil ou explorez nos parcours.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Accueil</ButtonLink>
          <ButtonLink href="/parcours" variant="secondary">Parcours</ButtonLink>
        </div>
        <nav aria-label="Liens utiles" className="mt-10 text-sm text-ink-secondary">
          <Link href="/support" className="hover:text-accent">Centre d&apos;aide</Link>
          {" · "}
          <Link href="/pricing" className="hover:text-accent">Tarifs</Link>
        </nav>
      </div>
    </PageShell>
  );
}
