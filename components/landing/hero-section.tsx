import Link from "next/link";
import { ButtonLink, Badge } from "@/components/ui";
import { ProgressOverview } from "@/components/cards";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

type Props = { dict: Dictionary };

export function HeroSection({ dict }: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,113,227,0.12),transparent)]" />
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Badge variant="accent" className="mb-6">
              {dict.hero.badge}
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-ink md:text-6xl lg:text-[4.25rem] lg:leading-[1.05]">
              {dict.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-secondary md:text-xl">
              {dict.hero.subtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/auth/signup" size="lg">
                {dict.hero.ctaPrimary}
              </ButtonLink>
              <ButtonLink href="/auth/login" variant="secondary" size="lg">
                Connexion
              </ButtonLink>
              <ButtonLink href="/parcours" variant="secondary" size="lg">
                {dict.hero.ctaSecondary}
              </ButtonLink>
            </div>
            <p className="mt-6 text-sm text-ink-tertiary">
              Sans carte bancaire · Accès Free immédiat ·{" "}
              <Link href="/pricing" className="font-medium text-accent hover:underline">
                {dict.nav.pricing}
              </Link>
            </p>
          </div>
          <ProgressOverview
            percent={78}
            tracks={[
              { title: "Jamf 100", percent: 100 },
              { title: "Apple IT Professional", percent: 64 },
              { title: "Intune Apple", percent: 52 },
              { title: "Apple Security", percent: 38 },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
