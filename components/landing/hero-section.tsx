import { ButtonLink } from "@/components/ui";

const UNIVERSE_BUTTONS = [
  { href: "#apple", label: "Apple" },
  { href: "#jamf", label: "Jamf" },
  { href: "#intune", label: "Intune" },
] as const;

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-8 lg:py-32">
        <div className="animate-[fadeInUp_0.6s_ease-out_both]">
          <h1 className="text-5xl font-bold tracking-tight text-ink md:text-7xl lg:leading-[1.05]">
            Maîtrisez Apple MDM.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-secondary md:text-xl">
            Formez-vous sur Apple, Jamf et Microsoft Intune avec des cours pratiques, des labs, des quiz et des
            examens blancs.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {UNIVERSE_BUTTONS.map((universe) => (
              <ButtonLink key={universe.href} href={universe.href} variant="secondary" size="lg">
                {universe.label}
              </ButtonLink>
            ))}
          </div>
          <p className="mt-8 text-sm font-medium text-ink-tertiary">
            Une seule plateforme. Trois expertises. Une carrière.
          </p>
        </div>
      </div>
    </section>
  );
}
