import Link from "next/link";
import { PageShell } from "@/components/layout/page-shell";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return (
    <PageShell>
      <div className="mx-auto max-w-lg px-6 py-24 lg:py-32">
        <EmptyState
          title="Page introuvable"
          description="Cette page n'existe pas ou a été déplacée."
          actionHref="/"
          actionLabel="Accueil"
          recommendedLinks={[
            { href: "/parcours", label: "Parcours" },
            { href: "/cours", label: "Cours" },
            { href: "/examens", label: "Examens" },
            { href: "/support", label: "Centre d'aide" },
          ]}
        />
        <p className="mt-6 text-center text-sm text-ink-tertiary">
          <Link href="/pricing" className="hover:text-accent">Tarifs</Link>
        </p>
      </div>
    </PageShell>
  );
}
