import Link from "next/link";
import { PageShell } from "@/components/layout";
import { HeroSection } from "@/components/landing/hero-section";
import { DemoSection } from "@/components/landing/demo-section";
import { CertificationsSection } from "@/components/landing/certifications-section";
import { StatsSection } from "@/components/landing/stats-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { SectionHeading, ButtonLink } from "@/components/ui";
import { tracks } from "@/lib/data";
import { TrackCard } from "@/components/cards";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

type Props = { locale?: Locale };

export function LandingPage({ locale = "fr" }: Props) {
  const dict = getDictionary(locale);

  return (
    <PageShell>
      <HeroSection dict={dict} />
      <DemoSection />
      <CertificationsSection />
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SectionHeading
            label="Parcours"
            title="Tous les parcours disponibles"
            description="7 parcours professionnels — cours, quiz, labs et examens blancs."
          />
          <Link href="/parcours" className="shrink-0 text-sm font-semibold text-accent hover:underline">
            Catalogue complet →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tracks.map((track) => (
            <TrackCard key={track.slug} track={track} />
          ))}
        </div>
      </section>
      <StatsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection dict={dict} />
      {locale !== "fr" && (
        <div className="border-t border-border-light py-4 text-center text-sm text-ink-tertiary">
          <ButtonLink href="/" variant="ghost" size="sm">
            Version française
          </ButtonLink>
        </div>
      )}
    </PageShell>
  );
}
