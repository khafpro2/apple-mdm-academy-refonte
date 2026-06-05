import { PageShell } from "@/components/layout/page-shell";
import Link from "next/link";

type LegalSection = {
  id: string;
  title: string;
  content: string[];
};

export function LegalPageShell({
  title,
  description,
  sections,
  updatedAt,
}: {
  title: string;
  description: string;
  sections: LegalSection[];
  updatedAt: string;
}) {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-6 py-12 lg:px-8 lg:py-16">
        <header>
          <p className="text-sm font-medium text-accent">Informations légales</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">{title}</h1>
          <p className="mt-3 text-ink-secondary">{description}</p>
          <p className="mt-2 text-xs text-ink-tertiary">Dernière mise à jour : {updatedAt}</p>
        </header>

        <nav aria-label="Sommaire" className="mt-8 rounded-2xl border border-border-light bg-surface-elevated p-5">
          <p className="text-sm font-semibold text-ink">Sommaire</p>
          <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-ink-secondary">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="prose-legal mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="text-xl font-bold text-ink">{section.title}</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-secondary">
                {section.content.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-12 border-t border-border-light pt-6 text-sm text-ink-secondary">
          <p>
            Questions ?{" "}
            <Link href="/support" className="font-medium text-accent hover:underline">
              Centre d&apos;aide
            </Link>{" "}
            ·{" "}
            <Link href="/contact" className="font-medium text-accent hover:underline">
              Contact
            </Link>
          </p>
          <p className="mt-2">
            <Link href="/privacy" className="hover:text-ink">Confidentialité</Link>
            {" · "}
            <Link href="/terms" className="hover:text-ink">CGU</Link>
            {" · "}
            <Link href="/legal" className="hover:text-ink">Mentions légales</Link>
          </p>
        </footer>
      </article>
    </PageShell>
  );
}
