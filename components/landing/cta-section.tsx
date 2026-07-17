import { ButtonLink } from "@/components/ui";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

type Props = { dict: Dictionary };

export function CtaSection({ dict }: Props) {
  return (
    <section className="bg-ink py-20 text-white lg:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
          Prêt à lancer votre carrière Apple MDM ?
        </h2>
        <p className="mt-6 text-lg text-zinc-300">
          Commencez gratuitement, structurez vos révisions et choisissez le plan adapté à votre équipe.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/auth/signup" size="lg" className="bg-white text-ink hover:bg-zinc-100">
            {dict.hero.ctaPrimary}
          </ButtonLink>
          <ButtonLink href="/pricing" variant="secondary" size="lg" className="border-zinc-600 text-white hover:bg-white/10">
            {dict.nav.pricing}
          </ButtonLink>
          <ButtonLink href="/enterprise" variant="secondary" size="lg" className="border-zinc-600 text-white hover:bg-white/10">
            Entreprise
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
